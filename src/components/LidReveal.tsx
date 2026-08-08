"use client";

import { useRef } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";

export function LidReveal() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const lidRotate = useTransform(scrollYProgress, [0.1, 0.65], [0, -100]);
  const lidOpacity = useTransform(scrollYProgress, [0.4, 0.7], [1, 0]);
  const rosesOpacity = useTransform(scrollYProgress, [0.25, 0.65], [0, 1]);
  const rosesScale = useTransform(scrollYProgress, [0.25, 0.65], [0.96, 1]);

  return (
    <section ref={containerRef} className="relative h-[220vh] bg-ink">
      <div className="sticky top-0 flex h-screen items-center justify-center overflow-hidden">
        <div
          className="relative h-80 w-64 md:h-[26rem] md:w-[20rem]"
          style={{ perspective: "1400px" }}
        >
          <motion.div
            style={{ opacity: rosesOpacity, scale: rosesScale }}
            className="absolute inset-0 overflow-hidden border border-bordeaux/40"
          >
            <Image
              src="/images/box-open-roses.jpg"
              alt="Отворена кутия FLOWERPOST, разкриваща бордо рози върху копринена хартия"
              fill
              loading="lazy"
              sizes="(min-width: 768px) 20rem, 16rem"
              className="object-cover"
            />
          </motion.div>

          <motion.div
            style={{
              rotateX: lidRotate,
              opacity: lidOpacity,
              transformOrigin: "top center",
              transformStyle: "preserve-3d",
            }}
            className="absolute inset-0 overflow-hidden border border-gold/50 shadow-[0_20px_60px_rgba(0,0,0,0.4)]"
          >
            <Image
              src="/images/box-closed.jpg"
              alt="Затворена кутия FLOWERPOST с панделка"
              fill
              sizes="(min-width: 768px) 20rem, 16rem"
              className="object-cover"
            />
          </motion.div>
        </div>

        <span className="tf-mono absolute bottom-12 left-1/2 -translate-x-1/2 text-ivory/50">
          Скролни, за да отвориш
        </span>
      </div>
    </section>
  );
}
