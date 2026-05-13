/**
 * createMotionWorker — instantiate the motion Web Worker.
 *
 * Usage:
 *   const worker = createMotionWorker();
 *   worker.postMessage({ type: "particles", progress: 0.5, count: 300 });
 *   worker.onmessage = (e) => { renderPoints(e.data.points); };
 *   // Cleanup:
 *   return () => worker.terminate();
 *
 * Only use for heavy particle/physics/noise math.
 * For simple animations: use GSAP directly on main thread.
 */
export function createMotionWorker(): Worker {
  return new Worker(new URL("../workers/motion-worker.ts", import.meta.url), {
    type: "module",
  });
}
