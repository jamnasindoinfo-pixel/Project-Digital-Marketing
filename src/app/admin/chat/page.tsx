'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Textarea } from '@/components/ui/textarea'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  Phone,
  MessageCircle,
  Clock,
  AlertCircle,
  Send,
  User,
  Bot,
  Search,
  MoreVertical,
  Paperclip,
  Smile,
  Mic,
  Check,
  CheckCheck,
  ArrowLeft,
  Settings,
  LogOut,
  Archive,
  Trash2
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useAuth } from '@/hooks/useAuth'

interface ChatSession {
  id: string
  userId: string
  userName?: string
  userProfile?: {
    name: string
    company: string
    phone?: string
  }
  status: 'ai-only' | 'admin-requested' | 'admin-active' | 'whatsapp-fallback'
  messages: Array<{
    id: string
    role: 'user' | 'ai' | 'admin'
    content: string
    timestamp: Date
  }>
  createdAt: Date
  lastActivity: Date
  adminResponseDeadline?: Date
}

export default function AdminChatPanel() {
  const router = useRouter()
  const { user, isLoading: authLoading, logout } = useAuth()
  const [sessions, setSessions] = useState<ChatSession[]>([])
  const [selectedSession, setSelectedSession] = useState<ChatSession | null>(null)
  const [adminMessage, setAdminMessage] = useState('')
  const [activeChats, setActiveChats] = useState<Set<string>>(new Set())

  // Load real chat sessions from localStorage
  useEffect(() => {
    const loadChatSessions = () => {
      try {
        // Get all chat sessions from localStorage
        const allStorage = { ...localStorage }
        const chatKeys = Object.keys(allStorage).filter(key => key.startsWith('chatMessages_'))

        const sessions: ChatSession[] = []

        chatKeys.forEach(key => {
          try {
            const messages = JSON.parse(allStorage[key])
            if (messages && messages.length > 0) {
              const sessionId = key.replace('chatMessages_', '')
              const lastMessage = messages[messages.length - 1]

              // Load user profile for this session
              const userProfileKey = `userProfile_${sessionId}`
              const userProfileData = allStorage[userProfileKey]
              let userProfile = undefined
              let userName = `User ${sessionId.substring(0, 8)}`

              if (userProfileData) {
                try {
                  userProfile = JSON.parse(userProfileData)
                  if (userProfile.name) {
                    userName = userProfile.name
                  }
                } catch (error) {
                  console.error(`Error parsing user profile for ${sessionId}:`, error)
                }
              }

              // Determine session status based on messages
              let status: ChatSession['status'] = 'ai-only'
              let adminResponseDeadline: Date | undefined

              // Check for admin request
              const adminRequestMessage = messages.find((msg: any) =>
                msg.adminInfo?.status === 'admin-requested'
              )

              // Check for admin active
              const adminActiveMessage = messages.find((msg: any) =>
                msg.adminInfo?.status === 'admin-active'
              )

              // Check for WhatsApp timeout
              const whatsappTimeoutMessage = messages.find((msg: any) =>
                msg.whatsappTimeout?.enabled
              )

              if (adminActiveMessage) {
                status = 'admin-active'
              } else if (adminRequestMessage) {
                status = 'admin-requested'
                // Calculate deadline (15 minutes from request time)
                const requestTime = new Date(adminRequestMessage.timestamp)
                adminResponseDeadline = new Date(requestTime.getTime() + 15 * 60 * 1000)

                // Check if deadline has passed
                if (new Date() > adminResponseDeadline) {
                  status = 'whatsapp-fallback'
                }
              } else if (whatsappTimeoutMessage) {
                status = 'whatsapp-fallback'
              }

              const session: ChatSession = {
                id: sessionId,
                userId: sessionId,
                userName,
                userProfile,
                status,
                messages: messages.map((msg: any) => ({
                  id: msg.id,
                  role: msg.role === 'assistant' ? 'ai' : msg.role,
                  content: msg.content,
                  timestamp: new Date(msg.timestamp)
                })),
                createdAt: new Date(messages[0].timestamp),
                lastActivity: new Date(lastMessage.timestamp),
                adminResponseDeadline
              }

              sessions.push(session)
            }
          } catch (error) {
            console.error(`Error parsing session ${key}:`, error)
          }
        })

        // Sort by last activity (most recent first)
        sessions.sort((a, b) => b.lastActivity.getTime() - a.lastActivity.getTime())

        setSessions(sessions)
      } catch (error) {
        console.error('Error loading chat sessions:', error)
      }
    }

    // Load initially
    loadChatSessions()

    // Set up polling to check for new messages every 3 seconds
    const interval = setInterval(loadChatSessions, 3000)

    return () => clearInterval(interval)
  }, [])

  const handleTakeOverChat = (sessionId: string) => {
    // Update local state
    setSessions(prev => prev.map(session =>
      session.id === sessionId
        ? { ...session, status: 'admin-active' as const }
        : session
    ))
    setActiveChats(prev => new Set(Array.from(prev).concat(sessionId)))

    // Update localStorage to notify chat widget
    try {
      const existingMessages = localStorage.getItem(`chatMessages_${sessionId}`)
      if (existingMessages) {
        const messages = JSON.parse(existingMessages)

        // Add admin takeover message
        const adminTakeoverMessage = {
          id: Date.now().toString(),
          role: 'assistant',
          content: 'Admin telah bergabung dalam chat ini. Selamat berbicara dengan tim ahli kami!',
          timestamp: new Date().toISOString(),
          adminInfo: {
            status: 'admin-active',
            takeoverTime: new Date().toISOString()
          }
        }

        messages.push(adminTakeoverMessage)
        localStorage.setItem(`chatMessages_${sessionId}`, JSON.stringify(messages))
      }
    } catch (error) {
      console.error('Error updating localStorage for admin takeover:', error)
    }
  }

  const handleSendMessage = () => {
    if (!adminMessage.trim() || !selectedSession) return

    const newMessage = {
      id: `m_${Date.now()}`,
      role: 'admin' as const,
      content: adminMessage,
      timestamp: new Date()
    }

    // Update local state
    setSessions(prev => prev.map(session =>
      session.id === selectedSession.id
        ? {
            ...session,
            messages: [...session.messages, newMessage],
            lastActivity: new Date()
          }
        : session
    ))

    setSelectedSession(prev => prev ? {
      ...prev,
      messages: [...prev.messages, newMessage],
      lastActivity: new Date()
    } : null)

    // Update localStorage to send message to chat widget
    try {
      const existingMessages = localStorage.getItem(`chatMessages_${selectedSession.id}`)
      if (existingMessages) {
        const messages = JSON.parse(existingMessages)

        // Add admin message
        const adminMessageForWidget = {
          id: newMessage.id,
          role: 'admin',
          content: adminMessage,
          timestamp: newMessage.timestamp.toISOString()
        }

        messages.push(adminMessageForWidget)
        localStorage.setItem(`chatMessages_${selectedSession.id}`, JSON.stringify(messages))
      }
    } catch (error) {
      console.error('Error sending admin message to localStorage:', error)
    }

    setAdminMessage('')
  }

  const getStatusColor = (status: ChatSession['status']) => {
    switch (status) {
      case 'admin-requested': return 'bg-yellow-500'
      case 'admin-active': return 'bg-green-500'
      case 'whatsapp-fallback': return 'bg-red-500'
      default: return 'bg-gray-500'
    }
  }

  const getStatusText = (status: ChatSession['status']) => {
    switch (status) {
      case 'admin-requested': return 'Menunggu Admin'
      case 'admin-active': return 'Admin Aktif'
      case 'whatsapp-fallback': return 'WhatsApp Fallback'
      default: return 'AI Only'
    }
  }

  const getTimeRemaining = (deadline?: Date) => {
    if (!deadline) return null

    const now = new Date()
    const diff = deadline.getTime() - now.getTime()
    const minutes = Math.floor(diff / (1000 * 60))

    if (minutes <= 0) return 'Sudah lewat deadline'
    if (minutes <= 5) return `${minutes} menit lagi ⚠️`
    return `${minutes} menit`
  }

  // Check authentication
  if (authLoading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Memuat...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    router.push('/admin/login')
    return null
  }

  return (
    <div className="h-screen bg-gray-100 flex">
      {/* Left Sidebar - Chat List */}
      <div className="w-96 bg-gray-50 border-r border-gray-200">
        {/* Sidebar Header */}
        <div className="bg-[#202c33] text-white p-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <Avatar className="h-10 w-10">
                <AvatarFallback className="bg-[#128c7e]">
                  <MessageCircle className="h-5 w-5" />
                </AvatarFallback>
              </Avatar>
              <div>
                <h1 className="text-lg font-semibold">Admin Panel</h1>
                <p className="text-xs text-gray-300">{sessions.length} Active Sessions</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon" className="text-white hover:bg-gray-700">
                <Settings className="h-5 w-5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="text-white hover:bg-gray-700"
                onClick={logout}
                title="Logout"
              >
                <LogOut className="h-5 w-5" />
              </Button>
            </div>
          </div>

          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="text"
              placeholder="Search conversations..."
              className="w-full bg-gray-700 text-white placeholder-gray-400 rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-1 focus:ring-gray-600"
            />
          </div>
        </div>

        {/* Chat List */}
        <ScrollArea className="h-[calc(100vh-120px)]">
          {sessions.map(session => (
            <div
              key={session.id}
              className={cn(
                "flex items-center gap-3 p-3 hover:bg-gray-200 cursor-pointer transition-colors",
                selectedSession?.id === session.id && "bg-gray-300"
              )}
              onClick={() => setSelectedSession(session)}
            >
              <div className="relative">
                <Avatar className="h-12 w-12">
                  <AvatarFallback className={cn(
                    "text-white font-semibold",
                    session.status === 'admin-requested' && "bg-yellow-500",
                    session.status === 'admin-active' && "bg-green-500",
                    session.status === 'whatsapp-fallback' && "bg-red-500",
                    session.status === 'ai-only' && "bg-gray-500"
                  )}>
                    {session.userName?.charAt(0)?.toUpperCase() || 'U'}
                  </AvatarFallback>
                </Avatar>
                {session.status === 'admin-requested' && (
                  <div className="absolute -top-1 -right-1 w-4 h-4 bg-yellow-500 rounded-full animate-pulse" />
                )}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <p className="font-semibold text-gray-900 truncate">
                    {session.userName || `User ${session.userId.slice(-4)}`}
                  </p>
                  <span className="text-xs text-gray-500">
                    {session.lastActivity.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                {session.userProfile?.company && (
                  <p className="text-xs text-blue-600 font-medium mb-1">
                    🏢 {session.userProfile.company}
                  </p>
                )}
                <div className="flex items-center gap-1">
                  <p className="text-sm text-gray-600 truncate">
                    {session.messages[session.messages.length - 1]?.content}
                  </p>
                  {session.status === 'admin-requested' && (
                    <Badge className="bg-yellow-500 text-white text-xs px-1.5 py-0.5 rounded-full">
                      {getTimeRemaining(session.adminResponseDeadline)}
                    </Badge>
                  )}
                </div>
              </div>

              <div className="flex flex-col items-end gap-1">
                <Badge className={cn(
                  "text-xs px-2 py-1 rounded-full",
                  session.status === 'admin-requested' && "bg-yellow-500 text-white",
                  session.status === 'admin-active' && "bg-green-500 text-white",
                  session.status === 'whatsapp-fallback' && "bg-red-500 text-white",
                  session.status === 'ai-only' && "bg-gray-500 text-white"
                )}>
                  {getStatusText(session.status)}
                </Badge>
                {session.status === 'admin-requested' && !activeChats.has(session.id) && (
                  <Button
                    size="sm"
                    className="bg-[#128c7e] hover:bg-[#0d5f54] text-white text-xs h-6 px-2"
                    onClick={(e) => {
                      e.stopPropagation()
                      handleTakeOverChat(session.id)
                    }}
                  >
                    Take Over
                  </Button>
                )}
              </div>
            </div>
          ))}
        </ScrollArea>
      </div>

      {/* Right Side - Chat Interface */}
      <div className="flex-1 flex flex-col bg-[#efeae2]">
        {selectedSession ? (
          <>
            {/* Chat Header */}
            <div className="bg-[#f0f2f5] border-b border-gray-200 p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10">
                    <AvatarFallback className={cn(
                      "text-white font-semibold",
                      selectedSession.status === 'admin-requested' && "bg-yellow-500",
                      selectedSession.status === 'admin-active' && "bg-green-500",
                      selectedSession.status === 'whatsapp-fallback' && "bg-red-500",
                      selectedSession.status === 'ai-only' && "bg-gray-500"
                    )}>
                      {selectedSession.userName?.charAt(0)?.toUpperCase() || 'U'}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="text-lg font-semibold text-gray-900">
                        {selectedSession.userName || `User ${selectedSession.userId.slice(-4)}`}
                      </h2>
                      <div className="flex items-center gap-1">
                        <div className="w-2 h-2 bg-green-500 rounded-full" />
                        <span className="text-xs text-gray-500">Online</span>
                      </div>
                    </div>
                    {selectedSession.userProfile?.company && (
                      <p className="text-sm text-blue-600">🏢 {selectedSession.userProfile.company}</p>
                    )}
                    {selectedSession.userProfile?.phone && (
                      <p className="text-sm text-gray-600 flex items-center gap-1">
                        <Phone className="h-3 w-3" />
                        {selectedSession.userProfile.phone}
                      </p>
                    )}
                    <p className="text-xs text-gray-500">
                      Status: {getStatusText(selectedSession.status)}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="icon" className="text-gray-600 hover:bg-gray-200">
                    <Phone className="h-5 w-5" />
                  </Button>
                  <Button variant="ghost" size="icon" className="text-gray-600 hover:bg-gray-200">
                    <MoreVertical className="h-5 w-5" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 bg-[#e5ddd5]">
              <div className="max-w-4xl mx-auto">
                {selectedSession.messages.map(message => (
                  <div
                    key={message.id}
                    className={cn(
                      "flex mb-4",
                      message.role === 'admin' ? 'justify-end' : 'justify-start'
                    )}
                  >
                    <div className={cn(
                      "max-w-[70%] px-4 py-2 rounded-2xl",
                      message.role === 'admin'
                        ? "bg-[#dcf8c6] text-gray-900 rounded-br-none"
                        : message.role === 'ai'
                        ? "bg-gray-100 text-gray-800 rounded-bl-none"
                        : "bg-white text-gray-900 rounded-bl-none shadow-sm"
                    )}>
                      <p className="text-sm break-words">{message.content}</p>
                      <div className={cn(
                        "flex items-center gap-1 mt-1 text-xs",
                        message.role === 'admin' ? "text-gray-600 justify-end" : "text-gray-500"
                      )}>
                        <span>{message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                        {message.role === 'admin' && (
                          <CheckCheck className="h-3 w-3 text-blue-500" />
                        )}
                      </div>
                    </div>
                  </div>
                ))}

                {selectedSession.status === 'admin-requested' && !activeChats.has(selectedSession.id) && (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
                    <div className="flex items-center gap-2 text-yellow-800 mb-2">
                      <AlertCircle className="h-4 w-4" />
                      <span className="font-medium">Customer is requesting admin assistance</span>
                    </div>
                    <p className="text-sm text-yellow-700 mb-3">
                      Customer wants to chat with a human agent. Take over this conversation to provide personalized assistance.
                    </p>
                    <Button
                      onClick={() => handleTakeOverChat(selectedSession.id)}
                      className="w-full bg-[#128c7e] hover:bg-[#0d5f54] text-white"
                    >
                      Take Over Chat
                    </Button>
                  </div>
                )}
              </div>
            </div>

            {/* Message Input Area */}
            {selectedSession.status === 'admin-active' && (
              <div className="bg-white border-t border-gray-200 p-4">
                <div className="max-w-4xl mx-auto">
                  <div className="flex items-end gap-3">
                    <Button variant="ghost" size="icon" className="text-gray-500 hover:text-gray-700">
                      <Smile className="h-5 w-5" />
                    </Button>
                    <Button variant="ghost" size="icon" className="text-gray-500 hover:text-gray-700">
                      <Paperclip className="h-5 w-5" />
                    </Button>
                    <div className="flex-1">
                      <Textarea
                        value={adminMessage}
                        onChange={(e) => setAdminMessage(e.target.value)}
                        placeholder="Type a message..."
                        className="resize-none border-gray-300 rounded-2xl focus:border-blue-500 focus:ring-0 min-h-[44px] max-h-32"
                        rows={1}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault()
                            handleSendMessage()
                          }
                        }}
                        style={{
                          height: adminMessage.split('\n').length > 1 ?
                            Math.min(adminMessage.split('\n').length * 24, 128) + 'px' : '44px'
                        }}
                      />
                    </div>
                    {adminMessage.trim() ? (
                      <Button
                        onClick={handleSendMessage}
                        className="bg-[#128c7e] hover:bg-[#0d5f54] text-white rounded-full p-2"
                      >
                        <Send className="h-5 w-5" />
                      </Button>
                    ) : (
                      <Button variant="ghost" size="icon" className="text-gray-500 hover:text-gray-700">
                        <Mic className="h-5 w-5" />
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center bg-[#e5ddd5]">
            <div className="text-center">
              <div className="bg-gray-100 rounded-full p-8 mb-4 inline-block">
                <MessageCircle className="h-16 w-16 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Welcome to Admin Panel
              </h3>
              <p className="text-gray-600 max-w-md mx-auto">
                Select a conversation from the left sidebar to start responding to customer inquiries.
              </p>
              <div className="mt-6 text-sm text-gray-500">
                <p>Total Active Sessions: {sessions.length}</p>
                <p>Admin Requests: {sessions.filter(s => s.status === 'admin-requested').length}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}