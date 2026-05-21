"use client";

import { ReactNode, useEffect } from "react";
import Lenis from "lenis";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

/**
 * SmoothScrollProvider — Lenis bound to GSAP ticker
 *
 * CRITICAL setup notes (from research):
 * - autoRaf: false → Lenis does NOT run its own requestAnimationFrame
 * - GSAP ticker drives Lenis → single RAF loop = no jitter
 * - ScrollTrigger.update is fired on every Lenis scroll event
 * - lagSmoothing(0) → keeps momentum math accurate
 *
 * R3F COMPATIBILITY:
 * R3F's useFrame ALSO uses RAF. They coexist fine because R3F runs its own
 * loop inside the Canvas; Lenis just updates window scroll. If you see
 * jitter on R3F objects bound to scroll, use motion/react's useScroll
 * (it reads window scroll, which Lenis is updating) — NOT drei's
 * <ScrollControls>, which conflicts with Lenis.
 */
export function SmoothScrollProvider({ children }: { children: ReactNode }) {
  useEffect(() => {
    const lenis = new Lenis({
      lerp: 0.05,
      wheelMultiplier: 1,
      // syncTouch: true breaks momentum scroll on iOS — let native touch scroll through.
      syncTouch: false,
      autoRaf: false,
    });

    const update = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(update);
    gsap.ticker.lagSmoothing(0);

    lenis.on("scroll", ScrollTrigger.update);
    ScrollTrigger.refresh();

    return () => {
      gsap.ticker.remove(update);
      lenis.destroy();
    };
  }, []);

  return <>{children}</>;
}
