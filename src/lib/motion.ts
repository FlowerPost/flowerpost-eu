export const EASE_LUXE = [0.22, 1, 0.36, 1] as const;
export const EASE_SOFT = [0.4, 0, 0.2, 1] as const;

export const DUR = {
  fast: 0.25,
  base: 0.6,
  slow: 1.1,
  epic: 1.8,
} as const;

export const fadeUp = {
  initial: { opacity: 0, y: 32 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-15% 0px -15% 0px" },
  transition: { duration: DUR.base, ease: EASE_LUXE },
};
