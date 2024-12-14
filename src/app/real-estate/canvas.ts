import {
  Application,
  Container,
  FederatedPointerEvent,
  FederatedWheelEvent,
  Graphics,
  Point,
} from "pixi.js";

let middleBtnDown = false;

let pointerPos = new Point();
let prevPointerPos = new Point();
let scale = 1;

export function initCanvas() {
  const app = new Application();
  const root = new Container();
  const graphics = new Graphics();
  graphics.rect(100, 100, 100, 100);
  graphics.rect(200, 200, 100, 100);
  graphics.rect(300, 300, 100, 100);
  graphics.rect(400, 400, 100, 100);
  graphics.fill("red");
  root.addChild(graphics);
  app.stage.addChild(root);
  app.init({ background: "black", resizeTo: window }).then(() => {
    document.querySelector("main")!.appendChild(app.canvas);
    app.stage.eventMode = "static";
    app.stage.hitArea = app.screen;
    app.stage.on("pointerdown", handlePointerDown);
    app.stage.on("pointerup", handlePointerUp);
    app.stage.on("pointermove", handlePointerMove);
    app.stage.on("wheel", handleWheel);
    app.stage.on("contextmenu", (e) => e.preventDefault());
    document.addEventListener("contextmenu", function (event) {
      event.preventDefault();
    });
  });

  function handlePointerDown(e: FederatedPointerEvent) {
    e.preventDefault();
    switch (e.button) {
      case 2:
        middleBtnDown = true;
        return;
    }
  }

  function handlePointerUp() {
    middleBtnDown = false;
  }

  function handlePointerMove(e: FederatedPointerEvent) {
    pointerPos.x = e.global.x;
    pointerPos.y = e.global.y;

    if (middleBtnDown) {
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
