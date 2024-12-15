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
    this.draggedX = x;
    this.draggedY = y;
    this.graphics = new Graphics().rect(0, 0, width, height).stroke("red");
    this.graphics.x = x;
    this.graphics.y = y;
  }
}

let buildings: Array<Building> = [
  new Building(100, 100, 100, 100),
  new Building(202, 100, 100, 100),
  new Building(304, 100, 100, 100),
  new Building(100, 202, 100, 100),
  new Building(202, 202, 100, 100),
  new Building(304, 202, 100, 100),
];

let leftPointerBtnDown = false;
let rightPointerBtnDown = false;
let pointerUp = false;
let pointerDown = false;

let pointerPos = new Rectangle(0, 0, 10, 10);
let prevPointerPos = new Rectangle(0, 0, 10, 10);
let pointerDownPos: Point | null = null;

let focusedElemId: string | null = null;
let draggingElemId: string | null = null;
let draggingElemLocalPos: Point | null = null;

export function initCanvas() {
  const app = new Application();
  const root = new Container();
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
    for (const building of buildings) {
      console.log(building.graphics.x);
      let isHover = pointerPos.intersects(building);
      let isFocus = isHover && leftPointerBtnDown && pointerDown;
      let isClick = isHover && pointerUp;
      if (isFocus) {
        focusedElemId = building.id;
      }
      if (focusedElemId === building.id) {
        let pointerXDiff = pointerDownPos!.x - pointerPos.x;
        let pointerYDiff = pointerDownPos!.y - pointerPos.y;
        if (Math.abs(pointerXDiff) >= 3 || Math.abs(pointerYDiff) >= 3) {
          draggingElemId = building.id;
          draggingElemLocalPos = new Point(
            building.graphics.x,
            building.graphics.y
          );
        }
      }
      let isDragging = draggingElemId === building.id;
      let isDragEnd = isDragging && pointerUp;
      if (isDragging) {
        const localPointerPos = root.toLocal(
          pointerPos,
          building.graphics.parent
        );
        // console.log(building.graphics.toGlobal(new Point(0, 0)).x);
        building.graphics.x = localPointerPos.x;
        building.graphics.y = localPointerPos.y;
      }
      if (isDragEnd) {
        // building.x = building.graphics.x;
        // building.y = building.graphics.y;
      }
    }
    pointerUp = false;
    pointerDown = false;
  }

  function handlePointerDown(e: FederatedPointerEvent) {
    e.preventDefault();
    pointerDown = true;
    pointerDownPos = new Point(e.global.x, e.global.y);

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
    rightPointerBtnDown = false;
    leftPointerBtnDown = false;
    pointerUp = true;
    pointerDown = false;
    draggingElemId = null;
    draggingElemLocalPos = null;
    focusedElemId = null;
    pointerDownPos = null;
  }

  function handlePointerLeave() {
    rightPointerBtnDown = false;
    leftPointerBtnDown = false;
  }

  function handlePointerMove(e: FederatedPointerEvent) {
    pointerPos.x = e.global.x;
    pointerPos.y = e.global.y;

    if (rightPointerBtnDown) {
      const deltaX = pointerPos.x - prevPointerPos.x;
      const deltaY = pointerPos.y - prevPointerPos.y;
      root.x += deltaX;
      root.y += deltaY;
    }

    prevPointerPos.x = e.global.x;
    prevPointerPos.y = e.global.y;
  }

  function handleWheel(e: FederatedWheelEvent) {
    e.preventDefault();

    const zoomFactor = 0.1;
    const oldScale = root.scale.x;

    // Determine the new scale
    const newScale = oldScale + (e.deltaY < 0 ? zoomFactor : -zoomFactor);
    const clampedScale = Math.max(0.5, Math.min(3, newScale));

    // Convert cursor position to local container coordinates
    const localPointerPos = root.toLocal({ x: e.clientX, y: e.clientY });

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
