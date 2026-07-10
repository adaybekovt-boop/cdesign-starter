"use client"
import dynamic from "next/dynamic"
import type { ComponentProps } from "react"
import type { ModelHero as ModelHeroComponent } from "./model-hero"
const ModelHero = dynamic(
  () => import("./model-hero").then((module) => module.ModelHero),
  {
    ssr: false,
    loading: () => <div className="h-[100dvh] min-h-[100dvh] bg-background" aria-hidden />,
  }
)
/**
 * Client-only boundary for WebGL. Keep Canvas and GLTF loading out of SSR so
 * server hydration cannot reset the graphics context or substitute a fallback.
 */
export function ModelHeroClient(props: ComponentProps<typeof ModelHeroComponent>) {
  return <ModelHero {...props} />
}
