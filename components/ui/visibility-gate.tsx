"use client";

import { useRef, useState, useEffect } from "react";

interface VisibilityGateProps {
  children: React.ReactNode;
  rootMargin?: string;
  minHeight?: string;
}

export function VisibilityGate({
  children,
  rootMargin = "200px 0px",
  minHeight = "100dvh",
}: VisibilityGateProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      { rootMargin }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [rootMargin]);

  return (
    <div ref={containerRef} style={{ minHeight }}>
      {isVisible ? children : null}
    </div>
  );
}
