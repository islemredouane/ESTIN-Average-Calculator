'use client'

import { useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useCalculatorStore } from '@/store/calculatorStore'
import { semesterData } from '@/lib/data/semesters'
import SemesterSummaryCard from './SemesterSummaryCard'
import UnitCard from './UnitCard'

export default function ResultsSection() {
  const showResults = useCalculatorStore((s) => s.showResults)
  const results = useCalculatorStore((s) => s.results)
  const currentSemester = useCalculatorStore((s) => s.currentSemester)
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    if (showResults && sectionRef.current) {
      const timer = setTimeout(() => {
        sectionRef.current?.scrollIntoView({ behavior: 'smooth' })
      }, 100)
      return () => clearTimeout(timer)
    }
  }, [showResults])

  return (
    <AnimatePresence>
      {showResults && results && (
        <motion.section
          ref={sectionRef}
          id="results"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
          className="py-20 relative"
        >
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-purple-500/30 to-transparent" />
          </div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            {/* Section Header */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="flex items-center gap-4 mb-8"
            >
              <div className="p-px rounded-2xl bg-gradient-to-br from-purple-500/70 via-pink-500/40 to-purple-900/30 flex-shrink-0">
                <div className="w-12 h-12 rounded-[15px] bg-gradient-to-br from-purple-950 via-slate-900 to-slate-950 flex items-center justify-center">
                  <svg className="w-6 h-6 text-purple-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M3 17l4.5-5.5 4 3L16 8l5 6" />
                    <path d="M21 17H3" />
                  </svg>
                </div>
              </div>
              <div>
                <h3 className="text-3xl font-bold text-white">Results</h3>
                <p className="text-slate-500 text-sm mt-0.5">Your semester breakdown</p>
              </div>
            </motion.div>

            {/* Semester Summary */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.1, type: 'spring', stiffness: 200 }}
              className="mb-6"
            >
              <SemesterSummaryCard
                average={results.semesterAverage}
                obtainedCredits={results.semesterObtainedCredits}
                totalCredits={results.semesterTotalCredits}
                semesterName={semesterData[currentSemester].name}
              />
            </motion.div>

            {/* Unit Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
              {results.units.map((unit, i) => (
                <motion.div
                  key={unit.name}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.2 + i * 0.08 }}
                >
                  <UnitCard unit={unit} />
                </motion.div>
              ))}
            </div>
          </div>
        </motion.section>
      )}
    </AnimatePresence>
  )
}
