'use client'

import dynamic from 'next/dynamic'
import HeroContent from './HeroContent'
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion'

const HeroCanvas = dynamic(() => import('./HeroCanvas'), { ssr: false })

export default function HeroSection() {
  const reducedMotion = usePrefersReducedMotion()

  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
      style={{
        background:
          'radial-gradient(ellipse at 20% 50%, rgba(109,40,217,0.25) 0%, transparent 50%), radial-gradient(ellipse at 80% 20%, rgba(236,72,153,0.15) 0%, transparent 50%), radial-gradient(ellipse at 50% 100%, rgba(37,99,235,0.1) 0%, transparent 60%), #030712',
      }}
    >
      {/* 3D Canvas Background */}
      {!reducedMotion && (
        <div className="absolute inset-0 pointer-events-none">
          <HeroCanvas />
        </div>
      )}

      {/* Static gradient blobs (always visible) */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-purple-700/10 rounded-full blur-[100px]" />
        <div className="absolute bottom-1/3 right-1/4 w-[400px] h-[400px] bg-pink-600/10 rounded-full blur-[80px]" />
        <div className="absolute top-1/2 right-1/3 w-[300px] h-[300px] bg-blue-600/8 rounded-full blur-[60px]" />
      </div>

      {/* Content */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 pt-14 sm:pt-20">
        <HeroContent />
      </div>
    </section>
  )
}
