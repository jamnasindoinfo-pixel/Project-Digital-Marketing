'use client'

import { Button } from '@/components/ui/button'

export function ConsultationButton() {
  const handleConsultation = () => {
    const chatButton = document.querySelector('[data-chat-button="true"]')
    if (chatButton) {
      ;(chatButton as HTMLElement).click()
    }
  }

  return (
    <Button
      size="lg"
      className="bg-white text-brand-600 hover:bg-gray-100 font-semibold px-8"
      onClick={handleConsultation}
    >
      Konsultasi Gratis
    </Button>
  )
}