'use client'

import { motion } from 'framer-motion'
import AverageDisplay from './AverageDisplay'
import ProgressBar from './ProgressBar'

interface SemesterSummaryCardProps {
  average: number
  obtainedCredits: number
  totalCredits: number
  semesterName: string
}

export default function SemesterSummaryCard({
  average,
  obtainedCredits,
  totalCredits,
  semesterName,
}: SemesterSummaryCardProps) {
  const pass = average >= 10

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, type: 'spring', stiffness: 200 }}
      className={`relative rounded-2xl overflow-hidden border ${
        pass ? 'border-purple-900/35' : 'border-slate-800/50'
      }`}
    >
      {/* Base gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-950/60 via-slate-900/70 to-slate-950" />

      {/* Large ambient glow — pass = emerald top-right, fail = red top-right */}
      <div
        className={`absolute -top-10 -right-10 w-64 h-64 rounded-full blur-3xl pointer-events-none ${
          pass ? 'bg-emerald-500/12' : 'bg-red-500/10'
        }`}
      />
      {/* Secondary bottom-left accent */}
      <div
        className={`absolute -bottom-8 -left-8 w-48 h-48 rounded-full blur-3xl pointer-events-none ${
          pass ? 'bg-purple-600/15' : 'bg-orange-600/8'
        }`}
      />

      {/* Content */}
      <div className="relative z-10 p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">

          {/* Left */}
          <div>
            <p className="text-xs text-slate-500 uppercase tracking-wider font-medium mb-1">
              Semester Average
            </p>
            <h4 className="text-xl font-bold text-white">{semesterName}</h4>
            <span
              className={`inline-flex items-center gap-1.5 mt-3 px-3 py-1.5 rounded-xl text-xs font-semibold border ${
                pass
                  ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                  : 'bg-red-500/10 text-red-400 border-red-500/20'
              }`}
            >
              <span
                className={`w-1.5 h-1.5 rounded-full ${
                  pass
                    ? 'bg-emerald-400 shadow-[0_0_6px_#34d399]'
                    : 'bg-red-400 shadow-[0_0_6px_#f87171]'
                }`}
              />
              {pass ? 'Passing' : 'Failing'}
            </span>
          </div>

          {/* Right: average + credits */}
          <div className="flex items-end gap-8 sm:gap-12">
            <div>
              <AverageDisplay value={average} large pass={pass} />
              <p className="text-xs text-slate-500 mt-1.5">Average / 20</p>
            </div>

            <div className={`pb-1 px-4 py-3 rounded-xl border ${
              pass
                ? 'bg-emerald-500/8 border-emerald-500/15'
                : 'bg-red-500/8 border-red-500/15'
            }`}>
              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-bold text-white tabular-nums">{obtainedCredits}</span>
                <span className="text-slate-600 text-xl font-medium">/</span>
                <span className="text-slate-400 text-xl font-semibold">{totalCredits}</span>
              </div>
              <p className="text-xs text-slate-500 mt-1">Credits Obtained</p>
            </div>
          </div>
        </div>

        {/* Progress bar with scale */}
        <div className="mt-6">
          <div className="flex justify-between text-xs text-slate-700 mb-2">
            <span>0</span>
            <span>10</span>
            <span>20</span>
          </div>
          <ProgressBar value={average} max={20} pass={pass} />
        </div>
      </div>
    </motion.div>
  )
}
