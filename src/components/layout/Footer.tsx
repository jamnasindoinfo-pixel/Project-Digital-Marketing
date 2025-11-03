'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  Facebook,
  Instagram,
  Linkedin,
  Send,
  Plane,
  Briefcase,
  CheckCircle,
  Users,
  FileText,
  ChevronRight
} from 'lucide-react'
import { COMPANY_INFO, CONTACT_INFO, NAVIGATION, SERVICES } from '@/lib/constants'
import { cn } from '@/lib/utils'

export function Footer() {
  const [email, setEmail] = useState('')

  const handleNewsletter = (e: React.FormEvent) => {
    e.preventDefault()
    // TODO: Implement newsletter subscription
    console.log('Newsletter signup:', email)
    setEmail('')
  }

  const footerLinks = {
    travel: [
      { name: 'PPIU', href: '#ppiu', icon: Plane },
      { name: 'PIHK', href: '#pihk', icon: Plane },
      { name: 'Akreditasi', href: '#akreditasi', icon: CheckCircle },
      { name: 'IATA', href: '#iata', icon: FileText }
    ],
    business: [
      { name: 'Pajak', href: '#pajak', icon: Briefcase },
      { name: 'Bank Garansi', href: '#bank-garansi', icon: Briefcase },
      { name: 'Laporan Keuangan', href: '#laporan-keuangan', icon: FileText },
      { name: 'Administrasi Kontraktor', href: '#kontraktor', icon: Briefcase }
    ],
    company: [
      { name: 'Tentang Kami', href: '#about' },
      { name: 'Portfolio', href: '#portfolio' },
      { name: 'Karir', href: '#careers' },
      { name: 'Blog', href: '#blog' }
    ],
    legal: NAVIGATION.legal
  }

  const socialLinks = [
    { name: 'WhatsApp', href: CONTACT_INFO.whatsapp.link, icon: Phone },
    { name: 'Instagram', href: '#', icon: Instagram },
    { name: 'Facebook', href: '#', icon: Facebook },
    { name: 'LinkedIn', href: '#', icon: Linkedin }
  ]

  return (
    <footer className="bg-gray-900 text-white">
      {/* Main Footer Content */}
      <div className="section-padding">
        <div className="container-custom">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
            {/* Company Info */}
            <div className="lg:col-span-2">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-10 h-10 bg-brand-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-xl">JSB</span>
                </div>
                <div>
                  <div className="font-bold text-lg">{COMPANY_INFO.name}</div>
                  <div className="text-xs text-gray-400">Solusi Terpercaya Sejak 2018</div>
                </div>
              </div>

              <p className="text-gray-300 mb-6 leading-relaxed">
                Pendampingan tenaga ahli berpengalaman untuk izin travel dan layanan administrasi bisnis Anda.
                Lebih dari {COMPANY_INFO.clients} client puas dengan layanan kami.
              </p>

              {/* Contact Info */}
              <div className="space-y-3">
                <a href={CONTACT_INFO.whatsapp.link} className="flex items-center gap-3 text-gray-300 hover:text-white transition-colors">
                  <Phone className="w-4 h-4 text-brand-400" />
                  <span>{CONTACT_INFO.whatsapp.display}</span>
                </a>
                <a href={`mailto:${CONTACT_INFO.email.link}`} className="flex items-center gap-3 text-gray-300 hover:text-white transition-colors">
                  <Mail className="w-4 h-4 text-brand-400" />
                  <span>{CONTACT_INFO.email.display}</span>
                </a>
                <div className="flex items-center gap-3 text-gray-300">
                  <MapPin className="w-4 h-4 text-brand-400" />
                  <span className="text-sm">{CONTACT_INFO.address.display}</span>
                </div>
                <div className="flex items-center gap-3 text-gray-300">
                  <Clock className="w-4 h-4 text-brand-400" />
                  <span className="text-sm">{CONTACT_INFO.hours.display}</span>
                </div>
              </div>

              {/* Social Links */}
              <div className="flex gap-3 mt-6">
                {socialLinks.map((social) => (
                  <Button
                    key={social.name}
                    variant="ghost"
                    size="icon"
                    className="text-gray-400 hover:text-white hover:bg-white/10"
                    asChild
                  >
                    <a href={social.href} target="_blank" rel="noopener noreferrer">
                      <social.icon className="w-5 h-5" />
                    </a>
                  </Button>
                ))}
              </div>
            </div>

            {/* Travel Services */}
            <div>
              <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                <Plane className="w-5 h-5 text-brand-400" />
                Layanan Travel
              </h3>
              <ul className="space-y-2">
                {footerLinks.travel.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-gray-300 hover:text-brand-400 transition-colors flex items-center gap-2"
                    >
                      <ChevronRight className="w-3 h-3" />
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Business Services */}
            <div>
              <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                <Briefcase className="w-5 h-5 text-brand-400" />
                Layanan Bisnis
              </h3>
              <ul className="space-y-2">
                {footerLinks.business.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-gray-300 hover:text-brand-400 transition-colors flex items-center gap-2"
                    >
                      <ChevronRight className="w-3 h-3" />
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Newsletter & Company */}
            <div>
              <h3 className="font-semibold text-lg mb-4">Newsletter</h3>
              <p className="text-gray-300 text-sm mb-4">
                Dapatkan update regulasi dan tips terbaru dari kami
              </p>
              <form onSubmit={handleNewsletter} className="space-y-3">
                <Input
                  type="email"
                  placeholder="Email Anda"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-gray-800 border-gray-700 text-white placeholder-gray-500"
                  required
                />
                <Button type="submit" className="w-full btn-primary">
                  <Send className="w-4 h-4 mr-2" />
                  Subscribe
                </Button>
              </form>

              <div className="mt-6">
                <h4 className="font-medium mb-3">Perusahaan</h4>
                <ul className="space-y-2">
                  {footerLinks.company.map((link) => (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        className="text-gray-300 hover:text-brand-400 transition-colors text-sm"
                      >
                        {link.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800">
        <div className="container-custom py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-gray-400 text-sm">
              � {new Date().getFullYear()} {COMPANY_INFO.name}. All rights reserved.
            </div>
            <div className="flex gap-6">
              {footerLinks.legal.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className="text-gray-400 hover:text-white text-sm transition-colors"
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Trust Badges */}
      <div className="bg-black/50 py-8">
        <div className="container-custom">
          <div className="flex flex-wrap justify-center items-center gap-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              className="flex items-center gap-2 text-gray-400"
            >
              <CheckCircle className="w-5 h-5 text-green-500" />
              <span>Terverifikasi Kemenag</span>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="flex items-center gap-2 text-gray-400"
            >
              <Users className="w-5 h-5 text-blue-500" />
              <span>{COMPANY_INFO.clients} Client Puas</span>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="flex items-center gap-2 text-gray-400"
            >
              <FileText className="w-5 h-5 text-purple-500" />
              <span>{COMPANY_INFO.projects} Project Selesai</span>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex items-center gap-2 text-gray-400"
            >
              <CheckCircle className="w-5 h-5 text-yellow-500" />
              <span>100% Sukses Rate</span>
            </motion.div>
          </div>
        </div>
      </div>
    </footer>
  )
}