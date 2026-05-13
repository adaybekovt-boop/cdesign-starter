"use client";

import { motion } from "motion/react";

/**
 * FrameCut — cinematic transition overlay
 *
 * Triggers a brief flash/wipe/black-frame when `active` flips true.
 * Use to mark a hard scene change in a ScrollFilm sequence.
 *
 * HARD LIMIT: max 1-2 cuts per page. More = looks cheap, like a music video edit.
 *
 * Usage with shared filmProgress:
 *
 *   import { useMotionValueEvent } from "motion/react";
 *   import { filmProgress } from "@/components/sections/scroll-film";
 *
 *   const [cut, setCut] = useState(false);
 *   useMotionValueEvent(filmProgress, "change", (p) => {
 *     // Trigger flash at 58% scroll (scene transition)
 *     if (p > 0.58 && p < 0.6 && !cut) {
 *       setCut(true);
 *       setTimeout(() => setCut(false), 250);
 *     }
 *   });
 *
 *   <FrameCut active={cut} variant="flash" />
 */
interface FrameCutProps {
  active: boolean;
  variant?: "flash" | "black" | "wipe-down" | "wipe-right";
  /** Override color. Default: white for flash, black for black. */
  color?: string;
  /** Duration in seconds. Default 0.22. Do not go above 0.4 — feels slow. */
  duration?: number;
}

export function FrameCut({
  active,
  variant = "flash",
  color,
  duration = 0.22,
}: FrameCutProps) {
  const bgColor = color ?? (variant === "black" ? "#000" : "#fff");

  if (variant === "flash" || variant === "black") {
    return (
      <motion.div
        aria-hidden
        className="pointer-events-none fixed inset-0 z-[999]"
        style={{ backgroundColor: bgColor }}
        initial={false}
        animate={{ opacity: active ? [0, 1, 0] : 0 }}
        transition={{ duration, ease: "linear", times: [0, 0.3, 1] }}
      />
    );
  }

  if (variant === "wipe-down") {
    return (
      <motion.div
        aria-hidden
        className="pointer-events-none fixed inset-0 z-[999]"
        style={{ backgroundColor: bgColor }}
        initial={false}
        animate={{
          clipPath: active
            ? ["inset(0% 0% 100% 0%)", "inset(0% 0% 0% 0%)", "inset(100% 0% 0% 0%)"]
            : "inset(100% 0% 0% 0%)",
        }}
        transition={{ duration, ease: "linear", times: [0, 0.5, 1] }}
      />
    );
  }

  // wipe-right
  return (
    <motion.div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-[999]"
      style={{ backgroundColor: bgColor }}
      initial={false}
      animate={{
        clipPath: active
          ? ["inset(0% 100% 0% 0%)", "inset(0% 0% 0% 0%)", "inset(0% 0% 0% 100%)"]
          : "inset(0% 0% 0% 100%)",
      }}
      transition={{ duration, ease: "linear", times: [0, 0.5, 1] }}
    />
  );
}
