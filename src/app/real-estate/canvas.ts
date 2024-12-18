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
    this.id = (++Building.idHelper).toString();
    this.container = new Container();

    const graphics = new Graphics()
      .beginFill(0xffffff)
      .drawRect(0, 0, width, height)
      .endFill();
    const style = new TextStyle({ fontSize: 24, fill: "white" });
    const text = new Text(`Building ${this.id}`, style);
    text.y = -30;

    this.container.addChild(graphics, text);
    this.container.position.set(x, y);
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

export class CanvasApp {
  private app: Application;
  private root: Container;
  private buildings: Building[] = [];
  private pointerPos = new Rectangle(0, 0, 10, 10);
  private prevGlobalPointerPos = new Rectangle(0, 0, 10, 10);
  private pointerDownPos: Point | null = null;
  private leftPointerBtnDown = false;
  private rightPointerBtnDown = false;
  private pointerReleased = false;
  private pointerPressed = false;
  private focusedElemId: string | null = null;
  private draggingElemId: string | null = null;

  constructor() {
    this.app = new Application();
    this.root = new Container();

    this.buildings = Array.from(
      { length: 10 },
      (_, i) =>
        new Building(
          i * 160 + GRID_UNIT_SIZE * 2 * i,
          i * 160 + GRID_UNIT_SIZE * 2 * i,
          160,
          160
        )
    );

    this.root.addChild(...this.buildings.map((b) => b.container));
    this.app.stage.addChild(this.root);

    this.app.init({ background: "black", resizeTo: window }).then(() => {
      document.querySelector("main")!.appendChild(this.app.canvas);
      this.initEvents();
    });
  }

  private initEvents() {
    this.app.stage.eventMode = "static";
    this.app.stage.hitArea = this.app.screen;
    this.app.stage.on("pointerdown", this.handlePointerDown.bind(this));
    this.app.stage.on("pointerup", this.handlePointerUp.bind(this));
    this.app.stage.on("pointermove", this.handlePointerMove.bind(this));
    this.app.stage.on("pointerleave", this.handlePointerLeave.bind(this));
    this.app.stage.on("wheel", this.handleWheel.bind(this));
    this.app.stage.on("contextmenu", (e) => e.preventDefault());

    document.addEventListener("contextmenu", (e) => e.preventDefault());
    Ticker.shared.add(this.tick.bind(this));
  }

  private tick() {
    for (const building of this.buildings) {
      const isHover = this.pointerPos.intersects(building);
      if (this.pointerPressed && isHover) {
        this.focusedElemId = building.id;
        building.draggedX = this.pointerDownPos!.x - building.container.x;
        building.draggedY = this.pointerDownPos!.y - building.container.y;
      }

      const isFocus = this.focusedElemId === building.id;
      if (isFocus && this.draggingElemId == null) {
        const pointerXDiff = this.pointerDownPos!.x - this.pointerPos.x;
        const pointerYDiff = this.pointerDownPos!.y - this.pointerPos.y;
        if (Math.abs(pointerXDiff) >= 3 || Math.abs(pointerYDiff) >= 3) {
          this.draggingElemId = building.id;
        }
      }

      const isDragging = this.draggingElemId === building.id;
      if (isDragging) {
        const newX = this.pointerPos.x - building.draggedX;
        const newY = this.pointerPos.y - building.draggedY;
        building.container.x =
          Math.round(newX / GRID_UNIT_SIZE) * GRID_UNIT_SIZE;
        building.container.y =
          Math.round(newY / GRID_UNIT_SIZE) * GRID_UNIT_SIZE;
      }

      if (isDragging && this.pointerReleased) {
        this.draggingElemId = null;
        building.x = building.container.x;
        building.y = building.container.y;
      }
    }

    if (this.pointerReleased) {
      this.resetPointerState();
    }

    this.pointerPressed = false;
  }

  private handlePointerDown(e: FederatedPointerEvent) {
    e.preventDefault();
    this.pointerPressed = true;
    const localPointerDownPos = this.root.toLocal(e.global);
    this.pointerDownPos = new Point(
      localPointerDownPos.x,
      localPointerDownPos.y
    );

    if (e.button === 0) this.leftPointerBtnDown = true;
    if (e.button === 2) this.rightPointerBtnDown = true;
  }

  private handlePointerUp() {
    this.pointerReleased = true;
  }

  private handlePointerLeave() {
    this.resetPointerState();
  }

  private handlePointerMove(e: FederatedPointerEvent) {
    const globalPointerPos = e.global;
    const localPointerPos = this.root.toLocal(globalPointerPos);

    this.pointerPos.x = localPointerPos.x;
    this.pointerPos.y = localPointerPos.y;

    this.pointerPos.width = 3 / this.root.scale.x;
    this.pointerPos.height = 3 / this.root.scale.y;

    if (this.rightPointerBtnDown) {
      const deltaX = globalPointerPos.x - this.prevGlobalPointerPos.x;
      const deltaY = globalPointerPos.y - this.prevGlobalPointerPos.y;
      this.root.x += deltaX;
      this.root.y += deltaY;
    }

    this.prevGlobalPointerPos.x = globalPointerPos.x;
    this.prevGlobalPointerPos.y = globalPointerPos.y;
  }

  private handleWheel(e: FederatedWheelEvent) {
    e.preventDefault();

    const zoomFactor = 0.1;
    const oldScale = this.root.scale.x;
    const newScale = oldScale + (e.deltaY < 0 ? zoomFactor : -zoomFactor);
    const clampedScale = Math.max(0.1, Math.min(10, newScale));

    const localPointerPos = this.root.toLocal({ x: e.clientX, y: e.clientY });
    this.root.scale.set(clampedScale, clampedScale);

    const scaleDiff = clampedScale - oldScale;
    this.root.x -= (localPointerPos.x - this.root.x) * scaleDiff;
    this.root.y -= (localPointerPos.y - this.root.y) * scaleDiff;
  }

  private resetPointerState() {
    this.pointerReleased = false;
    this.focusedElemId = null;
    this.pointerDownPos = null;
    this.leftPointerBtnDown = false;
    this.rightPointerBtnDown = false;
  }

  public dragCreate(x: number, y: number) {
    let building = new Building(0, 0, 160, 160);
    this.buildings.push(building);
    this.root.addChild(building.container);
    this.draggingElemId = building.id;
  }
}
