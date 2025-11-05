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
  ChevronRight
} from 'lucide-react'
import { COMPANY_INFO, NAVIGATION, CONTACT_INFO } from '@/lib/constants'
import { cn } from '@/lib/utils'

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null)

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
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.2 }}
                            className="absolute top-full left-0 mt-3 w-80 bg-white/98 backdrop-blur-xl rounded-2xl shadow-2xl border border-gray-200 overflow-hidden z-50"
                          >
                            <div className="p-2">
                              {item.children.map((subItem) => (
                                <Link
                                  key={subItem.href}
                                  href={subItem.href}
                                  className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
                                  onClick={() => setActiveDropdown(null)}
                                >
                                  <ChevronRight className="w-4 h-4 text-brand-600 mt-0.5 flex-shrink-0" />
                                  <div>
                                    <div className="font-medium text-gray-900">{subItem.title}</div>
                                    {subItem.description && (
                                      <div className="text-sm text-gray-600">{subItem.description}</div>
                                    )}
                                  </div>
                                </Link>
                              ))}
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
                              className="pl-10 pr-3 space-y-1"
                            >
                              {item.children.map((subItem) => (
                                <Link
                                  key={subItem.href}
                                  href={subItem.href}
                                  className="block p-2 text-sm text-gray-600 hover:text-brand-600"
                                  onClick={() => setIsOpen(false)}
                                >
                                  {subItem.title}
                                </Link>
                              ))}
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