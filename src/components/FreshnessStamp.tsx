'use client';

import React from 'react';
import { motion } from 'framer-motion';

export function FreshnessStamp() {
  const today = new Date().toLocaleDateString('bg-BG', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });

  return (
    <motion.div
      className="relative w-40 h-40 mx-auto"
      initial={{ rotate: 0, opacity: 0, scale: 0.8 }}
      animate={{ rotate: 0, opacity: 1, scale: 1 }}
      transition={{ duration: 1, ease: 'easeOut' }}
      whileHover={{ scale: 1.05 }}
    >
      {/* Wax seal background */}
      <div className="absolute inset-0 bg-terra-800 rounded-full shadow-2xl flex items-center justify-center">
        {/* Seal texture */}
        <div className="absolute inset-2 border-4 border-terra-800/20 rounded-full" />
        <div className="absolute inset-4 border border-terra-800/30 rounded-full" />

        {/* Decorative dashes around */}
        {Array.from({ length: 12 }).map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-3 bg-sand-50/80"
            style={{
              transform: `rotate(${(i * 360) / 12}deg) translateY(-15px)`,
            }}
          />
        ))}

        {/* Center content */}
        <div className="text-center z-10">
          <p className="text-xs font-mono font-bold text-sand-50 uppercase tracking-wider">
            Свежест
          </p>
          <p className="text-xs font-mono text-sand-50/90 mt-2">{today}</p>
        </div>
      </div>

      {/* Drip effect */}
      <motion.div
        className="absolute bottom-0 left-1/2 -translate-x-1/2 w-3 h-4 bg-terra-800 rounded-b-lg opacity-60"
        animate={{ scaleY: [1, 1.2, 1] }}
        transition={{ duration: 2, repeat: Infinity }}
      />
    </motion.div>
  );
}
