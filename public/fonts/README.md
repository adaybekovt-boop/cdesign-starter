# Fonts

This project uses:
- **Hanken Grotesk** (Variable) — primary sans-serif
- **Migra** — accent display serif (optional)

## How fonts load

Hanken Grotesk loads via `next/font/google` — no local files needed.

Migra is optional. If you have .woff2 files, place them here:
- `public/fonts/Migra-Regular.woff2`
- `public/fonts/Migra-Italic.woff2`

If Migra files are missing, the fallback serif stack is used automatically. Build will NOT fail.

## Adding custom fonts

Place .woff2 files in this folder and register them in `app/layout.tsx` via `next/font/local`.
