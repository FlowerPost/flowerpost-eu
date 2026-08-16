"use client";

import { motion, useScroll, useTransform } from "framer-motion";

// The single continuous backdrop for the whole page, Hero included (Hero's
// own section background is transparent, so there is no seam where the
// sticky stage releases).
//
// Colors mirror the pastel studio gradient rendered into the box-reveal
// frames — rose, mint, champagne, bordeaux — so scrolling out of the Hero
// reads as the same room continuing, not a new block starting.
//
// Motion is a slow sine/cosine drift keyed to scroll, NOT `scroll * k`.
// A linear rate looks right for one viewport and then breaks: this page is
// ~14000px tall (the Hero rig alone is 1320vh), so even k=0.1 translates the
// blobs thousands of pixels and parks every one of them off-screen for the
// entire lower half of the site — a flat grey backdrop exactly where the
// content lives. Oscillating keeps each blob near its home position, so the
// drift stays visible from the first pixel to the last. Different periods per
// blob keep them from ever syncing up. Transform-only, so it stays cheap.
export function SiteBackground() {
  const { scrollY } = useScroll();

  const yRose = useTransform(scrollY, (v) => Math.sin(v / 900) * 130);
  const xRose = useTransform(scrollY, (v) => Math.cos(v / 1400) * 70);

  const yMint = useTransform(scrollY, (v) => Math.sin(v / 1300 + 2) * 160);
  const xMint = useTransform(scrollY, (v) => Math.cos(v / 1000 + 1) * -80);

  const yChampagne = useTransform(scrollY, (v) => Math.sin(v / 1700 + 4) * 140);
  const xChampagne = useTransform(scrollY, (v) => Math.cos(v / 1500 + 3) * 60);

  const yBordeaux = useTransform(scrollY, (v) => Math.sin(v / 1100 + 5) * -120);
  const xBordeaux = useTransform(scrollY, (v) => Math.cos(v / 1800 + 2) * 75);

  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden" aria-hidden>
      <motion.div
        style={{
          y: yRose,
          x: xRose,
          backgroundImage:
            "radial-gradient(circle, rgba(240,190,203,0.85), transparent 70%)",
        }}
        className="absolute -top-1/3 -left-1/4 h-[95vmax] w-[95vmax] rounded-full blur-3xl"
      />
      <motion.div
        style={{
          y: yMint,
          x: xMint,
          backgroundImage:
            "radial-gradient(circle, rgba(188,220,203,0.7), transparent 70%)",
        }}
        className="absolute top-0 -right-1/4 h-[100vmax] w-[100vmax] rounded-full blur-3xl"
      />
      <motion.div
        style={{
          y: yChampagne,
          x: xChampagne,
          backgroundImage:
            "radial-gradient(circle, rgba(219,193,146,0.75), transparent 70%)",
        }}
        className="absolute top-1/2 left-1/4 h-[90vmax] w-[90vmax] rounded-full blur-3xl"
      />
      <motion.div
        style={{
          y: yBordeaux,
          x: xBordeaux,
          backgroundImage:
            "radial-gradient(circle, rgba(92,26,36,0.18), transparent 70%)",
        }}
        className="absolute -bottom-1/3 right-1/4 h-[80vmax] w-[80vmax] rounded-full blur-3xl"
      />
    </div>
  );
}
