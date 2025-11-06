'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { RotatingText } from '@/components/ui/rotating-text'
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
    `Halo PT Jaminan Nasional Indonesia, saya tertarik untuk konsultasi mengenai layanan ${selectedService === 'travel' ? 'travel' : 'bisnis'}`
  )

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-jni-50/80 via-white to-jni-100/80">
      {/* Background Pattern */}
      <div
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, rgb(22 114 56 / 0.3) 1px, transparent 1px)`,
          backgroundSize: '40px 40px'
        }}
      />
      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-jni-100/20"></div>

      <div className="container-custom relative z-10 pt-24 pb-20">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{
              duration: 0.8,
              ease: [0.25, 0.1, 0.25, 1.0]
            }}
          >
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight mb-8 tracking-tight">
              Solusi Lengkap untuk{' '}
              <span className="text-jni-600 inline-flex items-center">
                <RotatingText
                  texts={['Izin', 'Administrasi']}
                  interval={2500}
                  duration={0.6}
                  variant="slide"
                  className="text-jni-600"
                />
              </span>{' '}
              Travel Anda
            </h1>

            <p className="text-xl text-gray-600 mb-10 leading-relaxed max-w-lg">
              Pendampingan tenaga ahli berpengalaman, lebih dari 50 izin terbit.
              Layanan terpercaya sejak 2018 dengan {COMPANY_INFO.clients} client puas.
            </p>

            {/* Trust Indicators */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-10">
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
                  transition={{
                    duration: 0.6,
                    delay: 0.3 + index * 0.15,
                    ease: [0.25, 0.1, 0.25, 1.0]
                  }}
                  className="text-center group"
                >
                  <motion.div
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <item.icon className="w-10 h-10 mx-auto mb-3 text-jni-600 group-hover:text-jni-700 transition-colors duration-300" />
                  </motion.div>
                  <div className="text-3xl font-bold text-gray-900 group-hover:text-jni-600 transition-colors duration-300">{item.value}</div>
                  <div className="text-sm text-gray-600 group-hover:text-gray-700 transition-colors duration-300">{item.label}</div>
                </motion.div>
              ))}
            </div>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-4 mb-10">
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
              >
                <Button size="lg" className="btn-primary w-full sm:w-auto shadow-lg hover:shadow-xl transition-all duration-300" asChild>
                  <a href={whatsappLink} target="_blank" rel="noopener noreferrer">
                    <Phone className="w-5 h-5 mr-2" />
                    Konsultasi Gratis
                  </a>
                </Button>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
              >
                <Button size="lg" variant="outline" className="btn-secondary w-full sm:w-auto hover:shadow-md transition-all duration-300" asChild>
                  <a href="#faq">
                    <Download className="w-5 h-5 mr-2" />
                    Unduh Checklist Dokumen
                  </a>
                </Button>
              </motion.div>
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
            initial={{ opacity: 0, x: 50, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            transition={{
              duration: 0.8,
              delay: 0.4,
              ease: [0.25, 0.1, 0.25, 1.0]
            }}
            className="relative"
          >
            <div className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/20 p-8 hover:shadow-3xl transition-shadow duration-700">
              <h3 className="text-2xl font-bold mb-6 text-center bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">Pilih Layanan Anda</h3>

              <Tabs value={selectedService} onValueChange={setSelectedService} className="w-full">
                <TabsList className="grid w-full grid-cols-2 mb-6 bg-gray-100/80 p-1 rounded-xl">
                  <TabsTrigger
                    value="travel"
                    className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-jni-600 data-[state=active]:to-jni-700 data-[state=active]:text-white data-[state=active]:shadow-md transition-all duration-300 rounded-lg"
                  >
                    <span className="flex items-center gap-2">
                      Travel
                    </span>
                  </TabsTrigger>
                  <TabsTrigger
                    value="business"
                    className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-jni-600 data-[state=active]:to-jni-700 data-[state=active]:text-white data-[state=active]:shadow-md transition-all duration-300 rounded-lg"
                  >
                    <span className="flex items-center gap-2">
                      Bisnis
                    </span>
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="travel" className="space-y-4 mt-0">
                  <div className="grid gap-3">
                    {SERVICES.travel.items.map((service) => (
                      <motion.div
                        key={service.id}
                        whileHover={{
                          scale: 1.02,
                          y: -2
                        }}
                        whileTap={{ scale: 0.98 }}
                        transition={{
                          type: "spring",
                          stiffness: 400,
                          damping: 17
                        }}
                        className="p-4 border rounded-lg hover:shadow-lg transition-all cursor-pointer hover:border-jni-600 hover:bg-jni-50/30"
                      >
                        <h4 className="font-semibold text-lg">{service.name}</h4>
                        <p className="text-sm text-gray-600">{service.fullName}</p>
                        <p className="text-sm text-gray-500 mt-1">{service.duration}</p>
                      </motion.div>
                    ))}
                  </div>
                </TabsContent>

                <TabsContent value="business" className="space-y-4 mt-0">
                  <div className="grid gap-3">
                    {SERVICES.business.items.map((service) => (
                      <motion.div
                        key={service.id}
                        whileHover={{
                          scale: 1.02,
                          y: -2
                        }}
                        whileTap={{ scale: 0.98 }}
                        transition={{
                          type: "spring",
                          stiffness: 400,
                          damping: 17
                        }}
                        className="p-4 border rounded-lg hover:shadow-lg transition-all cursor-pointer hover:border-jni-600 hover:bg-jni-50/30"
                      >
                        <h4 className="font-semibold text-lg">{service.name}</h4>
                        <p className="text-sm text-gray-600">{service.fullName}</p>
                        <p className="text-sm text-gray-500 mt-1">{service.duration}</p>
                      </motion.div>
                    ))}
                  </div>
                </TabsContent>
              </Tabs>

              <div className="mt-8 p-5 bg-gradient-to-r from-jni-50 to-jni-100/30 rounded-xl border border-jni-200/50">
                <p className="text-sm text-jni-800 font-medium">
                  <strong>Butuh bantuan?</strong> Tim kami siap membantu Anda memilih layanan yang tepat.
                </p>
                <Button
                  size="sm"
                  className="w-full mt-4 bg-gradient-to-r from-jni-600 to-jni-700 hover:from-jni-700 hover:to-jni-800 transition-all duration-300 hover:scale-[1.02] hover:shadow-lg"
                  asChild
                >
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