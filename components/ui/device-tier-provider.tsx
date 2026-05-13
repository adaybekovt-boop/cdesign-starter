"use client";

import { useEffect } from "react";
import { getDeviceTier } from "@/lib/device-tier";

/**
 * DeviceTierProvider — sets data-tier on <html> once after mount.
 *
 * CSS reads [data-tier="full|balanced|low"] to gate effects.
 * Already mounted in app/layout.tsx.
 *
 * Replaces previous LiquidTierProvider + MotionTierProvider into one system.
 * data-liquid-tier is also kept for backward compat with liquid-button styles.
 */
export function DeviceTierProvider() {
  useEffect(() => {
    const tier = getDeviceTier();
    document.documentElement.dataset.tier = tier;
    // Backward compat for glass CSS which reads data-liquid-tier
    const liquidMap = { full: "full", balanced: "lite", low: "off" } as const;
    document.documentElement.dataset.liquidTier = liquidMap[tier];
  }, []);
  return null;
}
