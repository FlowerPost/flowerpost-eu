"use client";

import { useEffect, useRef, useState } from "react";
import {
  AnimatePresence,
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
  const stageRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imagesRef = useRef<HTMLImageElement[]>([]);
  const currentFrameRef = useRef(-1);
  const dprRef = useRef(1);

  const [ready, setReady] = useState(false);
  // Discrete phase index drives which headline block is mounted. This is
  // deliberately NOT a continuous opacity crossfade across 3 permanently
  // co-mounted blocks — that construction let more than one become
  // readable at once. AnimatePresence below guarantees only one phase's
  // JSX is ever in the DOM (plus its own brief exit copy).
  const [phase, setPhase] = useState<1 | 2 | 3>(1);
  const prefersReducedMotion = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  const seamScaleX = useTransform(scrollYProgress, [0.04, 0.16], [0, 1]);

  // Fugate-style depth drift (Motion Bible §4): the background stage moves
  // at its own slow velocity, independent of the phase text overlay above
  // it. The stage wrapper is oversized (-inset-y-16) so this drift never
  // exposes a gap at the top/bottom edge.
  const stageParallaxY = useTransform(scrollYProgress, [0, 1], [0, -48]);
  const cueOpacity = useTransform(scrollYProgress, [0, 0.05], [1, 0]);

  useMotionValueEvent(scrollYProgress, "change", (value) => {
    const next = value < PHASE_1_END ? 1 : value < PHASE_2_END ? 2 : 3;
    setPhase((prev) => (prev === next ? prev : next));
  });

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
    const stage = stageRef.current;
    const canvas = canvasRef.current;
    if (!stage || !canvas) return;

    dprRef.current = getMaxDpr();

    const resize = () => {
      const rect = stage.getBoundingClientRect();
      const dpr = dprRef.current;
      canvas.width = Math.round(rect.width * dpr);
      canvas.height = Math.round(rect.height * dpr);
      const ctx = canvas.getContext("2d");
      if (ctx) ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      if (currentFrameRef.current >= 0) drawFrame(currentFrameRef.current);
    };

    resize();
    const observer = new ResizeObserver(resize);
    observer.observe(stage);
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

  const phaseTransition = {
    duration: prefersReducedMotion ? 0.01 : DUR.base,
    ease: EASE_LUXE,
  };

  return (
    <section ref={sectionRef} className="relative min-h-[440vh] w-full bg-[#131e15]">
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        {/*
          Full-bleed stage: the frame sequence fills the entire viewport,
          not a contained plate. Oversized -inset-y-16 so the Fugate
          parallax drift never exposes a gap at the top/bottom edge.
        */}
        <motion.div
          initial={{ opacity: 0, scale: 1.04 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{
            duration: prefersReducedMotion ? 0.01 : DUR.epic,
            ease: EASE_LUXE,
          }}
          style={{ y: stageParallaxY }}
          className="absolute -inset-y-16 inset-x-0"
        >
          <div ref={stageRef} className="h-full w-full">
            {/*
              Desaturate + darken wash (item 6): the sequence is rendered on
              a light studio-pastel gradient, brighter/pinker than the
              forest-green direction. Toned down via filter until the
              Blender re-render lands — not a permanent color decision.
            */}
            <canvas
              ref={canvasRef}
              className="h-full w-full saturate-[0.55] brightness-[0.8]"
              aria-hidden
            />
          </div>
        </motion.div>

        {/* Readability gradient: neutral black scrim (not green — espresso
            ink was tried but is actually lighter than the forest-green
            base, which weakened contrast) on the left where the text
            sits, fading to transparent on the right where the box/ribbon
            sits — not a flat wash over the whole frame. */}
        <div
          className="pointer-events-none absolute inset-0 bg-gradient-to-r from-black/90 via-black/70 via-[45%] to-transparent"
          aria-hidden
        />
        {/* Mobile: box/ribbon crop loses most of its side negative space,
            so a bottom-heavy scrim backs the vertically-centered text
            instead. */}
        <div
          className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/80 via-black/45 to-transparent md:hidden"
          aria-hidden
        />

        <div className="relative z-10 mx-auto flex h-full max-w-7xl items-center px-8 md:px-14">
          <div className="relative min-h-[22rem] w-full max-w-lg md:min-h-[26rem]">
            <AnimatePresence mode="sync">
              {phase === 1 && (
                <motion.div
                  key="phase-1"
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -16 }}
                  transition={phaseTransition}
                  className="absolute inset-0 flex flex-col justify-center"
                >
                  <span className="tf-mono mb-6 text-champagne-sand">Flowerpost · Bulgaria</span>
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
              )}

              {phase === 2 && (
                <motion.div
                  key="phase-2"
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -16 }}
                  transition={phaseTransition}
                  className="absolute inset-0 flex flex-col justify-center"
                >
                  <span className="tf-mono mb-6 text-champagne-sand">Отваряне</span>
                  <p className="tf-quote max-w-sm text-ivory/90">
                    Панделката отстъпва. Капакът се повдига.
                  </p>
                </motion.div>
              )}

              {phase === 3 && (
                <motion.div
                  key="phase-3"
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -16 }}
                  transition={phaseTransition}
                  className="absolute inset-0 flex flex-col justify-center"
                >
                  <span className="tf-mono mb-6 text-champagne-sand">Разкритие</span>
                  <h2 className="tf-headline mb-8 text-ivory">
                    Розите, <em className="text-ribbon">разкрити</em>.
                  </h2>
                  <a href="#product" className="btn-bordeaux inline-block w-fit">
                    Разгледай кутиите
                  </a>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
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
