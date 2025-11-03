'use client'

import { useState, useEffect, useRef } from 'react'
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
  CheckCircle
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
  benefits?: string[]
  cta?: {
    primary?: { text: string; link: string }
    secondary?: { text: string; link: string }
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
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    // Load chat history from localStorage
    const savedMessages = localStorage.getItem('chatMessages')
    if (savedMessages) {
      const parsed = JSON.parse(savedMessages)
      setMessages(parsed.map((msg: any) => ({
        ...msg,
        timestamp: new Date(msg.timestamp)
      })))
    }
  }, [])

  useEffect(() => {
    // Save messages to localStorage
    if (messages.length > 0) {
      localStorage.setItem('chatMessages', JSON.stringify(messages))
    }
  }, [messages])

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

  const sendMessage = async () => {
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
        cta: data.cta
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
  }

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

  return (
    <>
      {/* Chat Button */}
      {!isOpen && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", duration: 0.5 }}
          className="fixed bottom-32 right-6 z-50 md:bottom-6 md:right-6"
        >
          <Button
            onClick={() => setIsOpen(true)}
            className="w-16 h-16 rounded-full bg-brand-600 hover:bg-brand-700 shadow-2xl hover:shadow-3xl transition-all duration-300 relative group"
          >
            <MessageCircle className="w-6 h-6" />
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full animate-pulse" />

            {/* Tooltip */}
            <div className="absolute bottom-full right-0 mb-2 px-3 py-2 bg-gray-900 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
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
              "fixed bottom-32 right-6 z-50 bg-white rounded-2xl shadow-2xl border border-gray-200 md:bottom-6 md:right-6",
              isMinimized ? "w-80 h-14" : "w-96 h-[600px] max-h-[80vh]"
            )}
            style={{
              marginBottom: '0px',
              maxHeight: '80vh',
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column'
            }}
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-brand-600 to-brand-700 text-white p-4 rounded-t-2xl flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                  <Bot className="w-5 h-5" />
                </div>
                <div>
                  <div className="font-semibold">Asisten Digital</div>
                  <div className="text-xs text-blue-100 flex items-center gap-1">
                    <CheckCircle className="w-3 h-3" />
                    Online " Respons cepat
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
                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar" style={{ minHeight: '300px', maxHeight: '440px' }}>
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
                      <div className={cn(
                        "max-w-[80%] space-y-2",
                        message.role === 'user' && "text-right"
                      )}>
                        <div className={cn(
                          "inline-block px-4 py-2 rounded-2xl",
                          message.role === 'user'
                            ? "bg-brand-600 text-white rounded-br-none"
                            : "bg-gray-100 text-gray-800 rounded-bl-none"
                        )}>
                          <p className="text-sm whitespace-pre-wrap">{message.content}</p>
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

                {/* Suggested Prompts */}
                {messages.length <= 2 && (
                  <div className="px-4 pb-2">
                    <p className="text-xs text-gray-500 mb-2">Pertanyaan populer:</p>
                    <div className="flex flex-wrap gap-2">
                      {suggestedPrompts.map((prompt) => (
                        <Button
                          key={prompt}
                          size="sm"
                          variant="outline"
                          className="text-xs h-7"
                          onClick={() => handlePromptClick(prompt)}
                        >
                          {prompt}
                        </Button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Input */}
                <div className="p-4 border-t">
                  <form onSubmit={handleSubmit} className="flex gap-2">
                    <Input
                      ref={inputRef}
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      placeholder="Ketik pertanyaan Anda..."
                      className="flex-1"
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
                      className="btn-primary"
                      disabled={!input.trim() || isTyping}
                    >
                      <Send className="w-4 h-4" />
                    </Button>
                  </form>

                  <div className="flex items-center justify-between mt-2">
                    <p className="text-xs text-gray-500 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      Respon rata-rata: 30 detik
                    </p>
                    {messages.length > 2 && (
                      <Button
                        size="sm"
                        variant="ghost"
                        className="text-xs text-gray-500 hover:text-gray-700"
                        onClick={clearChat}
                      >
                        Bersihkan chat
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