# cdesign-starter v3

Neutral Next.js infrastructure for cdesign. The starter supplies production mechanics and optional primitives; it does not supply a visual identity.

## Quick start

~~~bash
npx create-next-app@latest my-project -e https://github.com/adaybekovt-boop/cdesign-starter
cd my-project
npm install
npm run dev
~~~

app/page.tsx is intentionally empty. cdesign Generate Mode replaces it only after DESIGN_GENOME and the Novelty Gate pass.

## Stack

- Next.js 15, React 19, TypeScript, Tailwind v4
- Motion and GSAP
- Lenis synchronized to the GSAP ticker
- optional React Three Fiber, Drei, and postprocessing
- device capability tiers and reduced-motion support
- static cdesign audit

## Neutral by default

The root layout mounts only device-tier detection and smooth-scroll infrastructure. It does not mount:

- a demo hero or 3D object;
- a font pairing;
- grain, progress bar, glass filter, shader, or ambient layer;
- a dark-mode class or project palette;
- an assumed section sequence.

Generate Mode must replace language, metadata, typefaces, identity tokens, composition, imagery, and motion from .cdesign/INTENT.md.

## Optional primitives

The repository includes implementation examples for:

- split text, reveal image, path draw, marquee, isolated card, magnetic/tap interaction;
- liquid glass, grain, frame cuts, scroll progress;
- pinned state sequences, multi-layer parallax, scroll-film timelines;
- real GLB/GLTF, photo planes, SVG extrusion, frame-sequence canvas, and abstract geometry;
- device tiers, visibility gating, temporary will-change, scene mapping, and motion workers.

These are opt-in. Inspect them before use, override project-specific layout and timing, and do not satisfy a component quota. The abstract geometry and bundled GLB are demos, never missing-product fallbacks.

PinnedScrub now requires project-specific shell classes. ModelHero no longer adds a fixed left gradient or copy placement.

## Fonts

No project font is loaded. Select licensed typefaces after the typography field in DESIGN_GENOME is approved, register them in app/layout.tsx, and map their roles in app/globals.css.

Do not reuse a “safe” pair across projects or choose a font because the starter previously used it.

## Identity tokens

app/globals.css contains neutral build-safe slots. Replace identity-bearing values rather than inheriting them:

- background and surface temperature;
- foreground hierarchy and accent behavior;
- font roles and type scale;
- geometry/radii;
- shadow or material logic;
- curve families used by the selected motion system.

## 3D assets

Use real user-owned, licensed, or generated assets and record them in public/models/ASSETS.md and asset-manifest.json. If a needed asset does not exist, switch to the approved 2D treatment and update INTENT. Never swap in the bundled knot, torus, trophy, blob, or primitive.

## Audit

~~~bash
npm run lint
npm run typecheck
npm run build
npm run audit:cdesign
~~~

The audit checks static performance and architecture blockers and, when project metadata exists, validates required v3 INTENT headings and FINGERPRINT keys.

Visual QA still decides whether the implementation matches the genome, preserves the signature on mobile, and avoids screenshot-visible slop.

## License

MIT
