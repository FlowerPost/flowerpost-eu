"use client";

import Image from "next/image";
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
    <section id="product" className="py-28 md:py-40 lg:py-56">
      <motion.div {...fadeUp} className="relative aspect-[4/5] w-full overflow-hidden md:aspect-[16/9]">
        <Image
          src="/images/box-open-roses.jpg"
          alt="Отворена кутия FLOWERPOST с рози"
          fill
          sizes="100vw"
          className="object-cover"
        />
        <div
          className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent"
          aria-hidden
        />
        <div className="absolute inset-x-0 bottom-0 px-8 pb-14 md:px-14 md:pb-20">
          <div className="mx-auto max-w-7xl">
            <span className="tf-mono mb-6 block text-gold">Кутиите</span>
            <h2 className="tf-headline max-w-2xl text-ivory">
              Избери своя <em className="text-ribbon">ритъм</em>
            </h2>
          </div>
        </div>
      </motion.div>

      <div className="mx-auto mt-16 max-w-7xl px-8 md:mt-20 md:px-14">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {tiers.map((tier, i) => (
            <motion.div
              key={tier.id}
              {...fadeUp}
              transition={{ ...fadeUp.transition, delay: i * 0.1 }}
              className="relative bg-ivory p-10"
            >
              {tier.badge && (
                <span className="tf-mono absolute -top-3 left-8 bg-bordeaux px-3 py-1 text-ivory">
                  {tier.badge}
                </span>
              )}

              <h3 className="tf-headline mb-2 text-ink" style={{ fontSize: "2rem" }}>
                {tier.name}
              </h3>

              <div className="mb-10">
                <span className="tf-display text-bordeaux" style={{ fontSize: "3.5rem" }}>
                  {tier.price}
                </span>
                <span className="tf-mono ml-2 text-stone">лв / кутия</span>
              </div>

              <div className="mb-10 space-y-2 border-t border-gold/20 pt-6">
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
