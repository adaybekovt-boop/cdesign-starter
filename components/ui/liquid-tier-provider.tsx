"use client";

import { useEffect } from "react";
import { getLiquidTier } from "@/lib/liquid-performance-tier";

/**
 * LiquidTierProvider — sets `data-liquid-tier` on <html> after mount.
 *
 * Mount once in app/layout.tsx (already done in starter).
 * CSS in globals.css reads the attribute to gate progressive glass effects.
 */
export function LiquidTierProvider() {
  useEffect(() => {
    document.documentElement.dataset.liquidTier = getLiquidTier();
  }, []);
  return null;
}
