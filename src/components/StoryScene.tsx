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
    <section id="story" className="bg-ink px-8 py-28 md:px-14 md:py-40 lg:py-56">
      <div className="mx-auto max-w-7xl">
        <motion.div {...fadeUp} className="mb-16 md:mb-20">
          <span className="tf-mono mb-6 block text-gold">Историята</span>
          <h2 className="tf-headline max-w-3xl text-ivory">
            Не декорация. <em className="text-ribbon">Ритуал.</em>
          </h2>
        </motion.div>

        <div className="flex flex-col gap-14 md:flex-row md:items-start md:gap-20">
          <div className="flex flex-1 flex-col gap-8">
            {paragraphs.map((p, i) => (
              <motion.p
                key={p}
                {...fadeUp}
                transition={{ ...fadeUp.transition, delay: i * 0.1 }}
                className="tf-quote max-w-xl text-mist"
              >
                {p}
              </motion.p>
            ))}
          </div>

          <motion.figure
            {...fadeUp}
            transition={{ ...fadeUp.transition, delay: 0.15 }}
            className="w-full shrink-0 md:w-64"
          >
            <div className="relative aspect-[3/2] overflow-hidden shadow-[0_8px_40px_rgba(0,0,0,0.35)]">
              <Image
                src="/images/provenance-card.jpg"
                alt="Provenance картичка FLOWERPOST"
                fill
                sizes="(min-width: 768px) 16rem, 90vw"
                className="object-cover"
              />
            </div>
            <figcaption className="tf-mono mt-4 text-mist">Provenance карта</figcaption>
          </motion.figure>
        </div>
      </div>
    </section>
  );
}
