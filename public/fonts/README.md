# Fonts directory

This starter expects free fonts placed here. Download from Fontshare/Google:

## Required files

| Filename | Download from |
|----------|---------------|
| `HankenGrotesk-Variable.woff2` | https://www.fontshare.com/fonts/hanken-grotesk → "Variable" tab → woff2 |
| `Migra-Regular.woff2` | https://www.fontshare.com/fonts/migra → Regular weight → woff2 |
| `Migra-Italic.woff2` | https://www.fontshare.com/fonts/migra → Italic style → woff2 |
| `JetBrainsMono-Variable.woff2` | https://www.jetbrains.com/lp/mono/ → woff2 variable |

## Why these fonts

Per research on AI-slop fingerprints in landing pages (May 2026):

- **Geist** — overused by LLM agents, became slop marker
- **Inter, Roboto, Arial** — generic default, screams "AI did this"
- **Space Grotesk, Instrument Serif** — overused by AI hero sections

**Hanken Grotesk + Migra** are still rare in LLM training data and read as
intentional design choices.

## After downloading

```bash
# Verify files exist
ls public/fonts/
# Should show: HankenGrotesk-Variable.woff2  Migra-Regular.woff2  Migra-Italic.woff2  JetBrainsMono-Variable.woff2
```

If you skip this step, Next.js will throw a build error on the localFont imports
in `app/layout.tsx`.
