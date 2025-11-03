'use client'

import { useEffect, useRef } from 'react'

interface SmoothScrollProps {
  children: React.ReactNode
}

export function SmoothScroll({ children }: SmoothScrollProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const container = scrollContainerRef.current
    if (!container) return

    let ticking = false

    const updateScroll = () => {
      const scrollY = window.scrollY
      const sections = container.querySelectorAll('section[id]')

      sections.forEach((section) => {
        const rect = section.getBoundingClientRect()
        const id = section.getAttribute('id')

        if (rect.top <= 100 && rect.bottom >= 100) {
          // Update active navigation
          const navLinks = document.querySelectorAll(`a[href="#${id}"]`)
          navLinks.forEach((link) => {
            link.classList.add('text-brand-600')
          })
        } else {
          const navLinks = document.querySelectorAll(`a[href="#${id}"]`)
          navLinks.forEach((link) => {
            link.classList.remove('text-brand-600')
          })
        }
      })

      ticking = false
    }

    const onScroll = () => {
      if (!ticking) {
        requestAnimationFrame(updateScroll)
        ticking = true
      }
    }

    window.addEventListener('scroll', onScroll, { passive: true })

    return () => {
      window.removeEventListener('scroll', onScroll)
    }
  }, [])

  useEffect(() => {
    // Smooth scroll for anchor links
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      const link = target.closest('a[href^="#"]')

      if (link) {
        e.preventDefault()
        const href = link.getAttribute('href')
        if (href && href !== '#') {
          const element = document.querySelector(href)
          if (element) {
            const offsetTop = element.offsetTop - 80 // Offset for sticky header
            window.scrollTo({
              top: offsetTop,
              behavior: 'smooth'
            })
          }
        }
      }
    }

    document.addEventListener('click', handleClick)

    return () => {
      document.removeEventListener('click', handleClick)
    }
  }, [])

  return (
    <div ref={scrollContainerRef}>
      {children}
    </div>
  )
}