# cdesign-starter v3

This repository is neutral infrastructure for cdesign. It must not choose the generated site's art direction.

## Before generation

Complete DESIGN_GENOME, SIGNATURE_DECISION, REJECTED_DEFAULT, and the provisional fingerprint in .cdesign/INTENT.md. Replace the empty app/page.tsx only after the novelty and anti-slop gates pass.

## Starter contract

- No demo hero, project font, grain, progress bar, glass filter, or effect is mounted by default. Neutral build-safe token values exist, but no project palette is selected.
- Components are optional mechanics. Inspect and adapt them; no component quota exists.
- Replace identity-bearing tokens, metadata, language, fonts, composition, and motion from the approved genome.
- Do not use the bundled abstract model or GeometricHero as a substitute for a missing product or brand asset.

## Production invariants

- one coordinated scroll clock when Lenis and GSAP are used;
- continuous motion avoids layout-triggering properties and continuous filters;
- reduced-motion, touch, keyboard, loading, failure, and responsive states preserve meaning;
- visible canvases use performance adaptation and real assets record provenance;
- mobile preserves the signature relationship while reducing cost;
- content and proof remain truthful.

## Edit Mode

Read .cdesign/INTENT.md and .cdesign/FINGERPRINT.json. Apply a delta and preserve locks unless the user explicitly changes them. Legacy INTENT files are accepted; Selected vibe is a historical hint, not a preset.

## Handoff

Run:

~~~bash
npm run lint
npm run typecheck
npm run build
npm run audit:cdesign
~~~

Then run visual QA and an independent critic when available, or the same critique inline.
