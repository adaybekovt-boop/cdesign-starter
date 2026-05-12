"use client";

import { useEffect, useRef } from "react";
import Image, { type ImageProps } from "next/image";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

/**
 * RevealImage — clip-path mask reveal + inner scale on scroll
 * The "camera pulling back" effect. Premium image entrance.
 */
interface RevealImageProps extends Omit<ImageProps, "ref"> {
  className?: string;
}

export function RevealImage({ className = "", ...imageProps }: RevealImageProps) {
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const wrapper = wrapperRef.current;
    if (!wrapper) return;
    const img = wrapper.querySelector("img");
    if (!img) return;

    gsap.set(wrapper, { clipPath: "inset(100% 0% 0% 0%)" });
    gsap.set(img, { scale: 1.3, yPercent: 20 });

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: wrapper,
        start: "top 85%",
        toggleActions: "play none none reverse",
      },
    });

    tl.to(wrapper, { clipPath: "inset(0% 0% 0% 0%)", duration: 1.2, ease: "power4.inOut" })
      .to(img, { scale: 1, yPercent: 0, duration: 1.2, ease: "power4.inOut" }, "<");

    return () => {
      tl.kill();
      ScrollTrigger.getAll().forEach((st) => {
        if (st.trigger === wrapper) st.kill();
      });
    };
  }, []);

  return (
    <div ref={wrapperRef} className={`overflow-hidden ${className}`}>
      <Image {...imageProps} alt={imageProps.alt} />
    </div>
  );
}
