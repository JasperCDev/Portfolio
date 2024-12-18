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

const GRID_UNIT_SIZE = 16;

class Building extends Rectangle {
  static idHelper = 0;
  id: string;
  draggedX: number;
  draggedY: number;
  container: Container;
  collisionBounds: Rectangle;
  constructor(x: number, y: number, width: number, height: number) {
    super(x, y, width, height);
    this.x = x;
    this.y = y;
    this.id = (++Building.idHelper).toString();
    this.container = new Container();
    let graphics = new Graphics().rect(0, 0, width, height).fill(`white`);
    const style = new TextStyle({ fontSize: 24, fill: "white" });
    const text = new Text({ text: "Building " + this.id, x: 0, y: -30, style });
    this.container.addChild(graphics);
    this.container.addChild(text);
    this.container.x = x;
    this.container.y = y;
    this.draggedX = x;
    this.draggedY = y;
    this.collisionBounds = new Rectangle(
      x - GRID_UNIT_SIZE,
      y - GRID_UNIT_SIZE,
      width + GRID_UNIT_SIZE * 2,
      height + GRID_UNIT_SIZE * 2
    );
  }
}

let buildings: Array<Building> = Array.from(
  { length: 10 },
  (_, i) =>
    new Building(
      i * 160 + GRID_UNIT_SIZE * 2 * i,
      i * 160 + GRID_UNIT_SIZE * 2 * i,
      160,
      160
    )
);

let leftPointerBtnDown = false;
let rightPointerBtnDown = false;
let pointerReleased = false;
let pointerPressed = false;

let pointerPos = new Rectangle(0, 0, 10, 10);
let prevGlobalPointerPos = new Rectangle(0, 0, 10, 10);
let pointerDownPos: Point | null = null;

let focusedElemId: string | null = null;
let draggingElemId: string | null = null;

export function initCanvas() {
  let app = new Application();
  let root = new Container();
  // let g = new Graphics();
  // for (
  //   let i = -(300 * GRID_UNIT_SIZE);
  //   i < 300 * GRID_UNIT_SIZE;
  //   i += GRID_UNIT_SIZE
  // ) {
  //   for (
  //     let j = -(300 * GRID_UNIT_SIZE);
  //     j < 300 * GRID_UNIT_SIZE;
  //     j += GRID_UNIT_SIZE
  //   ) {
  //     g.circle(i, j, 1);
  //   }
  // }
  // g.fill("lightgrey");
  // root.addChild(g);

  root.addChild(...buildings.map((b) => b.container));
  app.stage.addChild(root);
  app.init({ background: "black", resizeTo: window }).then(() => {
    document.querySelector("main")!.appendChild(app.canvas);
    app.stage.eventMode = "static";
    app.stage.hitArea = app.screen;
    app.stage.on("pointerdown", handlePointerDown);
    app.stage.on("pointerup", handlePointerUp);
    app.stage.on("pointermove", handlePointerMove);
    app.stage.on("pointerleave", handlePointerLeave);
    app.stage.on("wheel", handleWheel);
    app.stage.on("contextmenu", (e) => e.preventDefault());
    document.addEventListener("contextmenu", function (event) {
      event.preventDefault();
    });

    Ticker.shared.add(tick);
  });

  function tick() {
    let now = Date.now();
    for (let building of buildings) {
      let isHover = pointerPos.intersects(building);
      if (pointerPressed && isHover) {
        focusedElemId = building.id;

        building.draggedX = pointerDownPos!.x - building.container.x;
        building.draggedY = pointerDownPos!.y - building.container.y;
      }
      let isFocus = focusedElemId === building.id;
      if (isFocus && draggingElemId == null) {
        let pointerXDiff = pointerDownPos!.x - pointerPos.x;
        let pointerYDiff = pointerDownPos!.y - pointerPos.y;
        if (Math.abs(pointerXDiff) >= 3 || Math.abs(pointerYDiff) >= 3) {
          draggingElemId = building.id;
        }
      }
      let isDragging = draggingElemId === building.id;
      let isDragEnd = isDragging && pointerReleased;
      if (isDragging) {
        let newX = pointerPos.x - building.draggedX;
        let newY = pointerPos.y - building.draggedY;

        building.container.x = Math.round(newX / 16) * 16;
        building.container.y = Math.round(newY / 16) * 16;
      }

      if (isDragEnd) {
        draggingElemId = null;
        building.x = building.container.x;
        building.y = building.container.y;
      }
    }
    if (pointerReleased) {
      pointerReleased = false;
      focusedElemId = null;
      pointerDownPos = null;
      rightPointerBtnDown = false;
      leftPointerBtnDown = false;
    }
    pointerPressed = false;

    // let fps = Ticker.shared.FPS;
    // if (fps < 58) {
    //   console.log(Ticker.shared.FPS);
    // }
    // console.log(Date.now() - now);
  }

  function handlePointerDown(e: FederatedPointerEvent) {
    e.preventDefault();
    pointerPressed = true;
    let localPointerDownPos = root.toLocal(e.global);
    pointerDownPos = new Point(localPointerDownPos.x, localPointerDownPos.y);

    switch (e.button) {
      case 0:
        leftPointerBtnDown = true;
        return;
      case 2:
        rightPointerBtnDown = true;
        return;
    }
  }

  function handlePointerUp() {
    pointerReleased = true;
  }

  function handlePointerLeave() {
    rightPointerBtnDown = false;
    leftPointerBtnDown = false;
  }

  function handlePointerMove(e: FederatedPointerEvent) {
    let globalPointerPos = e.global;
    let localPointerPos = root.toLocal(globalPointerPos);

    pointerPos.x = localPointerPos.x;
    pointerPos.y = localPointerPos.y;

    pointerPos.width = 3 / root.scale.x;
    pointerPos.height = 3 / root.scale.y;

    if (rightPointerBtnDown) {
      // Calculate the delta (difference) of the pointer's movement in screen space
      let deltaX = globalPointerPos.x - prevGlobalPointerPos.x;
      let deltaY = globalPointerPos.y - prevGlobalPointerPos.y;

      // Adjust the delta by the inverse of the scale (to correctly pan at different zoom levels)
      root.x += deltaX;
      root.y += deltaY;
    }

    prevGlobalPointerPos.x = globalPointerPos.x;
    prevGlobalPointerPos.y = globalPointerPos.y;
  }

  function handleWheel(e: FederatedWheelEvent) {
    e.preventDefault();

    // Define zoom factor
    let zoomFactor = 0.1;
    let oldScale = root.scale.x;

    // Determine the new scale based on the scroll direction
    let newScale = oldScale + (e.deltaY < 0 ? zoomFactor : -zoomFactor);
    let clampedScale = Math.max(0.1, Math.min(10, newScale));

    // Convert cursor position to local coordinates in the root container
    let localPointerPos = root.toLocal({ x: e.clientX, y: e.clientY });

    // Set the new scale
    root.scale.set(clampedScale, clampedScale);

    // Calculate the difference in scale
    let scaleDiff = clampedScale - oldScale;

    // Adjust the root's position to keep the mouse cursor in the same position in the viewport
    root.x -= (localPointerPos.x - root.x) * scaleDiff;
    root.y -= (localPointerPos.y - root.y) * scaleDiff;
  }
}

// misc utils
function derive<T>(cb: () => T extends void ? never : T) {
  return cb();
}
