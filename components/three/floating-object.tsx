"use client";

import { Canvas, useFrame, useLoader } from "@react-three/fiber";
import { Float, Environment, PerformanceMonitor } from "@react-three/drei";
import { EffectComposer, Bloom, Noise } from "@react-three/postprocessing";
import { useScroll } from "motion/react";
import { useRef, useState, Suspense } from "react";
import * as THREE from "three";

function FloatingPlane({
  imageUrl,
  scrollProgress,
  mouse,
}: {
  imageUrl: string;
  scrollProgress: ReturnType<typeof useScroll>["scrollYProgress"];
  mouse: React.MutableRefObject<{ x: number; y: number }>;
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  const texture = useLoader(THREE.TextureLoader, imageUrl);

  // Get image aspect ratio so the plane doesn't distort
  const aspect = texture.image ? texture.image.width / texture.image.height : 1;
  const baseWidth = 3;
  const baseHeight = baseWidth / aspect;

  useFrame((_, delta) => {
    if (!meshRef.current) return;

    // Mouse parallax: rotate slightly toward cursor
    meshRef.current.rotation.y += (mouse.current.x * 0.3 - meshRef.current.rotation.y) * 0.05;
    meshRef.current.rotation.x += (-mouse.current.y * 0.2 - meshRef.current.rotation.x) * 0.05;

    // Scroll-driven Y rotation overlay
    const p = scrollProgress.get();
    meshRef.current.rotation.y += p * delta * 0.5;
  });

  return (
    <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.6}>
      <mesh ref={meshRef}>
        <planeGeometry args={[baseWidth, baseHeight, 32, 32]} />
        <meshStandardMaterial
          map={texture}
          transparent
          alphaTest={0.01} // Required for proper transparent PNG rendering
          side={THREE.DoubleSide}
          roughness={0.4}
          metalness={0.1}
          toneMapped={false}
        />
      </mesh>
    </Float>
  );
}

interface FloatingObjectProps {
  /**
   * URL to PNG with TRANSPARENT background.
   * If you have a regular photo, remove the background first:
   *   - remove.bg (free, 3/day)
   *   - Adobe Express background remover (free, unlimited)
   *   - macOS Preview: right-click image > Remove Background
   *   - iOS: long-press subject in Photos > Copy Subject
   */
  imageUrl: string;
  withPostFX?: boolean;
  className?: string;
}

/**
 * FloatingObject — display a transparent PNG as a 3D plane that floats,
 * rotates with mouse movement, and drifts with scroll.
 *
 * The "perfume bottle floating in space" effect from premium product sites.
 *
 * CRITICAL: input image MUST have transparent background.
 * Plain photos with backgrounds will look broken.
 */
export function FloatingObject({ imageUrl, withPostFX = true, className = "" }: FloatingObjectProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mouse = useRef({ x: 0, y: 0 });
  const [dpr, setDpr] = useState(1.5);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  // Track normalized mouse position (-1 to 1)
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    mouse.current.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    mouse.current.y = ((e.clientY - rect.top) / rect.height) * 2 - 1;
  };

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      className={`relative w-full h-[100dvh] ${className}`}
    >
      <Canvas camera={{ position: [0, 0, 5], fov: 45 }} dpr={dpr}>
        <PerformanceMonitor
          onIncline={() => setDpr(2)}
          onDecline={() => setDpr(1)}
        >
          <ambientLight intensity={1.0} />
          <directionalLight position={[5, 5, 5]} intensity={0.8} />
          <directionalLight position={[-3, -2, 2]} intensity={0.3} color="#5e6ad2" />
          <Suspense fallback={null}>
            <Environment preset="studio" />
            <FloatingPlane imageUrl={imageUrl} scrollProgress={scrollYProgress} mouse={mouse} />
          </Suspense>
          {withPostFX && (
            <EffectComposer>
              <Bloom luminanceThreshold={0.8} luminanceSmoothing={0.9} intensity={0.6} mipmapBlur />
              <Noise opacity={0.03} />
            </EffectComposer>
          )}
        </PerformanceMonitor>
      </Canvas>
    </div>
  );
}
