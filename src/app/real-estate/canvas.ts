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
} from "pixi.js";

class Building extends Rectangle {
  static idHelper = 0;
  id: string;
  draggedX: number;
  draggedY: number;
  graphics: Graphics;
  constructor(x: number, y: number, width: number, height: number) {
    super(x, y, width, height);
    this.x = x;
    this.y = y;
    this.id = (++Building.idHelper).toString();
    this.graphics = new Graphics()
      .rect(0, 0, width, height)
      .fill(`rgb(24 24 27 / 1)`);
    this.graphics.x = x;
    this.graphics.y = y;
    this.draggedX = x;
    this.draggedY = y;
  }
}

let buildings: Array<Building> = Array.from(
  { length: 10 },
  (_, i) => new Building(i * 500 + 2 * i, i * 500 + 2 * i, 500, 500)
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
  root.addChild(...buildings.map((b) => b.graphics));
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
    for (let building of buildings) {
      let isHover = pointerPos.intersects(building);
      if (pointerPressed && isHover) {
        focusedElemId = building.id;

        building.draggedX = pointerDownPos!.x - building.graphics.x;
        building.draggedY = pointerDownPos!.y - building.graphics.y;
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
        building.graphics.x = Math.round(newX / 16) * 16;
        building.graphics.y = Math.round(newY / 16) * 16;
      }

      if (isDragEnd) {
        draggingElemId = null;
        building.x = building.graphics.x;
        building.y = building.graphics.y;
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

    let fps = Ticker.shared.FPS;
    if (fps < 59.5) {
      console.log(Ticker.shared.FPS);
    }
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

    let zoomFactor = 0.1;
    let oldScale = root.scale.x;

    // Determine the new scale
    let newScale = oldScale + (e.deltaY < 0 ? zoomFactor : -zoomFactor);
    let clampedScale = Math.max(0.1, Math.min(10, newScale));

    // Convert cursor position to local container coordinates
    let localPointerPos = root.toLocal({ x: e.clientX, y: e.clientY });

    // Adjust the root's position to keep the zoom centered on the cursor
    root.scale.set(clampedScale, clampedScale);
    root.x -= (localPointerPos.x - root.x) * (clampedScale - oldScale);
    root.y -= (localPointerPos.y - root.y) * (clampedScale - oldScale);
  }
}

// misc utils
function derive<T>(cb: () => T extends void ? never : T) {
  return cb();
}
