"use client"

import { Canvas, useFrame } from "@react-three/fiber"
import { Center, Environment, Float, PerformanceMonitor, useGLTF } from "@react-three/drei"
import { EffectComposer, Bloom, Noise } from "@react-three/postprocessing"
import { useScroll } from "motion/react"
import { ReactNode, Suspense, useRef, useState } from "react"
import * as THREE from "three"

function Model({
  modelUrl,
  scrollProgress,
  scale,
}: {
  modelUrl: string
  scrollProgress: ReturnType<typeof useScroll>["scrollYProgress"]
  scale: number
}) {
  const groupRef = useRef<THREE.Group>(null)
  const { scene } = useGLTF(modelUrl)

  useFrame((_, delta) => {
    if (!groupRef.current) return
    const progress = scrollProgress.get()
    groupRef.current.rotation.y += delta * 0.18
    groupRef.current.rotation.x = progress * -0.2
    groupRef.current.position.y = Math.sin(progress * Math.PI) * 0.12
  })

  return (
    <Float speed={1.2} rotationIntensity={0.08} floatIntensity={0.25}>
      <Center>
        <group ref={groupRef} scale={scale} dispose={null}>
          <primitive object={scene} />
        </group>
      </Center>
    </Float>
  )
}

interface ModelHeroProps {
  /** Relative path to an optimized, licensed GLB/GLTF stored under public/models/. */
  modelUrl: string
  /** Product or brand name announced to assistive technology. */
  ariaLabel: string
  /** Fit adjustment for models with different source scales. */
  scale?: number
  /** Keep this to one overlay with the hero copy and CTA. */
  children?: ReactNode
  className?: string
}

/**
 * ModelHero renders one real product or brand GLB/GLTF asset.
 *
 * Asset policy: use a licensed, optimized local file. Do not use this component
 * for decorative placeholder geometry; choose a 2D composition when no genuine
 * product, brand, or reference model exists.
 */
export function ModelHero({
  modelUrl,
  ariaLabel,
  scale = 1,
  children,
  className = "",
}: ModelHeroProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [dpr, setDpr] = useState(1.5)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  })

  return (
    <section
      ref={containerRef}
      aria-label={ariaLabel}
      className={`relative h-[100dvh] min-h-[100dvh] overflow-hidden ${className}`}
    >
      <Canvas style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }} camera={{ position: [0, 0, 5], fov: 42 }} dpr={dpr}>
        <PerformanceMonitor onIncline={() => setDpr(2)} onDecline={() => setDpr(1)}>
          <ambientLight intensity={0.7} />
          <directionalLight position={[4, 5, 5]} intensity={1.5} />
          <Suspense fallback={null}>
            <Environment preset="studio" />
            <Model modelUrl={modelUrl} scrollProgress={scrollYProgress} scale={scale} />
          </Suspense>
          <EffectComposer>
            <Bloom luminanceThreshold={0.8} luminanceSmoothing={0.9} intensity={0.45} mipmapBlur />
            <Noise opacity={0.02} />
          </EffectComposer>
        </PerformanceMonitor>
      </Canvas>
      <div aria-hidden className="pointer-events-none absolute inset-0 bg-gradient-to-r from-background via-background/60 to-transparent" />
      {children && (
        <div className="pointer-events-none absolute inset-0 flex items-center px-6 md:px-16 lg:px-24">
          <div className="pointer-events-auto">{children}</div>
        </div>
      )}
    </section>
  )
}
