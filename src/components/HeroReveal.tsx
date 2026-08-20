"use client";

import { useEffect, useRef, useState } from "react";
import {
  motion,
  useMotionValueEvent,
  useScroll,
  useTransform,
} from "framer-motion";
import { DUR, EASE_LUXE } from "@/lib/motion";
import { debugLog } from "@/lib/debug";

const FRAME_COUNT = 241;
const FRAME_PATH = (n: number) =>
  `/sequences/box-reveal/frame_${String(n).padStart(3, "0")}.webp`;

// Capped at the display's actual pixel density (up from a flat 1.5/2) so the
// canvas backing store is as sharp as the screen can show — the source
// frames are a fixed 668x990 (that's the full delivered render, confirmed
// against the original sequence-final export, not a compressed copy), so
// this can't add real detail, but a higher-resolution backing store gives
// the smoothing filter more pixels to interpolate into, which
// reads as materially less blurry on retina/high-DPI screens.
const DPR_MAX_TOUCH = 2.5;
const DPR_MAX_DEFAULT = 3;

function getMaxDpr(): number {
  if (typeof window === "undefined") return DPR_MAX_DEFAULT;
  const isTouch = window.matchMedia("(pointer: coarse)").matches;
  return isTouch ? DPR_MAX_TOUCH : DPR_MAX_DEFAULT;
}

function clamp01(value: number): number {
  return Math.min(1, Math.max(0, value));
}

// Canonical 1x1 lossy WebP (Modernizr's test image). If this fails to decode,
// every one of the 241 sequence frames will fail identically — a browser
// with no WebP support wouldn't look like "some frames missing", it would
// look exactly like "canvas never draws anything, ever", which is what the
// user's recording shows.
function testWebpSupport(): Promise<boolean> {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve(img.width === 1);
    img.onerror = () => resolve(false);
    img.src =
      "data:image/webp;base64,UklGRhoAAABXRUJQVlA4TA0AAAAvAAAAEAcQERGIiP4HAA==";
  });
}

// Retries before giving up: on a real mobile connection a dropped or timed
// out image request is common, not exceptional (verified against a screen
// recording on a real phone over 5G where the Hero canvas never painted a
// single frame for the entire scroll — a failure this environment's stable
// connection never reproduces). Each retry waits a bit longer than the last.
function loadImage(src: string, attempts = 3): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    let tries = 0;
    const attempt = () => {
      tries++;
      const img = new Image();
      img.decoding = "async";
      img.onload = () => resolve(img);
      img.onerror = () => {
        if (tries < attempts) {
          setTimeout(attempt, 300 * tries);
        } else {
          reject(new Error(`Failed to load ${src} after ${attempts} attempts`));
        }
      };
      img.src = src;
    };
    attempt();
  });
}

// Edge softening for the contained case, done on the canvas rather than in
// CSS so it always tracks the draw mode exactly — a CSS mask keyed to a
// breakpoint would desync from this aspect-based decision at odd window
// sizes and leave a hard photo edge showing.
function fadeSides(
  ctx: CanvasRenderingContext2D,
  dx: number,
  dw: number,
  ch: number,
) {
  const g = ctx.createLinearGradient(dx, 0, dx + dw, 0);
  g.addColorStop(0, "rgba(0,0,0,1)");
  g.addColorStop(0.1, "rgba(0,0,0,0)");
  g.addColorStop(0.9, "rgba(0,0,0,0)");
  g.addColorStop(1, "rgba(0,0,0,1)");
  ctx.globalCompositeOperation = "destination-out";
  ctx.fillStyle = g;
  ctx.fillRect(dx, 0, dw, ch);
  ctx.globalCompositeOperation = "source-over";
}

function drawFrameFitted(
  ctx: CanvasRenderingContext2D,
  img: HTMLImageElement,
  cw: number,
  ch: number,
) {
  const imgAspect = img.width / img.height;
  const canvasAspect = cw / ch;

  ctx.clearRect(0, 0, cw, ch);
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = "high";

  if (canvasAspect <= imgAspect) {
    // Portrait-ish viewport (phones): cover fills the screen while still
    // drawing the source at or below its native size — 0.82x at 375x812 —
    // so it stays sharp. Keep it edge to edge.
    let sx = 0;
    let sw = img.width;
    if (imgAspect > canvasAspect) {
      sw = img.height * canvasAspect;
      sx = (img.width - sw) / 2;
    }
    ctx.drawImage(img, sx, 0, sw, img.height, 0, 0, cw, ch);
    return;
  }

  // Landscape viewport: contain, not cover. The frames are a fixed 668x990
  // portrait render, so covering a wide screen means blowing them up 2.16x
  // at 1440 wide (2.87x at 1920) and discarding well over half the frame's
  // height — which is why the box read as both cropped-in and soft. Fitting
  // instead keeps the whole composition and holds the scale at or near 1:1.
  const scale = Math.min(cw / img.width, ch / img.height);
  const dw = img.width * scale;
  const dh = img.height * scale;
  const dx = (cw - dw) / 2;
  const dy = (ch - dh) / 2;

  ctx.drawImage(img, 0, 0, img.width, img.height, dx, dy, dw, dh);
  fadeSides(ctx, dx, dw, ch);
}

export function HeroReveal() {
  const sectionRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imagesRef = useRef<HTMLImageElement[]>([]);
  const currentFrameRef = useRef(-1);
  const dprRef = useRef(1);

  const [ready, setReady] = useState(false);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  // Fugate-style depth drift (Motion Bible §4): the background stage moves
  // at its own slow velocity. The stage wrapper is oversized (-inset-y-16)
  // so this drift never exposes a gap at the top/bottom edge.
  const stageParallaxY = useTransform(scrollYProgress, [0, 1], [0, -48]);
  const cueOpacity = useTransform(scrollYProgress, [0, 0.05], [1, 0]);

  const drawFrame = (index: number) => {
    const canvas = canvasRef.current;
    const img = imagesRef.current[index];
    if (!canvas || !img) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const dpr = dprRef.current;
    drawFrameFitted(ctx, img, canvas.width / dpr, canvas.height / dpr);
    currentFrameRef.current = index;
  };

  useEffect(() => {
    const nav = navigator as Navigator & {
      connection?: { effectiveType?: string; saveData?: boolean; downlink?: number };
    };
    debugLog("env", {
      ua: navigator.userAgent,
      devicePixelRatio: window.devicePixelRatio,
      maxDpr: getMaxDpr(),
      reducedMotion: window.matchMedia("(prefers-reduced-motion: reduce)").matches,
      connection: nav.connection
        ? {
            effectiveType: nav.connection.effectiveType,
            saveData: nav.connection.saveData,
            downlink: nav.connection.downlink,
          }
        : null,
    });
    testWebpSupport().then((supported) => debugLog("webpSupport", supported));
  }, []);

  useEffect(() => {
    let cancelled = false;

    // Deliberately ignores prefers-reduced-motion — the box-reveal and the
    // ambient video clips are the site's core visual identity, and the
    // owner chose to always show them rather than degrade to a still image
    // for visitors with that OS setting on.
    // Progressive load, not Promise.all(all 241) — the previous version
    // blocked the entire hero (canvas stays blank, scroll updates no-op)
    // until every one of 7.9MB / 241 requests finished: 5-8s on real
    // mobile networks. Instead: load a small initial batch synchronously
    // (~24 frames × ~33KB ≈ 800KB, an order of magnitude less), flip
    // `ready` as soon as that's in, then stream the rest in the
    // background at limited concurrency so it never competes with
    // anything the user is actively doing. drawFrame() already no-ops
    // gracefully for an index that hasn't arrived yet (holds the last
    // drawn frame), so a still-loading tail frame is never a hard error —
    // just a brief hold during a very fast early scroll.
    const INITIAL_BATCH = 24;
    const CONCURRENCY = 6;

    async function preload() {
      const sources = Array.from({ length: FRAME_COUNT }, (_, i) => FRAME_PATH(i + 1));

      // allSettled, not all: Promise.all's all-or-nothing semantics meant
      // ANY ONE of these 24 concurrent requests failing rejected the whole
      // batch, the preload().catch below swallowed it, `ready` never
      // flipped true, and the canvas stayed permanently blank for the rest
      // of the session — no retry, no partial render, nothing. allSettled
      // draws whatever did arrive and moves on; the background worker below
      // (which only starts once `ready` is true) keeps trying the rest.
      const initial = await Promise.allSettled(sources.slice(0, INITIAL_BATCH).map((s) => loadImage(s)));
      if (cancelled) return;
      let loadedCount = 0;
      const failures: string[] = [];
      initial.forEach((result, i) => {
        if (result.status === "fulfilled") {
          imagesRef.current[i] = result.value;
          loadedCount++;
        } else {
          failures.push(`frame_${i + 1}: ${String(result.reason?.message ?? result.reason)}`);
        }
      });
      debugLog("initialBatch", { loaded: loadedCount, total: INITIAL_BATCH, failures });
      setReady(true);

      let next = INITIAL_BATCH;
      async function worker() {
        while (!cancelled && next < FRAME_COUNT) {
          const i = next++;
          try {
            imagesRef.current[i] = await loadImage(sources[i]);
            const wanted = Math.round(clamp01(scrollYProgress.get()) * (FRAME_COUNT - 1));
            if (wanted === i) drawFrame(i);
          } catch {
            // one missing frame just leaves a gap — drawFrame skips it
          }
        }
      }
      await Promise.all(Array.from({ length: CONCURRENCY }, worker));
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
      debugLog("canvas", {
        dpr,
        rectW: rect.width,
        rectH: rect.height,
        canvasW: canvas.width,
        canvasH: canvas.height,
        innerW: window.innerWidth,
        innerH: window.innerHeight,
        docClientH: document.documentElement.clientHeight,
        currentFrame: currentFrameRef.current,
      });
    };

    resize();
    const observer = new ResizeObserver(resize);
    observer.observe(stage);
    return () => observer.disconnect();
  }, [ready]);

  useEffect(() => {
    if (!ready) return;
    const frame = Math.round(clamp01(scrollYProgress.get()) * (FRAME_COUNT - 1));
    drawFrame(frame);
    debugLog("initialDraw", {
      ready,
      frame,
      frameImageLoaded: Boolean(imagesRef.current[frame]),
      canvasSize: canvasRef.current
        ? { w: canvasRef.current.width, h: canvasRef.current.height }
        : null,
    });
  }, [ready, scrollYProgress]);

  useMotionValueEvent(scrollYProgress, "change", (value) => {
    if (!ready) return;
    const frame = Math.round(clamp01(value) * (FRAME_COUNT - 1));
    if (frame !== currentFrameRef.current) drawFrame(frame);
  });

  return (
    // 1320vh is the deliberate slow-reveal pacing for pointer scrolling, but
    // it costs ~11.7 phone screens of thumb-swiping to get through the box
    // opening — the sequence stops being a reveal and becomes an obstacle.
    // Phones get 2/3 of that; the frame mapping is proportional to section
    // height, so the whole animation still plays out in full, just over less
    // travel. Desktop pacing is unchanged.
    <section
      ref={sectionRef}
      className="relative min-h-[860vh] w-full md:min-h-[1320vh]"
    >
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        {/*
          Full-bleed stage: the frame sequence fills the entire viewport,
          not a contained plate. Oversized -inset-y-16 so the Fugate
          parallax drift never exposes a gap at the top/bottom edge.
        */}
        <motion.div
          initial={{ opacity: 0, scale: 1.04 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: DUR.epic, ease: EASE_LUXE }}
          style={{ y: stageParallaxY }}
          className="absolute -inset-y-16 inset-x-0"
        >
          {/*
            Masked rather than covered. The previous version laid a
            champagne-sand gradient over the bottom of the stage, which meant
            flat painted color met the real page background (same base tone,
            but carrying grain and the drifting color blobs) along a straight
            line — near-identical tones, and the eye reads the discontinuity
            as a hard edge anyway. Masking dissolves the photo itself, so what
            appears underneath IS the shared background: nothing to
            colour-match, so no seam can form.
          */}
          <div
            ref={stageRef}
            className="h-full w-full [mask-image:linear-gradient(to_bottom,black_0%,black_62%,transparent_92%)] [mask-repeat:no-repeat] [mask-size:100%_100%]"
          >
            <canvas ref={canvasRef} className="h-full w-full" aria-hidden />
          </div>
        </motion.div>

        <motion.div
          style={{ opacity: cueOpacity }}
          className="pointer-events-none absolute inset-x-0 bottom-10 z-10 flex flex-col items-center gap-3"
          aria-hidden
        >
          <span className="tf-mono text-bordeaux">Скролни, за да отвориш</span>
          <span className="block h-10 w-px bg-gradient-to-b from-gold/50 to-transparent" />
        </motion.div>
      </div>
    </section>
  );
}
