"use client";

import { motion } from "framer-motion";
import { fadeUp } from "@/lib/motion";

const facts = [
  { value: "3", label: "Партньорски ферми" },
  { value: "24ч", label: "От брането до вратата" },
  { value: "100%", label: "Проследим произход" },
];

export function TrustScene() {
  return (
    <section className="px-8 py-28 md:px-14 md:py-40 lg:py-56">
      <div className="mx-auto max-w-7xl">
        <motion.div {...fadeUp} className="mb-20 max-w-lg">
          <span className="tf-mono mb-6 block text-bordeaux">Произход</span>
          <h2 className="tf-headline text-ink">
            От фермата <em className="text-bordeaux">до твоята кутия</em>
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 gap-14 border-t border-ink/15 pt-14 sm:grid-cols-3">
          {facts.map((fact, i) => (
            <motion.div
              key={fact.label}
              {...fadeUp}
              transition={{ ...fadeUp.transition, delay: i * 0.1 }}
            >
              <div className="tf-display mb-4 text-ink" style={{ fontSize: "clamp(3.5rem, 6vw, 5.5rem)" }}>
                {fact.value}
              </div>
              <div className="tf-mono text-stone">{fact.label}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
