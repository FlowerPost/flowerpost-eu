"use client";

import { motion } from "framer-motion";
import { AmbientVideo } from "@/components/AmbientVideo";
import { fadeUp } from "@/lib/motion";

const clips = [
  { src: "/videos/bouquet-red.mp4", label: "Букет червени рози в ръце", caption: "Подготовка" },
  { src: "/videos/be-my-love.mp4", label: "Рози до светеща табела", caption: "Поводът" },
  { src: "/videos/love-vase.mp4", label: "Рози във ваза до светеща табела", caption: "У дома" },
];

export function VideoStrip() {
  return (
    <section className="px-8 py-28 md:px-14 md:py-40 lg:py-56">
      <div className="mx-auto max-w-7xl">
        <motion.div {...fadeUp} className="mb-14 max-w-2xl md:mb-20">
          <span className="tf-mono mb-6 block text-bordeaux">В движение</span>
          <h2 className="tf-headline text-ink">
            Мигът, <em className="text-bordeaux">заснет</em>
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
          {clips.map((clip, i) => (
            <motion.figure
              key={clip.src}
              {...fadeUp}
              transition={{ ...fadeUp.transition, delay: i * 0.1 }}
              className="group"
            >
              {/* Same layered shadow as the StoryScene card — a tight contact
                  shadow plus a wide soft one — so these read as objects
                  resting on the page rather than flat inset rectangles. */}
              <div className="relative aspect-[9/16] overflow-hidden rounded-lg shadow-[0_1px_2px_rgba(43,36,32,0.2),0_2px_6px_rgba(43,36,32,0.16),0_24px_50px_-18px_rgba(43,36,32,0.45)] ring-1 ring-black/5">
                <AmbientVideo
                  src={clip.src}
                  label={clip.label}
                  className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                />
              </div>
              <figcaption className="tf-mono mt-4 text-stone">{clip.caption}</figcaption>
            </motion.figure>
          ))}
        </div>
      </div>
    </section>
  );
}
