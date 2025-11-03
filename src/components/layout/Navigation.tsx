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
  Briefcase,
  ChevronRight
} from 'lucide-react'
import { COMPANY_INFO, NAVIGATION, CONTACT_INFO } from '@/lib/constants'
import { cn } from '@/lib/utils'

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const navClasses = cn(
    'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
    isScrolled
      ? 'bg-white/95 backdrop-blur-md shadow-lg py-2'
      : 'bg-white/80 backdrop-blur-sm py-4'
  )

  const dropdownContent = {
    travel: [
      { title: 'PPIU', href: '#ppiu', description: 'Izin Penyelenggara Perjalanan Ibadah Umrah' },
      { title: 'PIHK', href: '#pihk', description: 'Izin Penyelenggara Ibadah Haji Khusus' },
      { title: 'Akreditasi', href: '#akreditasi', description: 'Akreditasi PPIU & PIHK' },
      { title: 'IATA', href: '#iata', description: 'Keanggotaan IATA' }
    ],
    business: [
      { title: 'Pajak', href: '#pajak', description: 'Konsultasi & Pengurusan Pajak' },
      { title: 'Bank Garansi', href: '#bank-garansi', description: 'Pengajuan Bank Garansi' },
      { title: 'Laporan Keuangan', href: '#laporan-keuangan', description: 'Pembukuan & Laporan Keuangan' },
      { title: 'Administrasi Kontraktor', href: '#kontraktor', description: 'Administrasi Proyek' }
    ]
  }

  return (
    <>
      <nav className={navClasses}>
        <div className="container-custom">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2">
              <div className="w-10 h-10 bg-brand-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">JSB</span>
              </div>
              <div>
                <div className="font-bold text-lg text-gray-900">Jaminan Solusi</div>
                <div className="text-xs text-gray-600">Bisnis</div>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-8">
              {/* Dropdown Menus */}
              <div className="flex items-center gap-6">
                {NAVIGATION.main.slice(0, 2).map((item) => (
                  <div
                    key={item.title}
                    className="relative"
                    onMouseEnter={() => setActiveDropdown(item.title)}
                    onMouseLeave={() => setActiveDropdown(null)}
                  >
                    <button className="flex items-center gap-1 text-gray-700 hover:text-brand-600 transition-colors font-medium">
                      <span>{item.title}</span>
                      <ChevronDown className="w-4 h-4" />
                    </button>

                    <AnimatePresence>
                      {activeDropdown === item.title && (
                        <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          transition={{ duration: 0.2 }}
                          className="absolute top-full left-0 mt-2 w-80 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden"
                        >
                          <div className="p-2">
                            {dropdownContent[item.title.toLowerCase().split(' ')[0] as keyof typeof dropdownContent]?.map((subItem) => (
                              <Link
                                key={subItem.href}
                                href={subItem.href}
                                className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
                                onClick={() => setActiveDropdown(null)}
                              >
                                <ChevronRight className="w-4 h-4 text-brand-600 mt-0.5 flex-shrink-0" />
                                <div>
                                  <div className="font-medium text-gray-900">{subItem.title}</div>
                                  <div className="text-sm text-gray-600">{subItem.description}</div>
                                </div>
                              </Link>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ))}

                {/* Regular Links */}
                {NAVIGATION.main.slice(2).map((item) => (
                  <Link
                    key={item.title}
                    href={item.href}
                    className="text-gray-700 hover:text-brand-600 transition-colors font-medium"
                  >
                    {item.title}
                  </Link>
                ))}
              </div>

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
                  {/* Travel Services */}
                  <div>
                    <button
                      className="flex items-center justify-between w-full p-3 text-left hover:bg-gray-50 rounded-lg"
                      onClick={() => setActiveDropdown(activeDropdown === 'mobile-travel' ? null : 'mobile-travel')}
                    >
                      <div className="flex items-center gap-2">
                        <Plane className="w-4 h-4 text-brand-600" />
                        <span className="font-medium">Layanan Travel</span>
                      </div>
                      <ChevronDown className={cn(
                        "w-4 h-4 transition-transform",
                        activeDropdown === 'mobile-travel' && "rotate-180"
                      )} />
                    </button>
                    {activeDropdown === 'mobile-travel' && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        className="pl-10 pr-3 space-y-1"
                      >
                        {dropdownContent.travel.map((item) => (
                          <Link
                            key={item.href}
                            href={item.href}
                            className="block p-2 text-sm text-gray-600 hover:text-brand-600"
                            onClick={() => setIsOpen(false)}
                          >
                            {item.title}
                          </Link>
                        ))}
                      </motion.div>
                    )}
                  </div>

                  {/* Business Services */}
                  <div>
                    <button
                      className="flex items-center justify-between w-full p-3 text-left hover:bg-gray-50 rounded-lg"
                      onClick={() => setActiveDropdown(activeDropdown === 'mobile-business' ? null : 'mobile-business')}
                    >
                      <div className="flex items-center gap-2">
                        <Briefcase className="w-4 h-4 text-brand-600" />
                        <span className="font-medium">Layanan Bisnis</span>
                      </div>
                      <ChevronDown className={cn(
                        "w-4 h-4 transition-transform",
                        activeDropdown === 'mobile-business' && "rotate-180"
                      )} />
                    </button>
                    {activeDropdown === 'mobile-business' && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        className="pl-10 pr-3 space-y-1"
                      >
                        {dropdownContent.business.map((item) => (
                          <Link
                            key={item.href}
                            href={item.href}
                            className="block p-2 text-sm text-gray-600 hover:text-brand-600"
                            onClick={() => setIsOpen(false)}
                          >
                            {item.title}
                          </Link>
                        ))}
                      </motion.div>
                    )}
                  </div>

                  {/* Regular Links */}
                  {NAVIGATION.main.slice(2).map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className="block p-3 hover:bg-gray-50 rounded-lg font-medium"
                      onClick={() => setIsOpen(false)}
                    >
                      {item.title}
                    </Link>
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