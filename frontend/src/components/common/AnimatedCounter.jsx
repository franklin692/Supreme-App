import React, { useEffect, useRef, useState } from "react";
import { useInView } from "framer-motion";

export const AnimatedCounter = ({ value, decimals = 0, duration = 1.8, prefix = "", suffix = "" }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (!inView) return;
    let start;
    const to = Number(value) || 0;
    const step = (t) => {
      if (!start) start = t;
      const p = Math.min((t - start) / (duration * 1000), 1);
      const eased = 1 - Math.pow(1 - p, 3);
      setDisplay(to * eased);
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [inView, value, duration]);

  const formatted = decimals > 0
    ? display.toFixed(decimals)
    : Math.round(display).toLocaleString("it-IT");

  return (
    <span ref={ref} className="font-mono tabular-nums">{prefix}{formatted}{suffix}</span>
  );
};
