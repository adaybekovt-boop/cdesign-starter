/**
 * LiquidGlassFilter — global SVG filter definition for liquid refraction.
 *
 * Mount ONCE in app/layout.tsx (already done in starter).
 * Then any element can opt in by adding the `.liquid-refract` class.
 *
 * The filter is gated by:
 *   - @supports (backdrop-filter)
 *   - @media (min-width: 900px)  — desktop only
 *   - @media (prefers-reduced-motion: no-preference)
 *   - html[data-liquid-tier="full"]
 *
 * So even if you add `.liquid-refract` everywhere, it activates only where
 * the device can actually handle it.
 */
export function LiquidGlassFilter() {
  return (
    <svg aria-hidden className="pointer-events-none absolute size-0">
      <defs>
        <filter id="liquid-glass-filter">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.012 0.018"
            numOctaves={2}
            seed={7}
            result="noise"
          />
          <feDisplacementMap
            in="SourceGraphic"
            in2="noise"
            scale={8}
            xChannelSelector="R"
            yChannelSelector="G"
          />
        </filter>
      </defs>
    </svg>
  );
}
