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

interface PinnedScrubProps {
  steps: Step[];
  pinDistance?: string;
  transitionDuration?: number;
  transitionEase?: string;
  className: string;
  stepsClassName: string;
  visualsClassName: string;
  stepClassName?: string;
  visualClassName?: string;
}

/**
 * PinnedScrub — headless-enough pinned state primitive.
 * Defaults are intentionally plain; pass project shell classes from DESIGN_GENOME.
 */
export function PinnedScrub({
  steps,
  pinDistance = "+=300%",
  transitionDuration = 0.5,
  transitionEase = "power2.inOut",
  className,
  stepsClassName,
  visualsClassName,
  stepClassName = "",
  visualClassName = "",
}: PinnedScrubProps) {
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!wrapperRef.current) return;

    const ctx = gsap.context(() => {
      const stepEls = gsap.utils.toArray<HTMLElement>(".cdesign-step");
      const visuals = gsap.utils.toArray<HTMLElement>(".cdesign-visual");

      ScrollTrigger.create({
        trigger: wrapperRef.current,
        start: "top top",
        end: pinDistance,
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
        gsap.to(visuals, {
          opacity: 0,
          duration: transitionDuration,
          ease: transitionEase,
          overwrite: true,
        });
        gsap.to(visuals[index], {
          opacity: 1,
          duration: transitionDuration,
          ease: transitionEase,
        });
      }
    }, wrapperRef);

    return () => ctx.revert();
  }, [pinDistance, transitionDuration, transitionEase]);

  return (
    <div
      ref={wrapperRef}
      className={`relative min-h-[100dvh] ${className}`}
    >
      <div className={stepsClassName}>
        {steps.map((s) => (
          <div key={`step-${s.title}`} className={`cdesign-step ${stepClassName}`}>
            <h3>{s.title}</h3>
            <p>{s.body}</p>
          </div>
        ))}
      </div>
      <div className={`relative ${visualsClassName}`}>
        {steps.map((s, i) => (
          <div
            key={`visual-${s.title}`}
            className={`cdesign-visual absolute inset-0 ${visualClassName}`}
            style={{ opacity: i === 0 ? 1 : 0 }}
          >
            {s.visual}
          </div>
        ))}
      </div>
    </div>
  );
}
