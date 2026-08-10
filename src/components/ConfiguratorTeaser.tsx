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
    <section className="bg-ink py-28 md:py-40 lg:py-56">
      <motion.div {...fadeUp} className="relative aspect-[4/5] w-full overflow-hidden md:aspect-[16/9]">
        <Image
          src="/images/box-closed.jpg"
          alt="Затворена кутия FLOWERPOST — предварителен изглед на конфигуратора"
          fill
          sizes="100vw"
          className="object-cover"
        />
        <div
          className="pointer-events-none absolute inset-0 transition-colors duration-500"
          style={{ backgroundColor: activeHex, mixBlendMode: "color", opacity: 0.55 }}
          aria-hidden
        />
        <div
          className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent"
          aria-hidden
        />

        <div className="absolute inset-x-0 bottom-0 px-8 pb-14 md:px-14 md:pb-20">
          <div className="mx-auto max-w-7xl">
            <span className="tf-mono mb-6 block text-gold">Скоро</span>
            <h2 className="tf-headline mb-6 max-w-2xl text-ivory">
              Изгради <em className="text-ribbon">своята кутия</em>
            </h2>
            <p className="tf-body mb-10 max-w-md">
              Персонализиран конфигуратор идва скоро. Избери палитра предварително.
            </p>

            <div className="flex gap-4">
              {palette.map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => setSelected(p.id)}
                  aria-pressed={selected === p.id}
                  className={`h-12 w-12 border transition-all duration-200 ${
                    selected === p.id
                      ? "border-ivory scale-110"
                      : "border-ivory/30"
                  }`}
                  style={{ backgroundColor: p.hex }}
                  aria-label={p.label}
                />
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
