import type { Metadata, Viewport } from 'next'
import { Space_Grotesk } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { PwaRegister } from '@/components/pwa/PwaRegister'
import './globals.css'

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-space-grotesk',
})

const BASE_URL = 'https://estin-average-calculator.vercel.app'

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: dark)', color: '#030712' },
    { media: '(prefers-color-scheme: light)', color: '#030712' },
  ],
  colorScheme: 'dark',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
}

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: 'ESTIN Average Calculator — Official Grading & ECTS Engine',
    template: '%s | ESTIN Average Calculator',
  },
  description:
    'The official semester average and ECTS credits calculator for ESTIN Béjaïa students. Calculate 1CP, 2CP, 1CS, and 2CS (AI & Cyber Security) grades with official formulas, real-time compensation, 100% offline PWA, and zero data collection.',
  applicationName: 'ESTIN Average Calculator',
  authors: [
    {
      name: 'Redouane Mohamed Islem',
      url: 'https://github.com/islemredouane',
    },
  ],
  creator: 'Redouane Mohamed Islem',
  publisher: 'ESTIN',
  category: 'education',
  keywords: [
    'ESTIN average calculator',
    'calcul moyenne estin',
    'estin grades',
    'estin grade calculator',
    'estin bejaia',
    'calculateur moyenne estin',
    'estin average',
    'estin credits ECTS',
    'estin 1CP',
    'estin 2CP',
    'estin 1CS',
    'estin 2CS IA',
    'estin 2CS Cyber Securite',
    'formule moyenne estin',
    'university average calculator algeria',
    'ecole superieure informatique bejaia',
  ],
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'ESTIN Average Calculator — Official Grading & ECTS Engine',
    description:
      'Official semester average and ECTS credits calculator for ESTIN Béjaïa students. Instant, 100% client-side, offline PWA covering all 10 semesters.',
    url: BASE_URL,
    siteName: 'ESTIN Average Calculator',
    locale: 'en_US',
    type: 'website',
    images: [
      {
        url: '/og.png',
        width: 1200,
        height: 630,
        alt: 'ESTIN Average Calculator — Official Grading Engine Preview',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ESTIN Average Calculator — Official Grading & ECTS Engine',
    description:
      'Official semester average and ECTS credits calculator for ESTIN Béjaïa students. 100% client-side offline PWA.',
    creator: '@islemredouane',
    images: ['/og.png'],
  },
  icons: {
    icon: [
      { url: '/icon.svg', type: 'image/svg+xml' },
      { url: '/favicon.ico' },
      { url: '/icons/favicon-32.png', sizes: '32x32', type: 'image/png' },
      { url: '/icons/icon-192.png', sizes: '192x192', type: 'image/png' },
      { url: '/icons/icon-512.png', sizes: '512x512', type: 'image/png' },
    ],
    apple: [
      { url: '/icons/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
  },
  manifest: '/manifest.webmanifest',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'ESTIN Calc',
  },
  formatDetection: {
    telephone: false,
  },
  verification: {
    google: 'qoBM-Cu5e5LU1w_2GOwKiuWhT7l8Z9eqZo0XNg77prE',
  },
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'WebApplication',
      '@id': `${BASE_URL}/#app`,
      name: 'ESTIN Average Calculator',
      url: BASE_URL,
      applicationCategory: 'EducationalApplication',
      operatingSystem: 'All',
      browserRequirements: 'Requires JavaScript. Requires HTML5.',
      offers: {
        '@type': 'Offer',
        price: '0',
        priceCurrency: 'DZD',
      },
      author: {
        '@type': 'Person',
        name: 'Redouane Mohamed Islem',
        url: 'https://github.com/islemredouane',
        email: 'm_redouane@estin.dz',
      },
      creator: {
        '@type': 'Person',
        name: 'Redouane Mohamed Islem',
      },
      description:
        'Official semester average and ECTS credits calculator for ESTIN Béjaïa students. 100% client-side, offline-ready, covering 1CP, 2CP, 1CS, and 2CS.',
      featureList: [
        'Real-time module, unit, and semester average calculation',
        'Official ESTIN formula (2*Exam + TD) / 3',
        'Automatic ECTS credit compensation tracking',
        'Support for all 10 ESTIN semesters (1CP, 2CP, 1CS, 2CS)',
        '100% client-side privacy with offline PWA support',
      ],
      screenshot: `${BASE_URL}/og.png`,
    },
    {
      '@type': 'EducationalOrganization',
      '@id': 'https://estin.dz/#organization',
      name: "ESTIN — École Supérieure en Sciences et Technologies de l'Informatique et du Numérique",
      url: 'https://estin.dz',
      address: {
        '@type': 'PostalAddress',
        streetAddress: 'RN 75',
        addressLocality: 'Amizour',
        addressRegion: 'Béjaïa',
        postalCode: '06340',
        addressCountry: 'DZ',
      },
    },
    {
      '@type': 'FAQPage',
      '@id': `${BASE_URL}/#faq`,
      mainEntity: [
        {
          '@type': 'Question',
          name: 'How is the module average calculated at ESTIN Béjaïa?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'At ESTIN Béjaïa, the module average is computed using the official formula: (2 * Exam + TD) / 3, where the exam counts for two-thirds (~66.67%) and continuous assessment (TD) counts for one-third (~33.33%).',
          },
        },
        {
          '@type': 'Question',
          name: 'How many ECTS credits are required to validate a semester at ESTIN?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Achieving an overall semester average of at least 10.00 / 20.00 awards all 30 ECTS credits for that semester through direct pass or compensation.',
          },
        },
        {
          '@type': 'Question',
          name: 'Does ESTIN Average Calculator store or upload student grades?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'No. The calculator is 100% client-side and runs completely inside your browser. No grades, names, or student data are ever sent to any remote server or stored in any database.',
          },
        },
        {
          '@type': 'Question',
          name: 'Can ESTIN Average Calculator be used offline?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Yes. It is built as a Progressive Web App (PWA) with a dedicated Service Worker that caches all core application files, enabling full offline calculation anytime.',
          },
        },
      ],
    },
  ],
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={spaceGrotesk.variable}>
      <head>
        <link rel="manifest" href="/manifest.webmanifest" />
        <link rel="icon" href="/icon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/icons/apple-touch-icon.png" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="bg-[#030712] text-white font-sans antialiased">
        {children}
        <PwaRegister />
        <Analytics />
      </body>
    </html>
  )
}
