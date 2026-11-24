'use client'

import { motion } from 'framer-motion'
import SemesterPicker from './SemesterPicker'

export default function HeroContent() {
  const scrollToCalculator = () => {
    document.getElementById('calculator')?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <div className="flex flex-col items-center text-center py-10 sm:py-16">
      {/* Badge */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-4 px-4 py-1.5 rounded-full border border-purple-500/30 bg-purple-500/10 text-purple-300 text-sm font-medium"
      >
        ✦ Official ESTIN Grading Formula
      </motion.div>

      {/* Title */}
      <motion.h2
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="text-5xl sm:text-6xl md:text-7xl font-bold mb-4 leading-tight"
      >
        <span className="text-white">Estin</span>
        <br />
        <span className="gradient-text">Average Calculator</span>
      </motion.h2>

      {/* Description */}
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="text-lg sm:text-xl text-slate-400 max-w-2xl mb-7 leading-relaxed"
      >
        Calculate your semester&apos;s average based on the official grading formulas.
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="relative z-20 w-full mb-8"
      >
        <SemesterPicker onPicked={() => setTimeout(scrollToCalculator, 300)} />
      </motion.div>

      {/* Scroll Indicator */}
      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4, delay: 0.9 }}
        onClick={scrollToCalculator}
        className="flex flex-col items-center gap-2 text-slate-500 hover:text-purple-400 transition-colors group"
      >
        <span className="text-xs uppercase tracking-widest font-medium">Scroll to calculate</span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
          className="w-8 h-8 rounded-full border border-slate-700 group-hover:border-purple-500/50 flex items-center justify-center"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </motion.div>
      </motion.button>
    </div>
  )
}
