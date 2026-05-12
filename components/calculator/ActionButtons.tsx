'use client'

import { motion } from 'framer-motion'
import { useCalculatorStore } from '@/store/calculatorStore'

export default function ActionButtons() {
  const calculate = useCalculatorStore((s) => s.calculate)
  const reset = useCalculatorStore((s) => s.reset)

  return (
    <div className="flex flex-wrap gap-4">
      <motion.button
        whileHover={{ scale: 1.02, y: -2 }}
        whileTap={{ scale: 0.98, y: 0 }}
        onClick={calculate}
        className="flex items-center gap-2.5 px-8 py-3.5 rounded-xl font-semibold text-white bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-500 hover:to-pink-400 shadow-glow-purple transition-all duration-200"
      >
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="3" y="3" width="18" height="18" rx="2" />
          <line x1="3" y1="9" x2="21" y2="9" />
          <line x1="9" y1="21" x2="9" y2="9" />
        </svg>
        Calculate Average
      </motion.button>

      <motion.button
        whileHover={{ scale: 1.02, y: -2 }}
        whileTap={{ scale: 0.98, y: 0 }}
        onClick={reset}
        className="flex items-center gap-2.5 px-8 py-3.5 rounded-xl font-semibold text-slate-300 border border-slate-600 hover:border-purple-500/50 hover:text-white hover:bg-purple-900/20 transition-all duration-200"
      >
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" />
          <path d="M21 3v5h-5" />
          <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" />
          <path d="M3 21v-5h5" />
        </svg>
        Reset Form
      </motion.button>
    </div>
  )
}
