"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { Float, Environment, PerformanceMonitor } from "@react-three/drei";
import { EffectComposer, Bloom, Noise } from "@react-three/postprocessing";
import { useScroll } from "motion/react";
import { useRef, useState, Suspense } from "react";
import * as THREE from "three";

function Shape({ scrollProgress }: { scrollProgress: ReturnType<typeof useScroll>["scrollYProgress"] }) {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((_, delta) => {
    if (!meshRef.current) return;
    meshRef.current.rotation.y += delta * 0.2;
    meshRef.current.rotation.x = scrollProgress.get() * 1.5;
  });

  return (
    <Float speed={2} rotationIntensity={0.4} floatIntensity={1}>
      <mesh ref={meshRef}>
        <torusKnotGeometry args={[1, 0.3, 128, 32]} />
        <meshStandardMaterial color="#5e6ad2" roughness={0.2} metalness={0.8} />
      </mesh>
    </Float>
  );
}

interface GeometricHeroProps {
  children?: React.ReactNode;
  withPostFX?: boolean;
}

/**
 * GeometricHero — full-screen abstract 3D hero with overlaid text
 * Use when no user photo available and reference signals tech/futuristic vibe.
 */
export function GeometricHero({ children, withPostFX = true }: GeometricHeroProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [dpr, setDpr] = useState(1.5);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  return (
    <div ref={containerRef} className="relative h-[100dvh] w-full overflow-hidden">
      <Canvas camera={{ position: [0, 0, 5], fov: 50 }} dpr={dpr}>
        <PerformanceMonitor
          onIncline={() => setDpr(2)}
          onDecline={() => setDpr(1)}
        >
          <ambientLight intensity={0.3} />
          <directionalLight position={[5, 5, 5]} intensity={1} />
          <Suspense fallback={null}>
            <Environment preset="city" />
            <Shape scrollProgress={scrollYProgress} />
          </Suspense>
          {withPostFX && (
            <EffectComposer>
              <Bloom luminanceThreshold={0.7} luminanceSmoothing={0.9} intensity={0.6} mipmapBlur />
              <Noise opacity={0.03} />
            </EffectComposer>
          )}
        </PerformanceMonitor>
      </Canvas>
      {children && (
        <div className="absolute inset-0 pointer-events-none flex items-center px-6 md:px-16 lg:px-24">
          <div className="pointer-events-auto">{children}</div>
        </div>
      )}
    </div>
  );
}
