"use client";

import { ChevronDown } from "lucide-react";
import { useEffect, useRef, useState } from "react";

let y = 0;

export default function Home() {
  let ref = useRef<HTMLDivElement>(null);

  function handleClick() {
    y += window.innerHeight;
    ref.current!.style.transform = `translateY(-${y}px)`;
  }

  return (
    <div className="h-[100vh] overflow-hidden">
      <div ref={ref} className="transition-transform">
        <div className="h-[100vh] flex flex-col items-center justify-center p-20 bg-[radial-gradient(circle_at_center_bottom,_theme(colors.slate.600),_theme(colors.slate.900))]">
          <div>
            <h1 className="text-8xl mb-2 font-mono uppercase">
              Jasper Chauvin
            </h1>
            <p className="text-xl">
              Software Engineer with 4 years of experience.
            </p>
          </div>
        </div>
        <div className="h-[100vh] flex flex-col items-center justify-center p-20 bg-[radial-gradient(circle_at_center_bottom,_red,_blue)]">
          <div>
            <h1 className="text-8xl mb-2 font-mono uppercase">
              Dashboard Web Applications
            </h1>
            <p className="text-xl">
              High-density with real-time data and analytics.
            </p>
          </div>
        </div>
        <div className="h-[100vh] flex flex-col items-center justify-center p-20 bg-[radial-gradient(circle_at_center_bottom,green,pink)]">
          <div>
            <h1 className="text-8xl mb-2 font-mono uppercase">
              Complex interactions
            </h1>
            <p className="text-xl">Interactive visualizations</p>
          </div>
        </div>
      </div>
      <button
        onClick={handleClick}
        className="absolute bottom-0 left-[50%] flex flex-col items-center"
      >
        Learn More
        <ChevronDown size={36} />
      </button>
    </div>
  );
}
