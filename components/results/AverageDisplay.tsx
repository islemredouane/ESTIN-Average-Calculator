'use client'

import { useEffect } from 'react'
import { useMotionValue, useTransform, animate, motion } from 'framer-motion'

interface AverageDisplayProps {
  value: number
  pass: boolean
  large?: boolean
}

export default function AverageDisplay({ value, pass, large = false }: AverageDisplayProps) {
  const count = useMotionValue(0)
  const rounded = useTransform(count, (v) => v.toFixed(2))

  useEffect(() => {
    const controls = animate(count, value, { duration: 1.2, ease: 'easeOut' })
    return controls.stop
  }, [value, count])

  return (
    <motion.span
      className={`font-bold font-mono tabular-nums ${large ? 'text-5xl' : 'text-3xl'} ${
        pass ? 'text-emerald-400' : 'text-red-400'
      }`}
    >
      {rounded}
    </motion.span>
  )
}
