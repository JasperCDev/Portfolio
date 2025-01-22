"use client";

import { ChevronDown } from "lucide-react";

export default function Home() {
  return (
    <>
      <div className="h-full flex flex-col items-center justify-center p-20 bg-[radial-gradient(circle_at_center_bottom,_theme(colors.slate.600),_theme(colors.slate.900))]">
        <div>
          {" "}
          <h1 className="text-8xl mb-2 font-mono uppercase">Jasper Chauvin</h1>
          <p className="text-xl">
            Software Engineer with 4 years of experience.
          </p>
        </div>
      </div>
      <button
        onClick={() => alert("click")}
        className="absolute bottom-0 left-[50%] flex flex-col items-center"
      >
        Learn More
        <ChevronDown size={36} />
      </button>
    </>
  );
}
