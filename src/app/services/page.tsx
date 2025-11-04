import { Metadata } from 'next'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Search, Filter, Plane, Briefcase, Clock, Users, CheckCircle, ArrowRight, Phone, Star, MapPin, Award } from 'lucide-react'
import { SERVICES, COMPANY_INFO } from '@/lib/constants'
import Link from 'next/link'
import { Navigation } from '@/components/layout/Navigation'
import { Footer } from '@/components/layout/Footer'
import { createWhatsAppLink } from '@/lib/utils'
import ServiceCard from '@/components/services/ServiceCard'

// SEO Metadata
export const metadata: Metadata = {
  title: 'Layanan Lengkap - Jasa PPIU, PIHK, Akreditasi Travel & Konsultan Bisnis | PT Jaminan Solusi Bisnis',
  description: 'Layanan profesional pengurusan izin PPIU, PIHK, akreditasi travel, IATA, konsultan pajak, bank garansi, dan laporan keuangan. 6+ tahun pengalaman, 500+ client puas. Konsultasi gratis!',
  keywords: 'jasa PPIU, jasa PIHK, akreditasi travel, konsultan pajak, bank garansi, pengurusan izin travel, IATA, laporan keuangan, administrasi kontraktor, konsultan bisnis, Jakarta, Indonesia',
  openGraph: {
    title: 'Layanan Lengkap - PT Jaminan Solusi Bisnis',
    description: 'Layanan profesional pengurusan izin travel dan konsultan bisnis terpercaya di Indonesia',
    type: 'website',
    images: [{
      url: '/og-services.jpg',
      width: 1200,
      height: 630,
      alt: 'Layanan PT Jaminan Solusi Bisnis'
    }],
    locale: 'id_ID',
    siteName: 'PT Jaminan Solusi Bisnis'
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Layanan Lengkap - PT Jaminan Solusi Bisnis',
    description: 'Layanan profesional pengurusan izin travel dan konsultan bisnis terpercaya',
    images: ['/og-services.jpg']
  },
  alternates: {
    canonical: '/services'
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

// Structured Data for SEO
const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'ProfessionalService',
  name: 'PT Jaminan Solusi Bisnis',
  description: 'Konsultan profesional berpengalaman untuk izin travel dan layanan bisnis',
  url: 'https://ptjaminansolusibisnis.com/services',
  telephone: COMPANY_INFO.phone,
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'Jl. Contoh Alamat No. 123',
    addressLocality: 'Jakarta Pusat',
    addressRegion: 'DKI Jakarta',
    postalCode: '10110',
    addressCountry: 'ID'
  },
  openingHours: 'Mo-Fr 09:00-17:00',
  knowsAbout: [
    'Pengurusan Izin PPIU',
    'Pengurusan Izin PIHK',
    'Akreditasi Travel',
    'Keanggotaan IATA',
    'Konsultasi Pajak',
    'Bank Garansi',
    'Laporan Keuangan',
    'Administrasi Kontraktor'
  ],
  hasOfferCatalog: {
    '@type': 'OfferCatalog',
    name: 'Layanan PT Jaminan Solusi Bisnis',
    itemListElement: [
      ...SERVICES.travel.items.map((service, idx) => ({
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: service.fullName,
          description: service.description,
          provider: {
            '@type': 'Organization',
            name: 'PT Jaminan Solusi Bisnis'
          }
        }
      })),
      ...SERVICES.business.items.map((service, idx) => ({
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: service.fullName,
          description: service.description,
          provider: {
            '@type': 'Organization',
            name: 'PT Jaminan Solusi Bisnis'
          }
        }
      }))
    ]
  }
}

export default function ServicesPage() {
  const allServices = [
    ...SERVICES.travel.items.map(service => ({ ...service, category: 'travel', categoryName: SERVICES.travel.title })),
    ...SERVICES.business.items.map(service => ({ ...service, category: 'business', categoryName: SERVICES.business.title }))
  ]

  const whatsappMessage = createWhatsAppLink(
    'Halo PT Jaminan Solusi Bisnis, saya tertarik untuk konsultasi mengenai layanan yang Anda tawarkan. Mohon info lebih lanjut.'
  )

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      <div className="min-h-screen">
        <Navigation />

        {/* Hero Section */}
        <section className="bg-gradient-to-br from-brand-50 to-white pt-32 pb-16">
          <div className="container-custom">
            <div className="text-center max-w-4xl mx-auto mb-12">
              <Badge className="mb-4 bg-brand-100 text-brand-700 text-sm px-4 py-2">
                Layanan Profesional
              </Badge>
              <h1 className="text-4xl lg:text-6xl font-bold mb-6 text-gray-900">
                Layanan Lengkap untuk
                <span className="text-brand-600"> Bisnis Anda</span>
              </h1>
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                Solusi komprehensif untuk pengurusan izin travel, layanan administrasi bisnis,
                dan konsultasi profesional. Dipercaya oleh 500+ client dengan pengalaman 6+ tahun.
              </p>

              <div className="flex flex-wrap justify-center gap-8 mb-8">
                <div className="flex items-center gap-2">
                  <Award className="w-5 h-5 text-brand-600" />
                  <span className="font-semibold text-gray-700">6+ Tahun Pengalaman</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-brand-600" />
                  <span className="font-semibold text-gray-700">500+ Client Puas</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-brand-600" />
                  <span className="font-semibold text-gray-700">1000+ Proyek Selesai</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-brand-600" />
                  <span className="font-semibold text-gray-700">Jakarta, Indonesia</span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" className="btn-primary" asChild>
                  <a href={whatsappMessage} target="_blank" rel="noopener noreferrer">
                    <Phone className="w-5 h-5 mr-2" />
                    Konsultasi Gratis
                  </a>
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <Link href="#portfolio">
                    <ArrowRight className="w-5 h-5 mr-2" />
                    Lihat Portfolio
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Quick Stats */}
        <section className="py-12 bg-white border-b">
          <div className="container-custom">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
              <div>
                <div className="text-3xl font-bold text-brand-600 mb-2">95%</div>
                <div className="text-gray-600">Tingkat Keberhasilan</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-brand-600 mb-2">60-90</div>
                <div className="text-gray-600">Hari Proses Rata-rata</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-brand-600 mb-2">24/7</div>
                <div className="text-gray-600">Dukungan Pelanggan</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-brand-600 mb-2">4.9/5</div>
                <div className="text-gray-600">Rating Kepuasan</div>
              </div>
            </div>
          </div>
        </section>

        {/* Service Categories */}
        <section className="section-padding">
          <div className="container-custom">
            <div className="text-center mb-12">
              <h2 className="text-3xl lg:text-4xl font-bold mb-4">
                Pilih Kategori Layanan
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Kami menyediakan layanan lengkap untuk memenuhi kebutuhan bisnis dan travel Anda
              </p>
            </div>

            <div className="grid lg:grid-cols-2 gap-8 mb-12">
              {/* Travel Services Category */}
              <Card className="card-hover border-l-4 border-l-brand-600">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3 text-2xl">
                    <div className="w-12 h-12 bg-brand-100 rounded-lg flex items-center justify-center">
                      <Plane className="w-6 h-6 text-brand-600" />
                    </div>
                    {SERVICES.travel.title}
                  </CardTitle>
                  <p className="text-gray-600">
                    Layanan pengurusan izin dan akreditasi untuk perusahaan travel agent dan penyelenggara ibadah
                  </p>
                </CardHeader>
                <CardContent>
                  <div className="grid sm:grid-cols-2 gap-4 mb-6">
                    {SERVICES.travel.items.map((service) => (
                      <Link key={service.id} href={`/services/${service.id}`}>
                        <div className="p-4 rounded-lg border hover:border-brand-300 hover:bg-brand-50 transition-all cursor-pointer">
                          <h3 className="font-semibold text-gray-900 mb-1">{service.name}</h3>
                          <p className="text-sm text-gray-600 mb-2">{service.fullName}</p>
                          <div className="flex items-center gap-2 text-xs text-gray-500">
                            <Clock className="w-3 h-3" />
                            <span>{service.duration}</span>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                  <Button className="w-full" variant="outline" asChild>
                    <Link href="#travel-services">
                      Lihat Detail Layanan Travel
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>

              {/* Business Services Category */}
              <Card className="card-hover border-l-4 border-l-green-600">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3 text-2xl">
                    <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                      <Briefcase className="w-6 h-6 text-green-600" />
                    </div>
                    {SERVICES.business.title}
                  </CardTitle>
                  <p className="text-gray-600">
                    Layanan konsultasi dan administrasi untuk berbagai kebutuhan bisnis dan perusahaan
                  </p>
                </CardHeader>
                <CardContent>
                  <div className="grid sm:grid-cols-2 gap-4 mb-6">
                    {SERVICES.business.items.map((service) => (
                      <Link key={service.id} href={`/services/${service.id}`}>
                        <div className="p-4 rounded-lg border hover:border-green-300 hover:bg-green-50 transition-all cursor-pointer">
                          <h3 className="font-semibold text-gray-900 mb-1">{service.name}</h3>
                          <p className="text-sm text-gray-600 mb-2">{service.fullName}</p>
                          <div className="flex items-center gap-2 text-xs text-gray-500">
                            <Clock className="w-3 h-3" />
                            <span>{service.duration}</span>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                  <Button className="w-full" variant="outline" asChild>
                    <Link href="#business-services">
                      Lihat Detail Layanan Bisnis
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* All Services Grid */}
        <section id="all-services" className="section-padding bg-gray-50">
          <div className="container-custom">
            <div className="text-center mb-12">
              <h2 className="text-3xl lg:text-4xl font-bold mb-4">
                Semua Layanan Kami
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Temukan layanan yang tepat untuk kebutuhan bisnis Anda
              </p>
            </div>

            {/* Search and Filter */}
            <div className="flex flex-col lg:flex-row gap-4 mb-12">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  placeholder="Cari layanan..."
                  className="pl-12"
                  // Note: In a real implementation, you'd add state management for search
                />
              </div>
              <Select>
                <SelectTrigger className="w-full lg:w-48">
                  <Filter className="w-4 h-4 mr-2" />
                  <SelectValue placeholder="Semua Kategori" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua Kategori</SelectItem>
                  <SelectItem value="travel">Layanan Travel</SelectItem>
                  <SelectItem value="business">Layanan Bisnis</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Services Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {allServices.map((service) => (
                <ServiceCard
                  key={service.id}
                  service={service}
                  category={service.category as 'travel' | 'business'}
                  categoryName={service.categoryName}
                />
              ))}
            </div>
          </div>
        </section>

        {/* Why Choose Us */}
        <section className="section-padding">
          <div className="container-custom">
            <div className="text-center mb-12">
              <h2 className="text-3xl lg:text-4xl font-bold mb-4">
                Mengapa Memilih PT Jaminan Solusi Bisnis?
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Partner terpercaya untuk kesuksesan bisnis dan travel Anda
              </p>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
              <Card className="text-center card-hover">
                <CardHeader>
                  <div className="w-16 h-16 bg-brand-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="w-8 h-8 text-brand-600" />
                  </div>
                  <CardTitle>Legalitas Terjamin</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">
                    Perusahaan resmi berizin dengan tim ahli bersertifikat dan berpengalaman
                    lebih dari 6 tahun di bidangnya
                  </p>
                </CardContent>
              </Card>

              <Card className="text-center card-hover">
                <CardHeader>
                  <div className="w-16 h-16 bg-brand-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Clock className="w-8 h-8 text-brand-600" />
                  </div>
                  <CardTitle>Proses Cepat & Tepat</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">
                    Waktu penyelesaian optimal dengan sistem monitoring progres real-time
                    dan update berkala untuk setiap tahapan
                  </p>
                </CardContent>
              </Card>

              <Card className="text-center card-hover">
                <CardHeader>
                  <div className="w-16 h-16 bg-brand-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Users className="w-8 h-8 text-brand-600" />
                  </div>
                  <CardTitle>Dukungan Penuh</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">
                    Konsultasi berkelanjutan bahkan setelah proyek selesai dengan
                    support 24/7 untuk semua client
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="section-padding bg-brand-600 text-white">
          <div className="container-custom text-center">
            <h2 className="text-3xl lg:text-4xl font-bold mb-6">
              Siap Memulai Proses Bisnis Anda?
            </h2>
            <p className="text-xl mb-8 max-w-2xl mx-auto text-blue-100">
              Konsultasi gratis dengan tim ahli kami. Dapatkan solusi terbaik untuk
              kebutuhan izin dan layanan bisnis Anda.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-white text-brand-600 hover:bg-gray-100" asChild>
                <a href={whatsappMessage} target="_blank" rel="noopener noreferrer">
                  <Phone className="w-5 h-5 mr-2" />
                  Konsultasi Gratis
                </a>
              </Button>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-brand-600" asChild>
                <Link href="#contact">
                  Lihat Portofolio
                </Link>
              </Button>
            </div>
          </div>
        </section>

        <Footer />
      </div>
    </>
  )
}