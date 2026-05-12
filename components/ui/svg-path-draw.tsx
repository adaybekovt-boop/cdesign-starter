"use client";

import { useEffect, useRef, ReactNode } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

/**
 * SvgPathDraw — animate SVG paths drawing themselves
 *
 * USAGE: wrap your inline SVG. ALL <path>, <line>, <polyline> elements
 * inside will animate stroke-dashoffset from full length to 0.
 *
 * Triggers:
 *   - "scroll" (default) — animates when scrolled into view
 *   - "mount" — animates immediately on mount
 *
 * REQUIREMENTS for the wrapped SVG:
 *   - Use strokes (NOT just fills) on the paths you want animated
 *   - Set `stroke="currentColor"` so it inherits text color
 *   - Set `fill="none"` initially if you only want stroke drawing
 *
 * Example:
 *   <SvgPathDraw>
 *     <svg viewBox="0 0 200 50">
 *       <path d="M10 25 L190 25" stroke="currentColor" strokeWidth="2" fill="none" />
 *     </svg>
 *   </SvgPathDraw>
 */
interface SvgPathDrawProps {
  children: ReactNode;
  trigger?: "scroll" | "mount";
  duration?: number;
  stagger?: number;
  ease?: string;
  className?: string;
}

export function SvgPathDraw({
  children,
  trigger = "scroll",
  duration = 2,
  stagger = 0.15,
  ease = "power2.inOut",
  className = "",
}: SvgPathDrawProps) {
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!wrapperRef.current) return;

    const svg = wrapperRef.current.querySelector("svg");
    if (!svg) return;

    const paths = svg.querySelectorAll<SVGGeometryElement>("path, line, polyline, polygon, circle, rect");
    if (paths.length === 0) return;

    // Set up initial state: each path has dasharray = its length, offset = full length (invisible)
    paths.forEach((path) => {
      const length = path.getTotalLength();
      path.style.strokeDasharray = `${length}`;
      path.style.strokeDashoffset = `${length}`;
    });

    const animation = gsap.to(paths, {
      strokeDashoffset: 0,
      duration,
      stagger,
      ease,
      scrollTrigger:
        trigger === "scroll"
          ? {
              trigger: wrapperRef.current,
              start: "top 80%",
              toggleActions: "play none none reverse",
            }
          : undefined,
    });

    return () => {
      animation.kill();
      ScrollTrigger.getAll().forEach((st) => {
        if (st.trigger === wrapperRef.current) st.kill();
      });
    };
  }, [trigger, duration, stagger, ease]);

  return (
    <div ref={wrapperRef} className={className}>
      {children}
    </div>
  );
}
