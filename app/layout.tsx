import type { Metadata } from 'next'
import { Space_Grotesk } from 'next/font/google'
import { Analytics } from '@vercel/analytics/react'
import './globals.css'

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-space-grotesk',
})

export const metadata: Metadata = {
  title: 'ESTIN Average Calculator',
  description: "Calculate your semester's average based on the official grading formulas.",
  keywords:
    'ESTIN average calculator, estin, estin grades, estin grade, estin average, estin grade calculator, estin bib, estin repisotery, university average calculator',
  verification: {
    google: 'qoBM-Cu5e5LU1w_2GOwKiuWhT7l8Z9eqZo0XNg77prE',
  },
  icons: {
    icon: [{ url: '/icon.svg', type: 'image/svg+xml' }],
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={spaceGrotesk.variable}>
      <body className="bg-[#030712] text-white font-sans antialiased">
        {children}
        <Analytics />
      </body>
    </html>
  )
}
