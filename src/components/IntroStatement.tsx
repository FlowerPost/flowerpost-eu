"use client";

import { motion } from "framer-motion";
import { EASE_LUXE, DUR } from "@/lib/motion";

const viewport = { once: true, margin: "-15% 0px -15% 0px" } as const;

export function IntroStatement() {
  return (
    <section className="relative bg-champagne-sand py-32 md:py-48">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-y-10 px-8 md:grid-cols-[0.38fr_0.62fr] md:gap-x-16 md:px-14">
        <motion.span
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={viewport}
          transition={{ duration: DUR.base, ease: EASE_LUXE }}
          className="tf-mono text-gold md:pt-3"
        >
          Flowerpost · Bulgaria
        </motion.span>

        <div className="max-w-xl">
          <motion.h1
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={viewport}
            transition={{ duration: DUR.base, ease: EASE_LUXE, delay: 0.1 }}
            className="tf-display mb-8 text-ink"
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
            className="tf-body mb-10 max-w-md"
          >
            Рози, берани тази сутрин от сърцето на България. Доставени в кутия,
            направена да се отваря бавно.
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
        </div>
      </div>
    </section>
  );
}
