'use client'

import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useCalculatorStore } from '@/store/calculatorStore'
import { semesterData } from '@/lib/data/semesters'
import { getModuleKey, calculateModuleAverage } from '@/lib/calculator'
import ModuleCard from './ModuleCard'

interface UnitGroup {
  name: string
  modules: Array<{ module: import('@/lib/data/types').Module; moduleKey: string }>
  totalCredits: number
}

function UnitLiveAverage({
  moduleKeys,
}: {
  moduleKeys: Array<{ moduleKey: string; coef: number; credit: number }>
}) {
  const grades = useCalculatorStore((s) => s.grades)

  const { avg, hasGrades } = useMemo(() => {
    let weightedSum = 0
    let totalCoef = 0
    let filled = 0

    for (const { moduleKey, coef } of moduleKeys) {
      const g = grades[moduleKey]
      if (g && (g.exam || g.td)) {
        const a = calculateModuleAverage(parseFloat(g.exam || '0'), parseFloat(g.td || '0'))
        weightedSum += a * coef
        totalCoef += coef
        filled++
      }
    }

    if (filled === 0) return { avg: 0, hasGrades: false }
    return { avg: weightedSum / totalCoef, hasGrades: true }
  }, [grades, moduleKeys])

  if (!hasGrades) {
    return <span className="text-slate-600 text-sm font-mono">--</span>
  }

  const pass = avg >= 10
  return (
    <span
      className={`text-sm font-mono font-bold ${pass ? 'text-emerald-400' : 'text-red-400'}`}
    >
      {avg.toFixed(2)}
    </span>
  )
}

export default function UnitAccordion() {
  const currentSemester = useCalculatorStore((s) => s.currentSemester)
  const modules = semesterData[currentSemester].modules

  const units: UnitGroup[] = useMemo(() => {
    const map = new Map<string, UnitGroup>()
    modules.forEach((mod, index) => {
      const moduleKey = getModuleKey(mod.module, index)
      if (!map.has(mod.unit)) {
        map.set(mod.unit, { name: mod.unit, modules: [], totalCredits: 0 })
      }
      const group = map.get(mod.unit)!
      group.modules.push({ module: mod, moduleKey })
      group.totalCredits += mod.credit
    })
    return Array.from(map.values())
  }, [modules])

  const [openUnits, setOpenUnits] = useState<Set<number>>(() => new Set([0]))

  const toggleUnit = (i: number) => {
    setOpenUnits((prev) => {
      const next = new Set(prev)
      if (next.has(i)) next.delete(i)
      else next.add(i)
      return next
    })
  }

  return (
    <div className="space-y-3">
      {units.map((unit, i) => {
        const isOpen = openUnits.has(i)
        const moduleKeysMeta = unit.modules.map(({ module, moduleKey }) => ({
          moduleKey,
          coef: module.coef,
          credit: module.credit,
        }))

        return (
          <div
            key={unit.name}
            className="rounded-2xl border border-purple-900/25 overflow-hidden"
          >
            {/* Accordion header */}
            <button
              onClick={() => toggleUnit(i)}
              className="w-full flex items-center justify-between px-5 py-4 bg-gradient-to-r from-purple-950/50 to-slate-900/50 hover:from-purple-950/70 hover:to-slate-900/70 transition-colors duration-200 text-left group"
            >
              <div className="flex items-center gap-3 min-w-0">
                {/* Chevron */}
                <motion.div
                  animate={{ rotate: isOpen ? 90 : 0 }}
                  transition={{ duration: 0.2 }}
                  className="flex-shrink-0 w-5 h-5 text-purple-400 group-hover:text-purple-300"
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <polyline points="9 18 15 12 9 6" />
                  </svg>
                </motion.div>

                {/* Unit name */}
                <div className="min-w-0">
                  <p className="text-sm font-bold text-purple-200 group-hover:text-white transition-colors truncate">
                    {unit.name}
                  </p>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {unit.modules.length} module{unit.modules.length !== 1 ? 's' : ''} · {unit.totalCredits} credits
                  </p>
                </div>
              </div>

              {/* Live unit average */}
              <div className="flex-shrink-0 text-right ml-4">
                <UnitLiveAverage moduleKeys={moduleKeysMeta} />
                <p className="text-xs text-slate-600 mt-0.5">unit avg</p>
              </div>
            </button>

            {/* Accordion body */}
            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  key="content"
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
                  className="overflow-hidden"
                >
                  <div className="p-4 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3 bg-slate-950/30">
                    {unit.modules.map(({ module, moduleKey }) => (
                      <ModuleCard key={moduleKey} module={module} moduleKey={moduleKey} />
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )
      })}
    </div>
  )
}
