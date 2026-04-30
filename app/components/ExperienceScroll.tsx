"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const experiences = [
  {
    date: "2021 - PRESENT",
    title: "Senior Creative Technologist",
    company: "Design Agency Inc.",
    description:
      "Leading the intersection of design and engineering. Built generative brand systems using WebGL and procedural shaders. Directed a team of four developers, establishing internal tooling that cut production time by 40%.",
  },
  {
    date: "2018 - 2021",
    title: "Full-Stack Developer",
    company: "Tech Startup Co.",
    description:
      "Owned the frontend architecture for a B2B analytics platform serving 50k+ daily users. Migrated the legacy codebase to Next.js, improving Lighthouse scores from 42 to 96. Implemented real-time data pipelines with WebSockets.",
  },
  {
    date: "2016 - 2018",
    title: "Frontend Engineer",
    company: "Digital Studio",
    description:
      "Crafted immersive campaign sites for luxury and fashion brands. Specialized in scroll-driven storytelling using GSAP and smooth-scroll libraries. Collaborated closely with motion designers to translate After Effects compositions into performant web animations.",
  },
];

export default function ExperienceScroll() {
  const containerRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const threadRef = useRef<SVGPathElement>(null);
  const sealRefs = useRef<(SVGGElement | null)[]>([]);
  const progressRef = useRef(0);
  const activeIndexRef = useRef(0);
  const threadLengthRef = useRef(0);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const container = containerRef.current;
    const track = trackRef.current;
    if (!container || !track) return;

    if (threadRef.current) {
      threadLengthRef.current = threadRef.current.getTotalLength();
    }

    const lenis = (window as any).lenis as
      | {
          scroll: number;
          options: { lerp: number };
          scrollTo: (
            target: number,
            options?: { immediate?: boolean }
          ) => void;
        }
      | undefined;

    let originalLerp = 0.08;
    let isPinned = false;

    const disableSmooth = () => {
      if (lenis) {
        originalLerp = lenis.options.lerp;
        lenis.options.lerp = 1;
      }
    };

    const enableSmooth = () => {
      if (lenis) {
        lenis.options.lerp = originalLerp;
      }
    };

    const handleWheel = (e: WheelEvent) => {
      if (!isPinned) return;
      if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) {
        e.preventDefault();
        const delta = e.deltaX;
        if (lenis) {
          lenis.scrollTo(lenis.scroll + delta, { immediate: true });
        } else {
          window.scrollBy({ top: delta, left: 0, behavior: "auto" });
        }
      }
    };

    container.addEventListener("wheel", handleWheel, { passive: false });

    const ctx = gsap.context(() => {
      const getHorizontalDistance = () =>
        Math.max(track.scrollWidth - container.clientWidth, 0);

      gsap.set(track, { x: 0 });

      gsap.to(track, {
        x: () => -getHorizontalDistance(),
        ease: "none",
        scrollTrigger: {
          trigger: container,
          start: "top top",
          end: () => `+=${getHorizontalDistance()}`,
          pin: true,
          pinSpacing: true,
          scrub: true,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            const progress = self.progress;
            progressRef.current = progress;

            // Animate thread drawing
            if (threadRef.current) {
              const totalLength = threadLengthRef.current || threadRef.current.getTotalLength();
              threadRef.current.style.strokeDasharray = `${totalLength}`;
              threadRef.current.style.strokeDashoffset = `${
                totalLength * (1 - progress)
              }`;
            }

            // Animate seals
            sealRefs.current.forEach((seal, i) => {
              if (!seal) return;
              const nodeProgress = Math.max(
                0,
                Math.min(1, progress * 3 - i + 0.3)
              );
              seal.style.opacity = String(nodeProgress);
              const scale = 0.6 + nodeProgress * 0.4;
              seal.style.transform = `scale(${scale})`;
            });

            const nextIndex = Math.min(
              experiences.length - 1,
              Math.round(progress * (experiences.length - 1))
            );
            if (nextIndex !== activeIndexRef.current) {
              activeIndexRef.current = nextIndex;
              setActiveIndex(nextIndex);
            }
          },
          onRefresh: (self) => {
            if (self.isActive) {
              isPinned = true;
              disableSmooth();
            } else {
              isPinned = false;
              enableSmooth();
            }
          },
          onEnter: () => {
            isPinned = true;
            disableSmooth();
          },
          onLeave: () => {
            isPinned = false;
            enableSmooth();
          },
          onEnterBack: () => {
            isPinned = true;
            disableSmooth();
          },
          onLeaveBack: () => {
            isPinned = false;
            enableSmooth();
          },
        },
      });

      ScrollTrigger.refresh();
    }, container);

    return () => {
      container.removeEventListener("wheel", handleWheel);
      ctx.revert();
    };
  }, []);

  return (
    <section
      ref={containerRef}
      className="relative h-screen w-full max-w-full overflow-x-clip overflow-y-hidden"
      id="experience"
    >
      <div className="absolute top-0 left-0 w-full z-10 px-6 md:px-12 lg:px-24 pt-24 md:pt-32">
        <p className="text-xs font-semibold tracking-[0.2em] uppercase text-outline mb-4">
          Career Path
        </p>
        <h2 className="font-h1 text-h1 text-on-surface">Experience</h2>
      </div>

      <div className="h-full w-full overflow-hidden">
        <div
          ref={trackRef}
          className="flex h-full min-w-full will-change-transform relative"
        >
          {/* Red Thread SVG Overlay */}
          <div
            className="absolute top-0 left-0 h-full pointer-events-none z-0"
            style={{ width: `${experiences.length * 100}%` }}
          >
            <svg
              className="w-full h-full"
              preserveAspectRatio="none"
              viewBox="0 0 3000 1000"
            >
              <defs>
                <filter
                  id="threadGlow"
                  x="-20%"
                  y="-20%"
                  width="140%"
                  height="140%"
                >
                  <feGaussianBlur stdDeviation="4" result="blur" />
                  <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>

              {/* The red thread */}
              <path
                ref={threadRef}
                d="M 100 520 
                   C 350 520, 400 380, 600 380 
                   S 850 520, 1100 520
                   C 1350 520, 1400 660, 1600 660
                   S 1850 520, 2100 520
                   C 2350 520, 2400 360, 2600 360
                   S 2800 520, 2900 520"
                fill="none"
                stroke="#c23b22"
                strokeWidth="2.5"
                strokeLinecap="round"
                filter="url(#threadGlow)"
                opacity="0.8"
              />

              {/* Seals at each node */}
              {[
                { x: 600, y: 380, label: "壹" },
                { x: 1600, y: 660, label: "二" },
                { x: 2600, y: 360, label: "三" },
              ].map((seal, i) => (
                <g
                  key={i}
                  ref={(el) => {
                    sealRefs.current[i] = el;
                  }}
                  style={{
                    transformOrigin: `${seal.x}px ${seal.y}px`,
                    opacity: 0,
                    transform: "scale(0.6)",
                  }}
                >
                  {/* Outer ring */}
                  <circle
                    cx={seal.x}
                    cy={seal.y}
                    r="24"
                    fill="none"
                    stroke="#c23b22"
                    strokeWidth="2"
                    opacity="0.3"
                  />
                  {/* Inner stamp */}
                  <circle
                    cx={seal.x}
                    cy={seal.y}
                    r="18"
                    fill="#c23b22"
                    opacity="0.12"
                  />
                  {/* Character */}
                  <text
                    x={seal.x}
                    y={seal.y}
                    textAnchor="middle"
                    dominantBaseline="central"
                    fill="#c23b22"
                    fontSize="14"
                    fontWeight="600"
                    opacity="0.9"
                  >
                    {seal.label}
                  </text>
                </g>
              ))}

              {/* Small floating particles along the thread */}
              {[
                { x: 300, y: 480 },
                { x: 800, y: 450 },
                { x: 1300, y: 580 },
                { x: 1800, y: 500 },
                { x: 2300, y: 420 },
                { x: 2700, y: 480 },
              ].map((p, i) => (
                <circle
                  key={`p-${i}`}
                  cx={p.x}
                  cy={p.y}
                  r="2"
                  fill="#c23b22"
                  opacity="0.2"
                />
              ))}
            </svg>
          </div>

          {experiences.map((exp, i) => (
            <div
              key={i}
              className="experience-slide flex-none w-full min-w-0 h-full flex items-center px-6 md:px-12 lg:px-24"
            >
              <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 w-full items-center">
                <div className="md:col-span-5">
                  <p className="text-sm font-medium text-outline mb-4 tracking-wide">
                    {exp.date}
                  </p>
                  <h3 className="text-4xl md:text-5xl lg:text-6xl font-semibold text-on-surface leading-[1.1] mb-3">
                    {exp.title}
                  </h3>
                  <p className="text-xl text-on-surface-variant">
                    {exp.company}
                  </p>
                </div>
                <div className="md:col-span-6 md:col-start-7">
                  <p className="text-lg md:text-xl text-on-surface-variant leading-relaxed max-w-lg">
                    {exp.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom fade into next section */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent z-10 pointer-events-none" />

      <div className="absolute bottom-12 left-0 w-full px-6 md:px-12 lg:px-24 z-10">
        <div className="relative mx-auto max-w-3xl">
          <div className="absolute left-0 right-0 top-4 h-px bg-outline/20" />
          <div
            className="absolute left-0 top-4 h-px bg-primary/50 transition-all duration-500"
            style={{
              width: `${
                (activeIndex / Math.max(experiences.length - 1, 1)) * 100
              }%`,
            }}
          />
          <div className="relative grid grid-cols-3 gap-6">
            {experiences.map((exp, i) => (
              <div
                key={exp.title}
                className="flex flex-col items-center text-center gap-3"
              >
                <div
                  className={`h-3 w-3 rounded-full border transition-all duration-500 ${
                    i <= activeIndex
                      ? "border-primary bg-primary shadow-[0_0_0_6px_rgba(138,180,248,0.12)]"
                      : "border-outline/40 bg-background"
                  }`}
                />
                <div className="space-y-1">
                  <p
                    className={`text-[11px] tracking-[0.2em] uppercase transition-colors duration-500 ${
                      i === activeIndex ? "text-on-surface" : "text-outline"
                    }`}
                  >
                    {exp.date}
                  </p>
                  <p
                    className={`text-xs md:text-sm transition-colors duration-500 ${
                      i === activeIndex
                        ? "text-on-surface-variant"
                        : "text-on-surface-variant/60"
                    }`}
                  >
                    {exp.company}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
