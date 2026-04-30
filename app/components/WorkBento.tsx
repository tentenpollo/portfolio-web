"use client";

import { useState, useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Parallax from "./Parallax";

gsap.registerPlugin(ScrollTrigger);

const projects = [
  {
    title: "Aura",
    category: "Meditation Platform",
    year: "2024",
    image: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800&h=800&fit=crop&q=80",
    size: "large",
    description: "A calm digital space for breathwork and mindfulness.",
  },
  {
    title: "Generative Identity",
    category: "Algorithmic Branding",
    year: "2023",
    image: "https://images.unsplash.com/photo-1549490349-8643362247b5?w=600&h=600&fit=crop&q=80",
    size: "medium",
    description: "Procedural visual systems for dynamic brands.",
  },
  {
    title: "FinTech",
    category: "Data Dashboard",
    year: "2022",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&h=600&fit=crop&q=80",
    size: "medium",
    description: "Real-time analytics with quiet confidence.",
  },
];

export default function WorkBento() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const sectionRef = useRef<HTMLDivElement>(null);

  // Inner image parallax for each card
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) return;

    const images = section.querySelectorAll<HTMLImageElement>(".bento-inner-img");
    const tweens: gsap.core.Tween[] = [];

    images.forEach((img, i) => {
      const speed = i === 0 ? 0.3 : i === 1 ? -0.2 : 0.25;
      const tween = gsap.fromTo(
        img,
        { y: 60 * speed, scale: 1.08 },
        {
          y: -60 * speed,
          scale: 1,
          ease: "none",
          scrollTrigger: {
            trigger: img.closest(".bento-card-wrapper"),
            start: "top bottom",
            end: "bottom top",
            scrub: 1.2,
          },
        }
      );
      tweens.push(tween);
    });

    return () => {
      tweens.forEach((t) => t.kill());
    };
  }, []);

  return (
    <div className="relative py-40 w-full" ref={sectionRef}>
      {/* Floating decorative index — extreme parallax layer */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <Parallax speed={-0.35} className="absolute top-20 left-[5%] lg:left-[8%]">
          <span className="text-[12rem] md:text-[20rem] font-bold text-outline/[0.03] leading-none select-none">
            01
          </span>
        </Parallax>
        <Parallax speed={0.25} className="absolute bottom-32 right-[5%] lg:right-[10%]">
          <span className="text-[10rem] md:text-[16rem] font-bold text-outline/[0.03] leading-none select-none">
            02
          </span>
        </Parallax>
      </div>

      {/* Header */}
      <Parallax speed={-0.08} className="px-6 md:px-12 lg:px-24 mb-24">
        <p className="text-xs font-semibold tracking-[0.2em] uppercase text-outline mb-4">Portfolio</p>
        <h2 className="font-h1 text-h1 text-on-surface">Selected Work</h2>
      </Parallax>

      <div className="px-6 md:px-12 lg:px-24">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {/* Large Feature — Left */}
          <Parallax speed={-0.2} rotate={1.5} className="md:col-span-2 md:row-span-2 aspect-square md:aspect-auto bento-card-wrapper">
            <ProjectCard
              project={projects[0]}
              index={0}
              isHovered={hoveredIndex === 0}
              isOtherHovered={hoveredIndex !== null && hoveredIndex !== 0}
              onHover={() => setHoveredIndex(0)}
              onLeave={() => setHoveredIndex(null)}
            />
          </Parallax>

          {/* Medium — Top Right */}
          <Parallax speed={0.15} rotate={-1} className="aspect-square bento-card-wrapper">
            <ProjectCard
              project={projects[1]}
              index={1}
              isHovered={hoveredIndex === 1}
              isOtherHovered={hoveredIndex !== null && hoveredIndex !== 1}
              onHover={() => setHoveredIndex(1)}
              onLeave={() => setHoveredIndex(null)}
            />
          </Parallax>

          {/* Medium — Bottom Right */}
          <Parallax speed={-0.12} rotate={0.8} className="aspect-square bento-card-wrapper">
            <ProjectCard
              project={projects[2]}
              index={2}
              isHovered={hoveredIndex === 2}
              isOtherHovered={hoveredIndex !== null && hoveredIndex !== 2}
              onHover={() => setHoveredIndex(2)}
              onLeave={() => setHoveredIndex(null)}
            />
          </Parallax>
        </div>
      </div>
    </div>
  );
}

interface ProjectCardProps {
  project: (typeof projects)[0];
  index: number;
  isHovered: boolean;
  isOtherHovered: boolean;
  onHover: () => void;
  onLeave: () => void;
}

function ProjectCard({ project, index, isHovered, isOtherHovered, onHover, onLeave }: ProjectCardProps) {
  const isLarge = project.size === "large";

  return (
    <article
      className={`group relative w-full h-full overflow-hidden cursor-pointer bg-surface-container border border-outline/5 transition-all duration-700 ${
        isOtherHovered ? "opacity-40 scale-[0.97]" : "opacity-100"
      }`}
      onMouseEnter={onHover}
      onMouseLeave={onLeave}
    >
      {/* Background Image — inner parallax handled by useEffect above */}
      <img
        src={project.image}
        alt={project.title}
        loading="lazy"
        className={`bento-inner-img absolute inset-0 w-full h-full object-cover transition-all duration-1000 will-change-transform ${
          isHovered ? "opacity-100" : "opacity-60"
        }`}
      />

      {/* Overlay */}
      <div
        className={`absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent transition-opacity duration-700 ${
          isHovered ? "opacity-90" : "opacity-60"
        }`}
      />

      {/* Content */}
      <div className="absolute inset-0 p-6 md:p-8 flex flex-col justify-between">
        <div className="flex justify-between items-start">
          <span className="text-xs text-outline tracking-widest">{project.year}</span>
          <span
            className={`text-xs text-on-surface-variant transition-all duration-500 ${
              isHovered ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-2"
            }`}
          >
            View -&gt;
          </span>
        </div>

        <div>
          <p
            className={`text-xs text-outline uppercase tracking-wider mb-2 transition-all duration-500 ${
              isHovered ? "opacity-100 translate-y-0" : "opacity-70 translate-y-0"
            }`}
          >
            {project.category}
          </p>
          <h3
            className={`font-semibold text-on-surface transition-all duration-500 ${
              isLarge ? "text-3xl md:text-4xl lg:text-5xl" : "text-xl md:text-2xl"
            } ${isHovered ? "text-primary" : ""}`}
          >
            {project.title}
          </h3>
          <p
            className={`mt-2 text-sm text-on-surface-variant max-w-xs transition-all duration-500 ${
              isHovered ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            }`}
          >
            {project.description}
          </p>
        </div>
      </div>
    </article>
  );
}
