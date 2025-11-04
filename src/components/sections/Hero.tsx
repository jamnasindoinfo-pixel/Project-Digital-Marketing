'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { Phone, Download, CheckCircle, Clock, Users, FileText } from 'lucide-react'
import { COMPANY_INFO, SERVICES } from '@/lib/constants'
import { createWhatsAppLink } from '@/lib/utils'

export function Hero() {
  const [selectedService, setSelectedService] = useState('travel')
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  const whatsappLink = createWhatsAppLink(
    `Halo PT Jaminan Solusi Bisnis, saya tertarik untuk konsultasi mengenai layanan ${selectedService === 'travel' ? 'travel' : 'bisnis'}`
  )

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-blue-50 via-white to-emerald-50">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%233b82f6' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }} />
      </div>

      <div className="container-custom relative z-10 pt-20 pb-16">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight mb-6">
              Solusi Lengkap untuk{' '}
              <span className="gradient-text">Izin Travel Anda</span>
            </h1>

            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              Pendampingan tenaga ahli berpengalaman, lebih dari 50 izin terbit.
              Layanan terpercaya sejak 2018 dengan {COMPANY_INFO.clients} client puas.
            </p>

            {/* Trust Indicators */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              {[
                { icon: Clock, value: COMPANY_INFO.experience, label: 'Tahun Pengalaman' },
                { icon: Users, value: COMPANY_INFO.clients, label: 'Client Puas' },
                { icon: FileText, value: COMPANY_INFO.projects, label: 'Project Selesai' },
                { icon: CheckCircle, value: COMPANY_INFO.permits, label: 'Izin Terbit' },
              ].map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
                  className="text-center"
                >
                  <item.icon className="w-8 h-8 mx-auto mb-2 text-brand-600" />
                  <div className="text-2xl font-bold text-gray-900">{item.value}</div>
                  <div className="text-sm text-gray-600">{item.label}</div>
                </motion.div>
              ))}
            </div>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              <Button size="lg" className="btn-primary" asChild>
                <a href={whatsappLink} target="_blank" rel="noopener noreferrer">
                  <Phone className="w-5 h-5 mr-2" />
                  Konsultasi Gratis
                </a>
              </Button>
              <Button size="lg" variant="outline" className="btn-secondary" asChild>
                <a href="#faq">
                  <Download className="w-5 h-5 mr-2" />
                  Unduh Checklist Dokumen
                </a>
              </Button>
            </div>

            <div className="flex items-center gap-4 text-sm text-gray-600">
              <span className="flex items-center gap-1">
                <CheckCircle className="w-4 h-4 text-green-500" />
                Terverifikasi Kemenag
              </span>
              <span className="flex items-center gap-1">
                <CheckCircle className="w-4 h-4 text-green-500" />
                100% Sukses
              </span>
              <span className="flex items-center gap-1">
                <CheckCircle className="w-4 h-4 text-green-500" />
                Support 24/7
              </span>
            </div>
          </motion.div>

          {/* Right Content - Service Tabs */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative"
          >
            <div className="bg-white rounded-2xl shadow-2xl p-8">
              <h3 className="text-2xl font-bold mb-6 text-center">Pilih Layanan Anda</h3>

              <Tabs value={selectedService} onValueChange={setSelectedService} className="w-full">
                <TabsList className="grid w-full grid-cols-2 mb-6">
                  <TabsTrigger value="travel" className="data-[state=active]:bg-brand-600">
                    <span className="flex items-center gap-2">
                      <span>✈️</span> Travel
                    </span>
                  </TabsTrigger>
                  <TabsTrigger value="business" className="data-[state=active]:bg-brand-600">
                    <span className="flex items-center gap-2">
                      <span>💼</span> Bisnis
                    </span>
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="travel" className="space-y-4">
                  <div className="grid gap-3">
                    {SERVICES.travel.items.map((service) => (
                      <motion.div
                        key={service.id}
                        whileHover={{ scale: 1.02 }}
                        className="p-4 border rounded-lg hover:shadow-md transition-all cursor-pointer hover:border-brand-600"
                      >
                        <h4 className="font-semibold text-lg">{service.name}</h4>
                        <p className="text-sm text-gray-600">{service.fullName}</p>
                        <p className="text-sm text-gray-500 mt-1">{service.duration}</p>
                      </motion.div>
                    ))}
                  </div>
                </TabsContent>

                <TabsContent value="business" className="space-y-4">
                  <div className="grid gap-3">
                    {SERVICES.business.items.map((service) => (
                      <motion.div
                        key={service.id}
                        whileHover={{ scale: 1.02 }}
                        className="p-4 border rounded-lg hover:shadow-md transition-all cursor-pointer hover:border-brand-600"
                      >
                        <h4 className="font-semibold text-lg">{service.name}</h4>
                        <p className="text-sm text-gray-600">{service.fullName}</p>
                        <p className="text-sm text-gray-500 mt-1">{service.duration}</p>
                      </motion.div>
                    ))}
                  </div>
                </TabsContent>
              </Tabs>

              <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                <p className="text-sm text-blue-800">
                  <strong>Butuh bantuan?</strong> Tim kami siap membantu Anda memilih layanan yang tepat.
                </p>
                <Button size="sm" className="w-full mt-3" asChild>
                  <a href={whatsappLink} target="_blank" rel="noopener noreferrer">
                    Chat dengan Ahli
                  </a>
                </Button>
              </div>
            </div>

            </motion.div>
        </div>
      </div>
    </section>
  )
}