'use client'

import { useCalculatorStore } from '@/store/calculatorStore'

interface GradeInputProps {
  moduleKey: string
  type: 'exam' | 'td'
  fullWidth?: boolean
}

export default function GradeInput({ moduleKey, type, fullWidth }: GradeInputProps) {
  const value = useCalculatorStore((s) => s.grades[moduleKey]?.[type] ?? '')
  const setGrade = useCalculatorStore((s) => s.setGrade)

  return (
    <input
      type="number"
      min={0}
      max={20}
      step={0.5}
      placeholder="0 – 20"
      value={value}
      onChange={(e) => setGrade(moduleKey, type, e.target.value)}
      className={`px-3 py-2.5 rounded-lg bg-slate-950 border border-slate-700/80 text-white text-sm text-center placeholder-slate-600 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500/30 transition-all duration-200 ${
        fullWidth ? 'w-full' : 'w-24'
      }`}
    />
  )
}
