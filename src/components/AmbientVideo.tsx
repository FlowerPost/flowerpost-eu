"use client";

import { useEffect, useRef } from "react";
import { useReducedMotion } from "framer-motion";
import { debugLog } from "@/lib/debug";

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
// Reported: these clips never start on real phones (a static, soft first
// frame, forever) even though the same code works in every desktop and
// emulated-mobile browser tested. Root cause is preload="none" combined
// with a fire-and-forget play() on intersect: on iOS Safari and several
// mobile Chrome builds, preload="none" means the element has zero buffered
// data at the moment IntersectionObserver fires, play() has nothing to
// play yet, the returned promise rejects, and — because the original catch
// was `.catch(() => {})` — that rejection was swallowed with no retry.
// Nothing ever asked again, so the element sat on whatever partial frame it
// had decoded and never moved.
//
// preload="metadata" fixes the root cause: the browser fetches enough
// (duration, dimensions, a first frame) to make play() reliable, without
// pulling the full file up front — still far lighter than preload="auto".
// The retry-on-canplay below is the second half of the fix: if play() is
// rejected anyway (a real autoplay block, not a data-not-ready race), it
// tries again the moment the browser reports it actually has data.
export function AmbientVideo({ src, label, className = "" }: AmbientVideoProps) {
  const ref = useRef<HTMLVideoElement>(null);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const tag = src.split("/").pop() ?? src;
    const report = (extra?: Record<string, unknown>) => {
      debugLog(`video:${tag}`, {
        readyState: el.readyState,
        networkState: el.networkState,
        paused: el.paused,
        currentTime: el.currentTime,
        videoWidth: el.videoWidth,
        videoHeight: el.videoHeight,
        error: el.error ? { code: el.error.code, message: el.error.message } : null,
        canPlayMp4: el.canPlayType("video/mp4"),
        ...extra,
      });
    };

    if (prefersReducedMotion) {
      el.pause();
      report({ skippedReason: "prefersReducedMotion" });
      return;
    }

    let wantsToPlay = false;

    const attemptPlay = () => {
      el.play()
        .then(() => report({ playResult: "resolved" }))
        .catch((err) => {
          // Rejected because there's no data yet (preload="metadata" hasn't
          // resolved) or because of a genuine autoplay block — either way,
          // canplay below is the single retry path for both.
          report({ playResult: "rejected", playError: String(err) });
        });
    };

    const onCanPlay = () => {
      report({ event: "canplay" });
      if (wantsToPlay) attemptPlay();
    };
    const onError = () => report({ event: "error" });
    const onStalled = () => report({ event: "stalled" });
    el.addEventListener("canplay", onCanPlay);
    el.addEventListener("error", onError);
    el.addEventListener("stalled", onStalled);

    report({ event: "mount" });

    const io = new IntersectionObserver(
      ([entry]) => {
        wantsToPlay = entry.isIntersecting;
        if (entry.isIntersecting) {
          attemptPlay();
        } else {
          el.pause();
        }
        report({ event: "intersection", isIntersecting: entry.isIntersecting });
      },
      { rootMargin: "200px 0px" },
    );

    io.observe(el);
    return () => {
      io.disconnect();
      el.removeEventListener("canplay", onCanPlay);
      el.removeEventListener("error", onError);
      el.removeEventListener("stalled", onStalled);
    };
  }, [prefersReducedMotion, src]);

  return (
    <video
      ref={ref}
      src={src}
      muted
      loop
      playsInline
      preload="metadata"
      aria-label={label}
      aria-hidden={label ? undefined : true}
      className={className}
    />
  );
}
