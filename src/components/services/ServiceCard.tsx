'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Clock, Users, CheckCircle, ArrowRight, Phone } from 'lucide-react'
import { createWhatsAppLink } from '@/lib/utils'
import Link from 'next/link'

interface ServiceCardProps {
  service: {
    id: string
    name: string
    fullName: string
    description: string
    duration: string
    benefits: string[]
    features: string[]
  }
  category: 'travel' | 'business'
  categoryName: string
}

export default function ServiceCard({ service, category, categoryName }: ServiceCardProps) {
  const categoryColors = {
    travel: {
      bg: 'bg-brand-50',
      border: 'border-brand-200',
      hover: 'hover:border-brand-400 hover:shadow-lg',
      badge: 'bg-brand-100 text-brand-700',
      icon: 'text-brand-600'
    },
    business: {
      bg: 'bg-green-50',
      border: 'border-green-200',
      hover: 'hover:border-green-400 hover:shadow-lg',
      badge: 'bg-green-100 text-green-700',
      icon: 'text-green-600'
    }
  }

  const colors = categoryColors[category]
  const whatsappMessage = createWhatsAppLink(
    `Halo PT Jaminan Solusi Bisnis, saya tertarik dengan layanan ${service.fullName}. Mohon info lebih lanjut.`
  )

  return (
    <Card className={`card-hover ${colors.bg} ${colors.border} ${colors.hover} transition-all duration-300 h-full flex flex-col`}>
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between mb-3">
          <Badge className={`${colors.badge} text-xs px-3 py-1`}>
            {categoryName}
          </Badge>
          <div className={`w-8 h-8 rounded-lg bg-white flex items-center justify-center ${colors.icon} ${colors.border} border`}>
            {category === 'travel' ? (
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M6 6V5a3 3 0 013-3h2a3 3 0 013 3v1h2a2 2 0 012 2v3.57A22.952 22.952 0 0110 13a22.95 22.95 0 01-8-1.43V8a2 2 0 012-2h2zm2-1a1 1 0 011-1h2a1 1 0 011 1v1H8V5zm1 5a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1z" clipRule="evenodd" />
                <path d="M2 13.692V16a2 2 0 002 2h12a2 2 0 002-2v-2.308A24.974 24.974 0 0110 15c-2.796 0-5.487-.46-8-1.308z" />
              </svg>
            )}
          </div>
        </div>
        <CardTitle className="text-lg mb-2">{service.name}</CardTitle>
        <p className="text-sm text-gray-600 font-medium mb-3">{service.fullName}</p>
        <p className="text-sm text-gray-700 line-clamp-3">{service.description}</p>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col">
        {/* Key Benefits Preview */}
        <div className="mb-4 flex-1">
          <h4 className="font-semibold text-sm mb-3 text-gray-900">Keunggulan Utama:</h4>
          <div className="space-y-2">
            {service.benefits.slice(0, 3).map((benefit, idx) => (
              <div key={idx} className="flex items-start gap-2">
                <CheckCircle className="w-3 h-3 text-green-500 mt-0.5 flex-shrink-0" />
                <span className="text-xs text-gray-700 line-clamp-2">{benefit}</span>
              </div>
            ))}
            {service.benefits.length > 3 && (
              <div className="text-xs text-gray-500 italic">
                +{service.benefits.length - 3} keunggulan lainnya
              </div>
            )}
          </div>
        </div>

        {/* Duration and Client Info */}
        <div className="flex items-center justify-between mb-4 text-xs text-gray-600">
          <div className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            <span>{service.duration}</span>
          </div>
          <div className="flex items-center gap-1">
            <Users className="w-3 h-3" />
            <span>500+ Client</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-2">
          <Link href={`/services/${service.id}`}>
            <Button className="w-full" variant="outline" size="sm">
              Lihat Detail
              <ArrowRight className="w-3 h-3 ml-2" />
            </Button>
          </Link>
          <Button
            className="w-full btn-primary"
            size="sm"
            asChild
          >
            <a
              href={whatsappMessage}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Phone className="w-3 h-3 mr-2" />
              Konsultasi
            </a>
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}