/**
 * Liquid Glass Performance Tier
 *
 * Detects device capabilities and returns a tier:
 *   - "full" — desktop with good GPU, motion enabled → SVG displacement OK
 *   - "lite" — mobile / low-RAM / low cores → CSS blur only, no displacement
 *   - "off"  — prefers-reduced-motion → flat backgrounds, no glass
 *
 * Used by <LiquidTierProvider> to set `data-liquid-tier` on <html>,
 * which CSS reads to gate progressive enhancement.
 */

export type LiquidTier = "full" | "lite" | "off";

export function getLiquidTier(): LiquidTier {
  if (typeof window === "undefined") return "lite"; // SSR-safe default

  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reducedMotion) return "off";

  const coarsePointer = window.matchMedia("(pointer: coarse)").matches;
  const deviceMemory = "deviceMemory" in navigator ? Number(navigator.deviceMemory) : 8;
  const lowMemory = deviceMemory <= 4;
  const lowCores = (navigator.hardwareConcurrency ?? 8) <= 4;

  if (lowMemory || lowCores || coarsePointer) return "lite";

  return "full";
}
