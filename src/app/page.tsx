"use client";

import { ChevronDown } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { SlideHero } from "./slide_hero";
import { SlideDashboard } from "./slide_dashboard";
import { SlideComplex } from "./slide_complex";
import { SlideFooter } from "./slide_footer";

let y = 0;
let list = [SlideHero, SlideDashboard, SlideComplex, SlideFooter];

export default function Home() {
  let ref = useRef<HTMLDivElement>(null);
  let [currIndx, setCurrIndx] = useState(0);

  function handleClick() {
    y += window.innerHeight;
    ref.current!.style.transform = `translateY(-${y}px)`;
  }

  return (
    <div className="h-[100vh] overflow-hidden">
      <div
        ref={ref}
        className="transition-transform ease-in-out duration-1000"
        onTransitionEnd={() => setCurrIndx((prev) => prev + 1)}
      >
        {list.map((Slide, indx) => {
          let shown = indx === currIndx;
          if (!shown) {
            return <div key={indx} className="h-[100vh]"></div>;
          }
          return <Slide key={indx} />;
        })}
      </div>
      {currIndx >= list.length - 1 ? null : (
        <button
          onClick={handleClick}
          className="absolute bottom-0 left-[50%] translate-x-[-50%] flex flex-col items-center rounded p-4 pb-0 backdrop-md bg-slate-900"
        >
          <span className="text-xl">Learn More</span>
          <ChevronDown size={56} />
        </button>
      )}
    </div>
  );
}
