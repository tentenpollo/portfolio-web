"use client";

import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import gsap from "gsap";
import Image from "next/image";

interface ProjectModalProps {
  project: {
    title: string;
    category: string;
    year: string;
    image: string;
    size: string;
    description: string;
    link?: string | null;
  };
  sourceRect: DOMRect;
  onClose: () => void;
}

export default function ProjectModal({
  project,
  sourceRect,
  onClose,
}: ProjectModalProps) {
  const backdropRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const tlRef = useRef<gsap.core.Timeline | null>(null);

  useEffect(() => {
    const backdrop = backdropRef.current;
    const container = containerRef.current;
    const content = contentRef.current;
    if (!backdrop || !container || !content) return;

    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    const finalWidth =
      window.innerWidth < 640
        ? window.innerWidth - 32
        : Math.min(window.innerWidth * 0.85, 800);

    gsap.set(container, {
      top: sourceRect.top,
      left: sourceRect.left,
      width: sourceRect.width,
      height: sourceRect.height,
      borderRadius: "0.125rem",
      overflow: "hidden",
    });
    gsap.set(backdrop, { opacity: 0 });
    gsap.set(content, { opacity: 0 });

    if (prefersReduced) {
      gsap.set(backdrop, { opacity: 1 });
      gsap.set(content, { opacity: 1 });
      gsap.set(container, {
        top: "50%",
        left: "50%",
        xPercent: -50,
        yPercent: -50,
        width: finalWidth,
        height: "auto",
        maxHeight: "90vh",
        overflowY: "auto",
        borderRadius: "1rem",
      });
      document.body.style.overflow = "hidden";
      return;
    }

    const tl = gsap.timeline();
    tlRef.current = tl;

    tl.to(container, {
      top: "50%",
      left: "50%",
      xPercent: -50,
      yPercent: -50,
      width: finalWidth,
      height: "auto",
      maxHeight: "90vh",
      borderRadius: "1rem",
      duration: 0.5,
      ease: "power3.inOut",
    })
      .to(
        backdrop,
        { opacity: 1, duration: 0.35, ease: "power2.out" },
        "<+=0.1"
      )
      .to(
        content,
        { opacity: 1, duration: 0.3, ease: "power2.out" },
        ">-=0.1"
      )
      .eventCallback("onComplete", () => {
        gsap.set(container, { overflowY: "auto" });
      });

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    const handleResize = () => onClose();

    window.addEventListener("keydown", handleEscape);
    window.addEventListener("resize", handleResize);
    document.body.style.overflow = "hidden";

    return () => {
      window.removeEventListener("keydown", handleEscape);
      window.removeEventListener("resize", handleResize);
      document.body.style.overflow = "";
      tl.kill();
    };
  }, []);

  function close() {
    const container = containerRef.current;
    const backdrop = backdropRef.current;

    if (!container || !backdrop) {
      onClose();
      return;
    }

    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (prefersReduced) {
      onClose();
      return;
    }

    gsap.set(container, { overflow: "hidden" });
    tlRef.current?.kill();

    gsap
      .timeline({ onComplete: onClose })
      .to(contentRef.current, {
        opacity: 0,
        duration: 0.15,
        ease: "power2.in",
      })
      .to(
        container,
        {
          top: sourceRect.top,
          left: sourceRect.left,
          xPercent: 0,
          yPercent: 0,
          width: sourceRect.width,
          height: sourceRect.height,
          borderRadius: "0.125rem",
          duration: 0.4,
          ease: "power3.inOut",
        },
        "<"
      )
      .to(
        backdrop,
        { opacity: 0, duration: 0.3, ease: "power2.in" },
        "<+=0.1"
      );
  }

  function handleBackdropClick(e: React.MouseEvent) {
    if (e.target === backdropRef.current) close();
  }

  const modal = (
    <>
      {/* Backdrop */}
      <div
        ref={backdropRef}
        className="fixed inset-0 z-[70] bg-background/80 backdrop-blur-sm"
        onClick={handleBackdropClick}
      />

      {/* Container */}
      <div
        ref={containerRef}
        className="fixed z-[70] bg-surface-container border border-outline/10 shadow-2xl overflow-y-auto hide-scrollbar"
      >
        <div ref={contentRef} className="p-6 md:p-10 lg:p-12">
          {/* Close button */}
          <button
            onClick={close}
            className="absolute top-4 right-4 z-10 w-9 h-9 flex items-center justify-center rounded-full bg-surface-container-high/60 hover:bg-surface-container-high text-on-surface-variant hover:text-on-surface transition-colors duration-300"
            aria-label="Close"
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 14 14"
              fill="none"
            >
              <path
                d="M1 1L13 13M13 1L1 13"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
          </button>

          {/* Image */}
          <div className="relative w-full aspect-[16/9] mb-8 rounded-lg overflow-hidden">
            <Image
              src={project.image}
              alt={project.title}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 800px"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-surface-container/60 to-transparent" />
          </div>

          {/* Meta */}
          <div className="flex items-center gap-3 mb-6">
            <span className="text-xs text-outline tracking-widest">
              {project.year}
            </span>
            <span className="w-1 h-1 rounded-full bg-outline" />
            <span className="text-xs text-outline uppercase tracking-[0.15em]">
              {project.category}
            </span>
          </div>

          {/* Title */}
          <h2 className="font-h1 text-h1 text-on-surface mb-6">
            {project.title}
          </h2>

          {/* Description */}
          <p className="text-body-md text-on-surface-variant leading-relaxed mb-8 max-w-prose">
            {project.description}
          </p>

          {/* GitHub CTA */}
          {project.link ? (
            <a
              href={project.link}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 bg-[#201c1c] text-[#f4f1ea] text-xs tracking-[0.15em] uppercase rounded-full hover:bg-on-surface transition-colors duration-300"
            >
              View on GitHub
              <svg
                width="12"
                height="12"
                viewBox="0 0 12 12"
                fill="none"
              >
                <path
                  d="M1 11L11 1M11 1H3M11 1V9"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </a>
          ) : (
            <span className="text-xs text-on-surface-variant/40 tracking-[0.15em] uppercase italic">
              Repository coming soon
            </span>
          )}
        </div>
      </div>
    </>
  );

  if (typeof window === "undefined") return null;
  return createPortal(modal, document.body);
}
