"use client";

import { Canvas, useFrame, useLoader } from "@react-three/fiber";
import { PerformanceMonitor } from "@react-three/drei";
import { EffectComposer, Bloom, Noise } from "@react-three/postprocessing";
import { useScroll } from "motion/react";
import { useRef, useState, Suspense } from "react";
import * as THREE from "three";

function Plane({ photoUrl, scrollProgress }: { photoUrl: string; scrollProgress: ReturnType<typeof useScroll>["scrollYProgress"] }) {
  const meshRef = useRef<THREE.Mesh>(null);
  // useLoader handles caching — no memory leak from re-instantiation
  const texture = useLoader(THREE.TextureLoader, photoUrl);

  useFrame(() => {
    if (!meshRef.current) return;
    const p = scrollProgress.get();
    meshRef.current.rotation.y = p * Math.PI * 0.3;
    meshRef.current.rotation.x = p * -0.15;
    meshRef.current.position.z = -p * 1.8;
    meshRef.current.scale.setScalar(1 + p * 0.15);
  });

  return (
    <mesh ref={meshRef}>
      <planeGeometry args={[4, 2.5, 32, 32]} />
      <meshStandardMaterial map={texture} side={THREE.DoubleSide} toneMapped={false} roughness={0.4} />
    </mesh>
  );
}

interface PhotoTo3DProps {
  photoUrl: string;
  withPostFX?: boolean; // Bloom + Noise (recommended for cinematic feel)
  className?: string;
}

/**
 * PhotoTo3D — turn any image into a scroll-controlled 3D cinematic plane
 *
 * IMPORTANT (per research): does NOT use drei's <ScrollControls> because that
 * conflicts with Lenis. Uses motion/react's useScroll which reads window scroll
 * (which Lenis is updating). This gives perfect sync.
 */
export function PhotoTo3D({ photoUrl, withPostFX = true, className = "" }: PhotoTo3DProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [dpr, setDpr] = useState(1.5);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  return (
    <div ref={containerRef} className={`relative min-h-[150dvh] ${className}`}>
      <div className="sticky top-0 h-[100dvh] w-full">
        <Canvas camera={{ position: [0, 0, 4], fov: 45 }} dpr={dpr}>
          <PerformanceMonitor
            onIncline={() => setDpr(2)}
            onDecline={() => setDpr(1)}
          >
            <ambientLight intensity={0.9} />
            <directionalLight position={[5, 5, 5]} intensity={0.7} />
            <Suspense fallback={null}>
              <Plane photoUrl={photoUrl} scrollProgress={scrollYProgress} />
            </Suspense>
            {withPostFX && (
              <EffectComposer>
                <Bloom luminanceThreshold={0.7} luminanceSmoothing={0.9} intensity={0.8} mipmapBlur />
                <Noise opacity={0.04} />
              </EffectComposer>
            )}
          </PerformanceMonitor>
        </Canvas>
      </div>
    </div>
  );
}
