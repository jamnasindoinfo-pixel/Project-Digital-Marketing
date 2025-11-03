'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Plane,
  Briefcase,
  Clock,
  CheckCircle,
  FileText,
  Users,
  Calendar,
  ArrowRight,
  Info,
  Star
} from 'lucide-react'
import { SERVICES, CONTACT_INFO } from '@/lib/constants'
import { createWhatsAppLink } from '@/lib/utils'
import { cn } from '@/lib/utils'

export function Services() {
  const [selectedService, setSelectedService] = useState<string | null>(null)
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1
  })

  const handleServiceClick = (serviceId: string) => {
    setSelectedService(selectedService === serviceId ? null : serviceId)
  }

  const handleWhatsAppCTA = (serviceType: string, serviceName: string) => {
    const message = `Halo PT Jaminan Solusi Bisnis, saya tertarik untuk konsultasi mengenai layanan ${serviceName} (${serviceType}). Mohon info lebih lanjut.`
    const link = createWhatsAppLink(message)
    window.open(link, '_blank')
  }

  const ServiceCard = ({ service, category }: { service: any; category: string }) => (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      whileHover={{ y: -5 }}
      className="cursor-pointer"
      onClick={() => handleServiceClick(service.id)}
    >
      <Card className={cn(
        "h-full card-hover border-2 transition-all duration-300",
        selectedService === service.id ? "border-brand-600 shadow-2xl" : "border-gray-200"
      )}>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-brand-100 rounded-lg flex items-center justify-center">
                {category === 'travel' ? (
                  <Plane className="w-6 h-6 text-brand-600" />
                ) : (
                  <Briefcase className="w-6 h-6 text-brand-600" />
                )}
              </div>
              <div>
                <CardTitle className="text-xl">{service.name}</CardTitle>
                <p className="text-sm text-gray-600">{service.fullName}</p>
              </div>
            </div>
            <Badge variant="secondary" className="bg-brand-50 text-brand-700">
              {service.duration}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-gray-700 mb-4">{service.description}</p>

          <AnimatePresence>
            {selectedService === service.id && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="space-y-4"
              >
                <div>
                  <h4 className="font-semibold mb-2 flex items-center gap-2">
                    <Star className="w-4 h-4 text-yellow-500" />
                    Keunggulan Layanan
                  </h4>
                  <ul className="space-y-2">
                    {service.benefits.map((benefit: string, idx: number) => (
                      <li key={idx} className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                        <span className="text-sm text-gray-700">{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold mb-2 flex items-center gap-2">
                    <FileText className="w-4 h-4 text-blue-500" />
                    Fitur Utama
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {service.features.map((feature: string, idx: number) => (
                      <Badge key={idx} variant="outline" className="text-xs">
                        {feature}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="flex gap-2 pt-4">
                  <Button
                    size="sm"
                    className="flex-1 btn-primary"
                    onClick={(e) => {
                      e.stopPropagation()
                      handleWhatsAppCTA(category, service.fullName)
                    }}
                  >
                    Konsultasi
                    <ArrowRight className="w-4 h-4 ml-1" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={(e) => {
                      e.stopPropagation()
                      setSelectedService(null)
                    }}
                  >
                    Tutup
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {selectedService !== service.id && (
            <div className="flex items-center justify-between pt-4 border-t">
              <span className="text-sm text-gray-500 flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {service.duration}
              </span>
              <Button size="sm" variant="ghost" className="text-brand-600 hover:text-brand-700">
                <Info className="w-4 h-4 mr-1" />
                Detail
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  )

  return (
    <section id="services" className="section-padding bg-white">
      <div className="container-custom">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
          ref={ref}
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
            Layanan <span className="gradient-text">Kami</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Solusi lengkap untuk semua kebutuhan izin dan administrasi bisnis Anda
          </p>
        </motion.div>

        {/* Service Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Tabs defaultValue="travel" className="w-full">
            <TabsList className="grid w-full grid-cols-2 max-w-md mx-auto mb-12">
              <TabsTrigger value="travel" className="text-base">
                <Plane className="w-5 h-5 mr-2" />
                Layanan Travel
              </TabsTrigger>
              <TabsTrigger value="business" className="text-base">
                <Briefcase className="w-5 h-5 mr-2" />
                Layanan Bisnis
              </TabsTrigger>
            </TabsList>

            <TabsContent value="travel" className="mt-0">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <AnimatePresence mode="popLayout">
                  {SERVICES.travel.items.map((service) => (
                    <ServiceCard
                      key={service.id}
                      service={service}
                      category="travel"
                    />
                  ))}
                </AnimatePresence>
              </div>
            </TabsContent>

            <TabsContent value="business" className="mt-0">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <AnimatePresence mode="popLayout">
                  {SERVICES.business.items.map((service) => (
                    <ServiceCard
                      key={service.id}
                      service={service}
                      category="business"
                    />
                  ))}
                </AnimatePresence>
              </div>
            </TabsContent>
          </Tabs>
        </motion.div>

        {/* Process Timeline */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-20"
        >
          <div className="text-center mb-12">
            <h3 className="text-2xl lg:text-3xl font-bold mb-4">
              Proses Layanan Kami
            </h3>
            <p className="text-gray-600">
              Proses yang transparan dan terstruktur untuk hasil terbaik
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              { step: 1, title: 'Konsultasi Awal', desc: 'Evaluasi kebutuhan dan persyaratan' },
              { step: 2, title: 'Persiapan Dokumen', desc: 'Kumpulkan dan lengkapi semua dokumen' },
              { step: 3, title: 'Proses Pengajuan', desc: 'Submit ke instansi terkait' },
              { step: 4, title: 'Monitoring', desc: 'Track progres hingga selesai' }
            ].map((item) => (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, y: 20 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.6 + item.step * 0.1 }}
                className="text-center"
              >
                <div className="w-16 h-16 bg-brand-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
                  {item.step}
                </div>
                <h4 className="font-semibold text-lg mb-2">{item.title}</h4>
                <p className="text-gray-600 text-sm">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="mt-16 bg-gray-50 rounded-2xl p-8 lg:p-12"
        >
          <div className="text-center">
            <h3 className="text-2xl lg:text-3xl font-bold mb-4">
              Butuh Bantuan Memilih Layanan?
            </h3>
            <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
              Tim ahli kami siap membantu Anda menemukan solusi yang paling sesuai dengan kebutuhan bisnis Anda.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="btn-primary" asChild>
                <a href={CONTACT_INFO.whatsapp.link} target="_blank" rel="noopener noreferrer">
                  <Calendar className="w-5 h-5 mr-2" />
                  Jadwalkan Konsultasi Gratis
                </a>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <a href="#portfolio">
                  Lihat Portfolio Kami
                  <ArrowRight className="w-5 h-5 ml-2" />
                </a>
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}