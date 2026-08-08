"use client";

import { motion } from "framer-motion";
import { fadeUp } from "@/lib/motion";

interface Tier {
  id: string;
  name: string;
  price: number;
  stems: string;
  origin: string;
  badge?: string;
}

const tiers: Tier[] = [
  { id: "mini", name: "Mini", price: 39, stems: "8–10", origin: "Тракийска низина" },
  {
    id: "classic",
    name: "Classic",
    price: 79,
    stems: "18–22",
    origin: "Долината на розите",
    badge: "Signature",
  },
  { id: "luxury", name: "Luxury", price: 149, stems: "35–40", origin: "Казанлък" },
];

export function ProductScene() {
  return (
    <section id="product" className="bg-champagne-sand px-8 py-32 md:px-14 md:py-48">
      <div className="mx-auto max-w-7xl">
        <motion.div {...fadeUp} className="mb-16 max-w-lg">
          <span className="tf-mono mb-6 flex items-center gap-3 text-bordeaux">
            <span>02</span>
            <span className="h-px flex-1 bg-gold/30" />
            Кутиите
          </span>
          <h2 className="tf-headline text-ink">
            Избери своя <em className="text-bordeaux">ритъм</em>
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {tiers.map((tier, i) => (
            <motion.div
              key={tier.id}
              {...fadeUp}
              transition={{ ...fadeUp.transition, delay: i * 0.1 }}
              className="relative border border-gold/25 bg-ivory p-8"
            >
              {tier.badge && (
                <span className="tf-mono absolute -top-3 left-6 bg-bordeaux px-3 py-1 text-ivory">
                  {tier.badge}
                </span>
              )}

              <h3 className="tf-headline mb-1 text-ink" style={{ fontSize: "1.75rem" }}>
                {tier.name}
              </h3>

              <div className="mb-8">
                <span className="tf-display text-bordeaux" style={{ fontSize: "2.75rem" }}>
                  {tier.price}
                </span>
                <span className="tf-mono ml-2 text-stone">лв / кутия</span>
              </div>

              <div className="mb-8 space-y-2 border-t border-gold/20 pt-6">
                <div className="flex justify-between font-[var(--font-space-mono)] text-xs">
                  <span className="text-stone">Стръкове</span>
                  <span className="text-ink">{tier.stems}</span>
                </div>
                <div className="flex justify-between font-[var(--font-space-mono)] text-xs">
                  <span className="text-stone">Произход</span>
                  <span className="text-ink">{tier.origin}</span>
                </div>
              </div>

              <button className="btn-gold-outline w-full">Избери {tier.name}</button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
