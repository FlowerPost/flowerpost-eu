"use client";

import { motion } from "framer-motion";
import { AmbientVideo } from "@/components/AmbientVideo";
import { EASE_LUXE, DUR } from "@/lib/motion";

// Full-bleed ambient band. Masked top and bottom for the same reason the
// Hero canvas is: a video meeting the page background along a straight edge
// reads as a pasted-in rectangle, while a dissolve reads as one continuous
// scene. The overlay is a warm scrim, not a grey one, so the footage stays
// in the site's champagne/bordeaux family instead of going cold.
export function VideoBand() {
  return (
    <section className="relative h-[78vh] w-full overflow-hidden md:h-[92vh]">
      <div className="absolute inset-0 [mask-image:linear-gradient(to_bottom,transparent_0%,black_18%,black_82%,transparent_100%)]">
        <AmbientVideo
          src="/videos/roses-hanging.mp4"
          label="Рози, окачени с цветовете надолу"
          className="h-full w-full object-cover"
        />
        <div
          className="pointer-events-none absolute inset-0 bg-gradient-to-b from-[var(--color-champagne-sand)]/35 via-transparent to-[var(--color-champagne-sand)]/45"
          aria-hidden
        />
      </div>

      <div className="relative z-10 flex h-full items-center justify-center px-8">
        <motion.p
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-15% 0px -15% 0px" }}
          transition={{ duration: DUR.base, ease: EASE_LUXE }}
          className="tf-headline max-w-3xl text-center text-ink"
          style={{ textShadow: "0 1px 0 rgba(247,241,232,0.6), 0 8px 24px rgba(43,36,32,0.25)" }}
        >
          Всяко стъбло <em className="text-bordeaux">подбрано на ръка</em>
        </motion.p>
      </div>
    </section>
  );
}
