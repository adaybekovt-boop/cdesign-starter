import type { Metadata } from "next";
import localFont from "next/font/local";
import { SmoothScrollProvider } from "@/lib/lenis";
import { ScrollProgress } from "@/components/ui/scroll-progress";
import { GrainOverlay } from "@/components/ui/grain-overlay";
import "./globals.css";

// Hanken Grotesk — primary body font (free via Fontshare, NOT slop like Geist/Inter)
const hankenGrotesk = localFont({
  src: [
    { path: "../public/fonts/HankenGrotesk-Variable.woff2", style: "normal", weight: "100 900" },
  ],
  variable: "--font-hanken",
  display: "swap",
});

// Migra — display serif for editorial accents (free via Fontshare)
const migra = localFont({
  src: [
    { path: "../public/fonts/Migra-Regular.woff2", style: "normal", weight: "400" },
    { path: "../public/fonts/Migra-Italic.woff2", style: "italic", weight: "400" },
  ],
  variable: "--font-migra",
  display: "swap",
});

// JetBrains Mono — only when explicitly mono is needed (data, code, NOT decoration)
const jetbrainsMono = localFont({
  src: [
    { path: "../public/fonts/JetBrainsMono-Variable.woff2", style: "normal", weight: "100 800" },
  ],
  variable: "--font-jetbrains-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "cdesign starter",
  description: "Cinematic landing page starter",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${hankenGrotesk.variable} ${migra.variable} ${jetbrainsMono.variable} dark`}>
      <body>
        <SmoothScrollProvider>
          <ScrollProgress />
          {children}
          <GrainOverlay />
        </SmoothScrollProvider>
      </body>
    </html>
  );
}
