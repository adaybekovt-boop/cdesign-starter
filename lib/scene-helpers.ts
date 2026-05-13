/**
 * Scene & rhythm helpers for cinematic scroll sequences.
 *
 * Use with <ScrollFilm> and shared filmProgress MotionValue.
 * Read references/recipes/scroll-film.md for full patterns.
 */

/**
 * Map a global scroll progress (0-1) to a local "scene" progress (0-1).
 *
 * Lets you split a long timeline into named scenes:
 *
 *   const intro   = sceneProgress(global, 0,    0.22);
 *   const reveal  = sceneProgress(global, 0.22, 0.58);
 *   const climax  = sceneProgress(global, 0.58, 0.84);
 *   const outro   = sceneProgress(global, 0.84, 1);
 *
 *   mesh.rotation.y    = reveal * Math.PI * 1.5;
 *   mesh.position.z    = -4 + climax * 3;
 *   mesh.material.opacity = outro;
 *
 * Each scene is independent 0→1, clamped, and ready to drive any property.
 */
export function sceneProgress(global: number, start: number, end: number): number {
  const p = (global - start) / (end - start);
  return Math.min(1, Math.max(0, p));
}

/**
 * Rhythmic "hit" — a narrow pulse around a specific scroll position.
 *
 * Returns a value 0→1→0 within a small window around `at`.
 * Use sparingly — this is your bass drop / camera shake / impact moment.
 *
 *   const bassHit = hit(global, 0.42);          // peak at 42% scroll
 *   mesh.scale.setScalar(1 + bassHit * 0.05);   // SUBTLE — max scale 1.05
 *   div.style.filter = `contrast(${1 + bassHit * 0.2})`; // max contrast 1.2
 *
 * HARD LIMITS (do not exceed — site becomes cheap music video):
 *   - scale: max 1.05 multiplier
 *   - contrast: max 1.2
 *   - position shift: max 0.5 units (3D) or 4px (DOM)
 *   - max 2 hits per ScrollFilm section
 *
 * `width` controls how sharp the pulse is. 0.035 (default) = ~7% of total scroll
 * for a brief but visible impact. Larger = softer/longer pulse.
 */
export function hit(progress: number, at: number, width = 0.035): number {
  const d = Math.abs(progress - at);
  return Math.max(0, 1 - d / width);
}

/**
 * Smooth step easing for scene transitions.
 * 0→1 with eased curve, useful when you want a non-linear scene progress.
 */
export function smoothStep(t: number): number {
  const clamped = Math.min(1, Math.max(0, t));
  return clamped * clamped * (3 - 2 * clamped);
}
