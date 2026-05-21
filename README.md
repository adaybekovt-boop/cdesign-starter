# cdesign-starter

Pre-configured Next.js 15 starter for the **cdesign** Claude Code skill. Drop-in cinematic landing page foundation that defeats AI slop.

## Requirements

- Node.js 20+
- npm 10+
- Git (for `create-next-app` template)
- Claude Code with Skills support
- Git Bash or WSL on Windows (for `install.sh`)

## Stack

- **Next.js 15** (App Router) + React 19 + TypeScript
- **Tailwind CSS v4** with full design token system (multi-layer shadows, fluid type, easing presets)
- **Motion** (motion/react v11+) for declarative animations
- **GSAP 3.13** + ScrollTrigger + SplitText (free in 2026)
- **Lenis 1.3** bound to GSAP ticker — single RAF loop, no jitter
- **SplitType** for text segmentation
- **React Three Fiber v9** + Drei + Postprocessing (Bloom + Noise)
- **Hanken Grotesk + Migra** fonts (NOT Geist/Inter — those are slop markers)

## Quick start

```bash
# Use as template for Claude Code
npx create-next-app@latest my-project -e https://github.com/adaybekovt-boop/cdesign-starter

cd my-project
npm install
npm run dev
```

## Fonts

Hanken Grotesk is loaded via `next/font/google` by default - no setup required.

Optional local fonts for full typography system:
- **Migra** (display) - place `Migra-Regular.woff2` and `Migra-Italic.woff2` in `public/fonts/`
- **JetBrains Mono** (mono) - place `JetBrainsMono-Variable.woff2` in `public/fonts/`

To switch to local fonts, update `app/layout.tsx` to use `next/font/local`.
If font files are missing, the build will fall back to system fonts.

## Pre-built components

### UI primitives (`components/ui/`)
- `scroll-progress.tsx` — fixed top progress bar (already mounted)
- `grain-overlay.tsx` — SVG film grain (already mounted)
- `magnetic-button.tsx` — Rauno Freiberg magnetic CTA
- `reveal-image.tsx` — clip-path image entrance
- `tilt-card.tsx` — 3D mouse tilt
- `marquee.tsx` — infinite scrolling row
- `split-text-reveal.tsx` — aggressive hero text reveal (stagger 0.02)

### Sections (`components/sections/`)
- `pinned-scrub.tsx` — Stripe/Vercel pinned content swap
- `multi-layer-parallax.tsx` — 3-layer cinematic depth
- `scroll-film.tsx` — **Cinematic master timeline** (one pinned section, multiple "shots", DOM↔R3F sync via shared MotionValue)
- `hero-example.tsx` — placeholder hero (replace this)

### 3D (`components/three/`)
- `photo-to-3d.tsx` — turn any image into scroll-controlled 3D plane
- `geometric-hero.tsx` — abstract 3D hero (torus knot + Bloom)
- `canvas-scrub.tsx` — Apple-style frame-by-frame video alternative
- `svg-logo-3d.tsx` — extrude SVG logo into 3D, scroll-controlled rotation
- `floating-object.tsx` — transparent PNG floats in 3D with mouse parallax

### UI primitives (cont.)
- `svg-path-draw.tsx` — animate SVG paths drawing themselves (logo line reveal)
- `frame-cut.tsx` — **cinematic transition overlay** (flash/black/wipe). Max 1-2 per page.

### Lib helpers (`lib/`)
- `lenis.tsx` — Lenis bound to GSAP ticker (provider)
- `utils.ts` — `cn()` for class merging
- `scene-helpers.ts` — `sceneProgress()` and `hit()` for cinematic ScrollFilm scene mapping and rhythm pulses

## Asset preparation cheatsheet

### Logos: PNG → SVG
If you only have a raster logo (PNG/JPG), convert to SVG before using `<SvgLogo3D>` or `<SvgPathDraw>`:
- https://convertio.co/png-svg/ (free, online)
- https://www.adobe.com/express/feature/image/convert/png-to-svg (free, no signup)
- In Illustrator/Figma: Image Trace → Expand → export as SVG

The SVG should have `<path>` elements with proper `fill` or `stroke` attributes. After conversion, open in a text editor and verify.

### Objects: photo → transparent PNG
For `<FloatingObject>` you need a PNG with transparent background. Quick options:
- **macOS Preview**: right-click image → "Remove Background" (built-in, 5 seconds)
- **iOS Photos**: long-press subject → "Copy Subject" → paste anywhere
- **remove.bg**: https://www.remove.bg/ (3 free/day, best quality)
- **Adobe Express**: https://www.adobe.com/express/feature/image/remove-background (free, unlimited)

For complex hair/fur edges, Photoshop's Select Subject + refine is still the gold standard.

### What this starter does NOT do
- ❌ Auto-remove backgrounds from photos (use tools above instead)
- ❌ Generate 3D character models from photos (needs 30GB+ VRAM, irrelevant for landing pages)
- ❌ Convert raster logos to vector (use a converter first)

These are intentional scope limitations — landing pages don't need them.

## Design token usage

**NEVER hardcode hex values in components.** Always use CSS variables or Tailwind utilities derived from tokens:

```tsx
// ❌ NEVER
<div className="bg-[#08090a] shadow-[0_4px_8px_rgba(0,0,0,0.2)]">

// ✅ ALWAYS
<div className="bg-background shadow-lg">
```

Multi-layer shadows are pre-configured in `app/globals.css` and respect `light-dark()` automatically.

## What this starter prevents

The starter ships with defaults that block the most common AI-slop and mobile-perf failure modes:

- ❌ AI-slop fonts (Geist as default, Inter, Roboto, Space Grotesk, Instrument Serif)
- ❌ Single-layer flat shadows (`0 4px 8px rgba(0,0,0,0.2)`)
- ❌ Hardcoded hex colors (forces tokens)
- ❌ `h-screen` / raw `100vh` (broken on mobile — uses `min-h-[100dvh]` everywhere)
- ❌ Mismatched RAF loops (Lenis + GSAP sync from setup)
- ❌ Generic centered hero (example is left-aligned)
- ❌ `Lenis syncTouch: true` (broken iOS scroll — starter uses `false`)
- ❌ R3F Canvas without `PerformanceMonitor` (every Canvas adapts DPR 1↔2)
- ❌ Permanent `will-change` on reusable components (use `useTemporaryWillChange`)
- ❌ Magnetic / tilt effects firing on touch devices (gated by `(pointer: fine)`)
- ❌ Missing `viewport-fit: cover` for notched devices

## Audit script

Run the bundled static audit before handoff:

```bash
npm run audit:cdesign
```

It scans `app/`, `components/`, `lib/`, `hooks/`, `workers/` and reports `PASS` / `FAIL` / `WARN` with file:line for each of: `h-screen`, raw `100vh`, `transition: all`, `<img>`, `key={index}`, `syncTouch: true`, permanent `will-change`, Canvas without `PerformanceMonitor`, `backdrop-blur` in components, hover-only critical content. Exits non-zero on any `FAIL`. Plain Node — no extra deps.

Pair it with the standard gate:

```bash
npm run lint
npm run typecheck
npm run build
npm run audit:cdesign
```

## Visual QA

Sweep these viewport widths in browser DevTools (or via screenshot tooling) before handoff:

| Width | Device class                                |
|-------|---------------------------------------------|
| 1440  | Desktop primary                             |
| 1024  | Laptop / iPad landscape                     |
| 768   | iPad portrait / small laptop                |
| 430   | iPhone 15 Pro Max                           |
| 390   | iPhone 15 / 14                              |
| 375   | iPhone SE / small Android                   |

Block handoff if any viewport shows:

- Horizontal scroll (overflow-x: hidden missed on a section)
- Headline clipped, truncated, or with broken line-wrapping
- Fixed UI (header, scroll-progress) overlapping content
- Blank Canvas (R3F failed to mount, or PerformanceMonitor killed DPR to 0)
- CTA unreadable — contrast, size below 44px tap target, or hidden by safe-area
- Pinned ScrollTrigger section jumping, double-scrolling, or unpinning early
- Body copy below 14px (illegible)
- Mobile downgrade that erased visual identity (hero became a flat CSS fade, fonts changed, color palette flattened) — reduce intensity, never identity

## Used with cdesign skill

Install the skill: https://github.com/adaybekovt-boop/cdesign-skill (separate repo)

Then in Claude Code:
```
/cdesign "your idea" [optional-reference.png or url]
```

The skill:
1. Reads your brief and reference
2. Runs Director's Roll (picks one visual vibe)
3. Generates landing using this starter's components

## License

MIT
