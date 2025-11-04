'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Calendar, Clock, User, ArrowRight } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'

interface BlogPostCardProps {
  post: {
    id: string
    title: string
    slug: string
    excerpt?: string
    content: string
    featured_image?: string
    published_at?: string
    read_time?: number
    author?: {
      name?: string
      email?: string
    }
    category?: {
      name: string
      slug: string
    }
    tags?: Array<{
      name: string
      slug: string
    }>
  }
}

export function BlogPostCard({ post }: BlogPostCardProps) {
  const publishedDate = new Date(post.published_at || '').toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  })

  const authorName = post.author?.name || post.author?.email || 'Admin Travel'

  return (
    <Card className="group overflow-hidden hover:shadow-lg transition-all duration-300 bg-white border-gray-200">
      {/* Featured Image */}
      <div className="relative aspect-video overflow-hidden bg-gray-100">
        {post.featured_image ? (
          <Image
            src={post.featured_image}
            alt={post.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-brand-100 to-blue-100 flex items-center justify-center">
            <div className="text-center p-4">
              <div className="w-16 h-16 bg-brand-200 rounded-full mx-auto mb-2 flex items-center justify-center">
                <span className="text-brand-600 text-2xl font-bold">T</span>
              </div>
              <p className="text-brand-600 font-medium">Travel Indonesia</p>
            </div>
          </div>
        )}

        {/* Category Badge */}
        {post.category && (
          <div className="absolute top-4 left-4">
            <span className="bg-brand-600 text-white px-3 py-1 rounded-full text-sm font-medium">
              {post.category.name}
            </span>
          </div>
        )}
      </div>

      <CardContent className="p-6">
        {/* Meta Information */}
        <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
          <div className="flex items-center gap-1">
            <Calendar className="w-4 h-4" />
            <span>{publishedDate}</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="w-4 h-4" />
            <span>{post.read_time || 5} menit</span>
          </div>
          <div className="flex items-center gap-1">
            <User className="w-4 h-4" />
            <span>{authorName}</span>
          </div>
        </div>

        {/* Title */}
        <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-brand-600 transition-colors">
          <Link href={`/blog/${post.slug}`} className="hover:text-brand-600">
            {post.title}
          </Link>
        </h3>

        {/* Excerpt */}
        <p className="text-gray-600 mb-4 line-clamp-3 leading-relaxed">
          {post.excerpt || 'Baca selengkapnya untuk mengetahui informasi lengkapnya.'}
        </p>

        {/* Tags */}
        {post.tags && post.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {post.tags.slice(0, 3).map((tagItem, index) => (
              <span
                key={index}
                className="bg-gray-100 text-gray-700 px-2 py-1 rounded-md text-xs font-medium"
              >
                #{tagItem.name}
              </span>
            ))}
            {post.tags.length > 3 && (
              <span className="text-gray-500 text-xs">
                +{post.tags.length - 3} lainnya
              </span>
            )}
          </div>
        )}

        {/* Read More Link */}
        <Link
          href={`/blog/${post.slug}`}
          className="inline-flex items-center gap-2 text-brand-600 font-medium hover:text-brand-700 transition-colors group"
        >
          Baca Selengkapnya
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </Link>
      </CardContent>
    </Card>
  )
}