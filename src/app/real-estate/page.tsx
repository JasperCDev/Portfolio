"use client";

import { useEffect } from "react";
import { CanvasApp } from "./canvas";
import { Building, InspectionPanel } from "lucide-react";

let canvasClass: CanvasApp;

export default function Home() {
  useEffect(() => {
    canvasClass = new CanvasApp();
  }, []);

  return (
    <main>
      <div className="absolute top-[50%] left-0 flex flex-col rounded-l bg-card text-card-foreground shadow ">
        <div
          className="flex flex-col border-b-2 p-4"
          onClick={() => alert("gotta drag it")}
          onDragStart={(e) => {
            e.preventDefault();
            canvasClass.dragCreate(e.clientX, e.clientY);
          }}
          draggable
        >
          <Building size={48} />
        </div>
        <div className="flex flex-col border-b-2 p-4">
          <InspectionPanel size={48} />
        </div>
      </div>
    </main>
  );
}
