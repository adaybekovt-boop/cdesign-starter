# AGENTS.md — Runtime Rules

Short rules for AI agents modifying this codebase.

## DO

- **One spectacle per viewport** — a single dominant animated element per screen height
- **transform + opacity only** — no layout property animations
- **One scroll clock** — a single ScrollTrigger scrub drives all scroll-linked values on a page
- **Stagger 0.02s** — use 0.02 s between staggered children, not larger
- **Use existing components** — check `components/ui/` before building new primitives
- **PerformanceMonitor on R3F** — wrap every R3F canvas with `<PerformanceMonitor>` from Drei
- **VisibilityGate on heavy sections** — wrap any section with R3F or heavy JS in `<VisibilityGate>`

## DO NOT

- Rewrite files from scratch
- Introduce `framer-motion`
- Use `h-screen` (use `100dvh` via style or a Tailwind plugin instead)
- Use `transition: all`
- Use `key={index}` in lists — use stable, semantic keys
