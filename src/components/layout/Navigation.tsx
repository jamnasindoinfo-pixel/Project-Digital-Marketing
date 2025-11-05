'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import {
  Menu,
  X,
  ChevronDown,
  Phone,
  Plane,
  ChevronRight,
  ArrowRight,
  Star,
  Clock,
  Shield,
  Award,
  FileText,
  Building,
  Calculator,
  HardHat
} from 'lucide-react'
import { COMPANY_INFO, NAVIGATION, CONTACT_INFO } from '@/lib/constants'
import { cn } from '@/lib/utils'

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null)

  // Get icon for service
  const getServiceIcon = (title: string) => {
    const icons: { [key: string]: any } = {
      'PPIU': Plane,
      'PIHK': Star,
      'Akreditasi': Award,
      'IATA': Shield,
      'Pajak': Calculator,
      'Bank Garansi': Building,
      'Laporan Keuangan': FileText,
      'Administrasi Kontraktor': HardHat
    }
    return icons[title] || ChevronRight
  }

  useEffect(() => {
    let timeoutId: NodeJS.Timeout
    let lastScrollY = 0

    const handleScroll = () => {
      // Throttle scroll events
      if (timeoutId) {
        return
      }

      timeoutId = setTimeout(() => {
        const currentScrollY = window.scrollY
        // Only update state if scroll position actually changed significantly
        if (Math.abs(currentScrollY - lastScrollY) > 5) {
          setIsScrolled(currentScrollY > 20)
          lastScrollY = currentScrollY
        }
        timeoutId = null as any
      }, 16) // ~60fps
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', handleScroll)
      if (timeoutId) {
        clearTimeout(timeoutId)
      }
    }
  }, [])

  const navClasses = cn(
    'fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b border-gray-100',
    isScrolled
      ? 'bg-white/98 backdrop-blur-lg shadow-xl py-3 border-gray-200'
      : 'bg-white/90 backdrop-blur-md py-4 border-gray-100/50'
  )

  
  return (
    <>
      <nav className={navClasses}>
        <div className="container-custom">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3 group">
              <div className="w-12 h-12 bg-gradient-to-br from-brand-600 to-brand-700 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-105">
                <span className="text-white font-bold text-xl">JSB</span>
              </div>
              <div>
                <div className="font-bold text-xl text-gray-900 group-hover:text-brand-600 transition-colors">Jaminan Solusi</div>
                <div className="text-sm text-gray-600 font-medium">Bisnis</div>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-8">
              {NAVIGATION.main.map((item) => (
                <div key={item.title}>
                  {item.children ? (
                    // Dropdown Menu
                    <div
                      className="relative"
                      onMouseEnter={() => setActiveDropdown(item.title)}
                      onMouseLeave={() => setActiveDropdown(null)}
                    >
                      <button className="nav-link flex items-center gap-1 px-2 py-1 rounded-lg hover:bg-brand-50 transition-all duration-200">
                        <span>{item.title}</span>
                        <ChevronDown className="w-4 h-4 transition-transform duration-200 group-hover:rotate-180" />
                      </button>

                      <AnimatePresence>
                        {activeDropdown === item.title && (
                          <motion.div
                            initial={{ opacity: 0, y: -10, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: -10, scale: 0.95 }}
                            transition={{ duration: 0.2, ease: "easeOut" }}
                            className="dropdown-centered absolute top-full mt-3 w-96 bg-white/98 backdrop-blur-xl rounded-2xl shadow-2xl border border-gray-200/50 overflow-hidden z-50"
                          >
                            {/* Header */}
                            <div className="bg-gradient-to-r from-brand-600 to-brand-700 px-6 py-4">
                              <h3 className="text-white font-semibold text-lg">Layanan Kami</h3>
                              <p className="text-brand-100 text-sm">Solusi lengkap untuk bisnis Anda</p>
                            </div>

                            {/* Services Grid */}
                            <div className="p-4">
                              <div className="grid grid-cols-2 gap-2">
                                {item.children.map((subItem, index) => {
                                  const Icon = getServiceIcon(subItem.title)
                                  return (
                                    <Link
                                      key={subItem.href}
                                      href={subItem.href}
                                      className="service-item-hover group flex items-start gap-3 p-3 rounded-xl hover:bg-brand-50 transition-all duration-200"
                                      onClick={() => setActiveDropdown(null)}
                                    >
                                      <div className="w-10 h-10 bg-gradient-to-br from-brand-500 to-brand-600 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:shadow-lg transition-shadow">
                                        <Icon className="w-5 h-5 text-white" />
                                      </div>
                                      <div className="flex-1 min-w-0">
                                        <div className="font-semibold text-gray-900 text-sm group-hover:text-brand-600 transition-colors">
                                          {subItem.title}
                                        </div>
                                        {subItem.description && (
                                          <div className="text-xs text-gray-600 mt-1 line-clamp-2">
                                            {subItem.description}
                                          </div>
                                        )}
                                      </div>
                                      <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-brand-600 transition-all duration-200 group-hover:translate-x-1" />
                                    </Link>
                                  )
                                })}
                              </div>

                              {/* Footer CTA */}
                              <div className="mt-4 pt-4 border-t border-gray-200">
                                <Link
                                  href="/services"
                                  className="flex items-center justify-center gap-2 text-brand-600 font-medium text-sm hover:text-brand-700 transition-colors"
                                  onClick={() => setActiveDropdown(null)}
                                >
                                  Lihat Semua Layanan
                                  <ArrowRight className="w-4 h-4" />
                                </Link>
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  ) : (
                    // Regular Link
                    <Link
                      href={item.href}
                      className="text-gray-700 hover:text-brand-600 transition-colors font-medium"
                    >
                      {item.title}
                    </Link>
                  )}
                </div>
              ))}

              {/* CTA Button */}
              <Button className="btn-primary" asChild>
                <a href={CONTACT_INFO.whatsapp.link} target="_blank" rel="noopener noreferrer">
                  <Phone className="w-4 h-4 mr-2" />
                  Konsultasi Gratis
                </a>
              </Button>
            </div>

            {/* Mobile Menu Button */}
            <button
              className="lg:hidden p-2"
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed top-16 left-0 right-0 bg-white border-b z-40 lg:hidden"
          >
            <div className="container-custom py-4">
              <div className="space-y-4">
                {/* Mobile Menu Items */}
                <div className="space-y-2">
                  {NAVIGATION.main.map((item) => (
                    <div key={item.title}>
                      {item.children ? (
                        // Mobile Dropdown Menu
                        <div>
                          <button
                            className="flex items-center justify-between w-full p-3 text-left hover:bg-gray-50 rounded-lg"
                            onClick={() => setActiveDropdown(activeDropdown === `mobile-${item.title}` ? null : `mobile-${item.title}`)}
                          >
                            <div className="flex items-center gap-2">
                              <Plane className="w-4 h-4 text-brand-600" />
                              <span className="font-medium">{item.title}</span>
                            </div>
                            <ChevronDown className={cn(
                              "w-4 h-4 transition-transform",
                              activeDropdown === `mobile-${item.title}` && "rotate-180"
                            )} />
                          </button>
                          {activeDropdown === `mobile-${item.title}` && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: 'auto' }}
                              className="pl-4 pr-3 space-y-2"
                            >
                              {item.children.map((subItem) => {
                                const Icon = getServiceIcon(subItem.title)
                                return (
                                  <Link
                                    key={subItem.href}
                                    href={subItem.href}
                                    className="mobile-dropdown-item flex items-center gap-3 p-3 rounded-lg bg-gray-50 hover:bg-brand-50 transition-all duration-200 group"
                                    onClick={() => setIsOpen(false)}
                                  >
                                    <div className="w-8 h-8 bg-gradient-to-br from-brand-500 to-brand-600 rounded-lg flex items-center justify-center flex-shrink-0">
                                      <Icon className="w-4 h-4 text-white" />
                                    </div>
                                    <div className="flex-1">
                                      <div className="font-medium text-gray-900 text-sm group-hover:text-brand-600 transition-colors">
                                        {subItem.title}
                                      </div>
                                      {subItem.description && (
                                        <div className="text-xs text-gray-600 mt-0.5">
                                          {subItem.description}
                                        </div>
                                      )}
                                    </div>
                                    <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-brand-600 transition-colors" />
                                  </Link>
                                )
                              })}
                            </motion.div>
                          )}
                        </div>
                      ) : (
                        // Regular Link
                        <Link
                          key={item.href}
                          href={item.href}
                          className="block p-3 hover:bg-gray-50 rounded-lg font-medium"
                          onClick={() => setIsOpen(false)}
                        >
                          {item.title}
                        </Link>
                      )}
                    </div>
                  ))}
                </div>

                {/* Mobile CTA */}
                <div className="pt-4 border-t">
                  <Button className="w-full btn-primary" asChild>
                    <a href={CONTACT_INFO.whatsapp.link} target="_blank" rel="noopener noreferrer">
                      <Phone className="w-4 h-4 mr-2" />
                      Konsultasi Gratis
                    </a>
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}