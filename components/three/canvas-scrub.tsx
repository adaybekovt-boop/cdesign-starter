"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

/**
 * CanvasScrub — Apple-style frame-by-frame scroll-controlled animation
 *
 * Why not <video> with currentTime? Native <video> scrubbing lags badly
 * because video codecs use delta frames. Canvas + image sequence = smooth.
 *
 * Requirements:
 * - Pre-render your sequence as .webp or .jpg, 1920x1080 ideal
 * - Files named e.g. frame-0001.webp through frame-0150.webp
 * - Place in /public/sequence/
 *
 * Usage:
 * <CanvasScrub
 *   frameCount={150}
 *   pathTemplate="/sequence/frame-%d.webp"
 *   width={1920}
 *   height={1080}
 * />
 */
interface CanvasScrubProps {
  frameCount: number;
  pathTemplate: string; // "%d" gets replaced with frame number (padded)
  width?: number;
  height?: number;
  padding?: number; // zero-padding length, default 4 (frame-0001)
  scrollDistance?: string; // GSAP scrollTrigger end value, default "+=300%"
}

export function CanvasScrub({
  frameCount,
  pathTemplate,
  width = 1920,
  height = 1080,
  padding = 4,
  scrollDistance = "+=300%",
}: CanvasScrubProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Preload all frames (CRITICAL — otherwise canvas flickers)
    const images: HTMLImageElement[] = Array.from({ length: frameCount }, (_, i) => {
      const img = new Image();
      img.src = pathTemplate.replace("%d", String(i + 1).padStart(padding, "0"));
      return img;
    });

    const playhead = { frame: 0 };

    const render = () => {
      const frame = images[Math.floor(playhead.frame)];
      if (frame?.complete && frame.naturalWidth > 0) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(frame, 0, 0, canvas.width, canvas.height);
      }
    };

    images[0].onload = render;

    const tween = gsap.to(playhead, {
      frame: frameCount - 1,
      snap: "frame",
      ease: "none",
      scrollTrigger: {
        trigger: canvas,
        start: "top top",
        end: scrollDistance,
        scrub: 0.5,
        pin: true,
      },
      onUpdate: render,
    });

    return () => {
      tween.kill();
      ScrollTrigger.getAll().forEach((st) => {
        if (st.trigger === canvas) st.kill();
      });
    };
  }, [frameCount, pathTemplate, padding, scrollDistance]);

  return <canvas ref={canvasRef} width={width} height={height} className="w-full h-auto" />;
}
