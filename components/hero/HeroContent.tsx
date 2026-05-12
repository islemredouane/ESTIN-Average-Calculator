'use client'

import { motion } from 'framer-motion'
import { useCalculatorStore } from '@/store/calculatorStore'
import type { SemesterId } from '@/lib/data/types'

const MAIN_SEMESTERS: { id: SemesterId; label: string }[] = [
  { id: '1CP-S1', label: '1CP - S1' },
  { id: '1CP-S2', label: '1CP - S2' },
  { id: '2CP-S1', label: '2CP - S1' },
  { id: '2CP-S2', label: '2CP - S2' },
  { id: '1CS-S1', label: '1CS - S1' },
  { id: '1CS-S2', label: '1CS - S2' },
]

const CS2_SEMESTERS: { id: SemesterId; label: string }[] = [
  { id: '2CS-IA-S1', label: '2CS IA - S1' },
  { id: '2CS-IA-S2', label: '2CS IA - S2' },
  { id: '2CS-CS-S1', label: '2CS Cyber - S1' },
  { id: '2CS-CS-S2', label: '2CS Cyber - S2' },
]

function SemesterButton({
  sem,
  index,
  active,
  onClick,
}: {
  sem: { id: SemesterId; label: string }
  index: number
  active: boolean
  onClick: () => void
}) {
  return (
    <motion.button
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.3 + index * 0.07 }}
      whileHover={{ y: -4, scale: 1.03 }}
      whileTap={{ scale: 0.96, y: 0 }}
      onClick={onClick}
      className={`px-6 py-2.5 rounded-xl font-semibold text-sm transition-all duration-200 border ${
        active
          ? 'bg-purple-900/20 border-purple-500/50 text-white'
          : 'bg-slate-900/60 border-slate-700 text-slate-300 hover:border-purple-500/50 hover:text-white hover:bg-purple-900/20'
      }`}
    >
      {sem.label}
    </motion.button>
  )
}

export default function HeroContent() {
  const currentSemester = useCalculatorStore((s) => s.currentSemester)
  const setSemester = useCalculatorStore((s) => s.setSemester)

  const scrollToCalculator = () => {
    document.getElementById('calculator')?.scrollIntoView({ behavior: 'smooth' })
  }

  const handleSelect = (id: SemesterId) => {
    setSemester(id)
    setTimeout(scrollToCalculator, 300)
  }

  return (
    <div className="flex flex-col items-center text-center py-10 sm:py-16">
      {/* Badge */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-4 px-4 py-1.5 rounded-full border border-purple-500/30 bg-purple-500/10 text-purple-300 text-sm font-medium"
      >
        ✦ Official ESTIN Grading Formula
      </motion.div>

      {/* Title */}
      <motion.h2
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="text-5xl sm:text-6xl md:text-7xl font-bold mb-4 leading-tight"
      >
        <span className="text-white">Estin</span>
        <br />
        <span className="gradient-text">Average Calculator</span>
      </motion.h2>

      {/* Description */}
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="text-lg sm:text-xl text-slate-400 max-w-2xl mb-7 leading-relaxed"
      >
        Calculate your semester&apos;s average based on the official grading formulas.
      </motion.p>

      {/* Main semester buttons (1CP / 2CP / 1CS) — 3 per row */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4, delay: 0.3 }}
        className="flex flex-wrap justify-center gap-3 mb-3"
      >
        {MAIN_SEMESTERS.map((sem, i) => (
          <SemesterButton
            key={sem.id}
            sem={sem}
            index={i}
            active={currentSemester === sem.id}
            onClick={() => handleSelect(sem.id)}
          />
        ))}
      </motion.div>

      {/* 2CS buttons — 2 per row */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4, delay: 0.6 }}
        className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8"
      >
        {CS2_SEMESTERS.map((sem, i) => (
          <SemesterButton
            key={sem.id}
            sem={sem}
            index={MAIN_SEMESTERS.length + i}
            active={currentSemester === sem.id}
            onClick={() => handleSelect(sem.id)}
          />
        ))}
      </motion.div>

      {/* Scroll Indicator */}
      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4, delay: 0.9 }}
        onClick={scrollToCalculator}
        className="flex flex-col items-center gap-2 text-slate-500 hover:text-purple-400 transition-colors group"
      >
        <span className="text-xs uppercase tracking-widest font-medium">Scroll to calculate</span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
          className="w-8 h-8 rounded-full border border-slate-700 group-hover:border-purple-500/50 flex items-center justify-center"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </motion.div>
      </motion.button>
    </div>
  )
}
