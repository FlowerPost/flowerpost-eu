"use client";

import { useEffect, useState } from "react";
import { isDebugOn, subscribeDebug } from "@/lib/debug";

// Renders whatever HeroReveal / AmbientVideo have written to window.__fpDebug
// as visible on-page text. Only for ?debug=1 — see src/lib/debug.ts.
export function DebugOverlay() {
  const [on, setOn] = useState(false);
  const [, forceTick] = useState(0);

  useEffect(() => {
    setOn(isDebugOn());
    return subscribeDebug(() => forceTick((n) => n + 1));
  }, []);

  if (!on) return null;

  const data = typeof window !== "undefined" ? (window.__fpDebug ?? {}) : {};

  return (
    <pre className="fixed inset-x-2 bottom-2 z-[9999] max-h-[45vh] overflow-auto whitespace-pre-wrap rounded-lg bg-black/90 p-3 font-mono text-[10px] leading-tight text-lime-300">
      {JSON.stringify(data, null, 1)}
    </pre>
  );
}
