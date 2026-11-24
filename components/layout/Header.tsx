'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import GithubStarButton from './GithubStarButton'

const NAV_LINKS = [
  { label: 'Home', href: '#home' },
  { label: 'Calculator', href: '#calculator' },
  { label: 'Results', href: '#results' },
]

function HamburgerIcon({ open }: { open: boolean }) {
  const bar = 'absolute left-0 h-[2px] w-5 rounded-full bg-current'
  return (
    <div className="relative w-5 h-5">
      <motion.span
        className={bar}
        animate={open ? { top: '50%', y: '-50%', rotate: 45 } : { top: 2, y: 0, rotate: 0 }}
        transition={{ duration: 0.25, ease: 'easeInOut' }}
      />
      <motion.span
        className={bar}
        style={{ top: '50%', y: '-50%' }}
        animate={{ opacity: open ? 0 : 1, scale: open ? 0.5 : 1 }}
        transition={{ duration: 0.15 }}
      />
      <motion.span
        className={bar}
        animate={open ? { top: '50%', y: '-50%', rotate: -45 } : { top: 18, y: 0, rotate: 0 }}
        transition={{ duration: 0.25, ease: 'easeInOut' }}
      />
    </div>
  )
}

export default function Header() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    if (!menuOpen) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setMenuOpen(false)
    document.addEventListener('keydown', onKey)
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = prevOverflow
    }
  }, [menuOpen])

  return (
    <>
    <header
      className={`fixed top-0 left-0 right-0 z-[70] transition-all duration-300 border-b ${
        scrolled || menuOpen
          ? 'glass border-purple-900/30 shadow-[0_4px_30px_rgba(0,0,0,0.5)]'
          : 'bg-transparent border-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="p-px rounded-xl bg-gradient-to-br from-purple-500/70 via-pink-500/40 to-purple-900/30">
              <div className="w-9 h-9 rounded-[11px] bg-gradient-to-br from-purple-950 via-slate-900 to-slate-950 flex items-center justify-center">
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" strokeLinecap="round" strokeLinejoin="round">
                  <defs>
                    <linearGradient id="hSigma" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#ddd6fe" />
                      <stop offset="100%" stopColor="#fbcfe8" />
                    </linearGradient>
                  </defs>
                  <polyline points="19,4 5,4 15,12 5,20 19,20" stroke="url(#hSigma)" strokeWidth="2.25" />
                </svg>
              </div>
            </div>
            <div>
              <h1 className="text-lg font-bold text-white leading-none">ESTIN</h1>
              <span className="text-xs text-purple-400 leading-none">Average Calculator</span>
            </div>
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-3">
            <nav className="flex items-center gap-1">
              {NAV_LINKS.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="px-4 py-2 text-sm text-slate-300 hover:text-white hover:bg-purple-900/30 rounded-lg transition-all duration-200"
                >
                  {link.label}
                </a>
              ))}
            </nav>
            <div className="w-px h-6 bg-purple-900/40" />
            <GithubStarButton />
          </div>

          {/* Hamburger */}
          <button
            className="md:hidden relative z-[70] w-9 h-9 flex items-center justify-center text-slate-300 hover:text-white transition-colors"
            onClick={() => setMenuOpen((v) => !v)}
            aria-label="Toggle menu"
            aria-expanded={menuOpen}
          >
            <HamburgerIcon open={menuOpen} />
          </button>
        </div>
      </div>
    </header>

    {/* Mobile full-screen menu */}
    <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="md:hidden fixed inset-0 z-[60] bg-slate-950/97 backdrop-blur-xl"
          >
            {/* ambient glow */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[320px] h-[200px] bg-purple-600/20 blur-[100px] pointer-events-none" />

            <div className="relative h-full flex flex-col px-6 pt-24 pb-10">
              <nav className="flex flex-col gap-1">
                {NAV_LINKS.map((link, i) => (
                  <motion.a
                    key={link.href}
                    href={link.href}
                    onClick={() => setMenuOpen(false)}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.08 + i * 0.06 }}
                    className="group flex items-center justify-between py-4 border-b border-purple-900/20 text-2xl font-semibold text-slate-200 hover:text-white transition-colors"
                  >
                    {link.label}
                    <svg
                      className="w-5 h-5 text-purple-500 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M5 12h14M13 6l6 6-6 6" />
                    </svg>
                  </motion.a>
                ))}
              </nav>

              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.3 }}
                className="mt-auto flex flex-col gap-4"
              >
                <GithubStarButton className="w-full justify-center h-11" />
                <a
                  href="https://www.instagram.com/isl8m.ai/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 h-11 rounded-xl border border-purple-900/30 bg-slate-900/60 text-sm text-slate-300 hover:text-pink-300 hover:border-pink-500/40 transition-colors"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z" />
                  </svg>
                  Instagram
                </a>
                <p className="text-center text-xs text-slate-500 pt-2">
                  Developed by{' '}
                  <span className="text-purple-400 font-semibold">Redouane Mohamed Islem</span>
                </p>
              </motion.div>
            </div>
          </motion.div>
        )}
    </AnimatePresence>
    </>
  )
}
