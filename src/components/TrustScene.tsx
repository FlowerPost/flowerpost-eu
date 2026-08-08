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
    <section className="border-t border-gold/20 bg-champagne-sand px-8 py-32 md:px-14 md:py-48">
      <div className="mx-auto max-w-7xl">
        <motion.div {...fadeUp} className="mb-16 max-w-lg">
          <span className="tf-mono mb-6 flex items-center gap-3 text-bordeaux">
            <span>04</span>
            <span className="h-px flex-1 bg-gold/30" />
            Произход
          </span>
          <h2 className="tf-headline text-ink">
            От фермата <em className="text-bordeaux">до твоята кутия</em>
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 gap-10 border-t border-gold/20 pt-10 sm:grid-cols-3">
          {facts.map((fact, i) => (
            <motion.div
              key={fact.label}
              {...fadeUp}
              transition={{ ...fadeUp.transition, delay: i * 0.1 }}
            >
              <div className="tf-display mb-2 text-bordeaux" style={{ fontSize: "3rem" }}>
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
