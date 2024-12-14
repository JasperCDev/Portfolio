import { Application, FederatedPointerEvent, Graphics, Point } from "pixi.js";

let middleBtnDown = false;

let pointerPos = new Point();
let prevPointerPos = new Point();

export function initCanvas() {
  // Create a PixiJS application.
  const app = new Application();

  const graphics = new Graphics();
  graphics.rect(100, 100, 100, 100);
  graphics.fill("red");
  app.stage.addChild(graphics);
  // Asynchronous IIFE
  app.init({ background: "black", resizeTo: window }).then(() => {
    document.querySelector("main")!.appendChild(app.canvas);
    app.stage.eventMode = "static";
    app.stage.hitArea = app.screen;
    app.stage.on("pointerdown", handlePointerDown);
    app.stage.on("pointerup", handlePointerUp);
    app.stage.on("pointermove", handlePointerMove);
  });

  function handlePointerDown(e: FederatedPointerEvent) {
    switch (e.button) {
      case 1:
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
      app.stage.x += deltaX;
      app.stage.y += deltaY;
    }

    prevPointerPos.x = e.global.x;
    prevPointerPos.y = e.global.y;
  }
}
