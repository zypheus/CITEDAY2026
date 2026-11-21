import type { Metadata } from 'next'
import { Press_Start_2P, VT323 } from 'next/font/google'
import './globals.css'

const pressStart2P = Press_Start_2P({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-press-start',
  display: 'swap',
})

const vt323 = VT323({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-vt323',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'CITE DAY 2026 | Team Marines',
  description:
    'Official roster for Team Marines at CITE DAY 2026. Review all participants, competitions, and operations.',
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || 'https://cite-day-2026.vercel.app'
  ),
  openGraph: {
    title: 'CITE DAY 2026 | Team Marines',
    description:
      'Official roster for Team Marines at CITE DAY 2026. Review all participants, competitions, and operations.',
    siteName: 'Team Marines CITE DAY 2026',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${pressStart2P.variable} ${vt323.variable}`}>
      <body className="crt-screen">
        {children}
      </body>
    </html>
  )
}
