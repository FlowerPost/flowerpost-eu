import { PRICING_DEFAULTS, DELIVERY_DEFAULTS } from "./config";

export interface PricingConfig {
  basePriceCents: number;
  baseRoseCount: number;
  roseStep: number;
  stepPriceCents: number;
  minRoses: number;
  maxRoses: number;
}

export interface DeliveryConfig {
  sofiaShippingCents: number;
  countryShippingCents: number;
  leadTimeDays: number;
  maxDeliveriesPerDay: number;
  slots: string[];
}

export const defaultPricing: PricingConfig = { ...PRICING_DEFAULTS };
export const defaultDelivery: DeliveryConfig = {
  ...DELIVERY_DEFAULTS,
  slots: [...DELIVERY_DEFAULTS.slots],
};

/** Централна ценова функция — единственият източник на истина за цената на кутия. */
export function roseBoxPriceCents(
  roseCount: number,
  config: PricingConfig = defaultPricing,
): number {
  const clamped = Math.min(Math.max(roseCount, config.minRoses), config.maxRoses);
  const steps = Math.max(0, Math.round((clamped - config.baseRoseCount) / config.roseStep));
  return config.basePriceCents + steps * config.stepPriceCents;
}

/** Всички валидни варианти брой рози за конфигуратора. */
export function roseCountOptions(config: PricingConfig = defaultPricing): number[] {
  const options: number[] = [];
  for (let n = config.minRoses; n <= config.maxRoses; n += config.roseStep) options.push(n);
  return options;
}

export function shippingCents(
  deliveryType: string,
  config: DeliveryConfig = defaultDelivery,
): number {
  return deliveryType === "sofia" ? config.sofiaShippingCents : config.countryShippingCents;
}

export function formatPrice(cents: number): string {
  return new Intl.NumberFormat("bg-BG", {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: cents % 100 === 0 ? 0 : 2,
    maximumFractionDigits: 2,
  }).format(cents / 100);
}

export function formatDateBg(value: string | Date): string {
  const date = typeof value === "string" ? new Date(value) : value;
  if (Number.isNaN(date.getTime())) return "—";
  return new Intl.DateTimeFormat("bg-BG", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);
}

/** Най-ранната възможна дата за доставка (ISO YYYY-MM-DD). */
export function earliestDeliveryDate(leadTimeDays = defaultDelivery.leadTimeDays): string {
  const date = new Date();
  date.setHours(0, 0, 0, 0);
  date.setDate(date.getDate() + leadTimeDays);
  return toISODate(date);
}

export function toISODate(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}
