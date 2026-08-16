"use client";

import { motion } from "framer-motion";
import { fadeUp } from "@/lib/motion";

// Placeholder quotes until real submissions come in from the QR-code
// provenance card (printed, frozen — see /otzivi). Swap this array for
// fetched reviews once there's a data source; layout below doesn't change.
const testimonials = [
  {
    quote: "Отварянето наистина се усеща като ритуал, не като разопаковане.",
    author: "Мария, София",
  },
  {
    quote: "Розите миришеха сякаш още бяха на полето. Картата с произхода беше приятна изненада.",
    author: "Ивайло, Пловдив",
  },
  {
    quote: "Поръчах Classic за годишнина — кутията сама по себе си беше половината подарък.",
    author: "Симона, Варна",
  },
];

export function ReviewsTeaser() {
  return (
    <section className="px-8 py-28 md:px-14 md:py-40 lg:py-56">
      <div className="mx-auto max-w-7xl">
        <motion.div {...fadeUp} className="mb-16 max-w-2xl md:mb-20">
          <span className="tf-mono mb-6 block text-bordeaux">Отзиви</span>
          <h2 className="tf-headline mb-6 text-ink">
            Твоят глас, <em className="text-bordeaux">чут</em>
          </h2>
          <p className="tf-body max-w-md">
            Всяка кутия FLOWERPOST носи provenance карта с QR код — сканирай я
            и остави отзив за своя ритуал на отваряне. Ето какво споделят
            други, преди да поръчаш.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {testimonials.map((t, i) => (
            <motion.figure
              key={t.author}
              {...fadeUp}
              transition={{ ...fadeUp.transition, delay: i * 0.1 }}
              className="bg-ivory p-8 shadow-[0_8px_40px_rgba(0,0,0,0.12)]"
            >
              <blockquote className="tf-quote mb-6 text-ink">“{t.quote}”</blockquote>
              <figcaption className="tf-mono text-stone">{t.author}</figcaption>
            </motion.figure>
          ))}
        </div>

        <motion.div {...fadeUp} transition={{ ...fadeUp.transition, delay: 0.3 }} className="mt-14">
          <a href="/otzivi" className="btn-bordeaux inline-block w-fit">
            Остави своя отзив
          </a>
        </motion.div>
      </div>
    </section>
  );
}
