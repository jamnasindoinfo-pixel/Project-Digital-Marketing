import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Portfolio - PT Jaminan Solusi Bisnis',
  description: 'Lihat portfolio dan hasil kerja nyata kami dalam membantu ratusan client mendapatkan izin PPIU, PIHK, Bank Garansi, dan layanan bisnis lainnya dengan sukses.',
  keywords: [
    'portfolio PT Jaminan Solusi Bisnis',
    'project PPIU',
    'project PIHK',
    'project Bank Garansi',
    'konsultan izin berpengalaman',
    'hasil kerja konsultan',
    'project selesai'
  ],
  openGraph: {
    title: 'Portfolio - PT Jaminan Solusi Bisnis',
    description: 'Lihat portfolio dan hasil kerja nyata kami dalam membantu ratusan client mendapatkan izin dan layanan bisnis dengan sukses.',
    url: '/portfolio',
  },
}

export default function PortfolioLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}