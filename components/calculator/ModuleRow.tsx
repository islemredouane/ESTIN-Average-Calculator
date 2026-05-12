'use client'

import { memo } from 'react'
import { motion } from 'framer-motion'
import type { Module } from '@/lib/data/types'
import { useCalculatorStore } from '@/store/calculatorStore'
import { calculateModuleAverage } from '@/lib/calculator'
import GradeInput from './GradeInput'
import AverageCell from './AverageCell'

function CreditsCell({ moduleKey, credit }: { moduleKey: string; credit: number }) {
  const grades = useCalculatorStore((s) => s.grades[moduleKey])

  if (!grades || (!grades.exam && !grades.td)) {
    return <span className="text-slate-600 text-sm font-mono">--</span>
  }

  const exam = parseFloat(grades.exam || '0')
  const td = parseFloat(grades.td || '0')
  const avg = calculateModuleAverage(exam, td)
  const pass = avg >= 10
  const creditsObtained = pass ? credit : 0

  return (
    <span className={`text-sm font-mono font-semibold ${pass ? 'text-emerald-400' : 'text-slate-500'}`}>
      {creditsObtained}
    </span>
  )
}

interface ModuleRowProps {
  module: Module
  moduleKey: string
}

const ModuleRow = memo(function ModuleRow({ module, moduleKey }: ModuleRowProps) {
  return (
    <motion.tr
      whileHover={{ backgroundColor: 'rgba(109, 40, 217, 0.05)' }}
      transition={{ duration: 0.15 }}
      className="border-b border-slate-800/50 last:border-0"
    >
      <td className="px-4 py-3 text-xs text-slate-600">{module.unit}</td>
      <td className="px-4 py-3 text-sm font-medium text-slate-200">{module.module}</td>
      <td className="px-4 py-3 text-sm text-center text-slate-300">{module.coef}</td>
      <td className="px-4 py-3 text-sm text-center text-slate-300">{module.credit}</td>
      <td className="px-4 py-3">
        <GradeInput moduleKey={moduleKey} type="exam" />
      </td>
      <td className="px-4 py-3">
        <GradeInput moduleKey={moduleKey} type="td" />
      </td>
      <td className="px-4 py-3 text-center">
        <AverageCell moduleKey={moduleKey} credit={module.credit} />
      </td>
      <td className="px-4 py-3 text-center">
        <CreditsCell moduleKey={moduleKey} credit={module.credit} />
      </td>
    </motion.tr>
  )
})

export default ModuleRow
