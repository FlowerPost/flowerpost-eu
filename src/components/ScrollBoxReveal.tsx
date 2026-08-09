"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useMotionValueEvent, useReducedMotion, useScroll, useTransform } from "framer-motion";

const FRAME_COUNT = 241;
const FRAME_PATH = (n: number) => `/sequences/box-reveal/frame_${String(n).padStart(3, "0")}.webp`;
const STATIC_FRAME_PROGRESS = 0.6;

const DPR_MAX_TOUCH = 1.5;
const DPR_MAX_DEFAULT = 2;

function getMaxDpr(): number {
  if (typeof window === "undefined") return DPR_MAX_DEFAULT;
  const isTouch = window.matchMedia("(pointer: coarse)").matches;
  return isTouch ? DPR_MAX_TOUCH : DPR_MAX_DEFAULT;
}

function clamp01(value: number): number {
  return Math.min(1, Math.max(0, value));
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.decoding = "async";
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error(`Failed to load ${src}`));
    img.src = src;
  });
}

function drawCover(ctx: CanvasRenderingContext2D, img: HTMLImageElement, cw: number, ch: number) {
  const imgAspect = img.width / img.height;
  const canvasAspect = cw / ch;
  let sx = 0;
  let sy = 0;
  let sw = img.width;
  let sh = img.height;

  if (imgAspect > canvasAspect) {
    sw = img.height * canvasAspect;
    sx = (img.width - sw) / 2;
  } else {
    sh = img.width / canvasAspect;
    sy = (img.height - sh) / 2;
  }

  ctx.clearRect(0, 0, cw, ch);
  ctx.drawImage(img, sx, sy, sw, sh, 0, 0, cw, ch);
}

export function ScrollBoxReveal() {
  const sectionRef = useRef<HTMLElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imagesRef = useRef<HTMLImageElement[]>([]);
  const currentFrameRef = useRef(-1);
  const dprRef = useRef(1);

  const [ready, setReady] = useState(false);
  const prefersReducedMotion = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  const cueOpacity = useTransform(scrollYProgress, [0, 0.08], [1, 0]);

  const drawFrame = (index: number) => {
    const canvas = canvasRef.current;
    const img = imagesRef.current[index];
    if (!canvas || !img) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const dpr = dprRef.current;
    drawCover(ctx, img, canvas.width / dpr, canvas.height / dpr);
    currentFrameRef.current = index;
  };

  // preload every frame before allowing scroll-driven drawing
  useEffect(() => {
    let cancelled = false;

    async function preload() {
      const sources = Array.from({ length: FRAME_COUNT }, (_, i) => FRAME_PATH(i + 1));
      const loaded = await Promise.all(sources.map(loadImage));
      if (cancelled) return;
      imagesRef.current = loaded;
      setReady(true);
    }

    preload().catch(() => {
      // frames failed to load (e.g. offline) — leave the section blank rather
      // than throwing; the ivory section background still reads fine
    });

    return () => {
      cancelled = true;
    };
  }, []);

  // keep the canvas backing store in sync with its container, redraw on resize
  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    dprRef.current = getMaxDpr();

    const resize = () => {
      const rect = container.getBoundingClientRect();
      const dpr = dprRef.current;
      canvas.width = Math.round(rect.width * dpr);
      canvas.height = Math.round(rect.height * dpr);
      const ctx = canvas.getContext("2d");
      if (ctx) ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      if (currentFrameRef.current >= 0) drawFrame(currentFrameRef.current);
    };

    resize();
    const observer = new ResizeObserver(resize);
    observer.observe(container);
    return () => observer.disconnect();
  }, [ready]);

  // first paint once frames are ready — useMotionValueEvent only fires on
  // subsequent changes, so the frame matching the current (possibly
  // already-scrolled) position has to be drawn explicitly here. Reduced
  // motion always settles on the same static pose instead.
  useEffect(() => {
    if (!ready) return;
    const frame = prefersReducedMotion
      ? Math.round(STATIC_FRAME_PROGRESS * (FRAME_COUNT - 1))
      : Math.round(clamp01(scrollYProgress.get()) * (FRAME_COUNT - 1));
    drawFrame(frame);
  }, [ready, prefersReducedMotion, scrollYProgress]);

  useMotionValueEvent(scrollYProgress, "change", (value) => {
    if (!ready || prefersReducedMotion) return;
    const frame = Math.round(clamp01(value) * (FRAME_COUNT - 1));
    if (frame !== currentFrameRef.current) drawFrame(frame);
  });

  return (
    <section ref={sectionRef} className="relative min-h-[480vh] bg-ivory">
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        <div ref={containerRef} className="absolute inset-0">
          <canvas ref={canvasRef} className="h-full w-full" aria-hidden />
        </div>

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
