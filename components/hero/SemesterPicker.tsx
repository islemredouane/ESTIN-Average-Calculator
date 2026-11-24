'use client'

import { useEffect, useId, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useCalculatorStore } from '@/store/calculatorStore'
import { semesterData } from '@/lib/data/semesters'
import type { SemesterId } from '@/lib/data/types'

type Year = '1CP' | '2CP' | '1CS' | '2CS'
type Track = 'IA' | 'CS'

const YEARS: { id: Year; title: string; hint: string }[] = [
  { id: '1CP', title: '1CP', hint: 'Preparatory year' },
  { id: '2CP', title: '2CP', hint: 'Preparatory year' },
  { id: '1CS', title: '1CS', hint: 'Common core' },
  { id: '2CS', title: '2CS', hint: 'Specialization' },
]

const TRACKS: { id: Track; label: string }[] = [
  { id: 'IA', label: 'AI' },
  { id: 'CS', label: 'Cyber Security' },
]

const yearOf = (id: SemesterId): Year => id.slice(0, 3) as Year
const trackOf = (id: SemesterId): Track => (id.includes('-IA-') ? 'IA' : 'CS')
const numberOf = (id: SemesterId): 1 | 2 => (id.endsWith('S1') ? 1 : 2)

function buildId(year: Year, track: Track, n: 1 | 2): SemesterId {
  return (year === '2CS' ? `2CS-${track}-S${n}` : `${year}-S${n}`) as SemesterId
}

function Segmented<T extends string | number>({
  label,
  options,
  value,
  onChange,
  layoutId,
}: {
  label: string
  options: { id: T; label: string; sub?: string }[]
  value: T
  onChange: (id: T) => void
  layoutId: string
}) {
  return (
    <div role="radiogroup" aria-label={label} className="grid gap-1 p-1.5 rounded-2xl bg-slate-950/50 border border-purple-900/30" style={{ gridTemplateColumns: `repeat(${options.length}, minmax(0, 1fr))` }}>
      {options.map((o) => {
        const active = o.id === value
        return (
          <button
            key={String(o.id)}
            type="button"
            role="radio"
            aria-checked={active}
            onClick={() => onChange(o.id)}
            className={`relative rounded-xl px-3 py-3 text-sm font-semibold transition-colors ${
              active ? 'text-white' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            {active && (
              <motion.span
                layoutId={layoutId}
                className="absolute inset-0 rounded-xl bg-purple-900/25 border border-purple-500/50 shadow-[0_0_20px_rgba(139,92,246,0.18)]"
                transition={{ type: 'spring', stiffness: 400, damping: 32 }}
              />
            )}
            <span className="relative flex flex-col items-center leading-tight">
              {o.label}
              {o.sub && <span className="mt-0.5 text-[11px] font-normal text-slate-500">{o.sub}</span>}
            </span>
          </button>
        )
      })}
    </div>
  )
}

export default function SemesterPicker({ onPicked }: { onPicked: () => void }) {
  const currentSemester = useCalculatorStore((s) => s.currentSemester)
  const setSemester = useCalculatorStore((s) => s.setSemester)

  const year = yearOf(currentSemester)
  const track = trackOf(currentSemester)
  const number = numberOf(currentSemester)

  const [open, setOpen] = useState(false)
  const [focusIndex, setFocusIndex] = useState(0)
  const rootRef = useRef<HTMLDivElement>(null)
  const listId = useId()

  useEffect(() => {
    if (!open) return
    const onDown = (e: MouseEvent | TouchEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', onDown)
    document.addEventListener('touchstart', onDown)
    return () => {
      document.removeEventListener('mousedown', onDown)
      document.removeEventListener('touchstart', onDown)
    }
  }, [open])

  const openList = () => {
    setFocusIndex(YEARS.findIndex((y) => y.id === year))
    setOpen(true)
  }

  const chooseYear = (y: Year) => {
    setOpen(false)
    if (y !== year) setSemester(buildId(y, track, number))
  }

  const onButtonKey = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      e.preventDefault()
      if (!open) return openList()
      setFocusIndex((i) => (i + (e.key === 'ArrowDown' ? 1 : -1) + YEARS.length) % YEARS.length)
    } else if (e.key === 'Enter' || e.key === ' ') {
      if (open) {
        e.preventDefault()
        chooseYear(YEARS[focusIndex].id)
      }
    } else if (e.key === 'Escape') {
      setOpen(false)
    }
  }

  const current = YEARS.find((y) => y.id === year)!

  return (
    <div ref={rootRef} className="w-full max-w-sm mx-auto text-left">
      <div className="rounded-3xl border border-purple-900/25 bg-[#030712] bg-gradient-to-r from-purple-950/50 to-slate-900/50 p-5 space-y-5 shadow-[0_8px_40px_rgba(0,0,0,0.35)]">
        <div>
          <label id={`${listId}-label`} className="block mb-2.5 text-xs font-semibold uppercase tracking-wider text-purple-300/70">
            Choose your year
          </label>
          <div className="relative">
            <button
              type="button"
              role="combobox"
              aria-haspopup="listbox"
              aria-expanded={open}
              aria-controls={listId}
              aria-labelledby={`${listId}-label`}
              onClick={() => (open ? setOpen(false) : openList())}
              onKeyDown={onButtonKey}
              className={`w-full flex items-center justify-between gap-3 rounded-2xl border bg-slate-900/60 px-4 py-3.5 text-left transition-colors hover:border-purple-500/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500/30 ${
                open ? 'border-purple-500/60' : 'border-purple-900/40'
              }`}
            >
              <span>
                <span className="block text-base font-bold text-white">{current.title}</span>
                <span className="block text-xs text-slate-400">{current.hint}</span>
              </span>
              <svg
                className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </button>

            <AnimatePresence>
              {open && (
                <motion.ul
                  id={listId}
                  role="listbox"
                  aria-labelledby={`${listId}-label`}
                  initial={{ opacity: 0, y: -6, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -6, scale: 0.98 }}
                  transition={{ duration: 0.15 }}
                  className="absolute left-0 right-0 top-full mt-2 z-30 overflow-hidden rounded-2xl border border-purple-900/40 bg-slate-950 p-1.5 shadow-[0_12px_40px_rgba(0,0,0,0.6)]"
                >
                  {YEARS.map((y, i) => {
                    const selected = y.id === year
                    return (
                      <li
                        key={y.id}
                        role="option"
                        aria-selected={selected}
                        onMouseEnter={() => setFocusIndex(i)}
                        onClick={() => chooseYear(y.id)}
                        className={`flex cursor-pointer items-center justify-between rounded-xl px-3.5 py-3 transition-colors ${
                          i === focusIndex ? 'bg-purple-900/25' : ''
                        }`}
                      >
                        <span>
                          <span className="block text-sm font-bold text-white">{y.title}</span>
                          <span className="block text-xs text-slate-400">{y.hint}</span>
                        </span>
                        {selected && (
                          <svg className="w-4 h-4 text-purple-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                            <polyline points="20 6 9 17 4 12" />
                          </svg>
                        )}
                      </li>
                    )
                  })}
                </motion.ul>
              )}
            </AnimatePresence>
          </div>
        </div>

        <div
          aria-hidden={year !== '2CS'}
          className={`grid transition-[grid-template-rows,opacity,margin] duration-200 ease-out ${
            year === '2CS' ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0 -mt-5'
          }`}
          style={{ transitionProperty: 'grid-template-rows, opacity, margin' }}
        >
          <div
            className="min-h-0 overflow-hidden"
            style={{
              visibility: year === '2CS' ? 'visible' : 'hidden',
              transition: `visibility 0s linear ${year === '2CS' ? '0s' : '0.2s'}`,
            }}
          >
            <p className="mb-2.5 text-xs font-semibold uppercase tracking-wider text-purple-300/70">Specialization</p>
            <Segmented
              label="Specialization"
              layoutId="track-pill"
              value={track}
              options={TRACKS}
              onChange={(t) => setSemester(buildId('2CS', t, number))}
            />
          </div>
        </div>

        <div>
          <p className="mb-2.5 text-xs font-semibold uppercase tracking-wider text-purple-300/70">Semester</p>
          <Segmented<number>
            label="Semester"
            layoutId="semester-pill"
            value={number}
            options={[
              { id: 1, label: 'Semester 1' },
              { id: 2, label: 'Semester 2' },
            ]}
            onChange={(n) => {
              setSemester(buildId(year, track, n as 1 | 2))
              onPicked()
            }}
          />
        </div>

        <p className="text-center text-xs text-slate-500" aria-live="polite">
          {semesterData[currentSemester].name}
        </p>
      </div>
    </div>
  )
}
