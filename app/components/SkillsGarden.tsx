"use client";

import { useEffect, useRef, forwardRef, useImperativeHandle } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const skills = [
  {
    title: "Frontend Engineering",
    tags: ["React", "Vue", "Next.js", "TypeScript"],
    description: "Crafting pixel-perfect interfaces with modern frameworks",
    stoneColor: "#2a2a2a",
  },
  {
    title: "Backend & APIs",
    tags: ["Node.js", "Python", "GraphQL", "PostgreSQL"],
    description: "Building robust systems that scale with grace",
    stoneColor: "#3d3d3d",
  },
  {
    title: "Creative Development",
    tags: ["Three.js", "WebGL", "GSAP", "Framer Motion"],
    description: "Where engineering meets artistic expression",
    stoneColor: "#1c1c1c",
  },
  {
    title: "Interface Design",
    tags: ["Tailwind CSS", "Figma", "Design Systems", "Accessibility"],
    description: "Designing with intention and inclusivity",
    stoneColor: "#333333",
  },
  {
    title: "Product Strategy",
    tags: ["User Research", "Analytics", "A/B Testing", "Growth"],
    description: "Turning insights into impactful features",
    stoneColor: "#262626",
  },
];

type RakedSandHandle = {
  draw: (progress: number) => void;
};

const RakedSand = forwardRef<RakedSandHandle, {}>((_, ref) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const noiseCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const sizeRef = useRef({ width: 0, height: 0, dpr: 1 });

  useImperativeHandle(ref, () => ({
    draw: (progress: number) => {
      const canvas = canvasRef.current;
      const ctx = canvas?.getContext("2d");
      const noiseCanvas = noiseCanvasRef.current;
      if (!canvas || !ctx || !noiseCanvas) return;

      const { width, height } = sizeRef.current;

      ctx.clearRect(0, 0, width, height);
      ctx.drawImage(noiseCanvas, 0, 0, width, height);

      const centerX = width / 2;
      const centerY = height / 2;
      const maxRadius = Math.max(width, height) * 0.85;

      // Concentric raked circles
      const numRings = 14;
      for (let i = 0; i < numRings; i++) {
        const baseRadius = (i / numRings) * maxRadius;
        const shiftAmount = progress * 80 * (i % 2 === 0 ? 1 : -1);

        ctx.beginPath();
        ctx.arc(
          centerX + shiftAmount * 0.35,
          centerY,
          baseRadius,
          0,
          Math.PI * 2,
        );
        ctx.strokeStyle = `rgba(140, 132, 118, ${0.5 + (i / numRings) * 0.4})`;
        ctx.lineWidth = 2;
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(
          centerX + shiftAmount * 0.5,
          centerY + Math.sin(progress * Math.PI * 2 + i) * 12,
          baseRadius * 0.97,
          0,
          Math.PI * 2,
        );
        ctx.strokeStyle = `rgba(160, 152, 138, ${0.25 + (i / numRings) * 0.25})`;
        ctx.lineWidth = 1;
        ctx.stroke();
      }

      // Radial rake lines
      const numLines = 32;
      ctx.save();
      ctx.translate(centerX, centerY);
      ctx.rotate(progress * Math.PI * 0.5);

      for (let i = 0; i < numLines; i++) {
        const angle = (i / numLines) * Math.PI * 2;
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(Math.cos(angle) * maxRadius, Math.sin(angle) * maxRadius);
        ctx.strokeStyle = `rgba(150, 142, 128, ${0.2 + Math.sin(i * 0.7) * 0.15})`;
        ctx.lineWidth = 1.2;
        ctx.stroke();
      }
      ctx.restore();

      // Wave ripple accents
      const numWaves = 6;
      for (let i = 0; i < numWaves; i++) {
        const waveY =
          (height / numWaves) * i + Math.sin(progress * Math.PI * 4 + i) * 30;
        ctx.beginPath();
        ctx.moveTo(0, waveY);
        for (let x = 0; x < width; x += 20) {
          ctx.lineTo(x, waveY + Math.sin((x + progress * 200) * 0.02 + i) * 8);
        }
        ctx.strokeStyle = `rgba(170, 162, 148, ${0.12 + i * 0.02})`;
        ctx.lineWidth = 1.5;
        ctx.stroke();
      }

      // Floating particles
      const particles = 24;
      for (let i = 0; i < particles; i++) {
        const t = (i / particles) * Math.PI * 2;
        const dist = maxRadius * (0.35 + Math.sin(i * 2.7) * 0.25);
        const px = centerX + Math.cos(t + progress * 3) * dist;
        const py = centerY + Math.sin(t + progress * 2.5) * dist * 0.6;
        const size = 2 + Math.sin(i * 1.3) * 1.2;

        ctx.beginPath();
        ctx.arc(px, py, size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(194, 59, 34, ${0.12 + Math.sin(progress * 4 + i) * 0.06})`;
        ctx.fill();
      }
    },
  }));

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = 0;
    let height = 0;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const parent = canvas.parentElement;
      if (!parent) return;
      width = parent.clientWidth;
      height = parent.clientHeight;
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      sizeRef.current = { width, height, dpr };

      // Cache static noise to an offscreen canvas so we never regenerate it per frame
      const noiseCanvas = document.createElement("canvas");
      noiseCanvas.width = Math.floor(width * dpr);
      noiseCanvas.height = Math.floor(height * dpr);
      const noiseCtx = noiseCanvas.getContext("2d");
      if (noiseCtx) {
        noiseCtx.setTransform(dpr, 0, 0, dpr, 0, 0);
        noiseCtx.fillStyle = "#e2ddd2";
        noiseCtx.fillRect(0, 0, width, height);
        for (let i = 0; i < 4000; i++) {
          const sx = Math.random() * width;
          const sy = Math.random() * height;
          const v = Math.random();
          noiseCtx.fillStyle =
            v > 0.5 ? "rgba(255,255,255,0.12)" : "rgba(0,0,0,0.04)";
          noiseCtx.fillRect(sx, sy, 1.5, 1.5);
        }
      }
      noiseCanvasRef.current = noiseCanvas;
    };

    resize();
    window.addEventListener("resize", resize);

    return () => {
      window.removeEventListener("resize", resize);
    };
  }, []);

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />;
});

RakedSand.displayName = "RakedSand";

export default function SkillsGarden() {
  const sectionRef = useRef<HTMLElement>(null);
  const stonesRef = useRef<(HTMLDivElement | null)[]>([]);
  const shadowsRef = useRef<(HTMLDivElement | null)[]>([]);
  const progressRef = useRef(0);
  const sandRef = useRef<RakedSandHandle>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    const ctx = gsap.context(() => {
      // Section-wide scroll progress drives the sand canvas
      ScrollTrigger.create({
        trigger: section,
        start: "top bottom",
        end: "bottom top",
        onUpdate: (self) => {
          progressRef.current = self.progress;
          sandRef.current?.draw(self.progress);
        },
      });

      if (prefersReduced) return;

      // Animate each stone
      stonesRef.current.forEach((stone, i) => {
        if (!stone) return;

        const isEven = i % 2 === 0;
        const shadow = shadowsRef.current[i];

        // Entry animation
        gsap.fromTo(
          stone,
          {
            y: 120,
            opacity: 0,
            scale: 0.85,
            rotateX: 8,
            rotateZ: isEven ? -2 : 2,
          },
          {
            y: 0,
            opacity: 1,
            scale: 1,
            rotateX: 0,
            rotateZ: isEven ? -1 : 1,
            duration: 1.2,
            ease: "power3.out",
            scrollTrigger: {
              trigger: stone,
              start: "top 85%",
              end: "top 50%",
              scrub: 1,
            },
          },
        );

        // Parallax float
        gsap.to(stone, {
          y: isEven ? -40 : -25,
          x: isEven ? 15 : -10,
          rotateZ: isEven ? 1 : -1,
          ease: "none",
          scrollTrigger: {
            trigger: stone,
            start: "top bottom",
            end: "bottom top",
            scrub: 1.5,
          },
        });

        // Shadow parallax (moves opposite to stone)
        if (shadow) {
          gsap.to(shadow, {
            y: isEven ? 30 : 20,
            x: isEven ? -20 : 15,
            scale: 0.9,
            opacity: 0.15,
            ease: "none",
            scrollTrigger: {
              trigger: stone,
              start: "top bottom",
              end: "bottom top",
              scrub: 1.5,
            },
          });
        }
      });
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen w-full py-40 overflow-hidden"
      id="skills"
    >
      {/* Raked Sand Background */}
      <div className="absolute inset-0 z-0">
        <RakedSand ref={sandRef} />
      </div>

      {/* Top fade transition for free-flowing scroll */}
      <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-background to-transparent z-10 pointer-events-none" />

      {/* Content */}
      <div className="relative z-10 px-6 md:px-12 lg:px-24 max-w-6xl mx-auto pt-20">
        {/* Section Header */}
        <div className="mb-32 text-center">
          <p className="text-xs font-bold tracking-[0.3em] uppercase text-black mb-6">
            Digital Zen Garden
          </p>
          <h2 className="font-h1 text-h1 text-on-surface mb-4">Skills</h2>
          <p className="text-on-surface-variant max-w-md mx-auto">
            Each stone represents a discipline cultivated with patience and
            precision
          </p>
        </div>

        {/* Stones Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-24">
          {skills.map((skill, i) => {
            const isEven = i % 2 === 0;
            return (
              <div
                key={skill.title}
                className={`relative ${isEven ? "md:mt-0" : "md:mt-20"}`}
              >
                {/* Shadow element */}
                <div
                  ref={(el) => {
                    shadowsRef.current[i] = el;
                  }}
                  className="absolute inset-0 rounded-2xl bg-black/10 blur-xl transform translate-y-8 translate-x-4"
                  style={{ willChange: "transform, opacity" }}
                />

                {/* Stone */}
                <div
                  ref={(el) => {
                    stonesRef.current[i] = el;
                  }}
                  className="relative bg-surface-container-high/80 backdrop-blur-sm rounded-2xl p-8 md:p-10 border border-outline/10"
                  style={{
                    willChange: "transform, opacity",
                    perspective: "1000px",
                  }}
                >
                  {/* Stone top accent line */}
                  <div
                    className="absolute top-0 left-8 right-8 h-px opacity-30"
                    style={{
                      background: `linear-gradient(90deg, transparent, ${skill.stoneColor}, transparent)`,
                    }}
                  />

                  {/* Skill title */}
                  <h3 className="text-2xl md:text-3xl font-semibold text-on-surface mb-3">
                    {skill.title}
                  </h3>

                  {/* Description */}
                  <p className="text-sm text-on-surface-variant mb-6 leading-relaxed">
                    {skill.description}
                  </p>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-2">
                    {skill.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-3 py-1.5 text-xs font-medium tracking-wide text-on-surface-variant bg-surface-container-lowest/60 rounded-full border border-outline/20"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* Decorative corner mark */}
                  <div className="absolute bottom-4 right-4 w-8 h-8 opacity-10">
                    <svg viewBox="0 0 32 32" fill="none">
                      <circle
                        cx="16"
                        cy="16"
                        r="14"
                        stroke="currentColor"
                        strokeWidth="1"
                      />
                      <circle cx="16" cy="16" r="6" fill="currentColor" />
                    </svg>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Bottom transition gradient */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent z-10 pointer-events-none" />
    </section>
  );
}
