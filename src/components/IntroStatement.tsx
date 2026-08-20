"use client";

import { motion } from "framer-motion";
import { EASE_LUXE, DUR } from "@/lib/motion";

const viewport = { once: true, margin: "-15% 0px -15% 0px" } as const;

export function IntroStatement() {
  return (
    <section className="relative py-28 md:py-40 lg:py-56">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-y-10 px-8 md:grid-cols-[0.24fr_0.76fr] md:gap-x-16 md:px-14">
        <motion.span
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={viewport}
          transition={{ duration: DUR.base, ease: EASE_LUXE }}
          className="tf-mono text-bordeaux md:pt-3"
        >
          Flowerpost · Bulgaria
        </motion.span>

        {/* max-w-3xl, not max-w-2xl: at 1920px the type scale now grows
            well past its old ceiling (tf-headline hits 4rem instead of
            capping at 3.25rem), and the wider text needs the extra room —
            "Всяко стъбло подбрано на ръка" was wrapping to 3 cramped lines
            inside 672px at the old headline size; it needed the same fix
            from both ends, a bigger box AND bigger type, or the two just
            trade one cramped layout for another. */}
        <div className="max-w-3xl">
          <motion.h1
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={viewport}
            transition={{ duration: DUR.base, ease: EASE_LUXE, delay: 0.1 }}
            className="tf-display mb-10 text-ink"
          >
            Ритуалът
            <br />
            <span className="text-bordeaux">на цветята</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 22 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={viewport}
            transition={{ duration: DUR.base, ease: EASE_LUXE, delay: 0.22 }}
            className="tf-body mb-12 max-w-md"
          >
            Повече от подарък. Повече от цветя.
            <br />
            Подари емоция.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={viewport}
            transition={{ duration: DUR.base, ease: EASE_LUXE, delay: 0.34 }}
            className="flex flex-col gap-4 sm:flex-row"
          >
            <a href="#product" className="btn-bordeaux text-center">
              Разгледай кутиите
            </a>
            <a href="#story" className="btn-gold-outline text-center">
              Историята
            </a>
          </motion.div>

          {/* Relocated from VideoBand — same copy/emphasis split, now
              anchoring the CTA row instead of overlaying the hanging-roses
              clip. */}
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={viewport}
            transition={{ duration: DUR.base, ease: EASE_LUXE, delay: 0.44 }}
            className="tf-headline mt-10 text-ink"
          >
            Всяко стъбло <em className="text-bordeaux">подбрано на ръка</em>
          </motion.p>
        </div>
      </div>
    </section>
  );
}
