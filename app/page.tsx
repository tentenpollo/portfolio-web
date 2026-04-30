import Navbar from "./components/Navbar";
import ExperienceScroll from "./components/ExperienceScroll";
import ScrollReveal from "./components/ScrollReveal";
import Parallax from "./components/Parallax";
import WorkBento from "./components/WorkBento";

export default function Home() {
  return (
    <>
      <div className="texture-overlay"></div>

      <Navbar />

      <main className="relative z-10 w-full max-w-full overflow-x-clip flex flex-col">
        <section className="min-h-screen flex flex-col justify-center items-center ink-gradient relative px-6" id="hero">
          <div className="text-center flex flex-col items-center gap-8">
            <h1 className="font-display-xl text-display-xl text-on-surface animate-fade-up">KENSU</h1>
            <p className="font-body-lg text-body-lg text-on-surface-variant max-w-xl text-center animate-fade-up animation-delay-100">Full-Stack Developer & Creative Technologist.</p>
          </div>
          <div className="absolute right-6 md:right-12 lg:right-24 top-1/2 -translate-y-1/2 hidden lg:block text-xs tracking-[0.3em] uppercase text-on-surface-variant/40 [writing-mode:vertical-rl] animate-fade-up animation-delay-200">
            Digital Zen Garden
          </div>
        </section>

        <section className="px-6 md:px-12 lg:px-24 py-40 w-full" id="about">
          <ScrollReveal>
            <div className="grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-16 items-start">
              <div className="md:col-span-4">
                <p className="text-xs font-semibold tracking-[0.2em] uppercase text-outline mb-6">About Me</p>
                <h2 className="font-h1 text-h1 text-on-surface">Crafting digital tranquility through code.</h2>
              </div>
              <div className="md:col-span-7 md:col-start-6 pt-2">
                <p className="font-body-lg text-body-lg text-on-surface-variant leading-relaxed">
                  I build digital experiences that respect the user&apos;s attention. Blending modern engineering practices with a minimalist design philosophy, I focus on performance, accessibility, and the subtle details that elevate a product from functional to memorable.
                </p>
              </div>
            </div>
          </ScrollReveal>
        </section>

        <WorkBento />

        <ExperienceScroll />

        <section className="px-6 md:px-12 lg:px-24 py-40 w-full" id="skills">
          <ScrollReveal>
            <p className="text-xs font-semibold tracking-[0.2em] uppercase text-outline mb-20">Skills</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-24 gap-y-0">
              <Parallax speed={-0.08}>
                <div className="border-t border-outline/20 py-8 flex flex-col md:flex-row md:justify-between md:items-center gap-2">
                  <span className="text-2xl text-on-surface font-medium">Frontend Engineering</span>
                  <span className="text-sm text-on-surface-variant">React, Vue, Next.js</span>
                </div>
              </Parallax>
              <Parallax speed={0.06}>
                <div className="border-t border-outline/20 py-8 flex flex-col md:flex-row md:justify-between md:items-center gap-2">
                  <span className="text-2xl text-on-surface font-medium">Backend & APIs</span>
                  <span className="text-sm text-on-surface-variant">TypeScript, Node.js, Python</span>
                </div>
              </Parallax>
              <Parallax speed={-0.06}>
                <div className="border-t border-outline/20 py-8 flex flex-col md:flex-row md:justify-between md:items-center gap-2">
                  <span className="text-2xl text-on-surface font-medium">Creative Development</span>
                  <span className="text-sm text-on-surface-variant">Three.js, WebGL, Framer Motion</span>
                </div>
              </Parallax>
              <Parallax speed={0.08}>
                <div className="border-t border-outline/20 py-8 flex flex-col md:flex-row md:justify-between md:items-center gap-2">
                  <span className="text-2xl text-on-surface font-medium">Interface Design</span>
                  <span className="text-sm text-on-surface-variant">Tailwind CSS, CSS Modules</span>
                </div>
              </Parallax>
              <Parallax speed={-0.04} className="md:col-span-2">
                <div className="border-t border-outline/20 py-8 flex flex-col md:flex-row md:justify-between md:items-center gap-2">
                  <span className="text-2xl text-on-surface font-medium">Product Strategy</span>
                  <span className="text-sm text-on-surface-variant">Figma, Design Systems</span>
                </div>
              </Parallax>
            </div>
          </ScrollReveal>
        </section>

        <section className="min-h-[70vh] flex flex-col justify-center items-center text-center py-40 px-6" id="contact">
          <ScrollReveal>
            <p className="text-xs font-semibold tracking-[0.2em] uppercase text-outline mb-12">Get in Touch</p>
            <Parallax speed={-0.1} scale={0.92}>
              <a className="group inline-block text-6xl md:text-7xl lg:text-8xl font-semibold text-on-surface hover:text-primary transition-colors duration-700" href="mailto:hello@kensu.design">
                hello@kensu.design
                <span className="inline-block transition-transform duration-700 group-hover:translate-x-4">-&gt;</span>
              </a>
            </Parallax>
          </ScrollReveal>
        </section>
      </main>

      <footer className="w-full py-12 px-6 md:px-12 lg:px-24 flex flex-col md:flex-row justify-between items-center gap-6 text-xs tracking-[0.2em] uppercase text-on-surface-variant/60">
        <div className="font-semibold text-on-surface">KENSU</div>
        <div className="flex gap-8">
          <a className="hover:text-on-surface transition-colors duration-500" href="#">Github</a>
          <a className="hover:text-on-surface transition-colors duration-500" href="#">LinkedIn</a>
          <a className="hover:text-on-surface transition-colors duration-500" href="#">Read.cv</a>
        </div>
        <div>(c) 2024</div>
      </footer>
    </>
  );
}
