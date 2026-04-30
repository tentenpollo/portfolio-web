"use client";

import { useState, useEffect } from "react";

const navItems = [
  { label: "Work", href: "#work" },
  { label: "Experience", href: "#experience" },
  { label: "Skills", href: "#skills" },
  { label: "Contact", href: "#contact" },
];

export default function Navbar() {
  const [activeSection, setActiveSection] = useState<string>("");

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      {
        rootMargin: "-40% 0px -40% 0px",
        threshold: 0,
      }
    );

    navItems.forEach((item) => {
      const section = document.querySelector(item.href);
      if (section) observer.observe(section);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <nav className="fixed top-0 w-full z-50 bg-background/40 backdrop-blur-2xl transition-all duration-500">
      <div className="w-full flex justify-between items-center px-6 md:px-12 lg:px-24 py-5">
        <div className="text-lg font-bold tracking-[0.2em] text-on-surface">KENSŪ</div>
        <div className="hidden md:flex gap-10 items-center text-sm font-medium">
          {navItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className={`nav-link transition-colors duration-500 ${
                activeSection === item.href.slice(1)
                  ? "active text-on-surface"
                  : "text-on-surface-variant hover:text-on-surface"
              }`}
            >
              {item.label}
            </a>
          ))}
          <a
            className="ml-6 px-5 py-2.5 bg-on-surface text-surface rounded-full text-xs font-semibold tracking-wide hover:bg-primary hover:text-on-primary transition-colors duration-500"
            href="#contact"
          >
            Hire Me
          </a>
        </div>
      </div>
    </nav>
  );
}
