"use client";

import { useEffect, useRef } from "react";
import { useReducedMotion } from "framer-motion";
import { debugLog } from "@/lib/debug";

interface AmbientVideoProps {
  src: string;
  // Required, not optional: on prefers-reduced-motion the video is never
  // played at all (see below), so the poster is the ONLY thing that will
  // ever be visible there — without one that spot is permanently blank.
  poster: string;
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
// 2. Honours prefers-reduced-motion: play() is never called, so the viewer
//    never sees motion they've explicitly asked not to see.
//
// A prior fix here addressed preload="none" + fire-and-forget play()
// rejecting silently on iOS. That shipped and was confirmed live, but a
// user with Reduce Motion enabled (Settings > Accessibility > Motion on
// iOS) still saw nothing at all — confirmed via an on-page diagnostic
// (readyState: 0, videoWidth/Height: 0) that the reduced-motion branch
// below returns before ever loading a frame, and with no `poster` set the
// <video> element has nothing to paint. It isn't broken playback, it's a
// still frame that was never asked for. `poster` fixes it directly: a
// declarative HTML attribute the browser paints immediately regardless of
// any JS/autoplay policy, so reduced-motion visitors get the still image
// this component always intended for them, and everyone else sees it for
// the brief window before playback starts.
export function AmbientVideo({ src, poster, label, className = "" }: AmbientVideoProps) {
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
      poster={poster}
      muted
      loop
      playsInline
      // Reduced-motion visitors only ever see the poster, so there's no
      // reason to fetch any video data at all — "none" saves the request.
      preload={prefersReducedMotion ? "none" : "metadata"}
      aria-label={label}
      aria-hidden={label ? undefined : true}
      className={className}
    />
  );
}
