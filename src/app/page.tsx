"use client";

import { ChevronDown } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { SlideHero } from "./slideHero";
let y = 0;
let list = [SlideHero, SlideHero, SlideHero];

export default function Home() {
  let ref = useRef<HTMLDivElement>(null);
  let [currIndx, setCurrIndx] = useState(0);

  function handleClick() {
    y += window.innerHeight;
    ref.current!.style.transform = `translateY(-${y}px)`;
    ref.current!.ontransitionend = () => {
      setCurrIndx((prev) => prev + 1);
    };
  }

  return (
    <div className="h-[100vh] overflow-hidden">
      <div ref={ref} className="transition-transform ease-in-out duration-1000">
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
          className="absolute bottom-0 left-[50%] flex flex-col items-center"
        >
          Learn More
          <ChevronDown size={36} />
        </button>
      )}
    </div>
  );
}
