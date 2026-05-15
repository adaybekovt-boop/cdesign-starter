"use client";

import { type PropsWithChildren, useEffect, useRef, useState } from "react";

/**
 * VisibilityGate — unmounts children when offscreen to save GPU/CPU.
 * Use around heavy sections: R3F canvas, video, complex scroll animations.
 *
 * Usage:
 *   <VisibilityGate>
 *     <HeavyR3FSection />
 *   </VisibilityGate>
 */
export function VisibilityGate({
  rootMargin = "200px 0px",
  minHeight = "100dvh",
  children,
}: PropsWithChildren<{
  rootMargin?: string;
  minHeight?: string;
}>) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const io = new IntersectionObserver(
      ([entry]) => setVisible(entry.isIntersecting),
      { root: null, rootMargin, threshold: 0.01 }
    );

    io.observe(el);
    return () => io.disconnect();
  }, [rootMargin]);

  return (
    <div ref={ref} style={{ minHeight: visible ? undefined : minHeight }}>
      {visible ? children : null}
    </div>
  );
}
