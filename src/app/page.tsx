import { Hero } from '@/components/sections/Hero'
import { Benefits } from '@/components/sections/Benefits'
import { Services } from '@/components/sections/Services'
import { Portfolio } from '@/components/sections/Portfolio'
import { Testimonials } from '@/components/sections/Testimonials'
import { FAQ } from '@/components/sections/FAQ'
import { CTA } from '@/components/sections/CTA'
import { Navigation } from '@/components/layout/Navigation'
import { Footer } from '@/components/layout/Footer'
import { ChatWidget } from '@/components/chat/ChatWidget'
import { SmoothScroll } from '@/components/elements/smooth-scroll'
import { ScrollProgress } from '@/components/elements/scroll-progress'
import { BackToTop } from '@/components/elements/back-to-top'

export default function Home() {
  return (
    <SmoothScroll>
      <ScrollProgress />
      <Navigation />
      <main>
        <Hero />
        <Benefits />
        <Services />
        <Portfolio />
        <Testimonials />
        <FAQ />
        <CTA />
      </main>
      <Footer />
      <ChatWidget />
      <BackToTop />
    </SmoothScroll>
  )
}