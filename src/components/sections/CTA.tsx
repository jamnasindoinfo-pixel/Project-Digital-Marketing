'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import {
  Phone,
  Download,
  Calendar,
  Clock,
  CheckCircle,
  Zap,
  Users,
  ArrowRight,
  Calculator
} from 'lucide-react'
import { CONTACT_INFO } from '@/lib/constants'
import { cn } from '@/lib/utils'

export function CTA() {
  const [formData, setFormData] = useState({
    name: '',
    company: '',
    service: '',
    whatsapp: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 1000))

    // Create WhatsApp message
    const message = `Halo PT Jaminan Solusi Bisnis,\n\nSaya ${formData.name} dari ${formData.company} tertarik untuk konsultasi layanan ${formData.service}.\n\nMohon hubungi saya di ${formData.whatsapp}. Terima kasih.`
    const link = `https://wa.me/${process.env.NEXT_PUBLIC_WA_NUMBER || '628123456789'}?text=${encodeURIComponent(message)}`

    window.open(link, '_blank')
    setIsSubmitting(false)

    // Reset form
    setFormData({ name: '', company: '', service: '', whatsapp: '' })
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  const ctaOptions = [
    {
      id: 'consultation',
      title: 'Konsultasi Personal',
      description: 'Dapatkan evaluasi kasus spesifik Anda',
      duration: '30 menit',
      benefits: ['Evaluasi lengkap', 'Roadmap proses', 'Estimasi biaya'],
      icon: Calendar,
      primary: true,
      link: 'https://wa.me/628123456789?text=Halo, saya ingin jadwalkan konsultasi'
    },
    {
      id: 'checklist',
      title: 'Download Panduan',
      description: 'Unduh semua panduan yang Anda butuhkan',
      duration: 'Sekarang',
      benefits: ['Checklist lengkap', 'Template dokumen', 'Panduan step-by-step'],
      icon: Download,
      primary: false,
      link: '#'
    },
    {
      id: 'quote',
      title: 'Kalkulator Biaya',
      description: 'Dapatkan estimasi biaya instan',
      duration: '2 menit',
      benefits: ['Estimasi transparan', 'Breakdown biaya', 'Bandingkan layanan'],
      icon: Calculator,
      primary: false,
      link: '#'
    }
  ]

  return (
    <section id="cta" className="section-padding bg-gradient-to-br from-brand-600 to-brand-800 text-white overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }} />
      </div>

      <div className="container-custom relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
          ref={ref}
        >
          <Badge className="bg-white/20 text-white mb-4">
            <Zap className="w-3 h-3 mr-2" />
            Langkah Terakhir
          </Badge>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
            Pilih Jalur Tercepat untuk Izin Anda
          </h2>
          <p className="text-xl text-blue-100 max-w-3xl mx-auto">
            Tiga cara mudah untuk memulai perjalanan Anda bersama kami
          </p>
        </motion.div>

        {/* CTA Options */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {ctaOptions.map((option, index) => (
            <motion.div
              key={option.id}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
              whileHover={{ y: -10 }}
              className="relative"
            >
              {option.primary && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <Badge className="bg-yellow-400 text-yellow-900 px-4 py-1">
                    <Users className="w-3 h-3 mr-1" />
                    Paling Populer
                  </Badge>
                </div>
              )}

              <div className={cn(
                "bg-white/10 backdrop-blur-sm rounded-2xl p-8 h-full",
                "border-2 transition-all duration-300",
                option.primary
                  ? "border-white/30 shadow-2xl bg-white/20"
                  : "border-white/10 hover:border-white/20"
              )}>
                <div className="flex items-center justify-between mb-6">
                  <div className="w-16 h-16 bg-white/20 rounded-xl flex items-center justify-center">
                    <option.icon className="w-8 h-8" />
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Clock className="w-4 h-4" />
                    <span>{option.duration}</span>
                  </div>
                </div>

                <h3 className="text-2xl font-bold mb-3">{option.title}</h3>
                <p className="text-blue-100 mb-6">{option.description}</p>

                <ul className="space-y-3 mb-8">
                  {option.benefits.map((benefit, idx) => (
                    <li key={idx} className="flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-green-400" />
                      <span>{benefit}</span>
                    </li>
                  ))}
                </ul>

                <Button
                  size="lg"
                  className={cn(
                    "w-full",
                    option.primary
                      ? "bg-white text-brand-700 hover:bg-gray-100"
                      : "bg-white/20 text-white hover:bg-white/30 border-white"
                  )}
                  asChild
                >
                  <a href={option.link} target="_blank" rel="noopener noreferrer">
                    {option.primary ? 'Jadwalkan Sekarang' : 'Pilih Opsi'}
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </a>
                </Button>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Quick Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="max-w-2xl mx-auto"
        >
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
            <h3 className="text-2xl font-bold mb-6 text-center">
              Atau Isi Form Ini, Kami Akan Menghubungi Anda
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Nama Lengkap"
                  required
                  className="bg-white/20 border-white/30 text-white placeholder-white/70"
                />
                <Input
                  name="company"
                  value={formData.company}
                  onChange={handleInputChange}
                  placeholder="Nama Perusahaan"
                  required
                  className="bg-white/20 border-white/30 text-white placeholder-white/70"
                />
              </div>
              <Input
                name="service"
                value={formData.service}
                onChange={handleInputChange}
                placeholder="Layanan yang Dibutuhkan"
                required
                className="bg-white/20 border-white/30 text-white placeholder-white/70"
              />
              <Input
                name="whatsapp"
                value={formData.whatsapp}
                onChange={handleInputChange}
                placeholder="Nomor WhatsApp"
                type="tel"
                required
                className="bg-white/20 border-white/30 text-white placeholder-white/70"
              />
              <Button
                type="submit"
                size="lg"
                className="w-full bg-white text-brand-700 hover:bg-gray-100 font-semibold"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Mengirim...' : 'Kirim Permintaan'}
                <Phone className="w-5 h-5 ml-2" />
              </Button>
            </form>
          </div>
        </motion.div>
      </div>
    </section>
  )
}