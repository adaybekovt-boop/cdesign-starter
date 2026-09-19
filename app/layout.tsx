import type { Metadata, Viewport } from "next";
import { SmoothScrollProvider } from "@/lib/lenis";
import { DeviceTierProvider } from "@/components/ui/device-tier-provider";
import "./globals.css";

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
    // Generate Mode replaces language, metadata, fonts, and identity tokens from DESIGN_GENOME.
    <html lang="en">
      <body>
        <DeviceTierProvider />
        <SmoothScrollProvider>{children}</SmoothScrollProvider>
      </body>
    </html>
  );
}
