'use client'

import { memo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import type { Module } from '@/lib/data/types'
import { useCalculatorStore } from '@/store/calculatorStore'
import { calculateModuleAverage } from '@/lib/calculator'
import GradeInput from './GradeInput'

function ModuleAverage({ moduleKey }: { moduleKey: string }) {
  const grades = useCalculatorStore((s) => s.grades[moduleKey])

  if (!grades || (!grades.exam && !grades.td)) {
    return (
      <span className="text-slate-600 text-sm font-mono font-semibold">--</span>
    )
  }

  const avg = calculateModuleAverage(
    parseFloat(grades.exam || '0'),
    parseFloat(grades.td || '0')
  )
  const pass = avg >= 10

  return (
    <AnimatePresence mode="wait">
      <motion.span
        key={avg.toFixed(2)}
        initial={{ opacity: 0, scale: 0.85 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.85 }}
        transition={{ duration: 0.2 }}
        className={`text-sm font-mono font-bold px-2.5 py-0.5 rounded-lg ${
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

interface ModuleCardProps {
  module: Module
  moduleKey: string
}

const ModuleCard = memo(function ModuleCard({ module, moduleKey }: ModuleCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className="bg-slate-900/60 border border-slate-800/60 rounded-xl p-4 hover:border-purple-900/40 transition-colors duration-200"
    >
      {/* Module header */}
      <div className="flex items-start justify-between gap-3 mb-4">
        <div className="min-w-0">
          <p className="text-sm font-semibold text-slate-100 leading-snug">{module.module}</p>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-xs text-slate-500 bg-slate-800/60 px-2 py-0.5 rounded-md">
              Coef {module.coef}
            </span>
            <span className="text-xs text-slate-500 bg-slate-800/60 px-2 py-0.5 rounded-md">
              {module.credit} cr
            </span>
          </div>
        </div>
        <div className="flex-shrink-0 text-right">
          <ModuleAverage moduleKey={moduleKey} />
        </div>
      </div>

      {/* Grade inputs */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs text-slate-500 mb-1.5 font-medium">
            Exam <span className="text-purple-500">×2</span>
          </label>
          <GradeInput moduleKey={moduleKey} type="exam" fullWidth />
        </div>
        <div>
          <label className="block text-xs text-slate-500 mb-1.5 font-medium">TD / TP</label>
          <GradeInput moduleKey={moduleKey} type="td" fullWidth />
        </div>
      </div>
    </motion.div>
  )
})

export default ModuleCard
