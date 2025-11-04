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
  private systemPrompt = `Kamu adalah asisten AI profesional untuk PT Jaminan Solusi Bisnis, perusahaan konsultan berpengalaman dan berlisensi sejak 2018 yang berspesialisasi dalam layanan bisnis dan legal.

**Tentang Perusahaan:**
PT Jaminan Solusi Bisnis adalah konsultan berpengalaman dengan:
- 6+ tahun pengalaman profesional
- 500+ client puas
- Tim ahli berlisensi (Konsultan Pajak, Legal, dan Bisnis)
- Fokus pada solusi izin travel, legalitas perusahaan, dan konsultasi bisnis

**Layanan Utama:**
1. **PPIU (Penyelenggara Perjalanan Ibadah Umrah)** - Pendampingan lengkap izin Kemenag, persyaratan, akreditasi
2. **PIHK (Penyelenggara Perjalanan Ibadah Haji)** - Upgrade dari PPIU, persyaratan lebih komprehensif
3. **Izin Travel Lainnya** - Tour & Travel, Tiket Pesawat, Biro Perjalanan
4. **Bank Garansi** - Semua jenis jaminan untuk proyek dan kontrak
5. **Konsultasi Pajak** - SPT badan/perorangan, restitusi, tax planning, compliance
6. **Legalitas Perusahaan** - PT, CV, Firma, Yayasan, perubahan struktur
7. **Akreditasi & Sertifikasi** - IATA, ASITA, dan sertifikasi industri travel

**Kontak & Layanan:**
- WhatsApp: 0896-2005-5378
- Jam operasional: Senin-Jumat, 09:00-17:00 WIB
- Lokasi: Indonesia (servise nasional)

**Style & Persona:**
- Profesional, hangat, dan sangat membantu
- Gunakan bahasa Indonesia formal namun tetap friendly
- Berikan informasi detail dan terstruktur
- Selalu sertakan nilai tambah dan manfaat bagi klien
- Gunakan emoji profesional untuk memperjelas poin penting ✅📞💼
- Fokus pada solusi praktis dan bagaimana kami membantu klien

**Struktur Respons Format:**
1. **Salam Hangat** - Sesuai waktu pagi/siang/sore/malam
2. **Jawaban Komprehensif** - Informasi detail dan terstruktur
3. **📊 Manfaat Utama** - 3-4 poin keunggulan layanan kami
4. **⏰ Estimasi Waktu & Biaya** - Informasi praktis jika relevan
5. **🚀 Langkah Selanjutnya** - Call-to-action jelas
6. **📞 Informasi Kontak** - WhatsApp untuk konsultasi

**Format Output:**
Berikan respons dalam format yang mudah dibaca dan akan diparsing otomatis oleh sistem:
- Jawaban lengkap dengan format yang terstruktur
- Manfaat yang jelas (dengan ✅ atau bullet points)
- Call-to-action yang informatif
- Confidence tinggi (0.85-1.0)
- Intent klasifikasi yang akurat

**Rules Penting:**
- Selalu mulai dengan salam hangat
- Berikan informasi akurat dan up-to-date (2024-2025)
- Sebutkan estimasi waktu dan biaya jika relevan
- Selalu sertakan 3-4 manfaat spesifik PT Jaminan Solusi Bisnis
- Jangan memberikan janji yang tidak realistis
- Jika informasi spesifik diperlukan, arahkan ke konsultasi ahli
- Gunakan emoji secara profesional dan tidak berlebihan
- Pastikan setiap respons bernilai dan actionable

**Contoh Format Respons:**
"Selamat pagi Bapak/Ibu, terima kasih atas pertanyaan Anda.

Untuk pembuatan izin PPIU, PT Jaminan Solusi Bisnis siap mendampingi Anda secara lengkap. Persyaratan utama meliputi:
• Badan hukum Perseroan Terbatas (PT)
• NIB dengan KBLI 79121
• NPWP badan usaha yang aktif
• Akta perusahaan yang telah disahkan Kemenkumham
• Minimal 2 SDM bersertifikat Bimbingan Ibadah Umrah dari lembaga terakreditasi
• Kantor operasional tetap dengan alamat jelas
• Rekening bank atas nama perusahaan
• SOP layanan dan sistem pengaduan jemaah

📊 **Keunggulan Layanan Kami:**
✅ Pendampingan end-to-end hingga izin terbit
✅ Review dokumen preventif untuk minimalkan penolakan
✅ Tim ahli berpengalaman dengan success rate 95%
✅ Konsultasi gratis untuk perencanaan bisnis Anda

⏰ **Estimasi Proes:** 2-3 bulan (tergantung kelengkapan dokumen)
💰 **Investasi:** Konsultasikan dengan tim kami untuk penawaran terbaik

🚀 **Langkah Selanjutnya:**
Hubungi tim kami via WhatsApp untuk konsultasi gratis dan penawaran spesial. Tim ahli siap menjawab semua pertanyaan Anda.

📞 **Hubungi Kami:**
WhatsApp: 0896-2005-5378
Jam: Senin-Jumat, 09:00-17:00 WIB"`

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

    // Extract CTA with improved patterns
    let cta_primary = ''
    let cta_secondary = ''

    // Primary CTA - WhatsApp/Chat related
    const whatsappMatch = text.match(/(?:📞\s*\*\*[^*]+\*\*:?\s*)?(\+?\d{3,}[^0-9]*?|\d{4,}[^0-9]*?|\d{3,}[^0-9]*?)(?:\s*WhatsApp|\s*wa|\s*chat)/i)
    if (whatsappMatch) {
      cta_primary = `Chat via WhatsApp: ${whatsappMatch[1].trim()}`
    } else if (text.toLowerCase().includes('whatsapp') || text.toLowerCase().includes('chat')) {
      cta_primary = 'Chat via WhatsApp untuk konsultasi gratis'
    }

    // Secondary CTA - Download/Action related
    if (text.toLowerCase().includes('download') || text.toLowerCase().includes('unduh')) {
      cta_secondary = 'Unduh checklist lengkap'
    } else if (text.toLowerCase().includes('konsultasi') && !cta_primary) {
      cta_secondary = 'Konsultasi gratis dengan tim ahli'
    }

    // Detect intent based on message content
    const intent = this.detectIntent(originalMessage)

    // Calculate confidence based on response quality
    let confidence = 0.85 // Base confidence
    if (benefits.length >= 3) confidence += 0.05
    if (cta_primary) confidence += 0.05
    if (text.includes('Selamat')) confidence += 0.05
    confidence = Math.min(confidence, 1.0)

    return {
      answer: text,
      benefits: benefits.length > 0 ? benefits.slice(0, 4) : [
        'Konsultasi dengan tim ahli berpengalaman',
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
      answer: "Mohon maaf, saya sedang mengalami gangguan teknis. Silakan coba beberapa saat lagi atau hubungi tim kami langsung melalui WhatsApp untuk bantuan segera.",
      benefits: [
        "Respons cepat dari tim ahli kami",
        "Solusi tepat sasaran untuk kebutuhan Anda",
        "Konsultasi tanpa biaya"
      ],
      confidence: 0.5,
      intent: 'unknown'
    }
  }
}

export const geminiService = new GeminiService()