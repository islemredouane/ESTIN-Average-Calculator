'use client'

import { motion } from 'framer-motion'

interface ProgressBarProps {
  value: number
  max: number
  pass: boolean
}

export default function ProgressBar({ value, max, pass }: ProgressBarProps) {
  const pct = Math.min(100, (value / max) * 100)

  return (
    <div className="h-2 bg-slate-800/80 rounded-full overflow-hidden">
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: `${pct}%` }}
        transition={{ duration: 1.0, delay: 0.2, ease: [0.25, 0.46, 0.45, 0.94] }}
        className={`h-full rounded-full ${
          pass
            ? 'bg-gradient-to-r from-emerald-600 via-emerald-400 to-teal-400 shadow-[0_0_8px_rgba(52,211,153,0.5)]'
            : 'bg-gradient-to-r from-red-600 via-red-500 to-orange-400 shadow-[0_0_8px_rgba(248,113,113,0.4)]'
        }`}
      />
    </div>
  )
}
