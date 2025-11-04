import { notFound } from 'next/navigation'
import { Metadata } from 'next'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { CheckCircle, Clock, Phone, ArrowRight, Users, FileText, Star, MapPin, Shield, Award, Calculator, Download, ChevronRight } from 'lucide-react'
import { SERVICES, COMPANY_INFO, FAQ_DATA } from '@/lib/constants'
import Link from 'next/link'
import { Navigation } from '@/components/layout/Navigation'
import { Footer } from '@/components/layout/Footer'
import { createWhatsAppLink } from '@/lib/utils'

interface ServicePageProps {
  params: Promise<{
    service: string
  }>
}

// SEO Data Generation
function generateSEOMetadata(service: any, category: string): Metadata {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://ptjaminansolusibisnis.com'
  const serviceUrl = `${baseUrl}/services/${service.id}`

  // Keywords specific to each service
  const keywords = {
    ppiu: 'jasa PPIU, izin PPIU, pengurusan PPIU, biaya PPIU, syarat PPIU, konsultan travel umrah, penyelenggara perjalanan ibadah umrah, izin travel umrah Jakarta',
    pihk: 'jasa PIHK, izin PIHK, pengurusan PIHK, biaya PIHK, syarat PIHK, konsultan travel haji, penyelenggara ibadah haji khusus, izin travel haji plus',
    akreditasi: 'akreditasi travel, akreditasi PPIU, akreditasi PIHK, perpanjangan akreditasi, sertifikasi travel, kualifikasi travel, akreditasi Kemenag',
    iata: 'keanggotaan IATA, IATA travel agent, biaya IATA, syarat IATA, konsultan IATA, BSP IATA, CASS IATA, travel agent bersertifikat IATA',
    pajak: 'konsultan pajak, jasa konsultan pajak, konsultan pajak perusahaan, konsultan pajak Jakarta, tax planning, SPT pajak, konsultasi perpajakan',
    bankGaransi: 'bank garansi, jasa bank garansi, pengajuan bank garansi, biaya bank garansi, syarat bank garansi, jaminan pelaksanaan, jaminan uang muka',
    laporanKeuangan: 'jasa pembukuan, laporan keuangan, jasa akuntan, pembukuan perusahaan, konsultan keuangan, laporan keuangan bulanan, jasa accounting',
    kontraktor: 'administrasi kontraktor, SBU kontraktor, IUJK kontraktor, konsultan kontraktor, pengurusan SBU, izin kontraktor, sertifikasi kontraktor'
  }

  const descriptions = {
    ppiu: 'Jasa pengurusan izin PPIU profesional di Jakarta. Proses cepat 60-90 hari dengan tim berpengalaman. Dapatkan pendampingan lengkap untuk izin travel umrah Anda.',
    pihk: 'Konsultan profesional untuk pengurusan izin PIHK. Proses 90-120 hari dengan success rate 95%. Konsultasi gratis untuk persyaratan PIHK.',
    akreditasi: 'Jasa perpanjangan dan pengurusan akreditasi travel baru. Proses 30-45 hari dengan tim ahli Kemenag. Dapatkan akreditasi resmi untuk travel Anda.',
    iata: 'Konsultan keanggotaan IATA profesional. Proses 45-60 hari untuk mendapatkan akses ke 290+ maskapai. Konsultasi eligibility dan persyaratan.',
    pajak: 'Konsultan pajak profesional untuk perusahaan. Tax planning, compliance, dan optimasi pajak. Tim bersertifikat dengan pengalaman 6+ tahun.',
    bankGaransi: 'Jasa pengajuan bank garansi untuk berbagai keperluan. Proses 14-21 hari dengan rate kompetitif. Full support dari dokumen hingga cair.',
    laporanKeuangan: 'Jasa pembukuan dan laporan keuangan profesional. Reporting akurat dan compliance ready. Support bulanan untuk bisnis Anda.',
    kontraktor: 'Layanan administrasi lengkap untuk perusahaan kontraktor. Pengurusan SBU, IUJK, dan dokumen proyek. Tim ahli berpengalaman.'
  }

  return {
    title: `${service.fullName} - Jasa Profesional | PT Jaminan Solusi Bisnis`,
    description: descriptions[service.id as keyof typeof descriptions] || `Layanan profesional ${service.fullName} oleh PT Jaminan Solusi Bisnis. Pengalaman 6+ tahun, 500+ client puas. Konsultasi gratis!`,
    keywords: keywords[service.id as keyof typeof keywords] || `jasa ${service.name}, ${service.fullName}, konsultan profesional, Jakarta, Indonesia`,
    openGraph: {
      title: `${service.fullName} - PT Jaminan Solusi Bisnis`,
      description: descriptions[service.id as keyof typeof descriptions] || `Layanan profesional ${service.fullName} terpercaya`,
      type: 'article',
      url: serviceUrl,
      images: [{
        url: `${baseUrl}/og-${service.id}.jpg`,
        width: 1200,
        height: 630,
        alt: `${service.fullName} - PT Jaminan Solusi Bisnis`
      }],
      locale: 'id_ID',
      siteName: 'PT Jaminan Solusi Bisnis'
    },
    twitter: {
      card: 'summary_large_image',
      title: `${service.fullName} - PT Jaminan Solusi Bisnis`,
      description: descriptions[service.id as keyof typeof descriptions] || `Layanan profesional ${service.fullName} terpercaya`,
      images: [`${baseUrl}/og-${service.id}.jpg`]
    },
    alternates: {
      canonical: serviceUrl
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
  }
}

// Service-specific additional data
const serviceDetails = {
  ppiu: {
    requirements: [
      'Badan hukum Perseroan Terbatas (PT)',
      'Nomor Induk Berusaha (NIB)',
      'Nomor Pokok Wajib Pajak (NPWP)',
      'Minimal 2 orang SDM bersertifikat Bimbingan Ibadah Umrah',
      'Rekening bank atas nama perusahaan',
      'Akta pendirian dan perubahan (jika ada)',
      'Surat keterangan domisili perusahaan',
      'Bukti kepemilikan atau sewa kantor minimal 50m²',
      'Struktur organisasi yang jelas',
      'Standar Operasional Prosedur (SOP) layanan'
    ],
    timeline: [
      { phase: 'Konsultasi & Assessment', duration: '1-3 hari', description: 'Evaluasi kesiapan perusahaan dan identifikasi kebutuhan' },
      { phase: 'Persiapan Dokumen', duration: '7-14 hari', description: 'Pengumpulan dan lengkapi semua persyaratan dokumen' },
      { phase: 'Pengajuan Awal', duration: '3-5 hari', description: 'Submit ke Kemenag dan proses verifikasi administrasi' },
      { phase: 'Verifikasi Lapangan', duration: '14-21 hari', description: 'Tim Kemenag melakukan pengecekan lokasi dan fasilitas' },
      { phase: 'Evaluasi & Rekomendasi', duration: '21-30 hari', description: 'Proses evaluasi komite dan pembuatan rekomendasi' },
      { phase: 'Penerbitan Izin', duration: '7-14 hari', description: 'Tanda tangan dan penerbitan izin PPIU resmi' }
    ],
    pricing: {
      consultation: 'Gratis',
      processing: 'Rp 50.000.000 - 150.000.000',
      government: 'sesuai ketentuan',
      additional: 'Biaya akomodasi verifikasi (jika ada)'
    },
    benefits: [
      'Legalitas usaha travel umrah yang resmi',
      'Kepercayaan calon jamaah meningkat',
      'Akses ke sistem pendaftaran umrah online',
      'Dapat melakukan kerja sama dengan provider',
      'Persyaratan utama untuk operasional travel umrah',
      'Perlindungan hukum dalam operasional',
      'Dapat mengajukan visa jamaah langsung',
      'Akses ke fasilitas dan program Kemenag'
    ]
  },
  pihk: {
    requirements: [
      'Badan hukum PT (minimal 2 tahun operasional)',
      'Sudah memiliki izin PPIU',
      'Pengalaman menyelenggarakan umrah minimal 2 tahun',
      'Minimal 100 jamaah per tahun selama 2 tahun terakhir',
      'Modal minimal sesuai ketentuan Kemenag',
      'SDM bersertifikat Bimbingan Ibadah Haji',
      'Fasilitas kantor yang memadai',
      'Sistem manajemen yang terstruktur',
      'Program dan paket haji yang jelas',
      'Reputasi baik tanpa keluhan besar'
    ],
    timeline: [
      { phase: 'Evaluasi Kelayakan', duration: '3-5 hari', description: 'Assessment komprehensif kesiapan perusahaan' },
      { phase: 'Persiapan Dokumen', duration: '14-21 hari', description: 'Dokumentasi lengkap dan persyaratan khusus PIHK' },
      { phase: 'Pengajuan & Verifikasi', duration: '7-10 hari', description: 'Submit dan proses verifikasi awal Kemenag' },
      { phase: 'Assessment Lapangan', duration: '21-30 hari', description: 'Tim Kemenag melakukan evaluasi komprehensif' },
      { phase: 'Evaluasi Komite', duration: '30-45 hari', description: 'Proses evaluasi oleh komite PIHK' },
      { phase: 'Penerbitan Rekomendasi', duration: '14-21 hari', description: 'Rekomendasi dan proses final izin PIHK' }
    ],
    pricing: {
      consultation: 'Gratis',
      processing: 'Rp 100.000.000 - 300.000.000',
      government: 'sesuai ketentuan',
      additional: 'Biaya assessment dan verifikasi'
    },
    benefits: [
      'Legalitas usaha travel haji plus resmi',
      'Akses langsung ke kuota haji plus',
      'Kepercayaan pasar jamaah haji plus',
      'Dapat mengatur paket haji premium',
      'Akses ke fasilitas haji Indonesia',
      'Partnership dengan pihak Arab Saudi',
      'Revenue yang lebih tinggi dari umrah',
      'Posisi premium di industri travel haji'
    ]
  },
  akreditasi: {
    requirements: [
      'Izin PPIU/PIHK yang masih berlaku',
      'Laporan pelaksanaan ibadah 2 tahun terakhir',
      'Dokumentasi fasilitas dan SDM',
      'Sertifikat kompetensi SDM yang masih berlaku',
      'Bukti pelaksanaan pelatikan internal',
      'Standar pelayanan minimal',
      'Sistem kendali internal',
      'Program peningkatan kapasitas',
      'Laporan keuangan 2 tahun terakhir',
      'Evaluasi kinerja perusahaan'
    ],
    timeline: [
      { phase: 'Assessment Awal', duration: '3-5 hari', description: 'Evaluasi kesiapan dan gap analysis' },
      { phase: 'Perbaikan Dokumen', duration: '7-10 hari', description: 'Melengkapi dokumen yang kurang' },
      { phase: 'Pengajuan Akreditasi', duration: '3-5 hari', description: 'Submit ke Kemenag untuk proses akreditasi' },
      { phase: 'Verifikasi & Visitasi', duration: '7-14 hari', description: 'Tim verifikasi melakukan pengecekan' },
      { phase: 'Evaluasi Tim Akreditasi', duration: '7-10 hari', description: 'Proses evaluasi oleh tim ahli' },
      { phase: 'Penerbitan Sertifikat', duration: '3-5 hari', description: 'Terbitnya sertifikat akreditasi' }
    ],
    pricing: {
      consultation: 'Gratis',
      processing: 'Rp 30.000.000 - 75.000.000',
      government: 'sesuai ketentuan',
      additional: 'Biaya visitasi dan assessment'
    },
    benefits: [
      'Meningkatnya kepercayaan calon jamaah',
      'Persyaratan untuk operasional berkelanjutan',
      'Standar kualitas yang diakui Kemenag',
      'Akses ke program dan fasilitas Kemenag',
      'Meningkatnya daya saing bisnis',
      'Perlindungan hukum yang lebih kuat',
      'Kemudahan dalam perpanjangan izin',
      'Reputasi bisnis yang lebih baik'
    ]
  },
  iata: {
    requirements: [
      'Badan hukum PT (minimal 1 tahun operasional)',
      'NPWP perusahaan yang aktif',
      'Laporan keuangan 2 tahun terakhir',
      'Rekening koran 6 bulan terakhir',
      'Izin usaha yang relevan (travel agent)',
      'Referensi bank dari bank komersial',
      'Surat rekomendasi dari maskapai (jika ada)',
      'Fasilitas kantor yang memadai',
      'SDM dengan pengalaman industri penerbangan',
      'Sistem reservasi dan manajemen'
    ],
    timeline: [
      { phase: 'Eligibility Check', duration: '3-5 hari', description: 'Verifikasi kelayakan perusahaan' },
      { phase: 'Document Preparation', duration: '7-14 hari', description: 'Persiapan dokumen aplikasi IATA' },
      { phase: 'Application Submission', duration: '3-5 hari', description: 'Submit aplikasi ke IATA' },
      { phase: 'Financial Review', duration: '14-21 hari', description: 'Review finansial oleh IATA' },
      { phase: 'Background Check', duration: '7-10 hari', description: 'Verifikasi latar belakang perusahaan' },
      { phase: 'Approval & Onboarding', duration: '7-14 hari', description: 'Approval dan proses onboarding' }
    ],
    pricing: {
      consultation: 'Gratis',
      processing: 'Rp 40.000.000 - 100.000.000',
      government: 'sesuai ketentuan IATA',
      additional: 'Biaya pengujian dan verifikasi'
    },
    benefits: [
      'Akses ke 290+ maskapai penerbangan',
      'Sistem Billing and Settlement Plan (BSP)',
      'Kepercayaan pelanggan yang lebih tinggi',
      'Akses ke sistem reservasi global',
      'Kemudahan dalam issuing tiket',
      'Rate komisi yang lebih baik',
      'Dukungan teknis dari IATA',
      'Networking dalam industri penerbangan'
    ]
  },
  pajak: {
    requirements: [
      'NPWP perusahaan yang aktif',
      'Laporan keuangan terakhir',
      'Data transaksi pajak',
      'Dokumen pendukung pajak',
      'KTP dan NPWP direksi/komisaris',
      'Akta perusahaan terbaru',
      'Surat keterangan domisili',
      'Kontrak dan dokumen bisnis relevan',
      'Bukti pembayaran pajak sebelumnya',
      'Informasi struktur perusahaan'
    ],
    timeline: [
      { phase: 'Analisis Awal', duration: '1-3 hari', description: 'Review kondisi pajak perusahaan' },
      { phase: 'Collecting Data', duration: '3-7 hari', description: 'Pengumpulan dokumen dan data pajak' },
      { phase: 'Tax Planning', duration: '5-10 hari', description: 'Perencanaan dan strategi pajak' },
      { phase: 'Implementation', duration: 'Ongoing', description: 'Implementasi strategi pajak' },
      { phase: 'Compliance Check', duration: '3-5 hari', description: 'Verifikasi kepatuhan pajak' },
      { phase: 'Reporting & Monitoring', duration: 'Monthly/Quarterly', description: 'Laporan dan monitoring berkala' }
    ],
    pricing: {
      consultation: 'Gratis',
      processing: 'Rp 5.000.000 - 50.000.000/bulan',
      government: 'sesuai ketentuan',
      additional: 'Biaya audit dan review khusus'
    },
    benefits: [
      'Optimasi beban pajak yang legal',
      'Menghindari sanksi pajak',
      'Struktur pajak yang efisien',
      'Konsultasi pajak berkala',
      'Update regulasi pajak terbaru',
      'Representasi dalam tax audit',
      'Planning transaksi pajak',
      'Pelaporan pajak tepat waktu'
    ]
  },
  bankGaransi: {
    requirements: [
      'Akta perusahaan lengkap',
      'NIB dan NPWP perusahaan',
      'SPT tahunan 2 tahun terakhir',
      'Laporan keuangan 6 bulan terakhir',
      'Dokumen proyek atau kontrak',
      'Identitas direksi dan pemegang saham',
      'Surat keterangan domisili',
      'Referensi dari bank lain (jika ada)',
      'Bukti kepemilikan aset (jika required)',
      'Rencana penggunaan dana'
    ],
    timeline: [
      { phase: 'Preparation', duration: '2-3 hari', description: 'Persiapan dokumen aplikasi' },
      { phase: 'Bank Selection', duration: '1-2 hari', description: 'Pemilihan bank yang sesuai' },
      { phase: 'Application Submission', duration: '1-2 hari', description: 'Submit aplikasi ke bank' },
      { phase: 'Credit Analysis', duration: '5-7 hari', description: 'Analisis kredit oleh bank' },
      { phase: 'Approval Process', duration: '3-5 hari', description: 'Proses approval komite kredit' },
      { phase: 'Issuance', duration: '1-2 hari', description: 'Penerbitan bank garansi' }
    ],
    pricing: {
      consultation: 'Gratis',
      processing: '1-3% dari nilai garansi/tahun',
      government: 'sesuai ketentuan bank',
      additional: 'Biaya provisi dan administrasi'
    },
    benefits: [
      'Meningkatnya kepercayaan project owner',
      'Persyaratan untuk tender proyek',
      'Perlindungan bagi pihak ketiga',
      'Reputasi perusahaan yang lebih baik',
      'Akses ke proyek-proyek besar',
      'Kemudahan dalam pengajuan kredit',
      'Jaminan pelaksanaan kontrak',
      'Support business expansion'
    ]
  },
  laporanKeuangan: {
    requirements: [
      'Data transaksi keuangan',
      'Rekening koran perusahaan',
      'Invoice dan bukti transaksi',
      'Data aset dan kewajiban',
      'Informasi struktur perusahaan',
      'Akses ke sistem akuntansi (jika ada)',
      'Dokumen perpajakan terkait',
      'Laporan keuangan sebelumnya',
      'Informasi kebijakan akuntansi',
      'Data payroll dan karyawan'
    ],
    timeline: [
      { phase: 'System Setup', duration: '3-5 hari', description: 'Setup sistem pembukuan' },
      { phase: 'Data Collection', duration: 'Ongoing', description: 'Pengumpulan data transaksi' },
      { phase: 'Recording', duration: 'Daily/Weekly', description: 'Pencatatan transaksi rutin' },
      { phase: 'Reconciliation', duration: 'Monthly', description: 'Rekonsiliasi akun' },
      { phase: 'Reporting', duration: 'Monthly', description: 'Penyusunan laporan keuangan' },
      { phase: 'Review & Analysis', duration: '2-3 hari', description: 'Review dan analisis laporan' }
    ],
    pricing: {
      consultation: 'Gratis',
      processing: 'Rp 3.000.000 - 15.000.000/bulan',
      government: 'sesuai ketentuan',
      additional: 'Biaya software dan tools khusus'
    },
    benefits: [
      'Laporan keuangan yang akurat dan tepat waktu',
      'Pemantauan kesehatan keuangan perusahaan',
      'Kemudahan dalam pengambilan keputusan',
      'Kepatuhan terhadap standar akuntansi',
      'Dukungan untuk perpajakan',
      'Analisis kinerja bisnis',
      'Budgeting dan forecasting',
      'Support untuk pengajuan kredit'
    ]
  },
  kontraktor: {
    requirements: [
      'Akta pendirian perusahaan',
      'NIB dan NPWP perusahaan',
      'Izin usaha yang relevan',
      'Struktur organisasi perusahaan',
      'Data tenaga ahli bersertifikat',
      'Pengalaman proyek sebelumnya',
      'Fasilitas dan peralatan kerja',
      'Laporan keuangan perusahaan',
      'Dokumen kualifikasi personil',
      'Sistem manajemen mutu (jika ada)'
    ],
    timeline: [
      { phase: 'Assessment', duration: '3-5 hari', description: 'Evaluasi kesiapan perusahaan' },
      { phase: 'Document Preparation', duration: '7-14 hari', description: 'Persiapan dokumen SBU/IUJK' },
      { phase: 'Application', duration: '2-3 hari', description: 'Submit ke LPJK/Kementerian' },
      { phase: 'Verification', duration: '7-14 hari', description: 'Proses verifikasi dokumen' },
      { phase: 'Approval', duration: '5-10 hari', description: 'Proses approval dan penerbitan' },
      { phase: 'Ongoing Support', duration: 'Ongoing', description: 'Support administrasi proyek' }
    ],
    pricing: {
      consultation: 'Gratis',
      processing: 'Rp 10.000.000 - 50.000.000',
      government: 'sesuai ketentuan',
      additional: 'Biaya verifikasi dan asuransi'
    },
    benefits: [
      'Legalitas usaha kontraktor yang resmi',
      'Akses ke tender proyek pemerintah/swasta',
      'Klasifikasi perusahaan yang jelas',
      'Meningkatnya kepercayaan klien',
      'Support administrasi proyek lengkap',
      'Manajemen dokumen proyek',
      'Laporan kemajuan proyek berkala',
      'Compliance dengan regulasi konstruksi'
    ]
  }
}

export async function generateMetadata({ params }: ServicePageProps): Promise<Metadata> {
  const { service: serviceId } = await params

  // Find service in both categories
  const allServices = [
    ...SERVICES.travel.items,
    ...SERVICES.business.items
  ]

  const service = allServices.find(s => s.id === serviceId)
  const category = SERVICES.travel.items.find(s => s.id === serviceId) ? 'travel' : 'business'

  if (!service) {
    return {
      title: 'Layanan Tidak Ditemukan - PT Jaminan Solusi Bisnis',
      description: 'Layanan yang Anda cari tidak tersedia.'
    }
  }

  return generateSEOMetadata(service, category)
}

export default async function ServicePage({ params }: ServicePageProps) {
  const { service: serviceId } = await params

  // Find service in both categories
  const allServices = [
    ...SERVICES.travel.items,
    ...SERVICES.business.items
  ]

  const service = allServices.find(s => s.id === serviceId)

  if (!service) {
    notFound()
  }

  const category = SERVICES.travel.items.find(s => s.id === serviceId) ? 'travel' : 'business'
  const categoryData = category === 'travel' ? SERVICES.travel : SERVICES.business
  const serviceSpecificDetails = serviceDetails[serviceId as keyof typeof serviceDetails]

  const whatsappMessage = createWhatsAppLink(
    `Halo PT Jaminan Solusi Bisnis, saya tertarik untuk konsultasi mengenai layanan ${service.fullName}. Mohon info lebih lanjut.`
  )

  // Get related FAQs
  const relatedFAQs = FAQ_DATA[category as keyof typeof FAQ_DATA]?.filter(
    faq => faq.category === serviceId
  ) || []

  // Get related services
  const relatedServices = allServices.filter(s => {
    const serviceCategory = SERVICES.travel.items.find(item => item.id === s.id) ? 'travel' : 'business'
    return serviceCategory === category && s.id !== serviceId
  }).slice(0, 3)

  // Structured data for SEO
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: service.fullName,
    description: service.description,
    provider: {
      '@type': 'Organization',
      name: 'PT Jaminan Solusi Bisnis',
      url: process.env.NEXT_PUBLIC_SITE_URL,
      telephone: COMPANY_INFO.phone,
      address: {
        '@type': 'PostalAddress',
        streetAddress: 'Jl. Contoh Alamat No. 123',
        addressLocality: 'Jakarta Pusat',
        addressRegion: 'DKI Jakarta',
        postalCode: '10110',
        addressCountry: 'ID'
      }
    },
    serviceType: service.fullName,
    areaServed: 'Indonesia',
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: `Layanan ${service.fullName}`,
      itemListElement: [{
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: service.fullName,
          description: service.description
        },
        availability: 'https://schema.org/InStock'
      }]
    }
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      <div className="min-h-screen">
        <Navigation />

        {/* Breadcrumb */}
        <section className="bg-gray-50 py-4">
          <div className="container-custom">
            <nav className="flex items-center gap-2 text-sm text-gray-600">
              <Link href="/" className="hover:text-brand-600">Beranda</Link>
              <ChevronRight className="w-4 h-4" />
              <Link href="/services" className="hover:text-brand-600">Layanan</Link>
              <ChevronRight className="w-4 h-4" />
              <span className="text-gray-900 font-medium">{service.name}</span>
            </nav>
          </div>
        </section>

        {/* Hero Section */}
        <section className="bg-gradient-to-br from-brand-50 to-white pt-16 pb-20">
          <div className="container-custom">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <div className="flex items-center gap-4 mb-6">
                  <Badge className="bg-brand-100 text-brand-700 px-4 py-2">
                    {categoryData.title}
                  </Badge>
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    ))}
                    <span className="text-sm text-gray-600 ml-2">4.9 (125 reviews)</span>
                  </div>
                </div>

                <h1 className="text-4xl lg:text-5xl font-bold mb-6 text-gray-900">
                  {service.fullName}
                </h1>

                <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                  {service.description}
                </p>

                <div className="grid grid-cols-2 gap-6 mb-8">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-brand-100 rounded-lg flex items-center justify-center">
                      <Clock className="w-5 h-5 text-brand-600" />
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900">{service.duration}</div>
                      <div className="text-sm text-gray-600">Estimasi Proses</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-brand-100 rounded-lg flex items-center justify-center">
                      <Users className="w-5 h-5 text-brand-600" />
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900">500+</div>
                      <div className="text-sm text-gray-600">Client Puas</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-brand-100 rounded-lg flex items-center justify-center">
                      <Shield className="w-5 h-5 text-brand-600" />
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900">100%</div>
                      <div className="text-sm text-gray-600">Legal Resmi</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-brand-100 rounded-lg flex items-center justify-center">
                      <Award className="w-5 h-5 text-brand-600" />
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900">6+</div>
                      <div className="text-sm text-gray-600">Tahun Pengalaman</div>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                  <Button size="lg" className="btn-primary" asChild>
                    <a href={whatsappMessage} target="_blank" rel="noopener noreferrer">
                      <Phone className="w-5 h-5 mr-2" />
                      Konsultasi Gratis
                    </a>
                  </Button>
                  <Button size="lg" variant="outline" asChild>
                    <Link href="#requirements">
                      <FileText className="w-5 h-5 mr-2" />
                      Lihat Persyaratan
                    </Link>
                  </Button>
                  <Button size="lg" variant="outline" asChild>
                    <a href="#pricing" className="flex items-center">
                      <Calculator className="w-5 h-5 mr-2" />
                      Estimasi Biaya
                    </a>
                  </Button>
                </div>
              </div>

              <div className="relative">
                <Card className="shadow-2xl border-0 bg-white">
                  <CardHeader className="bg-gradient-to-r from-brand-600 to-blue-600 text-white rounded-t-lg">
                    <CardTitle className="text-xl">
                      Keunggulan Layanan {service.name}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      {service.benefits.slice(0, 6).map((benefit, idx) => (
                        <div key={idx} className="flex items-start gap-3">
                          <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                          <div>
                            <div className="font-medium text-gray-900 mb-1">
                              Keunggulan {idx + 1}
                            </div>
                            <div className="text-sm text-gray-700">{benefit}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                    {serviceSpecificDetails?.benefits && (
                      <div className="mt-6 pt-6 border-t">
                        <h4 className="font-semibold text-gray-900 mb-3">
                          Benefit Tambahan:
                        </h4>
                        <div className="grid grid-cols-1 gap-2">
                          {serviceSpecificDetails.benefits.slice(0, 3).map((benefit, idx) => (
                            <div key={idx} className="flex items-center gap-2 text-sm text-gray-700">
                              <div className="w-2 h-2 bg-brand-600 rounded-full"></div>
                              {benefit}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* Requirements Section */}
        {serviceSpecificDetails?.requirements && (
          <section id="requirements" className="section-padding bg-gradient-to-br from-slate-50 to-white">
            <div className="container-custom">
              <div className="text-center mb-16">
                <div className="inline-flex items-center gap-2 mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-brand-600 to-blue-600 rounded-full flex items-center justify-center">
                    <FileText className="w-6 h-6 text-white" />
                  </div>
                  <h2 className="text-3xl lg:text-4xl font-bold text-gray-900">
                    Persyaratan {service.fullName}
                  </h2>
                </div>
                <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                  Dokumen dan persyaratan lengkap untuk pengajuan {service.name}
                </p>
              </div>

              <div className="grid lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
                {/* Documents Required */}
                <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
                  <div className="bg-gradient-to-r from-brand-600 to-blue-600 px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                        <FileText className="w-5 h-5 text-white" />
                      </div>
                      <h3 className="text-xl font-semibold text-white">
                        Dokumen Persyaratan
                      </h3>
                    </div>
                  </div>
                  <div className="p-6 space-y-4">
                    <div className="grid gap-3">
                      {serviceSpecificDetails.requirements.map((req, idx) => (
                        <div key={idx} className="group flex items-start gap-4 p-4 rounded-xl bg-gray-50 hover:bg-brand-50 transition-all duration-300 cursor-default">
                          <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
                            <span className="text-brand-600 font-semibold text-sm">
                              {idx + 1}
                            </span>
                          </div>
                          <div className="flex-1">
                            <p className="text-gray-700 font-medium leading-relaxed">
                              {req}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="mt-6 p-4 bg-gradient-to-r from-brand-50 to-blue-50 rounded-xl border border-brand-200">
                      <div className="flex items-start gap-3">
                        <div className="w-6 h-6 bg-brand-600 rounded-full flex items-center justify-center flex-shrink-0">
                          <span className="text-white text-xs font-bold">!</span>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-800">
                            <strong>Penting:</strong>
                          </p>
                          <p className="text-sm text-gray-600 mt-1">
                            Tim kami akan membantu mempersiapkan dan mengevaluasi kelengkapan dokumen Anda sebelum pengajuan.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Eligibility Criteria */}
                <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
                  <div className="bg-gradient-to-r from-emerald-600 to-teal-600 px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                        <Shield className="w-5 h-5 text-white" />
                      </div>
                      <h3 className="text-xl font-semibold text-white">
                        Kriteria Kelayakan
                      </h3>
                    </div>
                  </div>
                  <div className="p-6 space-y-6">
                    <div className="p-6 bg-emerald-50 rounded-xl border-2 border-emerald-200">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 bg-emerald-600 rounded-full flex items-center justify-center">
                          <span className="text-white text-lg font-bold">✓</span>
                        </div>
                        <h4 className="text-lg font-semibold text-emerald-800">
                          Kriteria Terpenuhi
                        </h4>
                      </div>
                      <ul className="space-y-2 text-gray-700">
                        <li className="flex items-center gap-3">
                          <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                          <span>Badan hukum yang sah dan aktif</span>
                        </li>
                        <li className="flex items-center gap-3">
                          <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                          <span>Tidak memiliki masalah hukum</span>
                        </li>
                        <li className="flex items-center gap-3">
                          <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                          <span>Reputasi bisnis yang baik</span>
                        </li>
                        <li className="flex items-center gap-3">
                          <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                          <span>Komitmen untuk standar kualitas</span>
                        </li>
                      </ul>
                    </div>

                    <div className="p-6 bg-blue-50 rounded-xl border-2 border-blue-200">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                          <span className="text-white text-lg font-bold">⟳</span>
                        </div>
                        <h4 className="text-lg font-semibold text-blue-800">
                          Proses Verifikasi
                        </h4>
                      </div>
                      <p className="text-gray-700 leading-relaxed">
                        Tim profesional kami akan melakukan verifikasi awal yang komprehensif dan memberikan
                        rekomendasi yang tepat untuk perbaikan jika diperlukan.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Timeline Section */}
        {serviceSpecificDetails?.timeline && (
          <section id="timeline" className="section-padding">
            <div className="container-custom">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold mb-4">
                  Proses Pengurusan {service.fullName}
                </h2>
                <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                  Tahapan lengkap proses pengurusan izin dengan estimasi waktu yang realistis
                </p>
              </div>

              <div className="relative">
                {/* Timeline Line */}
                <div className="absolute left-4 lg:left-1/2 transform lg:-translate-x-1/2 h-full w-0.5 bg-gradient-to-b from-brand-600 to-blue-600"></div>

                <div className="space-y-8">
                  {serviceSpecificDetails.timeline.map((phase, idx) => (
                    <div key={idx} className={`relative flex items-center ${
                      idx % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'
                    }`}>
                      {/* Timeline Dot */}
                      <div className="absolute left-4 lg:left-1/2 transform lg:-translate-x-1/2 w-8 h-8 bg-white border-4 border-brand-600 rounded-full z-10"></div>

                      {/* Content */}
                      <div className={`w-full lg:w-5/12 ml-16 lg:ml-0 ${
                        idx % 2 === 0 ? 'lg:pr-8 lg:text-right' : 'lg:pl-8'
                      }`}>
                        <Card className="card-hover">
                          <CardHeader>
                            <div className="flex items-center gap-3 mb-2">
                              <Badge className="bg-brand-100 text-brand-700">
                                Tahap {idx + 1}
                              </Badge>
                              <span className="text-sm font-semibold text-brand-600">
                                {phase.duration}
                              </span>
                            </div>
                            <CardTitle className="text-lg">{phase.phase}</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <p className="text-gray-700">{phase.description}</p>
                          </CardContent>
                        </Card>
                      </div>

                      {/* Empty Space */}
                      <div className="hidden lg:block lg:w-5/12"></div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Pricing Section */}
        {serviceSpecificDetails?.pricing && (
          <section id="pricing" className="section-padding bg-gray-50">
            <div className="container-custom">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold mb-4">
                  Estimasi Biaya {service.fullName}
                </h2>
                <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                  Transparansi biaya untuk layanan {service.name} yang Anda butuhkan
                </p>
              </div>

              <div className="grid lg:grid-cols-3 gap-8 max-w-4xl mx-auto">
                <Card className="text-center">
                  <CardHeader>
                    <CardTitle className="text-xl text-brand-600">
                      Konsultasi
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold mb-4">Gratis</div>
                    <p className="text-gray-600 mb-4">
                      Evaluasi awal kesiapan perusahaan Anda
                    </p>
                    <Button className="w-full" variant="outline" asChild>
                      <a href={whatsappMessage} target="_blank" rel="noopener noreferrer">
                        Mulai Konsultasi
                      </a>
                    </Button>
                  </CardContent>
                </Card>

                <Card className="text-center border-2 border-brand-600 relative">
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-brand-600 text-white px-4 py-1">
                      Paling Populer
                    </Badge>
                  </div>
                  <CardHeader>
                    <CardTitle className="text-xl text-brand-600">
                      Layanan Lengkap
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold mb-4">
                      {serviceSpecificDetails.pricing.processing}
                    </div>
                    <p className="text-gray-600 mb-4">
                      Pendampingan penuh dari awal hingga selesai
                    </p>
                    <Button className="w-full btn-primary" asChild>
                      <a href={whatsappMessage} target="_blank" rel="noopener noreferrer">
                        Pesan Sekarang
                      </a>
                    </Button>
                  </CardContent>
                </Card>

                <Card className="text-center">
                  <CardHeader>
                    <CardTitle className="text-xl text-brand-600">
                      Biaya Resmi
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold mb-4">
                      {serviceSpecificDetails.pricing.government}
                    </div>
                    <p className="text-gray-600 mb-4">
                      Biaya resmi ke instansi terkait
                    </p>
                    <Button className="w-full" variant="outline" asChild>
                      <Link href="#contact">
                        Hubungi Tim
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              </div>

              <div className="mt-8 text-center">
                <p className="text-sm text-gray-600">
                  <strong>Termasuk:</strong> Konsultasi, persiapan dokumen, pengajuan, monitoring,
                  dan support hingga izin terbit. <strong>Tidak termasuk:</strong> biaya tambahan yang
                  muncul selama proses.
                </p>
              </div>
            </div>
          </section>
        )}

        {/* Detailed Benefits */}
        <section className="section-padding">
          <div className="container-custom">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">
                Mengapa Memilih Layanan {service.name}?
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Keunggulan dan manfaat yang Anda dapatkan dengan layanan kami
              </p>
            </div>

            <div className="grid lg:grid-cols-2 xl:grid-cols-3 gap-8">
              {service.benefits.map((benefit, idx) => (
                <Card key={idx} className="card-hover">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-brand-100 rounded-lg flex items-center justify-center">
                        <CheckCircle className="w-5 h-5 text-brand-600" />
                      </div>
                      Keunggulan {idx + 1}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-700">{benefit}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="section-padding bg-gray-50">
          <div className="container-custom">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">
                Fitur Layanan {service.fullName}
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Komponen lengkap yang termasuk dalam layanan kami
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {service.features.map((feature, idx) => (
                <div key={idx} className="text-center">
                  <div className="w-16 h-16 bg-brand-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <FileText className="w-8 h-8 text-brand-600" />
                  </div>
                  <p className="font-medium text-gray-900">{feature}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        {relatedFAQs.length > 0 && (
          <section className="section-padding">
            <div className="container-custom">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold mb-4">
                  Pertanyaan Umum tentang {service.fullName}
                </h2>
                <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                  Jawaban untuk pertanyaan yang sering diajukan
                </p>
              </div>

              <div className="max-w-3xl mx-auto">
                <Accordion type="single" collapsible>
                  {relatedFAQs.map((faq, idx) => (
                    <AccordionItem key={idx} value={`item-${idx}`}>
                      <AccordionTrigger className="text-left">
                        {faq.question}
                      </AccordionTrigger>
                      <AccordionContent className="text-gray-700">
                        {faq.answer}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </div>
            </div>
          </section>
        )}

        {/* Related Services */}
        {relatedServices.length > 0 && (
          <section className="section-padding bg-gray-50">
            <div className="container-custom">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold mb-4">
                  Layanan Terkait
                </h2>
                <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                  Layanan lainnya yang mungkin Anda butuhkan
                </p>
              </div>

              <div className="grid lg:grid-cols-3 gap-8">
                {relatedServices.map((relatedService) => (
                  <Card key={relatedService.id} className="card-hover">
                    <CardHeader>
                      <CardTitle className="text-lg">{relatedService.name}</CardTitle>
                      <p className="text-sm text-gray-600">{relatedService.fullName}</p>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-700 mb-4">{relatedService.description}</p>
                      <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
                        <Clock className="w-3 h-3" />
                        <span>{relatedService.duration}</span>
                      </div>
                      <Button className="w-full" variant="outline" asChild>
                        <Link href={`/services/${relatedService.id}`}>
                          Lihat Detail
                          <ChevronRight className="w-4 h-4 ml-2" />
                        </Link>
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* CTA Section */}
        <section className="section-padding bg-brand-600 text-white">
          <div className="container-custom text-center">
            <h2 className="text-3xl font-bold mb-6">
              Siap Memulai Proses {service.name}?
            </h2>
            <p className="text-xl mb-8 max-w-2xl mx-auto text-blue-100">
              Konsultasi gratis dengan tim ahli kami. Dapatkan penawaran terbaik
              untuk kebutuhan {service.fullName} Anda.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-white text-brand-600 hover:bg-gray-100" asChild>
                <a href={whatsappMessage} target="_blank" rel="noopener noreferrer">
                  <Phone className="w-5 h-5 mr-2" />
                  Mulai Sekarang
                </a>
              </Button>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-brand-600" asChild>
                <Link href="/services">
                  Lihat Semua Layanan
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-brand-600" asChild>
                <a href="#download" className="flex items-center">
                  <Download className="w-5 h-5 mr-2" />
                  Download Brosur
                </a>
              </Button>
            </div>

            <div className="mt-8 flex flex-wrap justify-center gap-8 text-sm">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                <span>Jakarta, Indonesia</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4" />
                <span>{COMPANY_INFO.phone}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span>Senin - Jumat: 09:00 - 17:00</span>
              </div>
            </div>
          </div>
        </section>

        <Footer />
      </div>
    </>
  )
}