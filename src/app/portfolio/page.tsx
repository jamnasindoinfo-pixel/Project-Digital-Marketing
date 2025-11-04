'use client'

import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { PORTFOLIO } from '@/lib/constants'
import { Navigation } from '@/components/layout/Navigation'
import { Footer } from '@/components/layout/Footer'
import { ChatWidget } from '@/components/chat/ChatWidget'
import { ScrollProgress } from '@/components/elements/scroll-progress'
import {
  Calendar,
  Clock,
  CheckCircle,
  AlertCircle,
  ExternalLink,
  Filter,
  Plane,
  Briefcase,
  TrendingUp
} from 'lucide-react'
import { cn } from '@/lib/utils'

// Portfolio filters
const categories = [
  { value: 'all', label: 'Semua', icon: TrendingUp },
  { value: 'travel', label: 'Travel', icon: Plane },
  { value: 'business', label: 'Bisnis', icon: Briefcase },
]

const statusConfig = {
  completed: {
    label: 'Selesai',
    color: 'bg-green-100 text-green-700',
    icon: CheckCircle
  },
  'in-progress': {
    label: 'Dalam Proses',
    color: 'bg-yellow-100 text-yellow-700',
    icon: Clock
  },
  active: {
    label: 'Aktif',
    color: 'bg-blue-100 text-blue-700',
    icon: TrendingUp
  }
}

export default function PortfolioPage() {
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1
  })

  // Filter portfolio based on selected category
  const filteredPortfolio = useMemo(() => {
    if (selectedCategory === 'all') {
      return PORTFOLIO
    }
    return PORTFOLIO.filter(item => item.category === selectedCategory)
  }, [selectedCategory])

  // Calculate statistics
  const stats = useMemo(() => {
    const total = PORTFOLIO.length
    const completed = PORTFOLIO.filter(item => item.status === 'completed').length
    const travel = PORTFOLIO.filter(item => item.category === 'travel').length
    const business = PORTFOLIO.filter(item => item.category === 'business').length

    return {
      total,
      completed,
      successRate: Math.round((completed / total) * 100),
      travel,
      business
    }
  }, [])

  return (
    <>
      <ScrollProgress />
      <Navigation />
      <main>
        {/* Header */}
        <section className="pt-32 pb-12 bg-gradient-to-br from-blue-50 via-white to-emerald-50">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              Portfolio <span className="gradient-text">Kami</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Lihat hasil kerja nyata kami dalam membantu ratusan client mendapatkan izin dan layanan bisnis mereka dengan sukses.
            </p>
          </motion.div>

          {/* Statistics */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="grid grid-cols-2 md:grid-cols-5 gap-6 mt-16"
          >
            <Card className="text-center border-0 shadow-lg bg-white">
              <CardContent className="p-6">
                <div className="text-3xl font-bold text-brand-600 mb-2">{stats.total}</div>
                <div className="text-sm text-gray-600">Total Project</div>
              </CardContent>
            </Card>
            <Card className="text-center border-0 shadow-lg bg-white">
              <CardContent className="p-6">
                <div className="text-3xl font-bold text-green-600 mb-2">{stats.completed}</div>
                <div className="text-sm text-gray-600">Selesai</div>
              </CardContent>
            </Card>
            <Card className="text-center border-0 shadow-lg bg-white">
              <CardContent className="p-6">
                <div className="text-3xl font-bold text-blue-600 mb-2">{stats.successRate}%</div>
                <div className="text-sm text-gray-600">Success Rate</div>
              </CardContent>
            </Card>
            <Card className="text-center border-0 shadow-lg bg-white">
              <CardContent className="p-6">
                <div className="text-3xl font-bold text-purple-600 mb-2">{stats.travel}</div>
                <div className="text-sm text-gray-600">Project Travel</div>
              </CardContent>
            </Card>
            <Card className="text-center border-0 shadow-lg bg-white">
              <CardContent className="p-6">
                <div className="text-3xl font-bold text-orange-600 mb-2">{stats.business}</div>
                <div className="text-sm text-gray-600">Project Bisnis</div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* Filter Section */}
      <section className="py-8 bg-white border-b sticky top-0 z-40 backdrop-blur-lg bg-white/95">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5 }}
            className="flex flex-col md:flex-row items-center justify-between gap-4"
            ref={ref}
          >
            <div className="flex items-center gap-2">
              <Filter className="w-5 h-5 text-gray-600" />
              <span className="text-sm font-medium text-gray-700">Filter Kategori:</span>
            </div>

            <div className="flex flex-wrap gap-2">
              {categories.map((category) => {
                const IconComponent = category.icon
                return (
                  <Button
                    key={category.value}
                    variant={selectedCategory === category.value ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedCategory(category.value)}
                    className={cn(
                      "gap-2 transition-all duration-200",
                      selectedCategory === category.value
                        ? "bg-brand-600 hover:bg-brand-700 text-white"
                        : "hover:border-brand-600 hover:text-brand-600"
                    )}
                  >
                    <IconComponent className="w-4 h-4" />
                    {category.label}
                  </Button>
                )
              })}
            </div>

            <div className="text-sm text-gray-600">
              Menampilkan <span className="font-semibold text-brand-600">{filteredPortfolio.length}</span> dari {stats.total} project
            </div>
          </motion.div>
        </div>
      </section>

      {/* Portfolio Grid */}
      <section className="py-16 bg-gray-50">
        <div className="container-custom">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPortfolio.map((item, index) => {
              const statusInfo = statusConfig[item.status as keyof typeof statusConfig]
              const StatusIcon = statusInfo.icon

              return (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 * index }}
                  whileHover={{ y: -8, scale: 1.02 }}
                  className="h-full"
                >
                  <Card className="h-full border-0 shadow-lg hover:shadow-2xl transition-all duration-300 bg-white overflow-hidden group">
                    {/* Header Image */}
                    <div className="h-48 bg-gradient-to-br from-brand-100 to-brand-50 relative overflow-hidden">
                      <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition-colors duration-300" />

                      {/* Service Badge */}
                      <div className="absolute top-4 left-4">
                        <Badge className={cn(
                          "px-3 py-1 text-xs font-semibold",
                          item.category === 'travel'
                            ? "bg-blue-100 text-blue-700"
                            : "bg-orange-100 text-orange-700"
                        )}>
                          {item.service}
                        </Badge>
                      </div>

                      {/* Status Badge */}
                      <div className="absolute top-4 right-4">
                        <Badge className={cn(
                          "px-3 py-1 text-xs font-semibold gap-1",
                          statusInfo.color
                        )}>
                          <StatusIcon className="w-3 h-3" />
                          {statusInfo.label}
                        </Badge>
                      </div>

                      {/* Icon */}
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                          {item.category === 'travel' ? (
                            <Plane className="w-10 h-10 text-brand-600" />
                          ) : (
                            <Briefcase className="w-10 h-10 text-brand-600" />
                          )}
                        </div>
                      </div>
                    </div>

                    <CardContent className="p-6 h-full flex flex-col">
                      {/* Client Info */}
                      <div className="mb-4">
                        <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-1">
                          {item.client}
                        </h3>
                        <p className="text-gray-600 text-sm leading-relaxed">
                          {item.description}
                        </p>
                      </div>

                      {/* Project Details */}
                      <div className="space-y-3 mb-6 flex-1">
                        <div className="flex items-center justify-between text-sm">
                          <div className="flex items-center gap-2 text-gray-600">
                            <Calendar className="w-4 h-4" />
                            <span>{new Date(item.date).toLocaleDateString('id-ID', {
                              day: 'numeric',
                              month: 'long',
                              year: 'numeric'
                            })}</span>
                          </div>
                          <div className="flex items-center gap-2 text-gray-600">
                            <Clock className="w-4 h-4" />
                            <span>{item.duration}</span>
                          </div>
                        </div>
                      </div>

                      {/* Action Button */}
                      <Button
                        className="w-full group-hover:bg-brand-700 transition-colors duration-200"
                        asChild
                      >
                        <a href="#cta" className="flex items-center justify-center gap-2">
                          <span>Konsultasi Serupa</span>
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              )
            })}
          </div>

          {filteredPortfolio.length === 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-16"
            >
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Filter className="w-12 h-12 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Tidak ada portfolio ditemukan
              </h3>
              <p className="text-gray-600 max-w-md mx-auto">
                Coba ubah filter kategori untuk melihat portfolio lainnya.
              </p>
            </motion.div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-brand-600 to-brand-700 text-white">
        <div className="container-custom text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Project Anda Berikutnya?
            </h2>
            <p className="text-xl text-blue-100 mb-8 max-w-3xl mx-auto">
              Bergabunglah dengan ratusan client yang telah berhasil mempercayakan layanan kami untuk berbagai kebutuhan izin dan konsultasi bisnis mereka.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-white text-brand-700 hover:bg-gray-100 font-semibold" asChild>
                <a href="#cta">
                  Mulai Konsultasi
                </a>
              </Button>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-brand-700 font-semibold" asChild>
                <a href="#testimonials">
                  Lihat Testimoni
                </a>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
      </main>
      <Footer />
      <ChatWidget />
    </>
  )
}