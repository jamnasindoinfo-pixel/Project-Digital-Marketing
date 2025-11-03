'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Image from 'next/image'
import { cn } from '@/lib/utils'

interface LazyImageProps {
  src: string
  alt: string
  width?: number
  height?: number
  className?: string
  priority?: boolean
}

export function LazyImage({
  src,
  alt,
  width,
  height,
  className,
  priority = false
}: LazyImageProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(false)
  const [inView, setInView] = useState(false)

  useEffect(() => {
    if (priority) {
      setInView(true)
      return
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true)
          observer.disconnect()
        }
      },
      {
        rootMargin: '50px'
      }
    )

    const imgElement = document.getElementById(`lazy-img-${src}`)
    if (imgElement) {
      observer.observe(imgElement)
    }

    return () => observer.disconnect()
  }, [src, priority])

  return (
    <div
      id={`lazy-img-${src}`}
      className={cn(
        "relative overflow-hidden",
        className
      )}
      style={{ width, height }}
    >
      {inView && (
        <>
          {isLoading && (
            <div className="absolute inset-0 bg-gray-200 animate-pulse" />
          )}

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: isLoading ? 0 : 1 }}
            transition={{ duration: 0.3 }}
            className="relative w-full h-full"
          >
            <Image
              src={src}
              alt={alt}
              fill
              className={cn(
                "object-cover",
                isLoading && "opacity-0"
              )}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              onLoad={() => setIsLoading(false)}
              onError={() => {
                setIsLoading(false)
                setError(true)
              }}
              priority={priority}
            />

            {error && (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
                <span className="text-gray-400 text-sm">Gambar tidak tersedia</span>
              </div>
            )}
          </motion.div>
        </>
      )}
    </div>
  )
}