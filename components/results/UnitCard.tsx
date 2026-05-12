'use client'

import { motion } from 'framer-motion'
import AverageDisplay from './AverageDisplay'
import ProgressBar from './ProgressBar'
import type { UnitResult } from '@/lib/data/types'

interface UnitCardProps {
  unit: UnitResult
}

export default function UnitCard({ unit }: UnitCardProps) {
  const pass = unit.average >= 10

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`relative rounded-2xl overflow-hidden h-full border ${
        pass ? 'border-purple-900/30' : 'border-slate-800/50'
      }`}
    >
      {/* Base gradient — same language as accordion headers */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-950/50 via-slate-900/70 to-slate-950" />

      {/* Ambient color glow — top-right corner blob */}
      <div
        className={`absolute -top-6 -right-6 w-36 h-36 rounded-full blur-3xl pointer-events-none ${
          pass ? 'bg-emerald-500/15' : 'bg-red-500/12'
        }`}
      />

      {/* Bottom-left secondary glow */}
      <div
        className={`absolute -bottom-4 -left-4 w-24 h-24 rounded-full blur-2xl pointer-events-none ${
          pass ? 'bg-purple-600/10' : 'bg-orange-600/8'
        }`}
      />

      {/* Content */}
      <div className="relative z-10 p-5 flex flex-col gap-4 h-full">

        {/* Header */}
        <div className="flex items-start justify-between gap-2">
          <p className="text-sm font-bold text-purple-200 leading-snug">{unit.name}</p>
          <span
            className={`flex-shrink-0 flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-lg font-semibold ${
              pass
                ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                : 'bg-red-500/10 text-red-400 border border-red-500/20'
            }`}
          >
            <span
              className={`w-1.5 h-1.5 rounded-full ${
                pass ? 'bg-emerald-400 shadow-[0_0_6px_#34d399]' : 'bg-red-400 shadow-[0_0_6px_#f87171]'
              }`}
            />
            {pass ? 'Pass' : 'Fail'}
          </span>
        </div>

        {/* Average + Credits */}
        <div className="flex items-end justify-between mt-auto">
          <div>
            <AverageDisplay value={unit.average} pass={pass} />
            <p className="text-xs text-slate-600 mt-1">/ 20</p>
          </div>

          <div className="text-right">
            <div className="flex items-baseline gap-1 justify-end">
              <span className="text-2xl font-bold text-white tabular-nums">{unit.credits}</span>
              <span className="text-slate-600">/</span>
              <span className="text-slate-400 text-lg font-semibold">{unit.totalCredits}</span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">Credits</p>
          </div>
        </div>

        {/* Progress bar */}
        <ProgressBar value={unit.average} max={20} pass={pass} />
      </div>
    </motion.div>
  )
}
