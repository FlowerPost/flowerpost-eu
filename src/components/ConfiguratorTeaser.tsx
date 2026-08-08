"use client";

import { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { fadeUp } from "@/lib/motion";

const palette = [
  { id: "bordeaux", label: "Бордо", hex: "#5c1a24" },
  { id: "ivory", label: "Айвъри", hex: "#f7f1e8" },
  { id: "gold", label: "Злато", hex: "#b08d57" },
];

export function ConfiguratorTeaser() {
  const [selected, setSelected] = useState(palette[0].id);
  const activeHex = palette.find((p) => p.id === selected)?.hex ?? palette[0].hex;

  return (
    <section className="bg-ivory px-8 py-32 md:px-14 md:py-48">
      <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-16 md:grid-cols-2">
        <motion.div {...fadeUp}>
          <span className="tf-mono mb-6 flex items-center gap-3 text-bordeaux">
            <span>03</span>
            <span className="h-px flex-1 bg-gold/30" />
            Скоро
          </span>
          <h2 className="tf-headline mb-6 max-w-md text-ink">
            Изгради <em className="text-bordeaux">своята кутия</em>
          </h2>
          <p className="tf-body mb-10 max-w-sm">
            Персонализиран конфигуратор идва скоро. Избери палитра предварително.
          </p>

          <div className="flex gap-4">
            {palette.map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => setSelected(p.id)}
                aria-pressed={selected === p.id}
                className={`h-11 w-11 border transition-all duration-200 ${
                  selected === p.id
                    ? "border-ink scale-110"
                    : "border-gold/30"
                }`}
                style={{ backgroundColor: p.hex }}
                aria-label={p.label}
              />
            ))}
          </div>
        </motion.div>

        <motion.div
          {...fadeUp}
          transition={{ ...fadeUp.transition, delay: 0.15 }}
          className="relative aspect-square overflow-hidden border border-gold/25"
        >
          <Image
            src="/images/box-closed.jpg"
            alt="Затворена кутия FLOWERPOST — предварителен изглед на конфигуратора"
            fill
            sizes="(min-width: 768px) 34rem, 90vw"
            className="object-cover"
          />
          <div
            className="pointer-events-none absolute inset-0 transition-colors duration-500"
            style={{ backgroundColor: activeHex, mixBlendMode: "color", opacity: 0.55 }}
            aria-hidden
          />
        </motion.div>
      </div>
    </section>
  );
}
