'use client'

import { useState, useEffect, useRef, useMemo, useCallback } from 'react'
import { memo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  MessageCircle,
  X,
  Send,
  Bot,
  User,
  Phone,
  Download,
  ChevronDown,
  Clock,
  CheckCircle,
  AlertTriangle,
  Headphones,
  ArrowRight
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface Message {
  id: string
  role: 'user' | 'assistant' | 'admin' | 'system'
  content: string
  timestamp: Date
  benefits?: string[]
  cta?: {
    primary?: { text: string; link: string }
    secondary?: { text: string; link: string }
  }
  adminInfo?: {
    status: string
    requestTime?: string
    takeoverTime?: string
  }
  whatsappTimeout?: {
    enabled: boolean
    timeoutMinutes: number
    fallbackMessage: string
  }
}

const suggestedPrompts = [
  "Apa syarat PPIU?",
  "Berapa lama proses PIHK?",
  "Konsultasi pajak",
  "Cek kelayakan perusahaan"
]

export function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false)
  const [input, setInput] = useState('')
  const [messages, setMessages] = useState<Message[]>([])
  const [isTyping, setIsTyping] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)
  const [adminRequested, setAdminRequested] = useState(false)
  const [adminActive, setAdminActive] = useState(false)
  const [showWhatsAppOption, setShowWhatsAppOption] = useState(false)
  const [sessionId] = useState(() => `session_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`)
  const [showUserForm, setShowUserForm] = useState(false)
  const [userProfile, setUserProfile] = useState({
    name: '',
    company: '',
    phone: ''
  })
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const adminTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  // Memoize processed messages to avoid expensive operations on every render
  const processedMessages = useMemo(() => {
    return messages.map(msg => ({
      ...msg,
      timestamp: new Date(msg.timestamp)
    }))
  }, [messages])

  useEffect(() => {
    // Load chat history from localStorage using session ID
    const savedMessages = localStorage.getItem(`chatMessages_${sessionId}`)
    const savedProfile = localStorage.getItem(`userProfile_${sessionId}`)

    if (savedMessages) {
      const parsed = JSON.parse(savedMessages)
      setMessages(parsed.map((msg: any) => ({
        ...msg,
        timestamp: new Date(msg.timestamp)
      })))
    }

    // Load user profile
    if (savedProfile) {
      const profile = JSON.parse(savedProfile)
      setUserProfile(profile)
      // If profile is complete, don't show form
      if (profile.name && profile.company) {
        setShowUserForm(false)
      } else {
        setShowUserForm(true)
      }
    } else {
      // No profile found, show form when chat opens
      setShowUserForm(true)
    }
  }, [sessionId])

  useEffect(() => {
    // Save messages to localStorage using session ID
    if (messages.length > 0) {
      localStorage.setItem(`chatMessages_${sessionId}`, JSON.stringify(messages))
    }
  }, [messages, sessionId])

  useEffect(() => {
    // Save user profile to localStorage
    if (userProfile.name || userProfile.company) {
      localStorage.setItem(`userProfile_${sessionId}`, JSON.stringify(userProfile))
    }
  }, [userProfile, sessionId])

  useEffect(() => {
    // Scroll to bottom on new message
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  useEffect(() => {
    // Focus input when chat opens
    if (isOpen && !isMinimized) {
      inputRef.current?.focus()
    }
  }, [isOpen, isMinimized])

  // Listen for localStorage changes (admin intervention)
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === `chatMessages_${sessionId}` && e.newValue) {
        try {
          const updatedMessages = JSON.parse(e.newValue)
          setMessages(updatedMessages.map((msg: any) => ({
            ...msg,
            timestamp: new Date(msg.timestamp)
          })))

          // Check for admin takeover
          const adminTakeoverMessage = updatedMessages.find((msg: any) =>
            msg.adminInfo?.status === 'admin-active'
          )

          if (adminTakeoverMessage) {
            setAdminActive(true)
            setAdminRequested(false)
            clearAdminTimeout()
          }
        } catch (error) {
          console.error('Error parsing updated messages:', error)
        }
      }
    }

    // Listen for storage events
    window.addEventListener('storage', handleStorageChange)

    // Check periodically for same-tab updates with much longer interval
    const interval = setInterval(() => {
      try {
        const currentMessages = localStorage.getItem(`chatMessages_${sessionId}`)
        if (currentMessages) {
          const parsed = JSON.parse(currentMessages)
          // Only update if there are actual changes and we're not in the middle of typing
          if (parsed.length !== messages.length ||
              (parsed.length > 0 && messages.length > 0 &&
               parsed[parsed.length - 1].id !== messages[messages.length - 1].id)) {

            const updatedMessages = parsed.map((msg: any) => ({
              ...msg,
              timestamp: new Date(msg.timestamp)
            }))
            setMessages(updatedMessages)

            // Check for admin takeover
            const adminTakeoverMessage = parsed.find((msg: any) =>
              msg.adminInfo?.status === 'admin-active'
            )

            if (adminTakeoverMessage) {
              setAdminActive(true)
              setAdminRequested(false)
              clearAdminTimeout()
            }
          }
        }
      } catch (error) {
        console.error('Error checking localStorage updates:', error)
      }
    }, 5000) // Reduced frequency from 1 second to 5 seconds

    return () => {
      window.removeEventListener('storage', handleStorageChange)
      clearInterval(interval)
    }
  }, [sessionId, messages])

  const requestAdmin = async () => {
    setAdminRequested(true)

    const adminRequestMessage: Message = {
      id: Date.now().toString(),
      role: 'assistant',
      content: 'Permintaan Anda telah diteruskan ke tim admin. Admin akan segera bergabung dalam chat ini untuk membantu Anda.',
      timestamp: new Date(),
      adminInfo: {
        status: 'admin-requested',
        requestTime: new Date().toISOString()
      }
    }

    setMessages(prev => [...prev, adminRequestMessage])

    // Set timeout untuk 15 menit
    adminTimeoutRef.current = setTimeout(() => {
      setShowWhatsAppOption(true)
      const timeoutMessage: Message = {
        id: (Date.now() + 2).toString(),
        role: 'assistant',
        content: 'Admin sedang offline atau tidak tersedia. Untuk bantuan segera, silakan hubungi kami melalui WhatsApp.',
        timestamp: new Date(),
        whatsappTimeout: {
          enabled: true,
          timeoutMinutes: 15,
          fallbackMessage: 'Admin sedang offline. Silakan hubungi kami via WhatsApp untuk bantuan segera.'
        }
      }
      setMessages(prev => [...prev, timeoutMessage])
    }, 15 * 60 * 1000) // 15 menit

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          messages: messages,
          session_id: 'user_session',
          user_action: 'request_admin'
        })
      })

      const data = await response.json()

      if (data.admin_intervention) {
        // Update status if admin took over immediately
        if (data.admin_intervention.status === 'admin-active') {
          setAdminActive(true)
          setAdminRequested(false)
          if (adminTimeoutRef.current) {
            clearTimeout(adminTimeoutRef.current)
          }
        }
      }
    } catch (error) {
      console.error('Error requesting admin:', error)
    }
  }

  const clearAdminTimeout = useCallback(() => {
    if (adminTimeoutRef.current) {
      clearTimeout(adminTimeoutRef.current)
      adminTimeoutRef.current = null
    }
  }, [])

  const sendMessage = useCallback(async () => {
    if (!input.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInput('')
    setIsTyping(true)

    // Clear admin timeout jika user mengirim pesan baru
    if (adminRequested && !adminActive) {
      clearAdminTimeout()
      setAdminRequested(false)
    }

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          messages: [...messages, userMessage],
          session_id: 'user_session'
        })
      })

      const data = await response.json()

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.answer || 'Maaf, terjadi kesalahan. Silakan coba lagi.',
        timestamp: new Date(),
        benefits: data.benefits,
        cta: data.cta,
        adminInfo: data.admin_intervention,
        whatsappTimeout: data.whatsapp_timeout
      }

      setMessages(prev => [...prev, assistantMessage])
    } catch (error) {
      console.error('Error sending message:', error)
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'Maaf, terjadi gangguan. Silakan hubungi kami langsung via WhatsApp.',
        timestamp: new Date()
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsTyping(false)
    }
  }, [input, messages, adminRequested, adminActive, clearAdminTimeout, sessionId])

  const handlePromptClick = (prompt: string) => {
    setInput(prompt)
    inputRef.current?.focus()
  }

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('id-ID', {
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const clearChat = () => {
    setMessages([])
    localStorage.removeItem('chatMessages')
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    sendMessage()
  }

  // Welcome message
  useEffect(() => {
    if (messages.length === 0 && isOpen) {
      const welcomeMessage: Message = {
        id: 'welcome',
        role: 'assistant',
        content: `Halo! Selamat datang di PT Jaminan Solusi Bisnis.\n\nSaya asisten digital yang siap membantu Anda dengan informasi mengenai:\n" Izin Travel (PPIU, PIHK, Akreditasi, IATA)\n" Layanan Bisnis (Pajak, Bank Garansi, Keuangan)\n\nAda yang bisa saya bantu?`,
        timestamp: new Date()
      }
      setMessages([welcomeMessage])
    }
  }, [isOpen, messages.length])

  const handleUserFormSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Get the current form values
    const formName = userProfile.name.trim()
    const formCompany = userProfile.company.trim()
    const formPhone = userProfile.phone.trim()

    // Basic validation
    if (!formName || !formCompany) {
      return
    }

    // Save the profile
    const savedProfile = {
      name: formName,
      company: formCompany,
      phone: formPhone
    }

    setUserProfile(savedProfile)

    // Hide form and show welcome message
    setShowUserForm(false)

    // Add system message about user info
    const userInfoMessage: Message = {
      id: Date.now().toString(),
      role: 'system',
      content: `Terima kasih ${formName} dari ${formCompany}! Data Anda telah tersimpan untuk layanan yang lebih personal.`,
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userInfoMessage])
  }

  return (
    <>
      {/* Chat Button */}
      {!isOpen && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", duration: 0.5 }}
          className="fixed bottom-20 right-4 z-50 md:bottom-6 md:right-6 sm:bottom-16 sm:right-4"
        >
          <Button
            onClick={() => setIsOpen(true)}
            className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-brand-600 hover:bg-brand-700 shadow-2xl hover:shadow-3xl transition-all duration-300 relative group"
          >
            <MessageCircle className="w-5 h-5 sm:w-6 sm:h-6" />
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full animate-pulse" />

            {/* Tooltip */}
            <div className="absolute bottom-full right-0 mb-2 px-3 py-2 bg-gray-900 text-white text-xs sm:text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
              Butuh bantuan? Chat kami!
              <div className="absolute bottom-0 right-4 transform translate-y-1/2 rotate-45 w-2 h-2 bg-gray-900" />
            </div>
          </Button>
        </motion.div>
      )}

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.3 }}
            className={cn(
              "fixed z-50 bg-white rounded-2xl shadow-2xl border border-gray-200",
              isMinimized
                ? "w-72 h-14 bottom-20 right-4 sm:bottom-16 sm:right-4 md:w-80 md:bottom-6 md:right-6"
                : "w-[90vw] max-w-sm bottom-20 right-4 left-4 sm:bottom-16 sm:right-4 sm:left-4 md:w-96 md:max-w-md md:bottom-6 md:right-6 md:left-auto",
              "max-h-[75vh] sm:max-h-[80vh] md:max-h-[85vh]"
            )}
            style={{
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column'
            }}
          >
            {/* Header */}
            <div className={cn(
              "p-3 sm:p-4 rounded-t-2xl flex items-center justify-between",
              adminActive
                ? "bg-gradient-to-r from-green-600 to-green-700 text-white"
                : adminRequested
                ? "bg-gradient-to-r from-orange-600 to-orange-700 text-white"
                : "bg-gradient-to-r from-brand-600 to-brand-700 text-white"
            )}>
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-white/20 rounded-full flex items-center justify-center">
                  {adminActive ? (
                    <Headphones className="w-4 h-4 sm:w-5 sm:h-5" />
                  ) : adminRequested ? (
                    <Clock className="w-4 h-4 sm:w-5 sm:h-5" />
                  ) : (
                    <Bot className="w-4 h-4 sm:w-5 sm:h-5" />
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="font-semibold text-sm sm:text-base truncate">
                    {adminActive ? 'Admin Support' : adminRequested ? 'Menunggu Admin...' : 'Asisten Digital'}
                  </div>
                  <div className="text-xs opacity-90 flex items-center gap-1">
                    {adminActive ? (
                      <>
                        <CheckCircle className="w-3 h-3 flex-shrink-0" />
                        <span className="truncate">Admin sedang aktif</span>
                      </>
                    ) : adminRequested ? (
                      <>
                        <Clock className="w-3 h-3 flex-shrink-0" />
                        <span className="truncate">Admin akan segera membantu</span>
                      </>
                    ) : (
                      <>
                        <CheckCircle className="w-3 h-3 flex-shrink-0" />
                        <span className="truncate">Online " Respons cepat</span>
                      </>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <Button
                  size="icon"
                  variant="ghost"
                  className="text-white hover:bg-white/20 h-8 w-8"
                  onClick={() => setIsMinimized(!isMinimized)}
                >
                  <ChevronDown className={cn("w-4 h-4 transition-transform", isMinimized && "rotate-180")} />
                </Button>
                <Button
                  size="icon"
                  variant="ghost"
                  className="text-white hover:bg-white/20 h-8 w-8"
                  onClick={() => setIsOpen(false)}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {!isMinimized && (
              <>
                {/* User Identification Form */}
                {showUserForm && (
                  <div className="p-2.5 sm:p-3 bg-gradient-to-br from-blue-50 to-indigo-50 border-b border-blue-100">
                    <div className="mb-2.5 sm:mb-3">
                      <h3 className="text-xs sm:text-sm font-semibold text-gray-800 mb-1 flex items-center gap-2">
                        <User className="w-3 h-3 sm:w-4 sm:h-4 text-blue-600 flex-shrink-0" />
                        <span>Identifikasi Diri Anda</span>
                      </h3>
                      <p className="text-xs text-gray-600 leading-tight">
                        Mohon lengkapi data diri Anda untuk layanan yang lebih personal.
                      </p>
                    </div>

                    <form onSubmit={handleUserFormSubmit} className="space-y-2 sm:space-y-2.5">
                      <div className="grid grid-cols-1 gap-2 sm:gap-2.5">
                        <div>
                          <label className="block text-xs font-medium text-gray-700 mb-1">
                            Nama Lengkap <span className="text-red-500">*</span>
                          </label>
                          <Input
                            type="text"
                            value={userProfile.name}
                            onChange={(e) => setUserProfile(prev => ({ ...prev, name: e.target.value }))}
                            placeholder="Nama lengkap Anda"
                            className="w-full h-7 sm:h-8 text-xs sm:text-sm"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-gray-700 mb-1">
                            Nama Travel/Perusahaan <span className="text-red-500">*</span>
                          </label>
                          <Input
                            type="text"
                            value={userProfile.company}
                            onChange={(e) => setUserProfile(prev => ({ ...prev, company: e.target.value }))}
                            placeholder="Nama travel/perusahaan"
                            className="w-full h-7 sm:h-8 text-xs sm:text-sm"
                            required
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">
                          Nomor Telepon <span className="text-gray-400">(opsional)</span>
                        </label>
                        <Input
                          type="tel"
                          value={userProfile.phone}
                          onChange={(e) => setUserProfile(prev => ({ ...prev, phone: e.target.value }))}
                          placeholder="08xx-xxxx-xxxx"
                          className="w-full h-7 sm:h-8 text-xs sm:text-sm"
                        />
                      </div>

                      <div className="flex gap-2 pt-1">
                        <Button
                          type="submit"
                          className="flex-1 bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm h-7 sm:h-8 whitespace-nowrap"
                          disabled={!userProfile.name.trim() || !userProfile.company.trim()}
                        >
                          Lanjut ke Chat
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          className="px-2 sm:px-3 h-7 sm:h-8 text-xs sm:text-sm whitespace-nowrap"
                          onClick={() => {
                            setShowUserForm(false)
                            // Add a system message for skipped users
                            const skipMessage: Message = {
                              id: Date.now().toString(),
                              role: 'system',
                              content: 'Silakan lanjutkan chat Anda. Anda dapat mengisi data diri kapan saja.',
                              timestamp: new Date()
                            }
                            setMessages(prev => [...prev, skipMessage])
                          }}
                        >
                          Lewati
                        </Button>
                      </div>
                    </form>
                  </div>
                )}

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-3 sm:space-y-4 custom-scrollbar" style={{ minHeight: showUserForm ? '150px' : '200px', maxHeight: showUserForm ? '250px' : '350px' }}>
                  {messages.map((message) => (
                    <motion.div
                      key={message.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={cn(
                        "flex gap-3",
                        message.role === 'user' ? "justify-end" : "justify-start"
                      )}
                    >
                      {message.role === 'assistant' && (
                        <div className="w-8 h-8 bg-brand-100 rounded-full flex items-center justify-center flex-shrink-0">
                          <Bot className="w-4 h-4 text-brand-600" />
                        </div>
                      )}
                      {message.role === 'admin' && (
                        <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                          <Headphones className="w-4 h-4 text-green-600" />
                        </div>
                      )}
                      {message.role === 'system' && (
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                          <User className="w-4 h-4 text-blue-600" />
                        </div>
                      )}
                      <div className={cn(
                        "max-w-[85%] sm:max-w-[80%] space-y-2",
                        message.role === 'user' && "text-right"
                      )}>
                        <div className={cn(
                          "inline-block px-3 py-2 sm:px-4 rounded-2xl",
                          message.role === 'user'
                            ? "bg-brand-600 text-white rounded-br-none"
                            : message.role === 'admin'
                            ? "bg-green-500 text-white rounded-bl-none"
                            : message.role === 'system'
                            ? "bg-blue-100 text-blue-800 rounded-bl-none border border-blue-200"
                            : "bg-gray-100 text-gray-800 rounded-bl-none"
                        )}>
                          <p className="text-xs sm:text-sm whitespace-pre-wrap leading-relaxed">{message.content}</p>
                        </div>

                        {/* Benefits */}
                        {message.benefits && message.benefits.length > 0 && (
                          <div className="bg-blue-50 rounded-lg p-3 space-y-1">
                            <p className="text-xs font-semibold text-blue-900 mb-2">Keunggulan Layanan:</p>
                            {message.benefits.map((benefit, idx) => (
                              <p key={idx} className="text-xs text-blue-800 flex items-start gap-1">
                                <span className="text-blue-600 mt-0.5">"</span>
                                {benefit}
                              </p>
                            ))}
                          </div>
                        )}

                        {/* CTA Buttons */}
                        {message.cta && (
                          <div className="flex gap-2 mt-2">
                            {message.cta.primary && (
                              <Button size="sm" className="flex-1" asChild>
                                <a href={message.cta.primary.link} target="_blank" rel="noopener noreferrer">
                                  {message.cta.primary.text.startsWith('Konsultasi') && <Phone className="w-3 h-3 mr-1" />}
                                  {message.cta.primary.text}
                                </a>
                              </Button>
                            )}
                            {message.cta.secondary && (
                              <Button size="sm" variant="outline" className="flex-1" asChild>
                                <a href={message.cta.secondary.link}>
                                  {message.cta.secondary.text.startsWith('Unduh') && <Download className="w-3 h-3 mr-1" />}
                                  {message.cta.secondary.text}
                                </a>
                              </Button>
                            )}
                          </div>
                        )}

                        {/* WhatsApp Fallback */}
                        {message.whatsappTimeout && (
                          <div className="bg-red-50 border border-red-200 rounded-lg p-3 mt-2">
                            <p className="text-sm text-red-800 mb-2">{message.whatsappTimeout.fallbackMessage}</p>
                            <Button size="sm" className="w-full bg-green-600 hover:bg-green-700 text-white" asChild>
                              <a href="https://wa.me/6289620055378?text=Halo,%20saya%20butuh%20bantuan%20segera" target="_blank" rel="noopener noreferrer">
                                <Phone className="w-3 h-3 mr-2" />
                                Hubungi via WhatsApp
                                <ArrowRight className="w-3 h-3 ml-2" />
                              </a>
                            </Button>
                          </div>
                        )}

                        <p className="text-xs text-gray-400 mt-1">
                          {formatTime(message.timestamp)}
                        </p>
                      </div>
                      {message.role === 'user' && (
                        <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center flex-shrink-0">
                          <User className="w-4 h-4 text-gray-600" />
                        </div>
                      )}
                    </motion.div>
                  ))}

                  {/* Typing Indicator */}
                  {isTyping && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex gap-3"
                    >
                      <div className="w-8 h-8 bg-brand-100 rounded-full flex items-center justify-center">
                        <Bot className="w-4 h-4 text-brand-600" />
                      </div>
                      <div className="bg-gray-100 rounded-2xl rounded-bl-none px-4 py-2">
                        <div className="flex gap-1">
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                        </div>
                      </div>
                    </motion.div>
                  )}

                  <div ref={messagesEndRef} />
                </div>

                {/* Admin Intervention Options */}
                {!adminActive && messages.length > 2 && (
                  <div className="px-4 pb-2 border-b">
                    <div className="space-y-2">
                      {/* Problem reporting button */}
                      <Button
                        size="sm"
                        variant="outline"
                        className="w-full justify-start text-xs h-8 border-orange-200 text-orange-700 hover:bg-orange-50"
                        onClick={() => {
                          const problemMessage: Message = {
                            id: Date.now().toString(),
                            role: 'user',
                            content: 'Saya mengalami masalah dengan layanan ini',
                            timestamp: new Date()
                          }
                          setMessages(prev => [...prev, problemMessage])
                          setInput('')
                        }}
                      >
                        <AlertTriangle className="w-3 h-3 mr-2" />
                        Saya mengalami masalah
                      </Button>

                      {/* Admin chat request button */}
                      <Button
                        size="sm"
                        variant="outline"
                        className="w-full justify-start text-xs h-8 border-blue-200 text-blue-700 hover:bg-blue-50"
                        onClick={requestAdmin}
                        disabled={adminRequested}
                      >
                        <Headphones className="w-3 h-3 mr-2" />
                        {adminRequested ? 'Menunggu admin...' : 'Chat dengan admin'}
                      </Button>
                    </div>

                    {adminRequested && (
                      <div className="mt-2 p-2 bg-orange-50 rounded-lg">
                        <p className="text-xs text-orange-700 flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          Admin akan bergabung dalam 15 menit. Jika admin tidak merespons, opsi WhatsApp akan tersedia.
                        </p>
                      </div>
                    )}
                  </div>
                )}

                {/* Suggested Prompts */}
                {messages.length <= 2 && !adminActive && (
                  <div className="px-3 sm:px-4 pb-2">
                    <p className="text-xs text-gray-500 mb-2">Pertanyaan populer:</p>
                    <div className="flex flex-wrap gap-1.5 sm:gap-2">
                      {suggestedPrompts.map((prompt) => (
                        <Button
                          key={prompt}
                          size="sm"
                          variant="outline"
                          className="text-xs h-6 sm:h-7 px-2 sm:px-3 whitespace-nowrap"
                          onClick={() => handlePromptClick(prompt)}
                        >
                          {prompt}
                        </Button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Input */}
                <div className="p-3 sm:p-4 border-t">
                  <form onSubmit={handleSubmit} className="flex gap-2">
                    <Input
                      ref={inputRef}
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      placeholder="Ketik pertanyaan Anda..."
                      className="flex-1 text-xs sm:text-sm"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault()
                          sendMessage()
                        }
                      }}
                    />
                    <Button
                      type="button"
                      onClick={sendMessage}
                      size="icon"
                      className="btn-primary h-9 w-9 sm:h-10 sm:w-10"
                      disabled={!input.trim() || isTyping}
                    >
                      <Send className="w-3 h-3 sm:w-4 sm:h-4" />
                    </Button>
                  </form>

                  <div className="flex items-center justify-between mt-2">
                    <p className="text-xs text-gray-500 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      <span className="hidden sm:inline">Respon rata-rata: 30 detik</span>
                      <span className="sm:hidden">Respon: 30 detik</span>
                    </p>
                    {messages.length > 2 && (
                      <Button
                        size="sm"
                        variant="ghost"
                        className="text-xs text-gray-500 hover:text-gray-700 h-6 px-2"
                        onClick={clearChat}
                      >
                        <span className="hidden sm:inline">Bersihkan chat</span>
                        <span className="sm:hidden">Clear</span>
                      </Button>
                    )}
                  </div>
                </div>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

export default memo(ChatWidget)