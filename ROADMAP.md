# Digital Zen Garden — Roadmap

> A living document capturing the experimental motion and interaction phases for the portfolio.

---

## Phase 3: Motion & Micro-interactions
*Goal: Add the "gliding" feel and polish that bridges layout into experience.*

### 3.1 Global Timing Audit
- Audit every `transition-colors duration-300` across the site.
- Bump hover transitions to `duration-500` or `duration-700`.
- Ensure nothing feels "rushed" — the user should feel invited, not pushed.

### 3.2 Scroll-Triggered Reveals
- Implement a lightweight fade-up effect for text blocks and project cards as they enter the viewport.
- Preferred approach: CSS `animation-timeline` with a JS fallback (IntersectionObserver) for broader support.
- Motion spec: `translateY(24px) → 0`, `opacity: 0 → 1`, `duration: 0.8s`, `easing: cubic-bezier(0.16, 1, 0.3, 1)`.

### 3.3 Smooth Scroll
- Integrate **Lenis** (or equivalent lightweight smooth-scroll library) to replace default browser scroll.
- Config target: `lerp: 0.1`, `smoothWheel: true`.
- Fallback: Native `scroll-behavior: smooth` if library is deferred.

### 3.4 Page Load Sequence
- Hero text should stagger in on load: name first, then descriptor, then the vertical accent.
- Timing: `stagger: 0.15s`, `duration: 1.2s`, `ease: power3.out` (if GSAP) or CSS keyframes.

---

## Phase 4: Experimental Effects
*Goal: The "wow" factors that make this portfolio unmistakably unique.*

### 4.1 Ink Wash Diffusion (Hero Background)
- A subtle, generative WebGL or Canvas 2D effect that reacts to cursor movement.
- Visual reference: Dipping a calligraphy brush in water — slow, organic bleeding of dark ink into warm paper.
- Must be performant: cap at 60fps, pause when hero is not in viewport.
- Color palette: Deep charcoal / indigo ink bleeding into warm off-white (`#f4f1ea`).

### 4.2 Falling Sakura / Dust Motes
- Lightweight particle system tied to scroll velocity.
- Particles resemble cherry blossom petals or dust motes in sunbeams.
- Behavior: slow drift, slight rotation, occasional turbulence on scroll.
- Tech: Canvas 2D or lightweight WebGL (e.g., via Three.js Points). Keep particle count under 150 for mobile.

### 4.3 Zen Cursor
- Custom cursor that replaces the default pointer.
- Trail effect: A faint, fading ink-trail follows the cursor.
- Alternative: Background distortion — subtle ripples on the background like water disturbed by a finger.
- Accessibility: Must respect `prefers-reduced-motion` and revert to system cursor.

### 4.4 Paper Texture Overlay
- A barely-visible rice paper / washi texture overlay across the entire viewport.
- Implementation: fixed `div` with a low-opacity SVG noise or scanned paper texture.
- Opacity target: `0.03` to `0.06` — felt, not seen.

### 4.5 Vertical Text Accents
- Occasional vertical Japanese-style text (e.g., "作品" for Work, "連絡" for Contact) as decorative section labels.
- Implementation: `writing-mode: vertical-rl`, extremely large type, low opacity, positioned absolutely at section edges.

---

## Notes
- All effects must respect `prefers-reduced-motion`.
- Performance budget: maintain < 100ms Time to Interactive on mid-tier mobile.
- These phases are intentionally deferred so that layout, typography, and spacing (Phases 1 & 2) are bulletproof first.
