import type { Metadata } from 'next'
import { Oswald, Inter } from 'next/font/google'
import './globals.css'

const oswald = Oswald({
  weight: ['500', '600', '700'],
  subsets: ['latin'],
  variable: '--font-oswald',
  display: 'swap',
})

const inter = Inter({
  weight: ['400', '500', '600', '700'],
  subsets: ['latin'],
  variable: '--font-inter',
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
    <html lang="en" className={`${oswald.variable} ${inter.variable}`}>
      <body className="tcg-body">
        {children}
      </body>
    </html>
  )
}
