# CLAUDE.md — Edit Mode Rules

## Stack

- **Framework**: Next.js 15 (App Router)
- **Styling**: Tailwind CSS v4
- **Animation**: GSAP + ScrollTrigger, CSS custom properties
- **3D**: React Three Fiber (R3F) + Drei
- **Language**: TypeScript

## Edit Mode Rules

Changes must be applied as a **delta** — never rewrite existing files wholesale.
Preserve intent: when you edit a section, leave the surrounding code intact.

### Invariants — do NOT touch these

| Concern | Rule |
|---|---|
| Visual metaphor | Preserve the established metaphor of each section |
| Motion hierarchy | Hero > section entrances > micro-interactions — maintain this order |
| Typography | Do not change font families, weight scales, or fluid type steps |
| Device tier | Respect the existing device-tier provider; do not flatten tiers |

### Forbidden transformations

- **Do NOT** replace scroll-driven animations with simple fade-ins
- **Do NOT** simplify or remove the hero section's animation sequence
- **Do NOT** use `transition: all` — always target specific properties
- **Do NOT** animate layout properties (`width`, `height`, `top`, `left`, `margin`, `padding`)

### Allowed animation properties

`transform` and `opacity` only, unless there is an explicit, commented reason.
