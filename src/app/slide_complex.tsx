"use client";
import { Building, InspectionPanel } from "lucide-react";
import { dragCreate, handleDestroy, initCanvasApp } from "./real-estate/canvas";
import { useEffect } from "react";
import { FadeText } from "./fade_text";

export function SlideComplex() {
  useEffect(() => {
    initCanvasApp();
    return () => {
      handleDestroy();
    };
  }, []);
  return (
    <main>
      <FadeText title="Complex Slide" />
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
