import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import AuthProviderWrapper from '../components/AuthProvider'
import { SITE_URL, SITE_NAME, DEFAULT_OG_IMAGE } from '../lib/site'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'MIXD Entertainment | Chicago Wedding & Event DJs',
    template: `%s | ${SITE_NAME}`,
  },
  description:
    'MIXD Entertainment provides professional DJ and MC services for weddings, mitzvahs, school dances, and private events in Chicago. 15+ years of experience keeping your event flowing and your guests dancing.',
  keywords: [
    'Chicago DJ',
    'wedding DJ Chicago',
    'event DJ',
    'mitzvah DJ',
    'school dance DJ',
    'private event DJ',
    'corporate event DJ',
    'MC services',
  ],
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: SITE_URL,
    siteName: SITE_NAME,
    title: 'MIXD Entertainment | Chicago Wedding & Event DJs',
    description:
      'Professional DJ and MC services for weddings, mitzvahs, school dances, and private events in Chicago.',
    images: [
      {
        url: DEFAULT_OG_IMAGE,
        width: 1200,
        height: 630,
        alt: 'MIXD Entertainment DJ performing at an event',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'MIXD Entertainment | Chicago Wedding & Event DJs',
    description:
      'Professional DJ and MC services for weddings, mitzvahs, school dances, and private events in Chicago.',
    images: [DEFAULT_OG_IMAGE],
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProviderWrapper>{children}</AuthProviderWrapper>
      </body>
    </html>
  )
}
