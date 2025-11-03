'use client'

import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import {
  Award,
  ShieldCheck,
  Users,
  Clock,
  TrendingUp,
  FileCheck,
  ChevronRight,
  Star
} from 'lucide-react'
import { cn } from '@/lib/utils'

const benefits = [
  {
    icon: Award,
    title: '6 Tahun Pengalaman',
    description: 'Expert di bidangnya dengan track record terbukti menangani ratusan kasus izin dan administrasi bisnis',
    features: ['Specialist team', 'Proven methods', 'Industry knowledge'],
    color: 'from-blue-500 to-blue-600'
  },
  {
    icon: ShieldCheck,
    title: 'One Stop Solution',
    description: 'Semua kebutuhan izin dan administrasi dalam satu tempat, dari travel hingga layanan bisnis lengkap',
    features: ['Complete services', 'Integrated process', 'Single point of contact'],
    color: 'from-green-500 to-green-600'
  },
  {
    icon: Users,
    title: 'Tim Profesional',
    description: 'Konsultan bersertifikat di masing-masing bidang siap membantu Anda 24/7',
    features: ['Certified experts', 'Dedicated support', 'Continuous training'],
    color: 'from-purple-500 to-purple-600'
  },
  {
    icon: FileCheck,
    title: 'Garansi Selesai',
    description: 'Uang kembali jika izin tidak terbit sesuai komitmen dan timeline yang disepakati',
    features: ['Money back guarantee', 'Clear commitment', 'Risk free'],
    color: 'from-orange-500 to-orange-600'
  }
]

const benefitsExtended = [
  {
    icon: Clock,
    title: 'Proses Cepat',
    description: 'Timeline yang jelas dengan monitoring real-time, proses lebih cepat karena dokumen siap'
  },
  {
    icon: TrendingUp,
    title: 'Success Rate 100%',
    description: 'Semua pengajuan yang kami bantu berhasil terbit dengan persyaratan lengkap'
  },
  {
    icon: Star,
    title: 'Premium Service',
    description: 'Layanan premium dengan dedicated assistant untuk setiap client'
  }
]

export function Benefits() {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1
  })

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5
      }
    }
  }

  return (
    <section id="benefits" className="section-padding bg-gray-50 overflow-hidden">
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
            Mengapa <span className="gradient-text">500+ Perusahaan</span> Mempercayai Kami?
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Kami berkomitmen memberikan layanan terbaik dengan hasil yang terbukti dan kepuasan client tertinggi
          </p>
        </motion.div>

        {/* Main Benefits Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16"
        >
          {benefits.map((benefit, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              whileHover={{ y: -5 }}
              className="group"
            >
              <Card className="h-full card-hover border-0 shadow-lg hover:shadow-2xl">
                <CardContent className="p-8 text-center">
                  <div className={cn(
                    "w-16 h-16 mx-auto mb-6 rounded-full flex items-center justify-center",
                    "bg-gradient-to-r " + benefit.color
                  )}>
                    <benefit.icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold mb-4 group-hover:text-brand-600 transition-colors">
                    {benefit.title}
                  </h3>
                  <p className="text-gray-600 mb-6 leading-relaxed">
                    {benefit.description}
                  </p>
                  <ul className="space-y-2 text-sm text-gray-500">
                    {benefit.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center justify-center gap-2">
                        <div className="w-1 h-1 bg-brand-600 rounded-full" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <Button variant="ghost" className="mt-6 text-brand-600 hover:text-brand-700 hover:bg-brand-50">
                    Pelajari lebih lanjut
                    <ChevronRight className="w-4 h-4 ml-1" />
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* Extended Benefits */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          {benefitsExtended.map((benefit, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.5 + index * 0.1 }}
              whileHover={{ scale: 1.02 }}
              className="bg-white rounded-lg p-6 shadow-md hover:shadow-lg transition-all"
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-brand-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <benefit.icon className="w-6 h-6 text-brand-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-lg mb-2">{benefit.title}</h4>
                  <p className="text-gray-600 text-sm">{benefit.description}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="mt-16 text-center"
        >
          <div className="bg-gradient-to-r from-brand-600 to-brand-800 rounded-2xl p-8 lg:p-12 text-white">
            <h3 className="text-2xl lg:text-3xl font-bold mb-4">
              Siap Memulai Proses Izin Anda?
            </h3>
            <p className="text-lg mb-8 text-blue-100 max-w-2xl mx-auto">
              Konsultasi gratis dengan tim ahli kami. Dapatkan evaluasi lengkap dan roadmap untuk kebutuhan izin Anda.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-white text-brand-600 hover:bg-gray-100" asChild>
                <a href="#cta">
                  Mulai Konsultasi Gratis
                  <ChevronRight className="w-5 h-5 ml-2" />
                </a>
              </Button>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-brand-600">
                Lihat Portfolio
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}