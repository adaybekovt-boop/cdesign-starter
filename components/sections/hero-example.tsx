import { SplitTextReveal } from "@/components/ui/split-text-reveal";
import { MagneticButton } from "@/components/ui/magnetic-button";

/**
 * HeroExample — placeholder hero for the starter.
 * The cdesign skill REPLACES this with a real hero based on user brief.
 * Left-aligned, NOT centered (premium standard).
 */
export function HeroExample() {
  return (
    <section className="relative min-h-[100dvh] flex items-center px-6 md:px-16 lg:px-24 py-24">
      <div className="max-w-5xl">
        <p className="text-sm text-muted mb-6 tracking-wide">
          cdesign starter — replace with your idea
        </p>
        <SplitTextReveal
          as="h1"
          className="text-5xl md:text-7xl lg:text-8xl font-medium tracking-tighter leading-[1.02] text-foreground"
        >
          Build cinematic interfaces. Without the AI slop.
        </SplitTextReveal>
        <p className="mt-8 text-lg md:text-xl text-muted max-w-2xl leading-relaxed">
          Pre-configured stack: Next 15, Tailwind v4, Motion, GSAP, Lenis, R3F.
          Run <code className="font-mono text-sm bg-elevated px-2 py-1 rounded">/cdesign &quot;your idea&quot;</code> in Claude Code to generate a real landing page.
        </p>
        <div className="mt-12">
          <MagneticButton>Get started</MagneticButton>
        </div>
      </div>
    </section>
  );
}
