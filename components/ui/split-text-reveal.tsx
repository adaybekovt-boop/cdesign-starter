"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import SplitType from "split-type";

/** SplitTextReveal is an opt-in word-mask primitive, not a default hero treatment. */
interface SplitTextRevealProps {
  children: string;
  as?: "h1" | "h2" | "h3" | "p";
  stagger?: number;
  delay?: number;
  duration?: number;
  ease?: string;
  className?: string;
}

export function SplitTextReveal({
  children,
  as: Tag = "h1",
  stagger = 0.02,
  delay = 0.15,
  duration = 0.9,
  ease = "cubic-bezier(0.16, 1, 0.3, 1)",
  className = "",
}: SplitTextRevealProps) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element || !element.isConnected) return;
    if (element.dataset.cdesignSplit === "true") return;
    if (
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      return;
    }

    const split = new SplitType(element, { types: "lines,words" });
    element.dataset.cdesignSplit = "true";

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
      duration,
      stagger,
      ease,
      delay,
    });

    return () => {
      split.revert();
      delete element.dataset.cdesignSplit;
    };
  }, [stagger, delay, duration, ease]);

  return (
    <Tag ref={ref as never} className={className}>
      {children}
    </Tag>
  );
}
