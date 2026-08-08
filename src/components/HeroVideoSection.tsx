"use client";

import { useEffect, useRef, useState } from "react";
import {
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";

const VIDEO_SRC = "/videos/hero.mp4";
const STATIC_PROGRESS = 0.6;

export function HeroVideoSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [duration, setDuration] = useState(0);
  const prefersReducedMotion = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  const cueOpacity = useTransform(scrollYProgress, [0, 0.08], [1, 0]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    video.pause();

    const handleLoaded = () => setDuration(video.duration || 0);
    if (video.readyState >= 1) {
      handleLoaded();
    } else {
      video.addEventListener("loadedmetadata", handleLoaded);
      return () => video.removeEventListener("loadedmetadata", handleLoaded);
    }
  }, []);

  useEffect(() => {
    if (!prefersReducedMotion || !duration) return;
    const video = videoRef.current;
    if (video) video.currentTime = duration * STATIC_PROGRESS;
  }, [prefersReducedMotion, duration]);

  useMotionValueEvent(scrollYProgress, "change", (value) => {
    if (prefersReducedMotion) return;
    const video = videoRef.current;
    if (!video || !duration) return;
    const clamped = Math.min(1, Math.max(0, value));
    video.currentTime = clamped * duration;
  });

  return (
    <section ref={sectionRef} className="relative min-h-[240vh] bg-ivory">
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        <video
          ref={videoRef}
          src={VIDEO_SRC}
          className="absolute inset-0 h-full w-full object-cover"
          muted
          playsInline
          preload="auto"
          aria-hidden
        />

        <motion.div
          style={{ opacity: cueOpacity }}
          className="pointer-events-none absolute inset-x-0 bottom-10 z-10 flex flex-col items-center gap-3"
          aria-hidden
        >
          <span className="tf-mono text-gold/70">Скрол</span>
          <span className="block h-10 w-px bg-gradient-to-b from-gold/50 to-transparent" />
        </motion.div>
      </div>
    </section>
  );
}
