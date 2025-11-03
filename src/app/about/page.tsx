import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Navigation } from '@/components/layout/Navigation'
import { Footer } from '@/components/layout/Footer'
import {
  Award,
  Users,
  CheckCircle,
  Target,
  Eye,
  HandHeart,
  TrendingUp,
  Calendar,
  MapPin
} from 'lucide-react'
import Link from 'next/link'
import { COMPANY_INFO, CONTACT_INFO } from '@/lib/constants'

export default function AboutPage() {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1
  })

  const values = [
    {
      icon: CheckCircle,
      title: 'Integritas',
      description: 'Berpegang teguh pada kejujuran dan transparansi dalam setiap layanan'
    },
    {
      icon: Target,
      title: 'Profesional',
      description: 'Memberikan layanan terbaik dengan standar tertinggi'
    },
    {
      icon: Eye,
      title: 'Visi Misi',
      description: 'Menjadi solusi terpercaya untuk semua kebutuhan izin dan administrasi'
    },
    {
      icon: HandHeart,
      title: 'Komitmen',
      description: 'Bertanggung jawab penuh atas keberhasilan setiap client'
    }
  ]

  const milestones = [
    { year: '2018', title: 'Didirikan', description: 'Memulai perjalanan dengan fokus pada izin travel' },
    { year: '2019', title: '100 Client', description: 'Mencapai 100 client puas di tahun pertama' },
    { year: '2021', title: 'Ekspansi Layanan', description: 'Menambah layanan administrasi bisnis' },
    { year: '2023', title: '500+ Client', description: 'Melayani lebih dari 500 client di seluruh Indonesia' },
    { year: '2024', title: 'Digitalisasi', description: 'Meluncurkan sistem digital untuk kemudahan client' }
  ]

  const team = [
    {
      name: 'Dr. Budi Santoso, S.H., M.Kn.',
      position: 'Founder & Senior Consultant',
      expertise: 'Hukum Perizinan & Kepatuhan',
      image: '/team/founder.jpg'
    },
    {
      name: 'Siti Nurhaliza, S.E., Ak.',
      position: 'Finance Director',
      expertise: 'Keuangan & Pajak',
      image: '/team/finance.jpg'
    },
    {
      name: 'Ahmad Fauzi, S.Sos.',
      position: 'Operations Manager',
      expertise: 'Travel & Tour Management',
      image: '/team/operations.jpg'
    },
    {
      name: 'Diana Putri, S.E.',
      position: 'Client Relations',
      expertise: 'Customer Success',
      image: '/team/relation.jpg'
    }
  ]

  return (
    <div className="min-h-screen">
      <Navigation />

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-brand-50 to-white pt-32 pb-16">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-4xl mx-auto text-center"
          >
            <Badge className="mb-4 bg-brand-100 text-brand-700">
              Tentang Kami
            </Badge>
            <h1 className="text-4xl lg:text-5xl font-bold mb-6">
              {COMPANY_INFO.name}
            </h1>
            <p className="text-xl text-gray-600 leading-relaxed">
              {COMPANY_INFO.description}. Dengan pengalaman lebih dari {COMPANY_INFO.experience} tahun,
              kami telah membantu {COMPANY_INFO.clients} client dalam mencapai tujuan bisnis mereka.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Company Stats */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <motion.div
            ref={ref}
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            className="grid grid-cols-2 md:grid-cols-4 gap-8"
          >
            {[
              { number: COMPANY_INFO.experience, label: 'Tahun Pengalaman' },
              { number: COMPANY_INFO.clients, label: 'Client Puas' },
              { number: COMPANY_INFO.projects, label: 'Project Selesai' },
              { number: '99%', label: 'Tingkat Keberhasilan' }
            ].map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="text-center"
              >
                <div className="text-4xl font-bold text-brand-600 mb-2">{stat.number}</div>
                <div className="text-gray-600">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Company Story */}
      <section className="section-padding bg-gray-50">
        <div className="container-custom">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-3xl font-bold mb-6">
                Cerita Kami
              </h2>
              <p className="text-gray-600 mb-6 leading-relaxed">
                PT Jaminan Solusi Bisnis berdiri pada tahun 2018 dengan visi untuk membantu para pengusaha Indonesia
                dalam mengurus berbagai perizinan dan administrasi bisnis yang seringkali rumit dan memakan waktu.
              </p>
              <p className="text-gray-600 mb-6 leading-relaxed">
                Dimulai dari fokus pada layanan izin travel (PPIU, PIHK), kami terus berkembang dan ekspansi ke
                layanan administrasi bisnis lainnya seperti pajak, bank garansi, dan laporan keuangan.
              </p>
              <p className="text-gray-600 leading-relaxed">
                Hingga hari ini, kami telah membantu lebih dari 500 client di seluruh Indonesia untuk mencapai
                kepatuhan bisnis dan fokus pada pertumbuhan perusahaan mereka.
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="relative"
            >
              <div className="bg-white rounded-2xl shadow-xl p-8">
                <h3 className="text-xl font-semibold mb-6">Nilai-Nilai Kami</h3>
                <div className="space-y-4">
                  {values.map((value, index) => (
                    <div key={index} className="flex gap-4">
                      <value.icon className="w-6 h-6 text-brand-600 flex-shrink-0 mt-1" />
                      <div>
                        <h4 className="font-semibold mb-1">{value.title}</h4>
                        <p className="text-sm text-gray-600">{value.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Milestones */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">
              Perjalanan Kami
            </h2>
            <p className="text-gray-600">
              Milestone penting dalam sejarah perusahaan
            </p>
          </div>
          <div className="grid md:grid-cols-5 gap-6">
            {milestones.map((milestone, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="text-center"
              >
                <Badge className="bg-brand-100 text-brand-700 mb-4">
                  {milestone.year}
                </Badge>
                <h3 className="font-semibold mb-2">{milestone.title}</h3>
                <p className="text-sm text-gray-600">{milestone.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="section-padding bg-gray-50">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">
              Tim Profesional Kami
            </h2>
            <p className="text-gray-600">
              Berpengalaman dan ahli di bidangnya masing-masing
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {team.map((member, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="text-center card-hover">
                  <CardContent className="p-6">
                    <div className="w-24 h-24 bg-gray-200 rounded-full mx-auto mb-4" />
                    <h3 className="font-semibold mb-2">{member.name}</h3>
                    <p className="text-sm text-brand-600 mb-2">{member.position}</p>
                    <p className="text-sm text-gray-600">{member.expertise}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-padding bg-brand-600 text-white">
        <div className="container-custom text-center">
          <h2 className="text-3xl font-bold mb-6">
            Siap Bekerja Sama dengan Kami?
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto text-blue-100">
            Mari diskusikan kebutuhan perizinan dan administrasi bisnis Anda
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-white text-brand-600 hover:bg-gray-100" asChild>
              <Link href="#cta">
                Mulai Konsultasi
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-brand-600" asChild>
              <Link href={CONTACT_INFO.whatsapp.link} target="_blank">
                Hubungi WhatsApp
              </Link>
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}