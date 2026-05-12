'use client'

import { useCalculatorStore } from '@/store/calculatorStore'
import { semesterData } from '@/lib/data/semesters'
import { getModuleKey } from '@/lib/calculator'
import ModuleRow from './ModuleRow'

export default function ModulesTable() {
  const currentSemester = useCalculatorStore((s) => s.currentSemester)
  const modules = semesterData[currentSemester].modules

  const flatModules = modules.map((mod, index) => ({ mod, index }))

  return (
    <div className="rounded-2xl border border-purple-900/30 overflow-hidden glass">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[800px]">
          <thead>
            <tr className="bg-gradient-to-r from-purple-950/80 to-slate-900/80 border-b border-purple-900/30">
              {['Unit', 'Module', 'Coefficient', 'Credits', 'Exam', 'TD/TP', 'Module Average', 'Credits Obtained'].map(
                (h) => (
                  <th
                    key={h}
                    className="px-4 py-4 text-left text-xs font-semibold text-purple-300 uppercase tracking-wider"
                  >
                    {h}
                  </th>
                )
              )}
            </tr>
          </thead>
          <tbody>
            {flatModules.flatMap(({ mod, index }, arrayIdx) => {
              const showUnitHeader =
                arrayIdx === 0 || flatModules[arrayIdx - 1].mod.unit !== mod.unit
              const moduleKey = getModuleKey(mod.module, index)
              const rows = []

              if (showUnitHeader) {
                rows.push(
                  <tr key={`unit-${mod.unit}-${index}`} className="bg-purple-950/40 border-b border-purple-900/20">
                    <td
                      colSpan={8}
                      className="px-4 py-2.5 text-sm font-bold text-purple-300 border-l-2 border-purple-500"
                    >
                      {mod.unit}
                    </td>
                  </tr>
                )
              }

              rows.push(<ModuleRow key={moduleKey} module={mod} moduleKey={moduleKey} />)

              return rows
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
