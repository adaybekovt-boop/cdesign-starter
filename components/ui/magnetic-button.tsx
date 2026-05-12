"use client";

import { useRef, ReactNode } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "motion/react";

/**
 * MagneticButton — Rauno Freiberg signature interaction
 *
 * Uses useMotionValue (NOT useState) for mouse tracking.
 * useState triggers re-render cascade on every mousemove = performance collapse.
 * useMotionValue updates outside React's reconciliation cycle.
 */
interface MagneticButtonProps {
  children: ReactNode;
  onClick?: () => void;
  className?: string;
  pull?: number; // 0-1, how strongly the button follows cursor (default 0.3)
}

export function MagneticButton({ children, onClick, className = "", pull = 0.3 }: MagneticButtonProps) {
  const ref = useRef<HTMLButtonElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const springConfig = { damping: 15, stiffness: 200, mass: 0.5 };
  const xSpring = useSpring(x, springConfig);
  const ySpring = useSpring(y, springConfig);

  // Inner content moves at half the pull strength for parallax depth
  const textX = useTransform(xSpring, (v) => v * 0.5);
  const textY = useTransform(ySpring, (v) => v * 0.5);

  const handleMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    x.set((e.clientX - rect.left - rect.width / 2) * pull);
    y.set((e.clientY - rect.top - rect.height / 2) * pull);
  };

  const handleLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.button
      ref={ref}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      onClick={onClick}
      style={{ x: xSpring, y: ySpring }}
      className={`relative px-6 py-3 rounded-full bg-foreground text-background font-medium text-sm tracking-tight ${className}`}
      whileTap={{ scale: 0.97 }}
    >
      <motion.span style={{ x: textX, y: textY }} className="inline-block">
        {children}
      </motion.span>
    </motion.button>
  );
}
