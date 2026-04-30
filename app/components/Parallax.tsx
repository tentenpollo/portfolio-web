"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface ParallaxProps {
  children: React.ReactNode;
  className?: string;
  speed?: number; // 0 = no movement, 1 = moves with scroll, -0.2 = subtle counter movement
  direction?: "vertical" | "horizontal";
  scale?: number; // optional scale from -> to (e.g. 0.95 means it scales from 0.95 to 1)
  rotate?: number; // optional rotation in degrees
  scrub?: boolean | number;
  start?: string;
  end?: string;
}

export default function Parallax({
  children,
  className = "",
  speed = -0.15,
  direction = "vertical",
  scale,
  rotate,
  scrub = true,
  start = "top bottom",
  end = "bottom top",
}: ParallaxProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) return;

    const distance = 200; // px range of movement
    const fromVars: gsap.TweenVars = {};
    const toVars: gsap.TweenVars = {
      ease: "none",
      scrollTrigger: {
        trigger: el,
        start,
        end,
        scrub,
      },
    };

    if (direction === "vertical") {
      fromVars.y = distance * speed;
      (toVars as any).y = -distance * speed;
    } else {
      fromVars.x = distance * speed;
      (toVars as any).x = -distance * speed;
    }

    if (scale !== undefined) {
      fromVars.scale = scale;
      (toVars as any).scale = 1;
    }

    if (rotate !== undefined) {
      fromVars.rotate = -rotate;
      (toVars as any).rotate = rotate;
    }

    const tween = gsap.fromTo(el, fromVars, toVars);

    return () => {
      tween.kill();
    };
  }, [speed, direction, scale, rotate, scrub, start, end]);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
