import { NextRequest, NextResponse } from 'next/server'
import { geminiService } from '@/lib/gemini'
import fs from 'fs'
import path from 'path'

// Rate limiting (simple implementation)
const rateLimitMap = new Map()
const RATE_LIMIT = 10 // requests per minute
const WINDOW_MS = 60 * 1000 // 1 minute

// Load FAQ data as fallback
let faqData: any = null
try {
  const faqPath = path.join(process.cwd(), 'data', 'faq.json')
  const faqFile = fs.readFileSync(faqPath, 'utf8')
  faqData = JSON.parse(faqFile)
} catch (error) {
  console.error('Failed to load FAQ data:', error)
}

// Simple intent classifier as fallback
function classifyIntent(message: string): { intent: string; confidence: number } {
  const lowerMessage = message.toLowerCase()

  if (!faqData) {
    return { intent: 'unknown', confidence: 0 }
  }

  // Check each intent's keywords
  for (const [intentName, intentData] of Object.entries(faqData.intents)) {
    const intent = intentData as any
    const keywordMatches = intent.keywords.filter((keyword: string) =>
      lowerMessage.includes(keyword.toLowerCase())
    )

    if (keywordMatches.length > 0) {
      const confidence = Math.min(keywordMatches.length / intent.keywords.length, 1)
      return { intent: intentName, confidence }
    }
  }

  return { intent: 'unknown', confidence: 0 }
}

// Generate response based on intent (fallback)
function generateFallbackResponse(intent: string, confidence: number): any {
  if (!faqData) {
    return faqData.fallback_response
  }

  // High confidence intent match
  if (confidence > 0.5 && faqData.intents[intent]) {
    return faqData.intents[intent]
  }

  // Low confidence or unknown intent
  return faqData.fallback_response
}

// Rate limiting check
function checkRateLimit(ip: string): boolean {
  const now = Date.now()
  const windowStart = now - WINDOW_MS

  // Clean old entries
  const entries = Array.from(rateLimitMap.entries())
  for (const [key, value] of entries) {
    if (value.timestamp < windowStart) {
      rateLimitMap.delete(key)
    }
  }

  // Check current IP
  const requests = rateLimitMap.get(ip) || { count: 0, timestamp: now }

  if (requests.count >= RATE_LIMIT) {
    return false
  }

  // Update counter
  rateLimitMap.set(ip, {
    count: requests.count + 1,
    timestamp: now
  })

  return true
}

export async function POST(req: NextRequest) {
  try {
    // Rate limiting
    const ip = req.headers.get('x-forwarded-for') ||
               req.headers.get('x-real-ip') ||
               'unknown'
    if (!checkRateLimit(ip)) {
      return NextResponse.json(
        { error: 'Too many requests. Please try again later.' },
        { status: 429 }
      )
    }

    const body = await req.json()
    const { messages, session_id, user_action, admin_takeover } = body

    // Get the last user message
    const userMessage = messages?.filter((m: any) => m.role === 'user').pop()?.content || ''

    if (!userMessage) {
      return NextResponse.json({ error: 'No message provided' }, { status: 400 })
    }

    // Try Gemini AI first, fallback to keyword matching if it fails
    let responseData
    try {
      const chatHistory = messages || []
      responseData = await geminiService.generateResponse(userMessage, chatHistory)
      console.log('✅ Gemini AI response successful')
    } catch (geminiError) {
      console.error('❌ Gemini AI failed, using fallback:', geminiError)

      // Fallback to keyword matching
      const { intent, confidence } = classifyIntent(userMessage)
      const fallbackData = generateFallbackResponse(intent, confidence)

      responseData = {
        answer: fallbackData.answer,
        benefits: fallbackData.benefits || [],
        cta_primary: fallbackData.cta_primary,
        cta_secondary: fallbackData.cta_secondary,
        confidence: confidence,
        intent: intent
      }

      console.log(`🔄 Using fallback response - Intent: ${intent}, Confidence: ${confidence}`)
    }

    // Add WhatsApp links for CTAs
    const whatsappNumber = process.env.WA_BUSINESS_NUMBER || '628123456789'
    let ctaLinks = {}

    if (responseData.cta_primary) {
      ctaLinks = {
        ...ctaLinks,
        primary: {
          text: responseData.cta_primary,
          link: `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
            `Halo, saya tertarik dengan informasi tentang ${responseData.intent || 'layanan'}`
          )}`
        }
      }
    }

    if (responseData.cta_secondary) {
      ctaLinks = {
        ...ctaLinks,
        secondary: {
          text: responseData.cta_secondary,
          link: responseData.cta_secondary.includes('#')
            ? responseData.cta_secondary
            : '#services'
        }
      }
    }

    // Log interaction
    console.log(`Chat interaction: ${responseData.intent} - ${userMessage.substring(0, 50)}...`)

    // Handle admin intervention logic
    let adminInfo = null
    let whatsappTimeout = null

    if (user_action === 'request_admin') {
      // User requested admin intervention
      adminInfo = {
        status: 'admin-requested',
        requestTime: new Date().toISOString(),
        timeoutMinutes: 15
      }

      whatsappTimeout = {
        enabled: true,
        timeoutMinutes: 15,
        fallbackMessage: 'Admin sedang offline. Silakan hubungi kami via WhatsApp untuk bantuan segera.'
      }

      console.log(`👨‍💼 Admin requested for session ${session_id}`)
    } else if (admin_takeover) {
      // Admin took over the chat
      adminInfo = {
        status: 'admin-active',
        takeoverTime: new Date().toISOString()
      }

      console.log(`✅ Admin took over session ${session_id}`)
    }

    return NextResponse.json({
      answer: responseData.answer,
      benefits: responseData.benefits,
      cta: ctaLinks,
      confidence: responseData.confidence,
      intent: responseData.intent,
      admin_intervention: adminInfo,
      whatsapp_timeout: whatsappTimeout
    })

  } catch (error) {
    console.error('Chat API error:', error)
    return NextResponse.json(
      {
        error: 'Internal server error',
        answer: 'Maaf, terjadi gangguan pada sistem. Silakan hubungi kami langsung via WhatsApp untuk bantuan segera.',
        benefits: ['Respon cepat', 'Layanan 24/7', 'Konsultasi gratis'],
        cta: {
          primary: {
            text: 'Hubungi WhatsApp',
            link: `https://wa.me/${process.env.WA_BUSINESS_NUMBER || '628123456789'}`
          }
        },
        confidence: 0,
        intent: 'error'
      },
      { status: 500 }
    )
  }
}

// Health check endpoint
export async function GET() {
  return NextResponse.json({
    status: 'healthy',
    gemini_enabled: !!process.env.GEMINI_API_KEY,
    fallback_enabled: !!faqData,
    api_version: '2.0.0',
    intents_count: faqData ? Object.keys(faqData.intents).length : 0
  })
}