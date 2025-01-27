/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  Application,
  Container,
  FederatedPointerEvent,
  FederatedWheelEvent,
  Graphics,
  Point,
  Rectangle,
  Ticker,
  Text,
  TextStyle,
} from "pixi.js";

const GRID_UNIT_SIZE: number = 16;

// Define application variables
let app: Application;
let root: Container;
let buildings: Building[] = [];
let pointerPos: Rectangle = new Rectangle(0, 0, 10, 10);
let prevGlobalPointerPos: Rectangle = new Rectangle(0, 0, 10, 10);
let pointerDownPos: Point | null = null;
let leftPointerBtnDown: boolean = false;
let rightPointerBtnDown: boolean = false;
let pointerReleased: boolean = false;
let pointerPressed: boolean = false;
let focusedElemId: string | null = null;
let draggingElemId: string | null = null;
let idHelper: number = 0;

interface BuildingState {
  hover: boolean;
  dragging: boolean;
  validPlacement: boolean;
}

interface Building {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  container: Container;
  graphics: Graphics;
  label: Text;
  draggedX: number;
  draggedY: number;
  state: BuildingState;
}

function createBuilding(
  x: number,
  y: number,
  width: number,
  height: number
): Building {
  const id = (++idHelper).toString();
  const container = new Container();

  const graphics = new Graphics().rect(0, 0, width, height).fill("white");
  const style = new TextStyle({ fontSize: 24, fill: "white" });
  const label = new Text({ text: `Building ${id}`, style, x: 0, y: -30 });

  container.addChild(graphics, label);
  container.position.set(x, y);

  return {
    id,
    x,
    y,
    width,
    height,
    container,
    graphics,
    label,
    draggedX: x,
    draggedY: y,
    state: {
      validPlacement: true,
      dragging: false,
      hover: false,
    },
  };
}

function renderBuilding(building: Building, newState: BuildingState): void {
  // only re-render when necessary state changes
  if (
    newState.hover === building.state.hover &&
    newState.dragging === building.state.dragging &&
    newState.validPlacement === building.state.validPlacement
  ) {
    return;
  }
  building.container.removeChildren();
  const fill = newState.validPlacement ? "white" : "red";
  const stroke = "white";

  building.graphics = new Graphics()
    .rect(0, 0, building.width, building.height)
    .fill(fill)
    .stroke(stroke);

  const style = new TextStyle({ fontSize: 24, fill: "white" });
  building.label = new Text({
    text: `Building ${building.id}`,
    style,
    x: 0,
    y: -30,
  });

  building.container.addChild(building.graphics, building.label);
}

export async function initCanvasApp() {
  app = new Application();
  root = new Container();

  buildings = Array.from({ length: 10 }, (_, i) =>
    createBuilding(
      i * 320 + GRID_UNIT_SIZE * 2 * i,
      i * 320 + GRID_UNIT_SIZE * 2 * i,
      320,
      320
    )
  );

  root.addChild(...buildings.map((b) => b.container));
  app.stage.addChild(root); 

  await app.init({ background: "black", resizeTo: window });
  const mainElement = document.querySelector("main");
  mainElement!.appendChild(app.canvas);
  initEvents();
}

function tick(): void {
  buildings.forEach((building) => {
    const isHover =
      pointerPos.intersects(
        new Rectangle(building.x, building.y, building.width, building.height)
      ) && draggingElemId === null;

    if (pointerPressed && isHover) {
      focusedElemId = building.id;
      building.draggedX = pointerDownPos!.x - building.container.x;
      building.draggedY = pointerDownPos!.y - building.container.y;
    }

    const isFocus = focusedElemId === building.id;
    if (isFocus && draggingElemId == null) {
      const pointerXDiff = pointerDownPos!.x - pointerPos.x;
      const pointerYDiff = pointerDownPos!.y - pointerPos.y;
      if (Math.abs(pointerXDiff) >= 3 || Math.abs(pointerYDiff) >= 3) {
        draggingElemId = building.id;
      }
    }

    const isDragging = draggingElemId === building.id;
    if (isDragging) {
      const newX = pointerPos.x - building.draggedX;
      const newY = pointerPos.y - building.draggedY;

      building.container.x = Math.round(newX / GRID_UNIT_SIZE) * GRID_UNIT_SIZE;
      building.container.y = Math.round(newY / GRID_UNIT_SIZE) * GRID_UNIT_SIZE;

      let isValid = true;
      buildings.forEach((b) => {
        if (b.id === building.id) return;
        if (
          b.container
            .getBounds()
            .rectangle.intersects(building.container.getBounds().rectangle)
        ) {
          isValid = false;
        }
      });

      if (pointerReleased) {
        draggingElemId = null;
        if (isValid) {
          building.x = building.container.x;
          building.y = building.container.y;
        } else {
          building.container.x = building.x;
          building.container.y = building.y;
        }
        isValid = true;
      }
      renderBuilding(building, {
        dragging: isDragging,
        hover: isHover,
        validPlacement: isValid,
      });
      building.state.validPlacement = !isValid;
      building.state.hover = isHover;
      building.state.validPlacement = isValid;
    }
  });

  if (pointerReleased) {
    resetPointerState();
  }

  pointerPressed = false;
}

function initEvents(): void {
  app.stage.eventMode = "static";
  app.stage.hitArea = app.screen;
  app.stage.on("pointerdown", handlePointerDown);
  app.stage.on("pointerup", handlePointerUp);
  app.stage.on("pointermove", handlePointerMove);
  app.stage.on("pointerleave", handlePointerLeave);
  app.stage.on("wheel", handleWheel);
  app.stage.on("contextmenu", (e) => e.preventDefault());

  document.addEventListener("contextmenu", (e) => e.preventDefault());
  Ticker.shared.add(tick);
}

function handlePointerDown(e: FederatedPointerEvent): void {
  e.preventDefault();
  pointerPressed = true;
  const localPointerDownPos = root.toLocal(e.global);
  pointerDownPos = new Point(localPointerDownPos.x, localPointerDownPos.y);

  if (e.button === 0) leftPointerBtnDown = true;
  if (e.button === 2) rightPointerBtnDown = true;
}

function handlePointerUp(): void {
  pointerReleased = true;
}

function handlePointerLeave(): void {
  resetPointerState();
}

function handlePointerMove(e: FederatedPointerEvent): void {
  const globalPointerPos = e.global;
  const localPointerPos = root.toLocal(globalPointerPos);

  pointerPos.x = localPointerPos.x;
  pointerPos.y = localPointerPos.y;
  pointerPos.width = 3 / root.scale.x;
  pointerPos.height = 3 / root.scale.y;

  if (rightPointerBtnDown) {
    const deltaX = globalPointerPos.x - prevGlobalPointerPos.x;
    const deltaY = globalPointerPos.y - prevGlobalPointerPos.y;
    root.x += deltaX;
    root.y += deltaY;
  }

  prevGlobalPointerPos.x = globalPointerPos.x;
  prevGlobalPointerPos.y = globalPointerPos.y;
}

function handleWheel(e: FederatedWheelEvent): void {
  e.preventDefault();

  const zoomFactor = 0.1;
  const oldScale = root.scale.x;
  const newScale = oldScale + (e.deltaY < 0 ? zoomFactor : -zoomFactor);
  const clampedScale = Math.max(0.1, Math.min(10, newScale));

  const localPointerPos = root.toLocal({ x: e.clientX, y: e.clientY });
  root.scale.set(clampedScale, clampedScale);

  const scaleDiff = clampedScale - oldScale;
  root.x -= (localPointerPos.x - root.x) * scaleDiff;
  root.y -= (localPointerPos.y - root.y) * scaleDiff;
}

function resetPointerState(): void {
  pointerReleased = false;
  focusedElemId = null;
  pointerDownPos = null;
  leftPointerBtnDown = false;
  rightPointerBtnDown = false;
}

export function dragCreate(): void {
  const building = createBuilding(0, 0, 160, 160);
  buildings.push(building);
  root.addChild(building.container);
  draggingElemId = building.id;
}
