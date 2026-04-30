"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const sectionIds = ["hero", "about", "work", "experience", "skills", "contact"];

export default function InkThread() {
  const lineRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  // Distribute blots evenly with inset padding so they don't touch viewport edges
  const inset = 6; // percent padding from top/bottom
  const blotPositions = sectionIds.map(
    (_, i) => inset + (i / (sectionIds.length - 1)) * (100 - inset * 2)
  );

  useEffect(() => {
    const line = lineRef.current;
    if (!line) return;

    // The ink line is fully visible from the start — it's a path, not a progress bar
    gsap.set(line, { scaleY: 1 });

    // Track active section
    const triggers: ScrollTrigger[] = [];
    sectionIds.forEach((id, index) => {
      const section = document.getElementById(id);
      if (!section) return;

      const st = ScrollTrigger.create({
        trigger: section,
        start: "top center",
        end: "bottom center",
        onEnter: () => setActiveIndex(index),
        onEnterBack: () => setActiveIndex(index),
      });
      triggers.push(st);
    });

    // Refresh after layout settles
    const timer = setTimeout(() => {
      ScrollTrigger.refresh();
    }, 100);

    return () => {
      clearTimeout(timer);
      triggers.forEach((st) => st.kill());
    };
  }, []);

  return (
    <div
      className="fixed left-5 md:left-10 lg:left-12 top-0 bottom-0 w-px z-40 pointer-events-none hidden md:block"
      aria-hidden="true"
    >
      {/* Background track */}
      <div className="absolute inset-y-0 left-0 w-px bg-outline/10" />

      {/* Ink progress line */}
      <div
        ref={lineRef}
        className="absolute top-0 left-0 w-px h-full bg-primary/50 origin-top"
        style={{ transform: "scaleY(0)" }}
      />

      {/* Section blots */}
      {blotPositions.map((top, i) => (
        <div
          key={sectionIds[i]}
          className="absolute left-1/2 -translate-x-1/2 flex items-center justify-center"
          style={{ top: `${top}%` }}
        >
          <div
            className={`rounded-full transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${
              i === activeIndex
                ? "bg-primary w-2.5 h-2.5"
                : i < activeIndex
                ? "bg-primary/40 w-1.5 h-1.5"
                : "bg-outline/20 w-1.5 h-1.5"
            }`}
          />
        </div>
      ))}
    </div>
  );
}
