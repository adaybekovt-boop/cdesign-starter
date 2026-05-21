"use client";

import { useEffect, useRef, ReactNode } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

interface Layer {
  content: ReactNode;
  speed: number; // 0 = static, 1 = full scroll speed, 1.5 = faster than scroll
  className?: string;
}

/**
 * MultiLayerParallax — cinematic depth with 3+ layers at different speeds
 * Negative yPercent = layer moves UP as user scrolls down (true parallax)
 */
export function MultiLayerParallax({ layers, className = "" }: { layers: Layer[]; className?: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const layerRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    if (!containerRef.current) return;
    const ctx = gsap.context(() => {
      layerRefs.current.forEach((el, i) => {
        if (!el) return;
        gsap.to(el, {
          yPercent: -layers[i].speed * 50,
          ease: "none",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top bottom",
            end: "bottom top",
            scrub: 1,
          },
        });
      });
    }, containerRef);

    return () => ctx.revert();
  }, [layers]);

  return (
    <div ref={containerRef} className={`relative overflow-hidden ${className}`}>
      {layers.map((layer, i) => (
        <div
          key={`layer-${i}-${layer.speed}`}
          ref={(el) => {
            layerRefs.current[i] = el;
          }}
          className={`absolute inset-0 ${layer.className ?? ""}`}
          style={{ zIndex: i }}
        >
          {layer.content}
        </div>
      ))}
    </div>
  );
}
