"use client";

import { useRef } from "react";
import dynamic from "next/dynamic";
import { motion, useScroll, useTransform } from "framer-motion";

const FlowerpostBox3D = dynamic(
  () => import("@/components/3d/FlowerpostBox").then((mod) => mod.FlowerpostBox3D),
  { ssr: false }
);

export function HeroSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  // scroll cue fades out as soon as the interaction begins
  const cueOpacity = useTransform(scrollYProgress, [0, 0.08], [1, 0]);

  return (
    <section ref={sectionRef} className="relative min-h-[240vh] bg-ivory">
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        <div className="absolute inset-0 z-0">
          <FlowerpostBox3D progress={scrollYProgress} className="h-full w-full" />
        </div>

        <motion.div
          style={{ opacity: cueOpacity }}
          className="pointer-events-none absolute inset-x-0 bottom-10 z-10 flex flex-col items-center gap-3"
          aria-hidden
        >
          <span className="tf-mono text-gold/70">Скрол</span>
          <span className="block h-10 w-px bg-gradient-to-b from-gold/50 to-transparent" />
        </motion.div>
      </div>
    </section>
  );
}
