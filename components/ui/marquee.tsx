import { ReactNode } from "react";

interface MarqueeProps {
  items: ReactNode[];
  speed?: "slow" | "normal" | "fast"; // 60s / 30s / 15s
  className?: string;
}

const speedMap = { slow: "60s", normal: "30s", fast: "15s" };

export function Marquee({ items, speed = "normal", className = "" }: MarqueeProps) {
  // Duplicate items for seamless loop; key prefix marks the copy so the two halves don't collide.
  const doubled = [
    ...items.map((node, i) => ({ node, key: `a-${i}` })),
    ...items.map((node, i) => ({ node, key: `b-${i}` })),
  ];
  return (
    <div className={`overflow-hidden py-8 border-y border-border ${className}`}>
      <div
        className="flex gap-12 whitespace-nowrap animate-marquee"
        style={{ animationDuration: speedMap[speed] }}
      >
        {doubled.map(({ node, key }) => (
          <span key={key} className="text-2xl text-muted font-medium tracking-tight">
            {node}
          </span>
        ))}
      </div>
    </div>
  );
}
