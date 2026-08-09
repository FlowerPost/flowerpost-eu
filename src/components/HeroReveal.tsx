"use client";

import { useEffect, useRef, useState } from "react";
import NextImage from "next/image";
import {
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";
import { DUR, EASE_LUXE } from "@/lib/motion";

const FRAME_COUNT = 241;
const FRAME_PATH = (n: number) =>
  `/sequences/box-reveal/frame_${String(n).padStart(3, "0")}.webp`;
const STATIC_FRAME_PROGRESS = 0.85;

// Phase text/CTA crossfades are timed to where the authored sequence itself
// acts: the box holds its closed pose through ~frame 90 (progress .37), lid
// separation and rose emergence happens ~frame 90-140, bloom settles by
// ~frame 200. These boundaries track that footage, not an even three-way split.
const PHASE_1_END = 0.36;
const PHASE_2_END = 0.58;

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

export function HeroReveal() {
  const sectionRef = useRef<HTMLElement>(null);
  const plateRef = useRef<HTMLDivElement>(null);
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

  const phase1Opacity = useTransform(
    scrollYProgress,
    [0, PHASE_1_END - 0.06, PHASE_1_END],
    [1, 1, 0]
  );
  const seamScaleX = useTransform(scrollYProgress, [0.04, 0.16], [0, 1]);

  const phase2Opacity = useTransform(
    scrollYProgress,
    [PHASE_1_END, PHASE_1_END + 0.04, PHASE_2_END - 0.04, PHASE_2_END],
    [0, 1, 1, 0]
  );

  const phase3Opacity = useTransform(scrollYProgress, [PHASE_2_END, PHASE_2_END + 0.08], [0, 1]);
  const phase3Y = useTransform(scrollYProgress, [PHASE_2_END, PHASE_2_END + 0.1], [24, 0]);

  // Fugate-style depth drift (Motion Bible §4): the plate moves at its own
  // slow velocity, independent of the phase text crossfades above it.
  const plateParallaxY = useTransform(scrollYProgress, [0, 1], [0, -48]);
  const cueOpacity = useTransform(scrollYProgress, [0, 0.05], [1, 0]);

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
      // frames failed to load (e.g. offline) — the plate keeps its
      // champagne-sand fallback rather than throwing
    });

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    const plate = plateRef.current;
    const canvas = canvasRef.current;
    if (!plate || !canvas) return;

    dprRef.current = getMaxDpr();

    const resize = () => {
      const rect = plate.getBoundingClientRect();
      const dpr = dprRef.current;
      canvas.width = Math.round(rect.width * dpr);
      canvas.height = Math.round(rect.height * dpr);
      const ctx = canvas.getContext("2d");
      if (ctx) ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      if (currentFrameRef.current >= 0) drawFrame(currentFrameRef.current);
    };

    resize();
    const observer = new ResizeObserver(resize);
    observer.observe(plate);
    return () => observer.disconnect();
  }, [ready]);

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
    <section ref={sectionRef} className="relative min-h-[440vh] bg-[#131e15]">
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        <div
          className="pointer-events-none absolute -left-28 -top-28 h-[26rem] w-[26rem] opacity-[0.05]"
          aria-hidden
        >
          <NextImage src="/images/fp-monogram.jpg" alt="" fill className="object-contain" sizes="26rem" />
        </div>

        <div className="mx-auto grid h-full max-w-7xl grid-cols-1 items-center gap-10 px-8 md:grid-cols-[0.4fr_0.6fr] md:gap-16 md:px-14">
          <div className="relative min-h-[22rem] md:min-h-[26rem]">
            <motion.div
              style={{ opacity: phase1Opacity }}
              className="absolute inset-0 flex flex-col justify-center"
            >
              <span className="tf-mono mb-6 text-gold/80">Flowerpost · Bulgaria</span>
              <h1 className="tf-display mb-8 text-ivory">
                Преди отварянето —
                <br />
                <span className="text-ribbon">тишина.</span>
              </h1>
              <motion.span
                style={{ scaleX: seamScaleX }}
                className="block h-px w-24 origin-left bg-gold"
                aria-hidden
              />
            </motion.div>

            <motion.div
              style={{ opacity: phase2Opacity }}
              className="absolute inset-0 flex flex-col justify-center"
            >
              <span className="tf-mono mb-6 text-gold/80">Отваряне</span>
              <p className="tf-quote max-w-sm text-ivory/85">
                Панделката отстъпва. Капакът се повдига.
              </p>
            </motion.div>

            <motion.div
              style={{ opacity: phase3Opacity, y: phase3Y }}
              className="absolute inset-0 flex flex-col justify-center"
            >
              <span className="tf-mono mb-6 text-gold/80">Разкритие</span>
              <h2 className="tf-headline mb-8 text-ivory">
                Розите, <em className="text-ribbon">разкрити</em>.
              </h2>
              <a href="#product" className="btn-bordeaux inline-block w-fit">
                Разгледай кутиите
              </a>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 1.04 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{
              duration: prefersReducedMotion ? 0.01 : DUR.epic,
              ease: EASE_LUXE,
            }}
            style={{ y: plateParallaxY }}
            className="mx-auto"
          >
            {/*
              Contained "plate" rather than full-bleed: the frame sequence is
              rendered on a light studio gradient (pending its own Blender
              re-render pass), so it sits inside a bordered frame against the
              forest-green environment instead of painting the whole section.
            */}
            <div
              ref={plateRef}
              className="relative aspect-[2/3] w-full max-w-sm overflow-hidden border border-gold/30 bg-champagne-sand shadow-[0_20px_60px_rgba(0,0,0,0.4)] md:max-w-md"
            >
              <canvas ref={canvasRef} className="h-full w-full" aria-hidden />
            </div>
          </motion.div>
        </div>

        <motion.div
          style={{ opacity: cueOpacity }}
          className="pointer-events-none absolute inset-x-0 bottom-10 z-10 flex flex-col items-center gap-3"
          aria-hidden
        >
          <span className="tf-mono text-gold/70">Скролни, за да отвориш</span>
          <span className="block h-10 w-px bg-gradient-to-b from-gold/50 to-transparent" />
        </motion.div>
      </div>
    </section>
  );
}
