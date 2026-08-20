"use client";

import { useEffect, useRef } from "react";
import { debugLog } from "@/lib/debug";

interface AmbientVideoProps {
  src: string;
  // Shown immediately (before any JS runs) and while the video is still
  // fetching data — a declarative HTML attribute, so it paints regardless
  // of autoplay policy or network speed.
  poster: string;
  /** Describes the shot for assistive tech; the element is decorative when omitted. */
  label?: string;
  className?: string;
}

// Muted, looping, decorative video that plays only while on screen —
// autoplaying video that has scrolled away keeps decoding frames, burning
// battery/CPU on phones for something nobody is looking at. An
// IntersectionObserver pauses it instead.
//
// Deliberately ignores prefers-reduced-motion: these clips are core to the
// site's identity, and the owner chose to always play them rather than
// degrade reduced-motion visitors to a still frame.
//
// A prior fix addressed preload="none" + fire-and-forget play() rejecting
// silently on iOS: preload="metadata" plus the canplay-triggered retry
// below.
export function AmbientVideo({ src, poster, label, className = "" }: AmbientVideoProps) {
  const ref = useRef<HTMLVideoElement>(null);

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
  }, [src]);

  return (
    <video
      ref={ref}
      src={src}
      poster={poster}
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
