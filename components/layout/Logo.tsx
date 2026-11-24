'use client'

import { useId } from 'react'

// x̄ (x-bar): the mathematical symbol for the mean.
export default function Logo({ size = 36, className = '' }: { size?: number; className?: string }) {
  const uid = useId().replace(/[^a-zA-Z0-9]/g, '')
  const border = `lg-bd-${uid}`
  const fill = `lg-bg-${uid}`
  const glyph = `lg-x-${uid}`
  const bar = `lg-bar-${uid}`

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      className={className}
      role="img"
      aria-label="ESTIN Average Calculator"
    >
      <defs>
        <linearGradient id={border} x1="0" y1="0" x2="48" y2="48" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#a78bfa" />
          <stop offset="50%" stopColor="#ec4899" />
          <stop offset="100%" stopColor="#6d28d9" />
        </linearGradient>
        <linearGradient id={fill} x1="0" y1="0" x2="48" y2="48" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#1e1040" />
          <stop offset="60%" stopColor="#0f172a" />
          <stop offset="100%" stopColor="#020617" />
        </linearGradient>
        <linearGradient id={glyph} x1="14" y1="18" x2="34" y2="38" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#ede9fe" />
          <stop offset="100%" stopColor="#fbcfe8" />
        </linearGradient>
        <linearGradient id={bar} x1="14" y1="0" x2="34" y2="0" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#a78bfa" />
          <stop offset="100%" stopColor="#f472b6" />
        </linearGradient>
      </defs>

      <rect width="48" height="48" rx="13" fill={`url(#${border})`} />
      <rect x="1.5" y="1.5" width="45" height="45" rx="11.5" fill={`url(#${fill})`} />

      <rect x="14" y="10" width="20" height="4.5" rx="2.25" fill={`url(#${bar})`} />
      <path
        d="M16 19.5 32 35.5M32 19.5 16 35.5"
        stroke={`url(#${glyph})`}
        strokeWidth="4.5"
        strokeLinecap="round"
        fill="none"
      />
    </svg>
  )
}
