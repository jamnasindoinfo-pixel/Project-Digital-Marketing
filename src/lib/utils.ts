import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatPhoneNumber(phone: string) {
  const cleaned = phone.replace(/\D/g, '')
  const match = cleaned.match(/^(\d{3})(\d{4})(\d{4})$/)
  if (match) {
    return `${match[1]}-${match[2]}-${match[3]}`
  }
  return phone
}

export function generateWhatsAppMessage(service: string, name: string) {
  const messages = {
    ppiu: `Halo PT Jaminan Solusi Bisnis, saya ${name} tertarik untuk konsultasi mengenai pengurusan izin PPIU. Mohon info lebih lanjut.`,
    pihk: `Halo PT Jaminan Solusi Bisnis, saya ${name} tertarik untuk konsultasi mengenai pengurusan izin PIHK. Mohon info lebih lanjut.`,
    akreditasi: `Halo PT Jaminan Solusi Bisnis, saya ${name} tertarik untuk konsultasi mengenai akreditasi travel. Mohon info lebih lanjut.`,
    iata: `Halo PT Jaminan Solusi Bisnis, saya ${name} tertarik untuk konsultasi mengenai keanggotaan IATA. Mohon info lebih lanjut.`,
    pajak: `Halo PT Jaminan Solusi Bisnis, saya ${name} tertarik untuk konsultasi mengenai layanan pajak. Mohon info lebih lanjut.`,
    bankGaransi: `Halo PT Jaminan Solusi Bisnis, saya ${name} tertarik untuk konsultasi mengenai bank garansi. Mohon info lebih lanjut.`,
    laporanKeuangan: `Halo PT Jaminan Solusi Bisnis, saya ${name} tertarik untuk konsultasi mengenai laporan keuangan. Mohon info lebih lanjut.`,
    kontraktor: `Halo PT Jaminan Solusi Bisnis, saya ${name} tertarik untuk konsultasi mengenai administrasi kontraktor. Mohon info lebih lanjut.`,
    general: `Halo PT Jaminan Solusi Bisnis, saya ${name} tertarik untuk konsultasi mengenai layanan yang Anda tawarkan. Mohon info lebih lanjut.`
  }

  return messages[service as keyof typeof messages] || messages.general
}

export function createWhatsAppLink(message: string) {
  const phoneNumber = process.env.WA_BUSINESS_NUMBER || '628123456789'
  const encodedMessage = encodeURIComponent(message)
  return `https://wa.me/${phoneNumber}?text=${encodedMessage}`
}

export function debounce<T extends (...args: any[]) => void>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null
  return (...args: Parameters<T>) => {
    if (timeout) clearTimeout(timeout)
    timeout = setTimeout(() => func(...args), wait)
  }
}

export function animateCounter(
  element: HTMLElement,
  target: number,
  duration: number = 2000
) {
  const start = 0
  const increment = target / (duration / 16)
  let current = start

  const timer = setInterval(() => {
    current += increment
    if (current >= target) {
      current = target
      clearInterval(timer)
    }
    element.textContent = Math.floor(current).toLocaleString('id-ID')
  }, 16)
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(amount)
}

export function formatDate(date: Date | string): string {
  const d = new Date(date)
  return d.toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

export function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '')
}