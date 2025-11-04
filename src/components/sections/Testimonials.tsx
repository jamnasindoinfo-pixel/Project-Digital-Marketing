'use client'

import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Star, Quote, MapPin, Calendar } from 'lucide-react'
import { TESTIMONIALS } from '@/lib/constants'
import { cn } from '@/lib/utils'

export function Testimonials() {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1
  })

  return (
    <section id="testimonials" className="py-20 bg-gradient-to-br from-gray-50 to-white">
      <div className="container-custom">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
          ref={ref}
        >
          <Badge className="mb-4 bg-brand-100 text-brand-700 px-4 py-2">
            Testimoni Client
          </Badge>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
            Apa Kata <span className="gradient-text">Client</span> Kami
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Kepuasan client adalah prioritas utama. Lihat pengalaman mereka bersama PT Jaminan Solusi Bisnis
          </p>
        </motion.div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {TESTIMONIALS.map((testimonial, index) => (
            <motion.div
              key={testimonial.id}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.1 * index }}
              whileHover={{ y: -8, scale: 1.02 }}
              className="h-full"
            >
              <Card className="h-full border-0 shadow-lg hover:shadow-2xl transition-all duration-300 bg-white">
                <CardContent className="p-8 h-full flex flex-col">
                  {/* Header with Quote */}
                  <div className="flex items-start justify-between mb-6">
                    <div className="bg-gradient-to-br from-brand-100 to-brand-50 p-3 rounded-lg">
                      <Quote className="w-6 h-6 text-brand-600" />
                    </div>
                    <div className="text-right">
                      <div className="flex items-center gap-1 justify-end text-xs text-gray-500">
                        <Calendar className="w-3 h-3" />
                        {new Date(testimonial.date).toLocaleDateString('id-ID', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric'
                        })}
                      </div>
                    </div>
                  </div>

                  {/* Rating */}
                  <div className="flex gap-1 mb-6">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={cn(
                          "w-5 h-5 transition-colors",
                          i < testimonial.rating
                            ? 'text-yellow-500 fill-yellow-500'
                            : 'text-gray-200'
                        )}
                      />
                    ))}
                  </div>

                  {/* Content */}
                  <div className="flex-1 mb-6">
                    <p className="text-gray-700 text-base leading-relaxed font-medium">
                      "{testimonial.content}"
                    </p>
                  </div>

                  {/* Author Info */}
                  <div className="pt-4 border-t border-gray-100">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-brand-600 to-brand-700 rounded-full flex items-center justify-center">
                        <span className="text-white font-bold text-sm">
                          {testimonial.name.charAt(0)}
                        </span>
                      </div>
                      <div className="flex-1">
                        <div className="font-bold text-gray-900 text-lg mb-1">
                          {testimonial.name}
                        </div>
                        <div className="text-sm text-gray-600 mb-2">
                          {testimonial.position}
                        </div>
                        <div className="flex items-center gap-2 text-xs text-gray-500">
                          <MapPin className="w-3 h-3" />
                          <span>{testimonial.company}</span>
                        </div>
                      </div>
                    </div>

                    {/* Service Badge */}
                    <Badge className={cn(
                      "inline-flex px-3 py-1 text-xs font-semibold",
                      testimonial.service.includes('PPIU') && "bg-blue-100 text-blue-700",
                      testimonial.service.includes('PIHK') && "bg-green-100 text-green-700",
                      testimonial.service.includes('Pajak') && "bg-purple-100 text-purple-700",
                      testimonial.service.includes('Bank') && "bg-orange-100 text-orange-700",
                      !testimonial.service.includes('PPIU') && !testimonial.service.includes('PIHK') && !testimonial.service.includes('Pajak') && !testimonial.service.includes('Bank') && "bg-gray-100 text-gray-700"
                    )}>
                      {testimonial.service}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="text-center mt-16"
        >
          <Card className="bg-gradient-to-r from-brand-600 to-brand-700 text-white border-0 shadow-xl">
            <CardContent className="p-12">
              <h3 className="text-2xl font-bold mb-4">
                Bergabung dengan Client Puas Kami
              </h3>
              <p className="text-brand-100 text-lg mb-8 max-w-2xl mx-auto">
                Lebih dari 500+ client telah mempercayai layanan kami untuk berbagai kebutuhan izin dan konsultasi bisnis
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Badge className="bg-white/20 text-white px-4 py-2 text-sm">
                  500+ Client Puas
                </Badge>
                <Badge className="bg-white/20 text-white px-4 py-2 text-sm">
                  95% Success Rate
                </Badge>
                <Badge className="bg-white/20 text-white px-4 py-2 text-sm">
                  6+ Tahun Pengalaman
                </Badge>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </section>
  )
}