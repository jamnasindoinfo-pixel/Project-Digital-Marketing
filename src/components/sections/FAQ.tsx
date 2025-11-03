'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  ChevronDown,
  ChevronUp,
  Search,
  MessageCircle,
  Phone,
  Download
} from 'lucide-react'
import { FAQ_DATA, CONTACT_INFO } from '@/lib/constants'
import { createWhatsAppLink } from '@/lib/utils'

export function FAQ() {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1
  })
  const [searchTerm, setSearchTerm] = useState('')
  const [expandedItems, setExpandedItems] = useState<string[]>([])
  const [activeCategory, setActiveCategory] = useState('all')

  const categories = [
    { id: 'all', name: 'Semua', count: Object.values(FAQ_DATA.travel).length + Object.values(FAQ_DATA.business).length },
    { id: 'travel', name: 'Layanan Travel', count: Object.values(FAQ_DATA.travel).length },
    { id: 'business', name: 'Layanan Bisnis', count: Object.values(FAQ_DATA.business).length }
  ]

  const allFAQs = [
    ...Object.values(FAQ_DATA.travel).map((item) => ({ ...item, category: 'travel' })),
    ...Object.values(FAQ_DATA.business).map((item) => ({ ...item, category: 'business' }))
  ]

  const filteredFAQs = allFAQs.filter((faq) => {
    const matchesSearch = faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         faq.answer.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = activeCategory === 'all' || faq.category === activeCategory
    return matchesSearch && matchesCategory
  })

  const toggleExpanded = (question: string) => {
    setExpandedItems(prev =>
      prev.includes(question)
        ? prev.filter(item => item !== question)
        : [...prev, question]
    )
  }

  const handleAskAssistant = (question: string) => {
    const message = `Halo, saya tertarik dengan informasi: ${question}`
    const link = createWhatsAppLink(message)
    window.open(link, '_blank')
  }

  return (
    <section id="faq" className="section-padding bg-gray-50">
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
            Pertanyaan yang <span className="gradient-text">Sering Diajukan</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Temukan jawaban untuk pertanyaan umum seputar layanan kami
          </p>
        </motion.div>

        {/* Search Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="max-w-2xl mx-auto mb-8"
        >
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              type="text"
              placeholder="Cari pertanyaan..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-12 h-12 text-base"
            />
          </div>
        </motion.div>

        {/* Category Tabs */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex flex-wrap justify-center gap-4 mb-12"
        >
          {categories.map((category) => (
            <Button
              key={category.id}
              variant={activeCategory === category.id ? "default" : "outline"}
              onClick={() => setActiveCategory(category.id)}
              className="relative"
            >
              {category.name}
              <span className="ml-2 bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full text-xs">
                {category.count}
              </span>
            </Button>
          ))}
        </motion.div>

        {/* FAQ Items */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="max-w-4xl mx-auto space-y-4"
        >
          {filteredFAQs.map((faq, index) => (
            <motion.div
              key={faq.question}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.05 * index }}
            >
              <div className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow">
                <button
                  onClick={() => toggleExpanded(faq.question)}
                  className="w-full p-6 text-left flex items-center justify-between"
                >
                  <span className="font-semibold text-gray-900 pr-4">{faq.question}</span>
                  <ChevronDown
                    className={`w-5 h-5 text-gray-400 transition-transform flex-shrink-0 ${
                      expandedItems.includes(faq.question) ? 'rotate-180' : ''
                    }`}
                  />
                </button>

                <AnimatePresence>
                  {expandedItems.includes(faq.question) && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <div className="px-6 pb-6">
                        <p className="text-gray-700 mb-4">{faq.answer}</p>

                        {/* CTAs */}
                        <div className="flex flex-col sm:flex-row gap-3">
                          <Button
                            size="sm"
                            onClick={() => handleAskAssistant(faq.question)}
                            className="btn-primary"
                          >
                            <MessageCircle className="w-4 h-4 mr-2" />
                            Tanyakan ke Asisten
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => window.open(CONTACT_INFO.whatsapp.link, '_blank')}
                          >
                            <Phone className="w-4 h-4 mr-2" />
                            Konsultasi Langsung
                          </Button>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          ))}

          {filteredFAQs.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500">Tidak ada pertanyaan yang ditemukan.</p>
              <Button
                variant="outline"
                onClick={() => {
                  setSearchTerm('')
                  setActiveCategory('all')
                }}
                className="mt-4"
              >
                Reset filter
              </Button>
            </div>
          )}
        </motion.div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mt-16 text-center"
        >
          <div className="bg-brand-50 rounded-2xl p-8 lg:p-12">
            <h3 className="text-2xl font-bold mb-4">
              Masih Ada Pertanyaan?
            </h3>
            <p className="text-gray-700 mb-6 max-w-2xl mx-auto">
              Tim kami siap membantu Anda. Dapatkan jawaban langsung dari ahli kami.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="btn-primary" asChild>
                <a href={CONTACT_INFO.whatsapp.link} target="_blank" rel="noopener noreferrer">
                  <Phone className="w-5 h-5 mr-2" />
                  Hubungi Kami Sekarang
                </a>
              </Button>
              <Button size="lg" variant="outline">
                <Download className="w-5 h-5 mr-2" />
                Unduh Panduan Lengkap
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}