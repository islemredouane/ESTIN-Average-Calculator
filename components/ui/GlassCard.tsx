import { cn } from '@/lib/utils'

interface GlassCardProps {
  children: React.ReactNode
  className?: string
  glow?: 'purple' | 'pink' | 'blue' | 'green' | 'red' | 'none'
}

export default function GlassCard({ children, className, glow = 'none' }: GlassCardProps) {
  const glowClass = {
    purple: 'hover:shadow-[0_0_30px_rgba(139,92,246,0.25)]',
    pink: 'hover:shadow-[0_0_30px_rgba(236,72,153,0.25)]',
    blue: 'hover:shadow-[0_0_30px_rgba(96,165,250,0.25)]',
    green: 'shadow-[0_0_20px_rgba(16,185,129,0.15)] hover:shadow-[0_0_30px_rgba(16,185,129,0.25)]',
    red: 'shadow-[0_0_20px_rgba(239,68,68,0.15)] hover:shadow-[0_0_30px_rgba(239,68,68,0.25)]',
    none: '',
  }[glow]

  return (
    <div
      className={cn(
        'glass rounded-2xl border border-purple-900/30 transition-all duration-300',
        glowClass,
        className
      )}
    >
      {children}
    </div>
  )
}
