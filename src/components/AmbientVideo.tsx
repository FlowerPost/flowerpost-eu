"use client";

import { useEffect, useRef } from "react";
import { useReducedMotion } from "framer-motion";

interface AmbientVideoProps {
  src: string;
  /** Describes the shot for assistive tech; the element is decorative when omitted. */
  label?: string;
  className?: string;
}

// Muted, looping, decorative video. Two things it does that a plain
// <video autoPlay loop> does not:
//
// 1. Plays only while on screen. Autoplaying video that has scrolled away
//    keeps decoding frames — burning battery and CPU on phones for something
//    nobody is looking at. An IntersectionObserver pauses it instead.
// 2. Honours prefers-reduced-motion: the video holds on its first frame and
//    is never played, so it degrades to a still image rather than motion the
//    viewer has explicitly asked not to see.
//
// preload="none" keeps these off the initial page weight entirely; the file
// is only fetched once the section approaches the viewport.
export function AmbientVideo({ src, label, className = "" }: AmbientVideoProps) {
  const ref = useRef<HTMLVideoElement>(null);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (prefersReducedMotion) {
      el.pause();
      return;
    }

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          // play() rejects if the browser blocks autoplay; nothing to recover
          // from — the poster frame stays, which is an acceptable fallback.
          el.play().catch(() => {});
        } else {
          el.pause();
        }
      },
      { rootMargin: "200px 0px" },
    );

    io.observe(el);
    return () => io.disconnect();
  }, [prefersReducedMotion]);

  return (
    <video
      ref={ref}
      src={src}
      muted
      loop
      playsInline
      preload="none"
      aria-label={label}
      aria-hidden={label ? undefined : true}
      className={className}
    />
  );
}
