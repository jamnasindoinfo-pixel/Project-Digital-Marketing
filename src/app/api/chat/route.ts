import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

// Rate limiting (simple implementation)
const rateLimitMap = new Map()
const RATE_LIMIT = 10 // requests per minute
const WINDOW_MS = 60 * 1000 // 1 minute

// Load FAQ data
let faqData: any = null
try {
  const faqPath = path.join(process.cwd(), 'data', 'faq.json')
  const faqFile = fs.readFileSync(faqPath, 'utf8')
  faqData = JSON.parse(faqFile)
} catch (error) {
  console.error('Failed to load FAQ data:', error)
}

// Simple intent classifier
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

// Generate response based on intent
function generateResponse(intent: string, confidence: number): any {
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
  for (const [key, value] of rateLimitMap.entries()) {
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
    const ip = req.ip || req.headers.get('x-forwarded-for') || 'unknown'
    if (!checkRateLimit(ip)) {
      return NextResponse.json(
        { error: 'Too many requests. Please try again later.' },
        { status: 429 }
      )
    }

    const body = await req.json()
    const { messages, session_id } = body

    // Get the last user message
    const userMessage = messages?.filter((m: any) => m.role === 'user').pop()?.content || ''

    if (!userMessage) {
      return NextResponse.json({ error: 'No message provided' }, { status: 400 })
    }

    // Classify intent
    const { intent, confidence } = classifyIntent(userMessage)
    console.log(`Intent detected: ${intent} with confidence: ${confidence}`)

    // Get response
    const responseData = generateResponse(intent, confidence)

    // Add CTA links
    const whatsappNumber = process.env.WA_BUSINESS_NUMBER || '628123456789'
    if (responseData.cta_primary) {
      responseData.cta.primary = {
        text: responseData.cta_primary,
        link: `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
          `Halo, saya tertarik dengan informasi tentang ${intent.replace('_', ' ')}`
        )}`
      }
    }

    if (responseData.cta_secondary) {
      responseData.cta.secondary = {
        text: responseData.cta_secondary,
        link: responseData.cta_secondary.includes('#')
          ? responseData.cta_secondary
          : '#services'
      }
    }

    // Log interaction (for analytics)
    console.log(`Chat interaction: ${intent} - ${userMessage.substring(0, 50)}...`)

    return NextResponse.json({
      answer: responseData.answer,
      benefits: responseData.benefits || [],
      cta: {
        primary: responseData.cta_primary || null,
        secondary: responseData.cta_secondary || null
      },
      confidence: confidence,
      intent: intent
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
    faq_loaded: !!faqData,
    intents_count: faqData ? Object.keys(faqData.intents).length : 0
  })
}