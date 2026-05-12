'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useCalculatorStore } from '@/store/calculatorStore'
import { calculateModuleAverage } from '@/lib/calculator'

interface AverageCellProps {
  moduleKey: string
  credit: number
}

export default function AverageCell({ moduleKey, credit }: AverageCellProps) {
  const grades = useCalculatorStore((s) => s.grades[moduleKey])

  if (!grades || (!grades.exam && !grades.td)) {
    return <span className="text-slate-600 text-sm font-mono">--</span>
  }

  const exam = parseFloat(grades.exam || '0')
  const td = parseFloat(grades.td || '0')
  const avg = calculateModuleAverage(exam, td)
  const pass = avg >= 10

  void credit

  return (
    <AnimatePresence mode="wait">
      <motion.span
        key={`${avg.toFixed(2)}`}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.8 }}
        transition={{ duration: 0.25 }}
        className={`inline-block px-2.5 py-1 rounded-lg text-sm font-mono font-semibold ${
          pass
            ? 'text-emerald-400 bg-emerald-950/60 border border-emerald-900/50'
            : 'text-red-400 bg-red-950/60 border border-red-900/50'
        }`}
      >
        {avg.toFixed(2)}
      </motion.span>
    </AnimatePresence>
  )
}
