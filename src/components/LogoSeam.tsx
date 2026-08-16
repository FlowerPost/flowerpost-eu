"use client";

import { motion } from "framer-motion";
import { EASE_LUXE, DUR } from "@/lib/motion";

// Sits exactly on the Hero → content boundary and covers it. The seam was
// visible because the Hero's bottom fade landed on flat champagne-sand while
// the content below carries grain + drifting color blobs — two near-identical
// tones meeting in a straight line, which the eye reads as a hard edge. The
// Hero canvas is now masked (dissolves into the real shared background), and
// this brand mark turns what's left of that transition into a composed
// moment instead of a defect.
//
// Drawn as SVG rather than placed as a raster logo: it stays crisp at every
// size and DPR, needs no asset file, and — the part a flat PNG can't do —
// the metal is built from real layers. A dark extruded copy sits behind the
// face for depth, the face carries a banded gold gradient (the bands are
// what make metal read as metal instead of as a yellow fill), and a soft
// white copy offset up-left supplies the lit bevel edge.
export function LogoSeam() {
  return (
    <div className="relative z-10 -mt-[12vh] mb-4 flex justify-center px-8 md:-mt-[15vh]">
      <motion.div
        initial={{ opacity: 0, y: 22 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-10% 0px -10% 0px" }}
        transition={{ duration: DUR.base, ease: EASE_LUXE }}
        className="relative w-full max-w-3xl"
      >
        {/* Warm halo — gives the mark a surface to sit on and further softens
            the tonal step across the seam. */}
        <div
          className="pointer-events-none absolute -inset-x-20 -inset-y-12 rounded-[50%] blur-3xl"
          style={{
            backgroundImage:
              "radial-gradient(ellipse, rgba(247,241,232,0.85), rgba(237,225,206,0.3) 55%, transparent 75%)",
          }}
          aria-hidden
        />

        <svg
          viewBox="0 0 1200 340"
          className="relative w-full"
          role="img"
          aria-label="FLOWERPOST — made to brighten your day"
        >
          <defs>
            {/* Banded metallic gold. The mid-tone dips are specular
                transitions; without them this reads as flat mustard. */}
            <linearGradient id="fpGold" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#f7e7c1" />
              <stop offset="18%" stopColor="#e3c98d" />
              <stop offset="38%" stopColor="#b58a45" />
              <stop offset="52%" stopColor="#d9bd82" />
              <stop offset="70%" stopColor="#f2ddb0" />
              <stop offset="86%" stopColor="#b8903f" />
              <stop offset="100%" stopColor="#8f6a2f" />
            </linearGradient>

            <linearGradient id="fpGoldSoft" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#e6cf9c" />
              <stop offset="55%" stopColor="#c19a52" />
              <stop offset="100%" stopColor="#9c7534" />
            </linearGradient>

            {/* Lift off the page — tight contact shadow plus a wider,
                softer one, the same pairing that reads as depth on the
                StoryScene card. */}
            <filter id="fpLift" x="-25%" y="-40%" width="150%" height="200%">
              <feDropShadow
                dx="0"
                dy="2"
                stdDeviation="2"
                floodColor="#2b2420"
                floodOpacity="0.3"
              />
              <feDropShadow
                dx="0"
                dy="10"
                stdDeviation="14"
                floodColor="#2b2420"
                floodOpacity="0.18"
              />
            </filter>

            {/* Bordeaux cast for the tagline — the small caps sit on a light
                background at a hairline weight, so a neutral grey shadow just
                muddies them. A warm bordeaux offset separates the letters from
                the page and ties them to the brand's accent colour. */}
            <filter id="fpTagline" x="-15%" y="-120%" width="130%" height="360%">
              <feDropShadow
                dx="0"
                dy="1.5"
                stdDeviation="0.6"
                floodColor="#5c1a24"
                floodOpacity="0.75"
              />
              <feDropShadow
                dx="0"
                dy="3"
                stdDeviation="4"
                floodColor="#5c1a24"
                floodOpacity="0.4"
              />
            </filter>
          </defs>

          <g filter="url(#fpLift)">
            {/* --- wordmark ---------------------------------------------
                textTransform/letterSpacing are reset explicitly: the global
                body rule sets uppercase + 0.22em tracking, and that cascades
                into SVG <text>. Inherited, it renders the mark as spaced-out
                caps and shoves the two words into each other.

                Positioned by anchor (flower ends before the rose, post
                starts after it) rather than by fixed x offsets, so the
                layout can't collide if the font metrics differ at all from
                what a hardcoded width would assume. */}
            <g
              style={{
                fontFamily: "var(--font-logo), Georgia, serif",
                textTransform: "none",
                letterSpacing: "normal",
              }}
              fontSize="176"
              fontWeight={400}
            >
              {/* extruded body */}
              <g fill="#6d5228" opacity="0.5" transform="translate(3.5 4.5)">
                <text x="565" y="206" textAnchor="end">
                  flower
                </text>
                <text x="742" y="206" textAnchor="start">
                  post
                </text>
              </g>

              {/* lit bevel edge */}
              <g fill="#fffaf0" opacity="0.5" transform="translate(-1.5 -2)">
                <text x="565" y="206" textAnchor="end">
                  flower
                </text>
                <text x="742" y="206" textAnchor="start">
                  post
                </text>
              </g>

              {/* metal face */}
              <g fill="url(#fpGold)">
                <text x="565" y="206" textAnchor="end">
                  flower
                </text>
                <text x="742" y="206" textAnchor="start">
                  post
                </text>
              </g>
            </g>

            {/* --- rose mark -------------------------------------------- */}
            {/* Line-art rose, stroked rather than filled to match the
                wordmark's hairline weight. Sits in the gap between the two
                words, baseline-aligned with them. */}
            <g
              transform="translate(653 120)"
              fill="none"
              stroke="url(#fpGoldSoft)"
              strokeWidth="6"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              {/* bud — egg silhouette, tapering toward the calyx */}
              <path d="M0,-74 C27,-74 45,-52 45,-26 C45,2 26,26 0,36 C-26,26 -45,2 -45,-26 C-45,-52 -27,-74 0,-74 Z" />
              {/* the two outer petals folding in over the bud — these are
                  what stop the outline reading as a plain oval */}
              <path d="M-45,-26 C-41,-52 -21,-63 -3,-56" />
              <path d="M45,-26 C41,-52 21,-63 3,-56" />
              {/* inner furl, kept small and centred: spanning the full width
                  is what made this read as an eye rather than a rose */}
              <path d="M-15,-30 C-15,-43 14,-42 13,-28 C12,-17 -3,-17 -3,-27" />
              {/* calyx */}
              <path d="M-26,16 C-15,30 15,30 26,16" />
              {/* stem */}
              <path d="M0,36 L0,116" />
              {/* leaves, riding the stem rather than floating under it */}
              <path d="M-2,60 C-22,42 -50,42 -63,52 C-50,74 -20,80 -2,60 Z" />
              <path d="M2,78 C22,60 50,60 63,70 C50,92 20,98 2,78 Z" />
            </g>

            {/* --- tagline ---------------------------------------------- */}
            <text
              x="600"
              y="300"
              textAnchor="middle"
              fill="url(#fpGoldSoft)"
              filter="url(#fpTagline)"
              style={{
                fontFamily: "var(--font-playfair), sans-serif",
                textTransform: "none",
              }}
              fontSize="26"
              fontWeight={500}
              letterSpacing="10"
            >
              MADE TO BRIGHTEN YOUR DAY
            </text>
          </g>
        </svg>
      </motion.div>
    </div>
  );
}
