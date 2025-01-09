"use client";

import { useEffect } from "react";
import { dragCreate, initCanvasApp } from "./canvas";
import { Building, InspectionPanel } from "lucide-react";

export default function Home() {
  useEffect(() => {
    initCanvasApp();
  }, []);

  return (
    <main>
      <div className="absolute top-[50%] left-0 flex flex-col rounded-l bg-card text-card-foreground shadow border-2 border-r-2">
        <div
          className="flex flex-col border-b-2 p-4"
          onClick={() => alert("gotta drag it")}
          onDragStart={(e) => {
            e.preventDefault();
            dragCreate();
          }}
          draggable
        >
          <Building size={48} />
        </div>
        <div className="flex flex-col p-4">
          <InspectionPanel size={48} />
        </div>
      </div>
    </main>
  );
}
