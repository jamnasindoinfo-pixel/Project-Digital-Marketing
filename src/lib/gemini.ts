import { GoogleGenerativeAI } from '@google/generative-ai'

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)

// Initialize the model with configuration from environment
const modelName = process.env.GEMINI_MODEL || 'gemini-1.5-flash'
const model = genAI.getGenerativeModel({ model: modelName })

export interface ChatResponse {
  answer: string
  benefits: string[]
  cta_primary?: string
  cta_secondary?: string
  confidence: number
  intent?: string
}

export class GeminiService {
  private systemPrompt = `Kamu adalah asisten AI profesional untuk PT Jaminan Nasional Indonesia.

**Layanan Utama:**
1. **PPIU** - Penyelenggara Perjalanan Ibadah Umrah
2. **PIHK** - Penyelenggara Perjalanan Ibadah Haji
3. **Izin Travel** - Perizinan PPIU, PIHK, biro perjalanan wisata
4. **Bank Garansi** - Semua jenis jaminan
5. **Surety Bond** - Semua Jenis Jaminan
6. **Konsultasi Pajak** - SPT, restitusi, tax planning
7. **Legalitas Perusahaan** - PT, CV, Firma, Yayasan, NIB, NPWP
8. **Akreditasi** - PPIU PIHK, IATA

**Style & Persona:**
- Profesional, hangat, dan membantu
- Gunakan bahasa Indonesia formal namun friendly
- Berikan informasi detail dan terstruktur
- Sertakan manfaat bagi klien

**Struktur Respons:**
1. **Salam** - Sesuai waktu
2. **Jawaban** - Informasi detail dan terstruktur
3. **Manfaat** - 3-4 poin keunggulan layanan
4. **Langkah Selanjutnya** - Call-to-action jelas

**Opsi Kontak:**
- Telepon: [Nomor telepon perusahaan]
- WhatsApp: [Nomor WhatsApp perusahaan]
- Email: [Email perusahaan]
- Website: [Website perusahaan]
- Alamat kantor: [Alamat lengkap]

**Rules:**
- Selalu mulai dengan salam hangat
- Berikan informasi akurat
- Sertakan manfaat spesifik
- Arahkan ke konsultasi ahli jika perlu
- Gunakan emoji profesional
- Pastikan respons bernilai dan actionable

**Contoh Respons:**
"Selamat pagi, terima kasih atas pertanyaan Anda.

Untuk pembuatan izin PPIU, kami siap mendampingi Anda. Persyaratan utama:
• Legalitas perusahaan
• NIB dengan KBLI 79122
• NPWP
• Akta perusahaan
• 2 SDM sertifikat Bimbingan Ibadah Umrah
• Kantor operasional
• Rekening bank
• SOP layanan

✅ **Keunggulan Layanan Kami:**
✅ Pendampingan lengkap hingga izin terbit
✅ Review dokumen preventif
✅ Tim ahli berpengalaman
✅ Proses cepat dan terpercaya

Semoga informasi ini bermanfaat bagi Anda.""`

  async generateResponse(message: string, chatHistory?: Array<{role: string, content: string}>): Promise<ChatResponse> {
    try {
      // Construct prompt with system instructions
      const fullPrompt = `${this.systemPrompt}\n\nUser: ${message}`

      const result = await model.generateContent(fullPrompt)
      const response = result.response
      const text = response.text()

      // Parse response to extract structured data
      return this.parseResponse(text, message)

    } catch (error) {
      console.error('Gemini API Error:', error)
      return this.getFallbackResponse()
    }
  }

  private parseResponse(text: string, originalMessage: string): ChatResponse {
    // Extract benefits with improved parsing
    const benefits: string[] = []
    const lines = text.split('\n')

    // Look for different benefit patterns
    const benefitPatterns = [
      /✅\s*(.+)/,
      /✔\s*(.+)/,
      /📊\s*\*\*[^*]+\*\*\s*(.+)/,
      /\*\*Keunggulan[^*]+\*\*:?\s*([\s\S]*?)(?=\n\n|\n\*\*|\n⏰|\n🚀|\n📞|$)/,
      /\•\s*(.+)/,
      /^\-\s*(.+)$/m,
      /^\d+\.\s*(.+)$/m
    ]

    for (const line of lines) {
      for (const pattern of benefitPatterns) {
        const match = line.match(pattern)
        if (match && match[1]) {
          const benefit = match[1].trim()
            .replace(/^\*\*|\*\*$/g, '') // Remove bold markers
            .replace(/^•|^-|^\d+\./g, '') // Remove list markers
            .trim()

          if (benefit && benefit.length > 3 && !benefits.includes(benefit)) {
            benefits.push(benefit)
          }
        }
      }
    }

    // Extract CTA with improved patterns - Disabled for WhatsApp/konsultasi
    let cta_primary = ''
    let cta_secondary = ''

    // Only non-WhatsApp/konsultasi CTAs
    if (text.toLowerCase().includes('telepon') || text.toLowerCase().includes('call')) {
      cta_primary = 'Hubungi via Telepon'
    } else if (text.toLowerCase().includes('email') || text.toLowerCase().includes('surat')) {
      cta_primary = 'Kirim Email'
    } else if (text.toLowerCase().includes('kunjungi') || text.toLowerCase().includes('alamat')) {
      cta_primary = 'Kunjungi Kantor Kami'
    }

    // Secondary CTA - Download/Action related (excluding konsultasi)
    if (text.toLowerCase().includes('download') || text.toLowerCase().includes('unduh')) {
      cta_secondary = 'Unduh checklist lengkap'
    } else if (text.toLowerCase().includes('website')) {
      cta_secondary = 'Kunjungi website kami'
    } else if (!cta_secondary && !cta_primary) {
      cta_secondary = 'Pelajari lebih lanjut'
    }

    // Detect intent based on message content
    const intent = this.detectIntent(originalMessage)

    // Calculate confidence based on response quality
    let confidence = 0.85 // Base confidence
    if (benefits.length >= 3) confidence += 0.05
    if (cta_secondary) confidence += 0.05
    if (text.includes('Selamat')) confidence += 0.05
    confidence = Math.min(confidence, 1.0)

    return {
      answer: text,
      benefits: benefits.length > 0 ? benefits.slice(0, 4) : [
        'Tim ahli berpengalaman siap membantu',
        'Solusi tepat sasaran untuk kebutuhan bisnis Anda',
        'Pendampingan lengkap hingga selesai'
      ],
      cta_primary,
      cta_secondary,
      confidence,
      intent
    }
  }

  private detectIntent(message: string): string {
    const lowerMessage = message.toLowerCase()

    // PPIU related intents
    if (lowerMessage.includes('ppiu') || lowerMessage.includes('umrah') || lowerMessage.includes('penyelenggara perjalanan ibadah umrah')) {
      if (lowerMessage.includes('syarat') || lowerMessage.includes('persyaratan') || lowerMessage.includes('dokumen')) {
        return 'PPIU_SYARAT'
      } else if (lowerMessage.includes('lama') || lowerMessage.includes('proses') || lowerMessage.includes('waktu')) {
        return 'PPIU_LAMA'
      } else if (lowerMessage.includes('biaya') || lowerMessage.includes('harga') || lowerMessage.includes('berapa')) {
        return 'PPIU_BIAYA'
      } else {
        return 'PPIU_GENERAL'
      }
    }

    // PIHK related intents
    if (lowerMessage.includes('pihk') || lowerMessage.includes('haji') || lowerMessage.includes('penyelenggara perjalanan ibadah haji')) {
      if (lowerMessage.includes('syarat') || lowerMessage.includes('persyaratan') || lowerMessage.includes('dokumen')) {
        return 'PIHK_SYARAT'
      } else if (lowerMessage.includes('lama') || lowerMessage.includes('proses') || lowerMessage.includes('waktu')) {
        return 'PIHK_LAMA'
      } else if (lowerMessage.includes('biaya') || lowerMessage.includes('harga') || lowerMessage.includes('berapa')) {
        return 'PIHK_BIAYA'
      } else {
        return 'PIHK_GENERAL'
      }
    }

    // Bank Garansi intents
    if (lowerMessage.includes('bank') || lowerMessage.includes('garansi') || lowerMessage.includes('jaminan')) {
      if (lowerMessage.includes('jenis') || lowerMessage.includes('macam') || lowerMessage.includes('tipe')) {
        return 'BANK_GARANSI_JENIS'
      } else if (lowerMessage.includes('syarat') || lowerMessage.includes('persyaratan')) {
        return 'BANK_GARANSI_SYARAT'
      } else if (lowerMessage.includes('biaya') || lowerMessage.includes('harga') || lowerMessage.includes('fee')) {
        return 'BANK_GARANSI_BIAYA'
      } else {
        return 'BANK_GARANSI_GENERAL'
      }
    }

    // Pajak intents
    if (lowerMessage.includes('pajak') || lowerMessage.includes('spt') || lowerMessage.includes('pajak') || lowerMessage.includes('pajak penghasilan')) {
      if (lowerMessage.includes('konsultasi') || lowerMessage.includes('konsultan')) {
        return 'PAJAK_KONSULTASI'
      } else if (lowerMessage.includes('spt') || lowerMessage.includes('laporan') || lowerMessage.includes('tahunan')) {
        return 'PAJAK_SPT'
      } else if (lowerMessage.includes('restitusi') || lowerMessage.includes('kembali')) {
        return 'PAJAK_RESTITUSI'
      } else if (lowerMessage.includes('planning') || lowerMessage.includes('perencanaan')) {
        return 'PAJAK_PLANNING'
      } else {
        return 'PAJAK_GENERAL'
      }
    }

    // Travel & Tourism intents
    if (lowerMessage.includes('travel') || lowerMessage.includes('wisata') || lowerMessage.includes('tour')) {
      if (lowerMessage.includes('izin') || lowerMessage.includes('legalitas')) {
        return 'TRAVEL_IZIN'
      } else if (lowerMessage.includes('iata') || lowerMessage.includes('asita')) {
        return 'TRAVEL_SERTIFIKASI'
      } else {
        return 'TRAVEL_GENERAL'
      }
    }

    // Legalitas Perusahaan intents
    if (lowerMessage.includes('pt') || lowerMessage.includes('cv') || lowerMessage.includes('firma') || lowerMessage.includes('perusahaan')) {
      if (lowerMessage.includes('pendirian') || lowerMessage.includes('buat')) {
        return 'LEGAL_PENDIRIAN'
      } else if (lowerMessage.includes('perubahan') || lowerMessage.includes('ubah')) {
        return 'LEGAL_PERUBAHAN'
      } else {
        return 'LEGAL_GENERAL'
      }
    }

    // General intents
    if (lowerMessage.includes('biaya') || lowerMessage.includes('harga') || lowerMessage.includes('berapa') || lowerMessage.includes('tarif')) {
      return 'HARGA_BIAYA'
    }

    if (lowerMessage.includes('kontak') || lowerMessage.includes('hubungi') || lowerMessage.includes('alamat') || lowerMessage.includes('telepon')) {
      return 'KONTAK_INFO'
    }

    // Contact method specific intents
    if (lowerMessage.includes('whatsapp') || lowerMessage.includes('wa')) {
      return 'KONTAK_WHATSAPP'
    }
    if (lowerMessage.includes('telepon') || lowerMessage.includes('call') || lowerMessage.includes('telpon')) {
      return 'KONTAK_TELEPON'
    }
    if (lowerMessage.includes('email') || lowerMessage.includes('surat') || lowerMessage.includes('mail')) {
      return 'KONTAK_EMAIL'
    }
    if (lowerMessage.includes('kunjungi') || lowerMessage.includes('datang') || lowerMessage.includes('office') || lowerMessage.includes('kantor')) {
      return 'KONTAK_KANTOR'
    }
    if (lowerMessage.includes('website') || lowerMessage.includes('web') || lowerMessage.includes('online')) {
      return 'KONTAK_WEBSITE'
    }

    if (lowerMessage.includes('testimoni') || lowerMessage.includes('review') || lowerMessage.includes('klien') || lowerMessage.includes('portfolio')) {
      return 'TESTIMONI'
    }

    if (lowerMessage.includes('halo') || lowerMessage.includes('hi') || lowerMessage.includes('pagi') || lowerMessage.includes('siang') || lowerMessage.includes('sore') || lowerMessage.includes('malam')) {
      return 'GREETING'
    }

    return 'unknown'
  }

  private getFallbackResponse(): ChatResponse {
    // Return a default response when Gemini fails
    return {
      answer: "Mohon maaf, saya sedang mengalami gangguan teknis. Silakan coba beberapa saat lagi. Tim kami siap membantu Anda dengan informasi lengkap mengenai layanan yang tersedia.",
      benefits: [
        "Respons cepat dari tim ahli kami",
        "Solusi tepat sasaran untuk kebutuhan Anda",
        "Informasi lengkap tersedia",
        "Layanan terpercaya dan berpengalaman"
      ],
      cta_primary: '',
      cta_secondary: '',
      confidence: 0.5,
      intent: 'unknown'
    }
  }
}

export const geminiService = new GeminiService()