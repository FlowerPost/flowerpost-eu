'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Leaf } from 'lucide-react';

export function HeroSection() {
  return (
    <section className="relative min-h-screen bg-sand-50 overflow-hidden pt-20">
      {/* Asymmetric background */}
      <div className="absolute -top-40 -right-40 w-96 h-96 bg-sage-500 rounded-full opacity-20 blur-3xl" />
      <div className="absolute -bottom-32 left-1/4 w-80 h-80 bg-terra-800 rounded-full opacity-10 blur-3xl" />

      <div className="relative z-10">
        <div className="container mx-auto px-6">
          {/* Asymmetric layout: 60-40 split */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center min-h-[600px]">
            {/* Left content - 7 columns */}
            <motion.div
              className="lg:col-span-7 space-y-8"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 1, ease: 'easeOut' }}
            >
              {/* Badge */}
              <motion.div
                className="inline-flex items-center gap-2 px-4 py-2 bg-sage-500/10 border border-sage-500/30 rounded-full"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <Leaf className="w-4 h-4 text-sage-500" />
                <span className="text-xs font-mono text-sage-500 font-bold uppercase">От българските ферми</span>
              </motion.div>

              {/* Main title */}
              <motion.h1
                className="text-6xl lg:text-8xl font-serif font-bold text-terra-800 leading-none"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.8 }}
              >
                Ритуалът
                <br />
                <span className="text-sage-500">на цветята</span>
              </motion.h1>

              {/* Subtitle */}
              <motion.p
                className="text-lg lg:text-xl text-terra-800/70 font-mono max-w-lg leading-relaxed"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.8 }}
              >
                Свежи, сезонни цветя доставени до врата ти всяка седмица. Роман със природата, един букет наведнъж.
              </motion.p>

              {/* CTA Buttons */}
              <motion.div
                className="flex flex-col sm:flex-row gap-4 pt-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-4 bg-terra-800 text-sand-50 font-mono font-bold rounded-none hover:bg-opacity-90 transition-all duration-300 flex items-center justify-center gap-2 group"
                >
                  Абонирай се
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-4 border-2 border-terra-800 text-terra-800 font-mono font-bold hover:bg-terra-800 hover:text-sand-50 transition-all duration-300"
                >
                  Founders' Club
                </motion.button>
              </motion.div>

              {/* Stats */}
              <motion.div
                className="flex gap-12 pt-8 border-t border-terra-800/20"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                <div>
                  <p className="text-2xl font-mono font-bold text-terra-800">50+</p>
                  <p className="text-xs font-mono text-terra-800/60 uppercase tracking-wider">Сортове цветя</p>
                </div>
                <div>
                  <p className="text-2xl font-mono font-bold text-terra-800">7</p>
                  <p className="text-xs font-mono text-terra-800/60 uppercase tracking-wider">Партньорски ферми</p>
                </div>
                <div>
                  <p className="text-2xl font-mono font-bold text-terra-800">100%</p>
                  <p className="text-xs font-mono text-terra-800/60 uppercase tracking-wider">Свежина гарантия</p>
                </div>
              </motion.div>
            </motion.div>

            {/* Right visual - 5 columns, offset */}
            <motion.div
              className="lg:col-span-5 relative h-[500px] lg:h-[600px]"
              initial={{ opacity: 0, scale: 0.8, rotate: 5 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              transition={{ delay: 0.3, duration: 1 }}
            >
              {/* Flower box illustration */}
              <div className="absolute inset-0 bg-gradient-to-br from-terra-800/5 to-sage-500/10 border-3 border-terra-800 flex items-center justify-center shadow-2xl">
                <div className="text-center">
                  <motion.div
                    className="text-8xl mb-6"
                    animate={{ y: [-10, 10, -10] }}
                    transition={{ duration: 3, repeat: Infinity }}
                  >
                    🌹
                  </motion.div>
                  <p className="text-terra-800 font-serif text-xl mb-2">Luxury Box</p>
                  <p className="text-terra-800/60 font-mono text-xs">20-25 стръкове</p>
                </div>
              </div>

              {/* Decorative wax seal */}
              <motion.div
                className="absolute -bottom-8 -right-8 w-32 h-32 bg-terra-800 rounded-full flex items-center justify-center shadow-lg"
                animate={{ rotate: 360 }}
                transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
              >
                <div className="text-center text-sand-50">
                  <p className="text-xs font-mono font-bold">TERRA</p>
                  <p className="text-xs font-mono">FLORA</p>
                </div>
              </motion.div>

              {/* Floating elements */}
              <motion.div
                className="absolute -top-12 -left-12 w-24 h-24 border-2 border-sage-500/30 rounded-full"
                animate={{ rotate: -360 }}
                transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
              />
              <motion.div
                className="absolute top-1/3 -right-16 w-20 h-20 bg-sage-500/20 rounded-full"
                animate={{ y: [-20, 20, -20] }}
                transition={{ duration: 4, repeat: Infinity }}
              />
            </motion.div>
          </div>
        </div>
      </div>

      {/* Bottom curve transition */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-b from-transparent to-white/50" />
    </section>
  );
}
