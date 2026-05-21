import type { Metadata, Viewport } from "next";
import { Hanken_Grotesk } from "next/font/google";
import { SmoothScrollProvider } from "@/lib/lenis";
import { ScrollProgress } from "@/components/ui/scroll-progress";
import { GrainOverlay } from "@/components/ui/grain-overlay";
import { DeviceTierProvider } from "@/components/ui/device-tier-provider";
import { LiquidGlassFilter } from "@/components/ui/liquid-glass-filter";
import "./globals.css";

const hanken = Hanken_Grotesk({
  subsets: ["latin", "cyrillic-ext"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: "cdesign starter",
  description: "Cinematic landing page starter",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  // cover = render under iOS notch / Android nav, paired with env(safe-area-inset-*) in CSS.
  viewportFit: "cover",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    // cdesign skill: change `lang` based on generated copy language — ru / kk / en. See SKILL.md Phase 3.
    <html lang="en" className={`${hanken.variable} dark`}>
      <body>
        <DeviceTierProvider />
        <LiquidGlassFilter />
        <SmoothScrollProvider>
          <ScrollProgress />
          {children}
          <GrainOverlay />
        </SmoothScrollProvider>
      </body>
    </html>
  );
}
