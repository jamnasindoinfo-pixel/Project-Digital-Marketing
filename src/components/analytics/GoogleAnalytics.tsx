'use client'

import Script from 'next/script'

export function GoogleAnalytics({ measurementId }: { measurementId: string }) {
  if (!measurementId) return null

  return (
    <>
      <Script
        strategy="afterInteractive"
        src={`https://www.googletagmanager.com/gtag/js?id=${measurementId}`}
      />
      <Script
        id="google-analytics"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${measurementId}', {
              page_title: document.title,
              page_location: window.location.href,
            });
          `,
        }}
      />
    </>
  )
}

// Event tracking functions
export const GA_TRACKING = {
  trackPageView: (url: string) => {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('config', process.env.NEXT_PUBLIC_GA_ID, {
        page_path: url,
      })
    }
  },

  trackEvent: (action: string, category: string, label?: string, value?: number) => {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', action, {
        event_category: category,
        event_label: label,
        value: value,
      })
    }
  },

  // Track WhatsApp clicks
  trackWhatsAppClick: (source: string) => {
    GA_TRACKING.trackEvent('whatsapp_click', 'contact', source)
  },

  // Track form submissions
  trackFormSubmission: (formType: string) => {
    GA_TRACKING.trackEvent('form_submit', 'lead', formType)
  },

  // Track downloads
  trackDownload: (filename: string) => {
    GA_TRACKING.trackEvent('download', 'content', filename)
  },

  // Track service clicks
  trackServiceClick: (serviceName: string) => {
    GA_TRACKING.trackEvent('service_click', 'service', serviceName)
  },

  // Track chat interactions
  trackChatInteraction: (type: string) => {
    GA_TRACKING.trackEvent('chat_interaction', 'engagement', type)
  },
}