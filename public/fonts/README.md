# Project fonts

The starter does not preselect a font.

After the typography field in DESIGN_GENOME is approved:

1. confirm the font license and required scripts;
2. prefer local .woff2 files when available;
3. register families with next/font in app/layout.tsx;
4. map display, body, mono, and accent roles in app/globals.css;
5. test loading, fallback metrics, Cyrillic/Kazakh coverage when relevant, and mobile line breaks.

Do not reuse a fixed pair merely because an earlier cdesign project used it.
