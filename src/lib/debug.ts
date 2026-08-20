// Temporary on-page diagnostic bus for the Hero-canvas / video "blank on
// real phone" bug: two prior fixes (video preload strategy, then
// Promise.allSettled for the frame batch) shipped and were confirmed live
// but did not resolve the user's report, so this exists to pull real values
// off their exact device instead of guessing a third time. Only active with
// ?debug=1 in the URL — silent no-op for every normal visitor. Remove this
// file and its call sites once the real cause is found and fixed.

export type DebugData = Record<string, unknown>;

declare global {
  interface Window {
    __fpDebug?: DebugData;
  }
}

const EVENT = "fp-debug-update";

export function isDebugOn(): boolean {
  if (typeof window === "undefined") return false;
  return new URLSearchParams(window.location.search).has("debug");
}

export function debugLog(key: string, value: unknown): void {
  if (!isDebugOn()) return;
  if (!window.__fpDebug) window.__fpDebug = {};
  window.__fpDebug[key] = value;
  window.dispatchEvent(new CustomEvent(EVENT));
}

export function subscribeDebug(cb: () => void): () => void {
  window.addEventListener(EVENT, cb);
  return () => window.removeEventListener(EVENT, cb);
}
