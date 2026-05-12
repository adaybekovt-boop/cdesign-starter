import { ReactNode } from "react";

interface MarqueeProps {
  items: ReactNode[];
  speed?: "slow" | "normal" | "fast"; // 60s / 30s / 15s
  className?: string;
}

const speedMap = { slow: "60s", normal: "30s", fast: "15s" };

export function Marquee({ items, speed = "normal", className = "" }: MarqueeProps) {
  return (
    <div className={`overflow-hidden py-8 border-y border-border ${className}`}>
      <div
        className="flex gap-12 whitespace-nowrap will-change-transform animate-marquee"
        style={{ animationDuration: speedMap[speed] }}
      >
        {[...items, ...items].map((item, i) => (
          <span key={i} className="text-2xl text-muted font-medium tracking-tight">
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}
