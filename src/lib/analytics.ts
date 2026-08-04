import type { AnalyticsEvent } from "./config";

const CONSENT_KEY = "fp_cookie_consent";

export interface CookieConsent {
  necessary: true;
  analytics: boolean;
  marketing: boolean;
  decidedAt: string;
}

export function readConsent(): CookieConsent | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(CONSENT_KEY);
    return raw ? (JSON.parse(raw) as CookieConsent) : null;
  } catch {
    return null;
  }
}

export function writeConsent(consent: Omit<CookieConsent, "necessary" | "decidedAt">) {
  if (typeof window === "undefined") return;
  const value: CookieConsent = {
    necessary: true,
    analytics: consent.analytics,
    marketing: consent.marketing,
    decidedAt: new Date().toISOString(),
  };
  window.localStorage.setItem(CONSENT_KEY, JSON.stringify(value));
  window.dispatchEvent(new CustomEvent("fp:consent-changed", { detail: value }));
}

/**
 * Event tracking слой. Събитията се буферират в dataLayer само при дадено
 * съгласие за аналитични бисквитки. Без съгласие не се зарежда нищо.
 */
export function track(event: AnalyticsEvent, payload: Record<string, unknown> = {}) {
  if (typeof window === "undefined") return;
  const consent = readConsent();
  if (!consent?.analytics) return;
  const w = window as unknown as { dataLayer?: unknown[] };
  w.dataLayer = w.dataLayer || [];
  w.dataLayer.push({ event, ...payload, ts: Date.now() });
}
