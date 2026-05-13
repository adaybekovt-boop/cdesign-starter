/**
 * Device Tier — unified capability detection for motion + glass effects.
 *
 * Replaces separate LiquidTier and MotionTier into one system.
 * Sets data-tier="full|balanced|low" on <html> via <DeviceTierProvider>.
 *
 * Tiers:
 *   full     — desktop, high-end, motion enabled → all effects at max
 *   balanced — mobile/tablet or mid-range → reduced intensity, no blur animation
 *   low      — prefers-reduced-motion or very weak device → flat fallback
 *
 * NOTE: deviceMemory is not universally supported (~85% coverage).
 * This is a heuristic, not precise. Err on the side of caution for users.
 */

export type DeviceTier = "full" | "balanced" | "low";

export function getDeviceTier(): DeviceTier {
  if (typeof window === "undefined") return "balanced"; // SSR default

  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reducedMotion) return "low";

  const coarsePointer = window.matchMedia("(pointer: coarse)").matches;
  const cores = navigator.hardwareConcurrency ?? 4;
  const memory = "deviceMemory" in navigator ? Number(navigator.deviceMemory) : 4;

  if (coarsePointer || cores <= 4 || memory <= 4) return "balanced";

  return "full";
}
