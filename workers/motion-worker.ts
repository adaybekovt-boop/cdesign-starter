/**
 * motion-worker.ts — heavy scroll/particle math off main thread.
 *
 * USE THIS when you need:
 * - Particle systems (500+ points)
 * - Physics simulation
 * - Noise field calculations
 * - Large coordinate array generation
 *
 * DO NOT USE for simple hover/reveal — this is overkill.
 * Only add this complexity when you've profiled and confirmed main thread blocking.
 */

type WorkerInput = {
  type: "particles";
  progress: number;
  count: number;
};

type WorkerOutput = {
  type: "particles";
  points: { x: number; y: number }[];
};

self.onmessage = (event: MessageEvent<WorkerInput>) => {
  const { type, progress, count } = event.data;

  if (type === "particles") {
    const points = Array.from({ length: count }, (_, i) => {
      const t = i / count;
      return {
        x: Math.sin(progress * 6.28 + t * 12) * 40,
        y: Math.cos(progress * 6.28 + t * 8) * 40,
      };
    });

    self.postMessage({ type: "particles", points } satisfies WorkerOutput);
  }
};
