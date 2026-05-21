"use client";

import type { ButtonHTMLAttributes, ReactNode } from "react";
import { tv, type VariantProps } from "tailwind-variants";

/**
 * tv() pattern — tokenized variant system.
 *
 * Export the tv() definition so other components can extend it or
 * build similar patterns. This is the reference implementation for
 * the cdesign starter's component authoring style.
 *
 * Claude: use tv() for ANY component that has size/color/state variants.
 * Never write 200-char className strings. Extract into tv() instead.
 */
export const liquidButtonVariants = tv({
  slots: {
    root: [
      "liquid-button",
      "relative isolate overflow-hidden cursor-pointer rounded-full",
      "transition-transform",
      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background",
    ],
    shine: "liquid-button__shine",
    content: "relative z-10",
  },
  variants: {
    size: {
      sm: { root: "h-9 px-4 text-sm" },
      md: { root: "h-11 px-6 text-base" },
      lg: { root: "h-14 px-8 text-lg" },
    },
    intensity: {
      soft: { root: "" },
      strong: { root: "liquid-button-strong" },
    },
    fullWidth: {
      true: { root: "w-full flex items-center justify-center" },
    },
  },
  defaultVariants: {
    size: "md",
    intensity: "soft",
  },
});

type LiquidButtonProps = ButtonHTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof liquidButtonVariants> & {
    children: ReactNode;
  };

export function LiquidButton({
  children,
  className,
  size,
  intensity,
  fullWidth,
  ...props
}: LiquidButtonProps) {
  const { root, shine, content } = liquidButtonVariants({ size, intensity, fullWidth });

  return (
    <button {...props} className={root({ className })}>
      <span className={shine()} aria-hidden />
      <span className={content()}>{children}</span>
    </button>
  );
}
