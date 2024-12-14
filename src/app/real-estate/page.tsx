"use client";

import { useEffect } from "react";
import { initCanvas } from "./canvas";

export default function Home() {
  useEffect(() => {
    initCanvas();
  }, []);

  return <main></main>;
}
