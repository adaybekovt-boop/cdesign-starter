"use client";

import { Canvas, useFrame, useLoader } from "@react-three/fiber";
import { Center, Environment, PerformanceMonitor } from "@react-three/drei";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import { useScroll } from "motion/react";
import { useMemo, useRef, useState, Suspense } from "react";
import * as THREE from "three";
import { SVGLoader } from "three/examples/jsm/loaders/SVGLoader.js";

function ExtrudedSVG({
  svgUrl,
  scrollProgress,
  depth,
  color,
  metalness,
  roughness,
}: {
  svgUrl: string;
  scrollProgress: ReturnType<typeof useScroll>["scrollYProgress"];
  depth: number;
  color: string;
  metalness: number;
  roughness: number;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const svgData = useLoader(SVGLoader, svgUrl);

  // Build extruded geometry from each SVG path
  const shapes = useMemo(() => {
    const out: { geometry: THREE.ExtrudeGeometry; fill: string | null }[] = [];
    svgData.paths.forEach((path) => {
      const fill = (path.userData as { style?: { fill?: string } })?.style?.fill ?? null;
      const subShapes = SVGLoader.createShapes(path);
      subShapes.forEach((shape) => {
        const geom = new THREE.ExtrudeGeometry(shape, {
          depth,
          bevelEnabled: true,
          bevelThickness: depth * 0.05,
          bevelSize: depth * 0.05,
          bevelSegments: 3,
        });
        out.push({ geometry: geom, fill });
      });
    });
    return out;
  }, [svgData, depth]);

  useFrame((_, delta) => {
    if (!groupRef.current) return;
    const p = scrollProgress.get();
    // Continuous slow auto-rotation + scroll-driven Y rotation
    groupRef.current.rotation.y += delta * 0.3;
    groupRef.current.rotation.y += (p * Math.PI * 2 - groupRef.current.rotation.y % (Math.PI * 2)) * 0.02;
    groupRef.current.rotation.x = p * -0.3;
  });

  return (
    <Center>
      {/* Flip Y because SVG coords are top-down, Three.js is bottom-up */}
      <group ref={groupRef} scale={[0.01, -0.01, 0.01]}>
        {shapes.map(({ geometry, fill }) => (
          <mesh key={geometry.uuid} geometry={geometry} castShadow receiveShadow>
            <meshStandardMaterial
              color={fill && fill !== "none" ? fill : color}
              metalness={metalness}
              roughness={roughness}
              side={THREE.DoubleSide}
            />
          </mesh>
        ))}
      </group>
    </Center>
  );
}

interface SvgLogo3DProps {
  /** Absolute or relative URL to an SVG file (e.g. "/logo.svg") */
  svgUrl: string;
  /** Extrusion depth in SVG units. Higher = more "chunky". Default 20. */
  depth?: number;
  /** Fallback color if SVG paths have no fill. */
  color?: string;
  /** PBR metalness 0-1. Default 0.7 (semi-metallic look). */
  metalness?: number;
  /** PBR roughness 0-1. Default 0.25 (slightly glossy). */
  roughness?: number;
  /** Enable Bloom post-processing for glow. Default true. */
  withBloom?: boolean;
  className?: string;
}

/**
 * SvgLogo3D — turn any SVG logo into a 3D extruded scroll-controlled object
 *
 * Requirements:
 *   - SVG file in /public/ (e.g. /public/logo.svg)
 *   - SVG should have actual <path> elements with `fill` attributes
 *   - SVG should not be too complex (under ~20 paths recommended for perf)
 *
 * Usage:
 *   <SvgLogo3D svgUrl="/logo.svg" depth={15} color="#5e6ad2" />
 */
export function SvgLogo3D({
  svgUrl,
  depth = 20,
  color = "#5e6ad2",
  metalness = 0.7,
  roughness = 0.25,
  withBloom = true,
  className = "",
}: SvgLogo3DProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [dpr, setDpr] = useState(1.5);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  return (
    <div ref={containerRef} className={`relative w-full h-[100dvh] ${className}`}>
      <Canvas camera={{ position: [0, 0, 8], fov: 45 }} dpr={dpr}>
        <PerformanceMonitor
          onIncline={() => setDpr(2)}
          onDecline={() => setDpr(1)}
        >
          <ambientLight intensity={0.4} />
          <directionalLight position={[5, 5, 5]} intensity={1.2} castShadow />
          <directionalLight position={[-5, -3, 2]} intensity={0.4} color="#5e6ad2" />
          <Suspense fallback={null}>
            <Environment preset="city" />
            <ExtrudedSVG
              svgUrl={svgUrl}
              scrollProgress={scrollYProgress}
              depth={depth}
              color={color}
              metalness={metalness}
              roughness={roughness}
            />
          </Suspense>
          {withBloom && (
            <EffectComposer>
              <Bloom luminanceThreshold={0.6} luminanceSmoothing={0.9} intensity={0.5} mipmapBlur />
            </EffectComposer>
          )}
        </PerformanceMonitor>
      </Canvas>
    </div>
  );
}
