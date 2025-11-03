import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Script from 'next/script'
import { ErrorBoundary } from '@/components/ui/error-boundary'
import { GoogleAnalytics } from '@/components/analytics/GoogleAnalytics'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: {
    default: 'PT Jaminan Solusi Bisnis - Solusi Lengkap Izin Travel dan Layanan Bisnis',
    template: '%s | PT Jaminan Solusi Bisnis'
  },
  description: 'Pendampingan tenaga ahli berpengalaman untuk izin PPIU, PIHK, Akreditasi, IATA, serta layanan administrasi bisnis seperti pajak, bank garansi, dan laporan keuangan. 500+ client puas, 6+ tahun pengalaman.',
  keywords: [
    'PPIU',
    'PIHK',
    'Izin Travel',
    'Akreditasi Travel',
    'IATA',
    'Izin Umrah',
    'Izin Haji',
    'Konsultan Pajak',
    'Bank Garansi',
    'Laporan Keuangan',
    'Administrasi Kontraktor',
    'PT Jaminan Solusi Bisnis'
  ],
  authors: [{ name: 'PT Jaminan Solusi Bisnis' }],
  creator: 'PT Jaminan Solusi Bisnis',
  publisher: 'PT Jaminan Solusi Bisnis',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'id_ID',
    url: '/',
    siteName: 'PT Jaminan Solusi Bisnis',
    title: 'PT Jaminan Solusi Bisnis - Solusi Lengkap Izin Travel dan Layanan Bisnis',
    description: 'Pendampingan tenaga ahli berpengalaman untuk izin PPIU, PIHK, Akreditasi, IATA, serta layanan administrasi bisnis. 500+ client puas.',
    images: [
      {
        url: '/images/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'PT Jaminan Solusi Bisnis',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'PT Jaminan Solusi Bisnis - Solusi Lengkap Izin Travel dan Layanan Bisnis',
    description: 'Pendampingan tenaga ahli berpengalaman untuk izin PPIU, PIHK, Akreditasi, IATA, serta layanan administrasi bisnis.',
    images: ['/images/og-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-verification-code',
    yandex: 'your-yandex-verification-code',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="id">
      <head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="manifest" href="/site.webmanifest" />
        <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#5bbad5" />
        <meta name="msapplication-TileColor" content="#da532c" />
        <meta name="theme-color" content="#ffffff" />
      </head>
      <body className={inter.className}>
        <ErrorBoundary>
          {children}
        </ErrorBoundary>
        <GoogleAnalytics measurementId={process.env.NEXT_PUBLIC_GA_ID || ''} />
      </body>
    </html>
  )
}