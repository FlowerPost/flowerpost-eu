'use client';

import { motion } from 'framer-motion';
import { HeroSection } from '@/components/HeroSection';
import { FoundersClub } from '@/components/FoundersClub';
import { SubscriptionTiers } from '@/components/SubscriptionTiers';

export default function Home() {
  return (
    <main className="overflow-hidden">
      {/* Hero Section */}
      <HeroSection />

      {/* Subscription Tiers - moved here */}
      <SubscriptionTiers />

      {/* The Ritual Section */}
      <TheRitual />

      {/* Founders Club */}
      <FoundersClub />

      {/* Farm to Table Section */}
      <FarmToTable />

      {/* Footer */}
      <Footer />
    </main>
  );
}

function TheRitual() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 },
    },
  };

  const rituals = [
    {
      title: 'Понеделник',
      description: 'Свежа доставка пристига до твоя дом. Распакована, преживей първите аромати.',
    },
    {
      title: 'От вторник до неделя',
      description: 'Наслаждавай се на красотата. Всеки ден е нов, всеки цвят разказва своята история.',
    },
    {
      title: 'Следващия понеделник',
      description: 'Обнови цикъла. Нови цветя, нов ритуал, нова магия.',
    },
  ];

  return (
    <section className="py-20 bg-sand-50">
      <div className="container mx-auto px-6">
        <motion.div
          className="max-w-4xl mx-auto"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <motion.div className="text-center mb-16" variants={itemVariants}>
            <h2 className="text-5xl font-serif font-bold text-terra-800 mb-4">
              Ритуалът на цветята
            </h2>
            <p className="text-lg text-terra-800/70 font-mono">
              Преживей магията на природата в дома си всеки ден
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {rituals.map((ritual, index) => (
              <motion.div
                key={ritual.title}
                className="text-center"
                variants={itemVariants}
              >
                <motion.div
                  className="inline-block mb-4"
                  whileHover={{ scale: 1.1 }}
                >
                  <div className="w-16 h-16 rounded-full bg-sage-500/20 border-2 border-sage-500 flex items-center justify-center">
                    <span className="text-2xl font-mono font-bold text-sage-500">
                      {index + 1}
                    </span>
                  </div>
                </motion.div>
                <h3 className="text-xl font-serif font-bold text-terra-800 mb-3">
                  {ritual.title}
                </h3>
                <p className="text-terra-800/60 font-mono text-sm leading-relaxed">
                  {ritual.description}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function FarmToTable() {
  const farms = [
    {
      name: 'Роза Долина',
      region: 'Казанлък',
      emoji: '🌹',
    },
    {
      name: 'Горски Цветя',
      region: 'Пирин',
      emoji: '🌼',
    },
    {
      name: 'Морски Бриз',
      region: 'Варна',
      emoji: '🌺',
    },
    {
      name: 'Планински Склон',
      region: 'Рила',
      emoji: '🌸',
    },
  ];

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-6">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2 className="text-5xl font-serif font-bold text-terra-800 mb-4">
            От фермата до твоята ваза
          </h2>
          <p className="text-lg text-terra-800/70 font-mono">
            Партньорства със селекционни български ферми за максимална свежина
          </p>
        </motion.div>

        <motion.div
          className="grid grid-cols-2 md:grid-cols-4 gap-6"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ staggerChildren: 0.1, delayChildren: 0.2 }}
          viewport={{ once: true }}
        >
          {farms.map((farm) => (
            <motion.div
              key={farm.name}
              className="bg-sand-50 rounded-lg p-6 border-2 border-terra-800/10 hover:border-terra-800/30 transition-all text-center"
              whileHover={{ y: -4 }}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <div className="text-4xl mb-3">{farm.emoji}</div>
              <h3 className="font-serif font-bold text-terra-800 mb-1">
                {farm.name}
              </h3>
              <p className="text-terra-800/60 font-mono text-xs">
                {farm.region}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="bg-terra-800 text-sand-50 py-16">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <div>
            <h3 className="font-serif text-xl font-bold mb-4">FlowerPost</h3>
            <p className="font-mono text-sm text-sand-50/70 mb-4">
              Ритуалът на цветята, всяка седмица.
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-mono font-bold text-sm mb-4 uppercase tracking-wider">
              Меню
            </h4>
            <ul className="space-y-2 text-sm font-mono text-sand-50/70">
              <li>
                <a href="#" className="hover:text-sand-50 transition">
                  За нас
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-sand-50 transition">
                  Абонаменти
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-sand-50 transition">
                  Контакти
                </a>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-mono font-bold text-sm mb-4 uppercase tracking-wider">
              Правна
            </h4>
            <ul className="space-y-2 text-sm font-mono text-sand-50/70">
              <li>
                <a href="#" className="hover:text-sand-50 transition">
                  Условия
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-sand-50 transition">
                  Политика
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-sand-50 transition">
                  Доставка
                </a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-mono font-bold text-sm mb-4 uppercase tracking-wider">
              Контакт
            </h4>
            <ul className="space-y-2 text-sm font-mono text-sand-50/70">
              <li>hello@flowerpost.bg</li>
              <li>+359 2 XXX XX XX</li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-sand-50/20 pt-8 text-center">
          <p className="text-sand-50/50 font-mono text-xs">
            © 2026 FlowerPost. Всички права запазени. 🌹
          </p>
        </div>
      </div>
    </footer>
  );
}
