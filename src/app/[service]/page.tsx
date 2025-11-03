import { notFound } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { CheckCircle, Clock, Phone, ArrowRight, Users, FileText } from 'lucide-react'
import { SERVICES } from '@/lib/constants'
import Link from 'next/link'
import { Navigation } from '@/components/layout/Navigation'
import { Footer } from '@/components/layout/Footer'
import { createWhatsAppLink } from '@/lib/utils'

interface ServicePageProps {
  params: Promise<{
    service: string
  }>
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

  const whatsappMessage = createWhatsAppLink(
    `Halo PT Jaminan Solusi Bisnis, saya tertarik untuk konsultasi mengenai layanan ${service.fullName}. Mohon info lebih lanjut.`
  )

  return (
    <div className="min-h-screen">
      <Navigation />

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-brand-50 to-white pt-32 pb-16">
        <div className="container-custom">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <Badge className="mb-4 bg-brand-100 text-brand-700">
                {categoryData.title}
              </Badge>
              <h1 className="text-4xl lg:text-5xl font-bold mb-6">
                {service.fullName}
              </h1>
              <p className="text-xl text-gray-600 mb-8">
                {service.description}
              </p>

              <div className="flex items-center gap-6 mb-8">
                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-brand-600" />
                  <span className="font-semibold">{service.duration}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-brand-600" />
                  <span className="font-semibold">500+ Client</span>
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
                  <Link href="#cta">
                    <ArrowRight className="w-5 h-5 mr-2" />
                    Lihat Detail Layanan
                  </Link>
                </Button>
              </div>
            </div>

            <div className="relative">
              <div className="bg-white rounded-2xl shadow-2xl p-8">
                <div className="grid grid-cols-2 gap-6">
                  {service.benefits.slice(0, 4).map((benefit, idx) => (
                    <div key={idx} className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-gray-700">{benefit}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Detailed Benefits */}
      <section className="section-padding bg-gray-50">
        <div className="container-custom">
          <h2 className="text-3xl font-bold text-center mb-12">
            Mengapa Memilih Layanan {service.name}?
          </h2>

          <div className="grid lg:grid-cols-3 gap-8">
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

      {/* Features */}
      <section className="section-padding">
        <div className="container-custom">
          <h2 className="text-3xl font-bold text-center mb-12">
            Fitur Layanan {service.fullName}
          </h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {service.features.map((feature, idx) => (
              <div key={idx} className="text-center">
                <div className="w-16 h-16 bg-brand-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <FileText className="w-8 h-8 text-brand-600" />
                </div>
                <p className="font-medium">{feature}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="section-padding bg-gray-50">
        <div className="container-custom">
          <h2 className="text-3xl font-bold text-center mb-12">
            Proses Pengurusan {service.fullName}
          </h2>

          <div className="grid md:grid-cols-4 gap-8">
            {[
              { step: 1, title: 'Konsultasi Awal', desc: 'Evaluasi kebutuhan Anda' },
              { step: 2, title: 'Persiapan Dokumen', desc: 'Kumpulkan persyaratan' },
              { step: 3, title: 'Pengajuan', desc: 'Proses ke instansi' },
              { step: 4, title: 'Selesai', desc: 'Dokumen terbit' }
            ].map((item) => (
              <div key={item.step} className="text-center">
                <div className="w-12 h-12 bg-brand-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 font-bold">
                  {item.step}
                </div>
                <h3 className="font-semibold mb-2">{item.title}</h3>
                <p className="text-sm text-gray-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section id="cta" className="section-padding bg-brand-600 text-white">
        <div className="container-custom text-center">
          <h2 className="text-3xl font-bold mb-6">
            Siap Memulai Proses {service.name}?
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto text-blue-100">
            Konsultasi gratis dengan tim ahli kami. Dapatkan penawaran terbaik untuk kebutuhan Anda.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-white text-brand-600 hover:bg-gray-100" asChild>
              <a href={whatsappMessage} target="_blank" rel="noopener noreferrer">
                <Phone className="w-5 h-5 mr-2" />
                Mulai Sekarang
              </a>
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-brand-600" asChild>
              <Link href="/#contact">
                Hubungi Tim Kami
              </Link>
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}