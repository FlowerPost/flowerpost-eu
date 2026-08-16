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
    <section id="story" className="px-8 py-28 md:px-14 md:py-40 lg:py-56">
      <div className="mx-auto max-w-7xl">
        <motion.div {...fadeUp} className="mb-16 md:mb-20">
          <span className="tf-mono mb-6 block text-bordeaux">Историята</span>
          <h2 className="tf-headline max-w-3xl text-ink">
            Не декорация. <em className="text-bordeaux">Ритуал.</em>
          </h2>
        </motion.div>

        <div className="flex flex-col gap-14 md:flex-row md:items-start md:gap-20">
          <div className="flex flex-1 flex-col gap-8">
            {paragraphs.map((p, i) => (
              <motion.p
                key={p}
                {...fadeUp}
                transition={{ ...fadeUp.transition, delay: i * 0.1 }}
                className="tf-quote max-w-xl text-stone"
              >
                {p}
              </motion.p>
            ))}
          </div>

          <motion.figure
            {...fadeUp}
            transition={{ ...fadeUp.transition, delay: 0.15 }}
            className="w-full shrink-0 md:w-96"
          >
            {/* Layered shadow — a tight, dark contact shadow close to the
                edge plus a soft, diffused one further out — is what reads
                as an object actually resting above the page, not just a
                flat photo with a drop-shadow filter slapped on. */}
            <div className="relative aspect-[16/10] overflow-hidden rounded-lg shadow-[0_1px_2px_rgba(43,36,32,0.2),0_2px_6px_rgba(43,36,32,0.18),0_28px_60px_-16px_rgba(43,36,32,0.5)] ring-1 ring-black/5">
              <Image
                src="/images/box-gift-marble.jpg"
                alt="FLOWERPOST подаръчна кутия с панделка до букет бели рози на мраморен плот"
                fill
                sizes="(min-width: 768px) 24rem, 90vw"
                className="object-cover"
              />
            </div>
            <figcaption className="tf-mono mt-4 text-stone">Кутията, готова за отваряне</figcaption>
          </motion.figure>
        </div>
      </div>
    </section>
  );
}
