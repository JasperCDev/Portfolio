import { useEffect, useState } from "react";

export function FadeText(props: { title: string }) {
  let [transform, setTransform] = useState("-translate-y-[-100vh]");
  let [opacity, setOpacity] = useState("opacity-1");

  useEffect(() => {
    setTransform("-translate-y-[-50vh]");
    setTimeout(() => setOpacity("opacity-0"), 4000);
  }, []);

  return (
    <h1
      className={`backdrop-blur-md text-6xl absolute w-full text-center ${transform} ${opacity} transition-[transform,_opacity] ease-in-out duration-2000 rounded-xl`}
    >
      {props.title}
    </h1>
  );
}
