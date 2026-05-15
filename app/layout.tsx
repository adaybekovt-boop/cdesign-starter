import type { Metadata } from "next";
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

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
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
