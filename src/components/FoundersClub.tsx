'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FreshnessStamp } from './FreshnessStamp';

export function FoundersClub() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [takenSpots, setTakenSpots] = useState(0);
  const totalSpots = 50;
  const remainingSpots = Math.max(totalSpots - takenSpots, 0);
  const spotsPercentage = (takenSpots / totalSpots) * 100;

  useEffect(() => {
    fetch('/api/founders')
      .then((res) => res.json())
      .then((data) => {
        if (typeof data.takenSpots === 'number') setTakenSpots(data.takenSpots);
      })
      .catch(() => {
        // Silently keep the default; the form still works.
      });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    setErrorMessage('');

    try {
      const res = await fetch('/api/founders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();

      if (!res.ok) {
        setStatus('error');
        setErrorMessage(data.error ?? 'Възникна грешка. Опитай отново.');
        return;
      }

      if (typeof data.takenSpots === 'number') setTakenSpots(data.takenSpots);
      setStatus('success');
      setEmail('');
      setTimeout(() => setStatus('idle'), 4000);
    } catch {
      setStatus('error');
      setErrorMessage('Проблем с връзката. Опитай отново.');
    }
  };

  return (
    <section className="py-20 bg-gradient-to-b from-sand-50 to-white">
      <div className="container mx-auto px-6">
        <motion.div
          className="max-w-4xl mx-auto"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          {/* Section title */}
          <div className="text-center mb-16">
            <motion.h2
              className="text-5xl font-serif font-bold text-terra-800 mb-4"
              initial={{ opacity: 0, y: -20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              Founders' Club
            </motion.h2>
            <motion.p
              className="text-lg text-terra-800/70 font-mono"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
            >
              Екскулузивна поканаза първите 50 основатели
            </motion.p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left - Freshness Stamp */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <FreshnessStamp />
              <p className="text-center text-terra-800/60 font-mono text-sm mt-6">
                Дигиталния печат за свежест
              </p>
            </motion.div>

            {/* Right - Registration form */}
            <motion.div
              className="space-y-8"
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              {/* Spots remaining */}
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <p className="text-terra-800 font-mono font-bold">
                    Остават: {remainingSpots} от {totalSpots} места
                  </p>
                  <p className="text-terra-800/60 font-mono text-sm">
                    {Math.round(spotsPercentage)}% наличност
                  </p>
                </div>

                {/* Progress bar */}
                <div className="w-full h-2 bg-sage-500/20 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-sage-500"
                    initial={{ width: 0 }}
                    whileInView={{ width: `${spotsPercentage}%` }}
                    transition={{ duration: 1, delay: 0.5 }}
                    viewport={{ once: true }}
                  />
                </div>
              </div>

              {/* Benefits */}
              <div className="space-y-3">
                <h3 className="text-terra-800 font-serif font-bold text-lg">
                  Привилегии на основателя
                </h3>
                <ul className="space-y-2 font-mono text-sm text-terra-800/70">
                  <li>✓ Безсрочна отстъпка от 30% на всички абонаменти</li>
                  <li>✓ Екскулузивен достъп до сезонни колекции</li>
                  <li>✓ Персонална поздравителна карта всяка седмица</li>
                  <li>✓ Приоритетна поддръжка на客клиентите</li>
                </ul>
              </div>

              {/* Email form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="flex flex-col sm:flex-row gap-3">
                  <input
                    type="email"
                    placeholder="твоят@имейл.bg"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    disabled={status === 'loading'}
                    className="flex-1 px-4 py-3 border-2 border-terra-800 rounded-lg font-mono text-sm focus:outline-none focus:ring-2 focus:ring-sage-500 disabled:opacity-60"
                  />
                  <motion.button
                    type="submit"
                    disabled={status === 'loading'}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-6 py-3 bg-sage-500 text-sand-50 font-mono font-bold rounded-lg hover:bg-opacity-90 transition-all disabled:opacity-60"
                  >
                    {status === 'loading' ? 'Изпращане...' : 'Запазиме'}
                  </motion.button>
                </div>

                {status === 'success' && (
                  <motion.p
                    className="text-sage-500 font-mono text-sm text-center"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    ✓ Благодарим! Проверей имейла си.
                  </motion.p>
                )}

                {status === 'error' && (
                  <motion.p
                    className="text-terra-800 font-mono text-sm text-center"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    ✕ {errorMessage}
                  </motion.p>
                )}
              </form>

              {/* Limited time notice */}
              <p className="text-terra-800/50 font-mono text-xs text-center border-t border-terra-800/20 pt-4">
                ⏰ Ограничено предложение: последния дата е 30 августа 2026
              </p>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
