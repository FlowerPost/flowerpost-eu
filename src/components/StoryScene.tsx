"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { fadeUp } from "@/lib/motion";

const paragraphs = [
  "В България цветята се предават от поколение на поколение — не като стока, а като език.",
  "Всяка кутия FLOWERPOST носи provenance карта — знаеш точно чия ръка е брала розите ти и в кой ден.",
  "Не продаваме букети. Изпращаме доказателство за внимание.",
];

export function StoryScene() {
  return (
    <section id="story" className="bg-ivory px-8 py-32 md:px-14 md:py-48">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-16 md:grid-cols-[0.4fr_0.6fr]">
        <motion.div {...fadeUp}>
          <span className="tf-mono mb-6 flex items-center gap-3 text-bordeaux">
            <span>01</span>
            <span className="h-px flex-1 bg-gold/30" />
            Историята
          </span>
          <h2 className="tf-headline mb-10 max-w-xs text-ink">
            Не декорация. <em className="text-bordeaux">Ритуал.</em>
          </h2>

          <div className="relative aspect-[3/2] w-full overflow-hidden border border-gold/25">
            <Image
              src="/images/provenance-card.jpg"
              alt="Provenance картичка FLOWERPOST"
              fill
              sizes="(min-width: 768px) 30rem, 90vw"
              className="object-cover"
            />
          </div>
        </motion.div>

        <div className="flex flex-col gap-10">
          {paragraphs.map((p, i) => (
            <motion.p
              key={p}
              {...fadeUp}
              transition={{ ...fadeUp.transition, delay: i * 0.1 }}
              className="tf-quote max-w-xl text-ink"
            >
              {p}
            </motion.p>
          ))}
        </div>
      </div>
    </section>
  );
}
