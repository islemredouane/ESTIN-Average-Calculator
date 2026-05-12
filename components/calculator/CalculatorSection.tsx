'use client'

import { motion } from 'framer-motion'
import ScrollReveal from '@/components/ui/ScrollReveal'
import UnitAccordion from './UnitAccordion'
import { useCalculatorStore } from '@/store/calculatorStore'
import { semesterData } from '@/lib/data/semesters'

function StickyActionBar() {
  const calculate = useCalculatorStore((s) => s.calculate)
  const reset = useCalculatorStore((s) => s.reset)

  return (
    <div className="fixed bottom-0 inset-x-0 z-40 sm:relative sm:inset-auto sm:mt-8 bg-slate-950/95 sm:bg-transparent backdrop-blur-xl sm:backdrop-blur-none border-t border-slate-800/60 sm:border-0 px-4 py-3 sm:p-0">
      <div className="max-w-7xl mx-auto flex gap-3 sm:justify-start">
        <motion.button
          whileHover={{ scale: 1.02, y: -1 }}
          whileTap={{ scale: 0.98 }}
          onClick={calculate}
          className="flex-1 sm:flex-none flex items-center justify-center gap-2.5 px-8 py-3 rounded-xl font-semibold text-purple-200 bg-gradient-to-br from-purple-950 via-slate-900 to-slate-950 border border-purple-500/40 hover:border-purple-400/70 hover:text-white transition-all duration-200 text-sm shadow-[0_0_20px_rgba(139,92,246,0.15)] hover:shadow-[0_0_25px_rgba(139,92,246,0.3)]"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 2 2 8l10 6 10-6-10-6z" />
            <path d="M2 16l10 6 10-6M2 12l10 6 10-6" />
          </svg>
          Calculate
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.02, y: -1 }}
          whileTap={{ scale: 0.98 }}
          onClick={reset}
          className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl font-semibold text-slate-400 border border-slate-700 hover:border-slate-500 hover:text-slate-200 hover:bg-slate-800/40 transition-all duration-200 text-sm"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" />
            <path d="M21 3v5h-5" />
            <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" />
            <path d="M3 21v-5h5" />
          </svg>
          Reset
        </motion.button>
      </div>
    </div>
  )
}

export default function CalculatorSection() {
  const currentSemester = useCalculatorStore((s) => s.currentSemester)
  const semesterName = semesterData[currentSemester].name

  return (
    <section id="calculator" className="py-20 relative pb-28 sm:pb-20">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-purple-500/30 to-transparent" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <ScrollReveal direction="left" className="flex items-center gap-4 mb-8">
          <div className="p-px rounded-2xl bg-gradient-to-br from-purple-500/70 via-pink-500/40 to-purple-900/30 flex-shrink-0">
          <div className="w-12 h-12 rounded-[15px] bg-gradient-to-br from-purple-950 via-slate-900 to-slate-950 flex items-center justify-center">
            <svg className="w-6 h-6 text-purple-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2" />
              <rect x="9" y="3" width="6" height="4" rx="1" />
              <path d="M9 12h6M9 16h4" />
            </svg>
          </div>
          </div>
          <div>
            <h3 className="text-3xl font-bold text-white">Enter Your Grades</h3>
            <p className="text-slate-400 text-sm mt-0.5">
              Tap a unit to expand and fill in your grades
            </p>
          </div>
        </ScrollReveal>

        {/* Current Semester Badge */}
        <ScrollReveal direction="left" delay={0.1} className="flex items-center gap-3 mb-5">
          <span className="text-slate-500 text-xs uppercase tracking-wider font-medium">Semester</span>
          <span className="px-4 py-1.5 rounded-full bg-purple-900/30 border border-purple-500/25 text-purple-300 text-sm font-semibold">
            {semesterName}
          </span>
        </ScrollReveal>

        {/* Unit Accordion */}
        <ScrollReveal direction="up" delay={0.15}>
          <UnitAccordion />
        </ScrollReveal>

        {/* Sticky bottom action bar (fixed on mobile, inline on desktop) */}
        <StickyActionBar />
      </div>
    </section>
  )
}
