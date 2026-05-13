"use client";

import { useEffect, useRef, ReactNode } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { motionValue, type MotionValue } from "motion/react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

/**
 * Shared progress MotionValue — bind to R3F useFrame for DOM↔3D sync
 *
 * Usage in R3F component:
 *   import { filmProgress } from "@/components/sections/scroll-film";
 *   useFrame(() => { mesh.rotation.y = filmProgress.get() * Math.PI * 2; });
 */
export const filmProgress: MotionValue<number> = motionValue(0);

/**
 * ScrollFilm — one pinned section, one master GSAP timeline, multiple "shots"
 *
 * Pass a `buildTimeline` function that receives the timeline and a query selector.
 * Use data-shot="<name>" attributes on child elements.
 *
 * Result: cinematic scroll-controlled sequence (Apple/Linear/Awwwards SOTD tier).
 *
 * Use sparingly — max 1-2 per page. Read scroll-film.md recipe before customizing.
 */
interface ScrollFilmProps {
  children: ReactNode;
  /** GSAP timeline construction callback. Receives `tl` and a scoped query selector. */
  buildTimeline: (tl: gsap.core.Timeline, q: (selector: string) => Element[]) => void;
  /** Scroll distance for the pin (e.g. "+=400%" for 4 viewport heights). Default "+=400%" */
  scrollDistance?: string;
  /** Scrub smoothing. 1 = cinematic (default). true = instant (jittery). */
  scrub?: number | boolean;
  className?: string;
}

export function ScrollFilm({
  children,
  buildTimeline,
  scrollDistance = "+=400%",
  scrub = 1,
  className = "",
}: ScrollFilmProps) {
  const rootRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!rootRef.current) return;

    const ctx = gsap.context(() => {
      const q = gsap.utils.selector(rootRef);

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: rootRef.current,
          start: "top top",
          end: scrollDistance,
          scrub,
          pin: true,
          anticipatePin: 1,
          onUpdate: (self) => filmProgress.set(self.progress),
        },
        defaults: { ease: "none" }, // scrub controls timing
      });

      buildTimeline(tl, q);
    }, rootRef);

    return () => ctx.revert();
  }, [buildTimeline, scrollDistance, scrub]);

  return (
    <section ref={rootRef} className={`relative h-[100dvh] overflow-hidden ${className}`}>
      {children}
    </section>
  );
}
