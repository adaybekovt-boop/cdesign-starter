"use client";

import { RefObject, useCallback } from "react";

/**
 * useTemporaryWillChange — promote element to GPU layer ONLY during animation.
 *
 * MDN warns: permanent will-change on many elements increases memory usage.
 * This hook sets will-change on pointerdown/hover start and removes it
 * 350ms after the animation would be done.
 *
 * Usage:
 *   const cardRef = useRef<HTMLDivElement>(null);
 *   const promote = useTemporaryWillChange(cardRef);
 *
 *   <div ref={cardRef} onPointerEnter={promote}>...</div>
 */
export function useTemporaryWillChange<T extends HTMLElement>(
  ref: RefObject<T | null>,
  value = "transform, opacity"
) {
  return useCallback(() => {
    const el = ref.current;
    if (!el) return;
    el.style.willChange = value;
    window.setTimeout(() => {
      if (el) el.style.willChange = "auto";
    }, 350);
  }, [ref, value]);
}
