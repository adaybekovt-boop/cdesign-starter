"use client";

import { memo, useState } from "react";
import { motion } from "motion/react";

/**
 * IsolatedAnimatedCard — feature/content card with local animation state.
 *
 * WHY memo + local state:
 * - State is managed inside the card, not in the parent grid
 * - Parent grid NEVER re-renders when a card is pressed/hovered
 * - React.memo skips re-render if props haven't changed
 * - Only the physically interacted card pays the render cost
 *
 * FORBIDDEN patterns (causes full grid re-render):
 * - parent useState for hover/active index
 * - parent onHover callback that updates parent state
 * - animating ALL cards when ONE is pressed
 * - layout={true} on large lists
 *
 * Extend this pattern for any interactive grid item.
 */
interface IsolatedAnimatedCardProps {
  title: string;
  body: string;
  accent?: string; // CSS color for hover glow
  icon?: React.ReactNode;
}

export const IsolatedAnimatedCard = memo(function IsolatedAnimatedCard({
  title,
  body,
  accent,
  icon,
}: IsolatedAnimatedCardProps) {
  const [active, setActive] = useState(false);

  return (
    <motion.article
      layout={false} // NEVER layout-animate inside lists
      animate={{ scale: active ? 0.985 : 1 }}
      transition={{ duration: 0.22, ease: [0.2, 0.8, 0.2, 1] }}
      onPointerDown={() => setActive(true)}
      onPointerUp={() => setActive(false)}
      onPointerCancel={() => setActive(false)}
      className="group relative overflow-hidden rounded-2xl border border-border bg-elevated p-6 cursor-pointer"
      style={{ boxShadow: "var(--shadow-md)" }}
    >
      {/* Hover glow layer — opacity only, no layout cost */}
      <div
        className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{
          background: accent
            ? `radial-gradient(circle at 50% 0%, ${accent}20, transparent 70%)`
            : "linear-gradient(to bottom right, rgba(255,255,255,0.04), transparent)",
        }}
        aria-hidden
      />

      <div className="relative z-10">
        {icon && <div className="mb-4 text-accent">{icon}</div>}
        <h3 className="text-xl font-medium tracking-tight leading-snug">{title}</h3>
        <p className="mt-3 text-sm text-muted leading-relaxed">{body}</p>
      </div>
    </motion.article>
  );
});
