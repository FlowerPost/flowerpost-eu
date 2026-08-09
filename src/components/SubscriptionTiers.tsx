'use client';

import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import { Check, ChevronRight, ChevronLeft } from 'lucide-react';

const tiers = [
  {
    name: 'Mini',
    emoji: '🌱',
    price: 29,
    features: [
      { label: 'Брой стръкове', value: '8-10' },
      { label: 'Доставка', value: 'Седмично' },
      { label: 'Произход', value: 'Софийски регион' },
    ],
    highlight: false,
  },
  {
    name: 'Classic',
    emoji: '🌹',
    price: 59,
    features: [
      { label: 'Брой стръкове', value: '12-15' },
      { label: 'Доставка', value: 'Седмично' },
      { label: 'Произход', value: 'Долината на розите' },
    ],
    highlight: true,
  },
  {
    name: 'Luxury',
    emoji: '🌺',
    price: 99,
    features: [
      { label: 'Брой стръкове', value: '20-25' },
      { label: 'Доставка', value: 'Седмично' },
      { label: 'Произход', value: 'Всички регионе' },
    ],
    highlight: false,
  },
];

export function SubscriptionTiers() {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = 400;
      scrollContainerRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  return (
    <section className="py-24 bg-white">
      <div className="container mx-auto px-6">
        {/* Section title - asymmetric */}
        <motion.div
          className="mb-16"
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h2 className="text-6xl lg:text-7xl font-serif font-bold text-terra-800 mb-2">
            Избери своя
          </h2>
          <h2 className="text-6xl lg:text-7xl font-serif font-bold text-sage-500 mb-4">
            ритуал
          </h2>
          <p className="text-terra-800/60 font-mono max-w-xl">
            Три нива на свежина. Всеки букет е събран с любов от нашите партньорски ферми.
          </p>
        </motion.div>

        {/* Horizontal scroll container */}
        <div className="relative">
          {/* Left scroll button */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            onClick={() => scroll('left')}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-12 h-12 bg-terra-800 text-sand-50 rounded-full flex items-center justify-center shadow-lg hover:bg-opacity-90 transition-all"
          >
            <ChevronLeft className="w-6 h-6" />
          </motion.button>

          {/* Scrollable container */}
          <div
            ref={scrollContainerRef}
            className="overflow-x-auto pb-4 scroll-smooth scrollbar-hide"
            style={{ scrollBehavior: 'smooth' }}
          >
            <div className="flex gap-6 px-20 min-w-min">
              {tiers.map((tier, index) => (
                <motion.div
                  key={tier.name}
                  className={`flex-shrink-0 w-80 p-8 border-3 transition-all duration-300 ${
                    tier.highlight
                      ? 'border-sage-500 bg-gradient-to-b from-sage-500/15 to-sand-50 shadow-xl'
                      : 'border-terra-800 bg-white hover:shadow-lg'
                  }`}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.6 }}
                  viewport={{ once: true }}
                  whileHover={tier.highlight ? { scale: 1.05 } : undefined}
                >
                  {/* Premium badge */}
                  {tier.highlight && (
                    <div className="absolute -top-4 left-8">
                      <span className="inline-block bg-sage-500 text-sand-50 px-3 py-1 text-xs font-mono font-bold uppercase tracking-wider rounded-full">
                        Препоръчвано
                      </span>
                    </div>
                  )}

                  {/* Emoji */}
                  <div className="text-5xl mb-6">{tier.emoji}</div>

                  {/* Tier name */}
                  <h3 className="text-3xl font-serif font-bold text-terra-800 mb-1">
                    {tier.name}
                  </h3>

                  {/* Price */}
                  <div className="mb-6 pb-6 border-b-2 border-terra-800/10">
                    <span className="text-5xl font-mono font-bold text-terra-800">
                      {tier.price}
                    </span>
                    <span className="text-terra-800/60 font-mono text-sm"> лв/мес</span>
                  </div>

                  {/* Features */}
                  <div className="space-y-3 mb-8">
                    {tier.features.map((feature) => (
                      <div key={feature.label} className="flex justify-between items-center">
                        <span className="text-xs font-mono text-terra-800/60 uppercase">
                          {feature.label}
                        </span>
                        <span className="text-sm font-mono font-bold text-terra-800">
                          {feature.value}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* CTA */}
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`w-full py-3 font-mono font-bold text-sm uppercase tracking-wider transition-all ${
                      tier.highlight
                        ? 'bg-sage-500 text-sand-50 hover:bg-opacity-90'
                        : 'bg-terra-800 text-sand-50 hover:bg-opacity-90'
                    }`}
                  >
                    Начни
                  </motion.button>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Right scroll button */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            onClick={() => scroll('right')}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-12 h-12 bg-terra-800 text-sand-50 rounded-full flex items-center justify-center shadow-lg hover:bg-opacity-90 transition-all"
          >
            <ChevronRight className="w-6 h-6" />
          </motion.button>
        </div>

        {/* Bottom info */}
        <motion.p
          className="text-center text-terra-800/50 font-mono text-xs mt-12 pt-8 border-t border-terra-800/10 uppercase tracking-widest"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          viewport={{ once: true }}
        >
          Всяка доставка включва подробен печат за свежост и история на цветята
        </motion.p>
      </div>
    </section>
  );
}
