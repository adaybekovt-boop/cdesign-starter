import { HeroExample } from "@/components/sections/hero-example";

export default function Home() {
  return (
    <main className="min-h-[100dvh]">
      <HeroExample />
      {/* Replace HeroExample with your real sections.
          Available components:

          UI primitives (components/ui/):
          - magnetic-button.tsx     (Rauno-style magnetic CTA)
          - liquid-button.tsx       (Apple-style glass button, auto-degrades on weak devices)
          - reveal-image.tsx
          - tilt-card.tsx
          - marquee.tsx
          - split-text-reveal.tsx
          - svg-path-draw.tsx       (SVG logo line reveal)
          - frame-cut.tsx           (cinematic flash/wipe transition overlay)
          - scroll-progress.tsx     (already mounted in layout)
          - grain-overlay.tsx       (already mounted in layout)
          - DeviceTierProvider (already mounted — sets data-liquid-tier on <html>)
          - liquid-glass-filter.tsx  (already mounted — global SVG displacement filter)

          Sections (components/sections/):
          - pinned-scrub.tsx
          - multi-layer-parallax.tsx
          - scroll-film.tsx         (cinematic master timeline — Apple-style scroll film)

          3D / R3F (components/three/):
          - photo-to-3d.tsx         (image as scroll-controlled 3D plane)
          - geometric-hero.tsx      (abstract torus knot hero)
          - svg-logo-3d.tsx         (extrude SVG logo into 3D, rotates)
          - floating-object.tsx     (transparent PNG floats with mouse parallax)
          - canvas-scrub.tsx        (Apple-style frame-by-frame scroll video)
      */}
    </main>
  );
}
