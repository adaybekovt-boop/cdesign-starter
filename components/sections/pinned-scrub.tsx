"use client";

import { useEffect, useRef, ReactNode } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

interface Step {
  title: string;
  body: string;
  visual: ReactNode;
}

/**
 * PinnedScrub — Stripe/Vercel-tier pinned section with content swap
 * Pin a container, crossfade visuals as text scrolls past.
 */
export function PinnedScrub({ steps }: { steps: Step[] }) {
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!wrapperRef.current) return;

    const ctx = gsap.context(() => {
      const stepEls = gsap.utils.toArray<HTMLElement>(".cdesign-step");
      const visuals = gsap.utils.toArray<HTMLElement>(".cdesign-visual");

      ScrollTrigger.create({
        trigger: wrapperRef.current,
        start: "top top",
        end: "+=300%",
        pin: true,
        anticipatePin: 1,
      });

      stepEls.forEach((step, i) => {
        ScrollTrigger.create({
          trigger: step,
          start: "top center",
          end: "bottom center",
          onEnter: () => crossfade(i),
          onEnterBack: () => crossfade(i),
        });
      });

      function crossfade(index: number) {
        gsap.to(visuals, { opacity: 0, duration: 0.5, ease: "power2.inOut", overwrite: true });
        gsap.to(visuals[index], { opacity: 1, duration: 0.5, ease: "power2.inOut" });
      }
    }, wrapperRef);

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={wrapperRef}
      className="relative min-h-[100dvh] grid grid-cols-1 lg:grid-cols-2 gap-12 px-6 md:px-16 py-24"
    >
      <div className="space-y-[80vh]">
        {steps.map((s, i) => (
          <div key={i} className="cdesign-step">
            <h3 className="text-3xl md:text-4xl font-medium tracking-tight mb-4">{s.title}</h3>
            <p className="text-muted text-lg leading-relaxed max-w-md">{s.body}</p>
          </div>
        ))}
      </div>
      <div className="relative">
        {steps.map((s, i) => (
          <div
            key={i}
            className="cdesign-visual absolute inset-0 flex items-center justify-center"
            style={{ opacity: i === 0 ? 1 : 0 }}
          >
            {s.visual}
          </div>
        ))}
      </div>
    </div>
  );
}
