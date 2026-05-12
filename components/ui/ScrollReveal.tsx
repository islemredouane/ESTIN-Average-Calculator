'use client'

import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'

type Direction = 'up' | 'down' | 'left' | 'right' | 'scale' | 'none'

interface ScrollRevealProps {
  children: React.ReactNode
  className?: string
  delay?: number
  direction?: Direction
  once?: boolean
}

const variants = {
  up: { hidden: { y: 40, opacity: 0 }, visible: { y: 0, opacity: 1 } },
  down: { hidden: { y: -40, opacity: 0 }, visible: { y: 0, opacity: 1 } },
  left: { hidden: { x: -40, opacity: 0 }, visible: { x: 0, opacity: 1 } },
  right: { hidden: { x: 40, opacity: 0 }, visible: { x: 0, opacity: 1 } },
  scale: { hidden: { scale: 0.95, opacity: 0 }, visible: { scale: 1, opacity: 1 } },
  none: { hidden: { opacity: 0 }, visible: { opacity: 1 } },
}

export default function ScrollReveal({
  children,
  className,
  delay = 0,
  direction = 'up',
  once = true,
}: ScrollRevealProps) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once, margin: '-50px' })

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={isInView ? 'visible' : 'hidden'}
      variants={variants[direction]}
      transition={{ duration: 0.6, delay, ease: [0.25, 0.46, 0.45, 0.94] }}
      className={className}
    >
      {children}
    </motion.div>
  )
}
