"use client";

import { useEffect, useRef, ReactNode } from "react";
import { gsap } from "gsap";
import SplitType from "split-type";

/**
 * SplitTextReveal — aggressive stagger reveal (0.02s) for hero headlines
 *
 * Stagger calibration (per research):
 *   - 0.025+ = generic AI animation, FAIL
 *   - 0.02 = target (Vercel/Linear tier)
 *   - 0.015 = aggressive cinema
 *   - below 0.015 = unreadable mush, FAIL
 */
interface SplitTextRevealProps {
  children: string;
  as?: "h1" | "h2" | "h3" | "p";
  stagger?: number;
  delay?: number;
  className?: string;
}

export function SplitTextReveal({
  children,
  as: Tag = "h1",
  stagger = 0.02,
  delay = 0.15,
  className = "",
}: SplitTextRevealProps) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!ref.current || !ref.current.isConnected) return;
    if (ref.current.dataset.cdesignSplit === "true") return;
    if (
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      return;
    }

    const split = new SplitType(ref.current, { types: "lines,words" });
    ref.current.dataset.cdesignSplit = "true";

    // Wrap each line in overflow-hidden for masked reveal
    split.lines?.forEach((line) => {
      const wrap = document.createElement("span");
      wrap.style.display = "block";
      wrap.style.overflow = "hidden";
      line.parentNode?.insertBefore(wrap, line);
      wrap.appendChild(line);
    });

    gsap.from(split.words ?? [], {
      yPercent: 110,
      opacity: 0,
      duration: 0.9,
      stagger,
      ease: "cubic-bezier(0.16, 1, 0.3, 1)",
      delay,
    });

    return () => {
      split.revert();
      if (ref.current) {
        delete ref.current.dataset.cdesignSplit;
      }
    };
  }, [stagger, delay]);

  return (
    <Tag ref={ref as never} className={className}>
      {children}
    </Tag>
  );
}
