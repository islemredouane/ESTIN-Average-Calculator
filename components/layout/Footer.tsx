import GithubStarButton from './GithubStarButton'
import Logo from './Logo'

export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="border-t border-purple-900/30 pt-10 pb-24 sm:pb-10 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-8">
          {/* Brand */}
          <div className="flex items-start gap-3">
            <Logo size={36} className="flex-shrink-0" />
            <div>
              <p className="text-sm font-bold text-white leading-none">ESTIN Average Calculator</p>
              <p className="mt-2 text-sm text-slate-400 leading-relaxed max-w-xs">
                A free tool for ESTIN students to track module grades and compute semester averages.
              </p>
            </div>
          </div>

          {/* Links */}
          <div className="flex items-center gap-2">
            <GithubStarButton />

            {/* Instagram */}
            <a
              href="https://www.instagram.com/isl8m.ai/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              className="group relative"
            >
              <div className="p-px rounded-xl bg-gradient-to-br from-purple-500/40 via-slate-700/30 to-pink-900/20 group-hover:from-pink-500/70 group-hover:via-purple-500/40 group-hover:to-orange-500/30 transition-all duration-300">
                <div className="w-9 h-9 rounded-[11px] bg-gradient-to-br from-slate-900 to-slate-950 flex items-center justify-center text-slate-400 group-hover:text-pink-300 transition-colors duration-300">
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z" />
                  </svg>
                </div>
              </div>
            </a>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-8 pt-6 border-t border-purple-900/20 flex flex-col-reverse sm:flex-row sm:items-center justify-between gap-3">
          <p className="text-xs text-slate-500">
            © {year} ESTIN Average Calculator ·{' '}
            <a
              href="https://www.estin.dz"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-purple-400 transition-colors"
            >
              ESTIN
            </a>
          </p>
          <p className="text-xs text-slate-500">
            Developed by{' '}
            <a
              href="https://github.com/islemredouane/ESTIN-Average-Calculator"
              target="_blank"
              rel="noopener noreferrer"
              className="text-purple-400 font-semibold hover:text-purple-300 transition-colors"
            >
              Redouane Mohamed Islem
            </a>
          </p>
        </div>
      </div>
    </footer>
  )
}
