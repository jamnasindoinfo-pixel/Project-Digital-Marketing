import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { blogApi } from '@/lib/supabase'
import { BlogPostContent } from '@/components/blog/BlogPostContent'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Calendar, Clock, User, Share2, Bookmark } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'

interface BlogPostPageProps {
  params: Promise<{
    slug: string
  }>
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  try {
    const { slug } = await params
    const post = await blogApi.getPostBySlug(slug)

    if (!post) {
      return {
        title: 'Artikel Tidak Ditemukan',
        description: 'Artikel yang Anda cari tidak ditemukan.'
      }
    }

    const publishedDate = new Date(post.published_at || '').toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    })

    return {
      title: post.title,
      description: post.excerpt,
      openGraph: {
        title: post.title,
        description: post.excerpt,
        type: 'article',
        publishedTime: post.published_at,
        modifiedTime: post.updated_at,
        authors: post.author?.user_metadata?.name || post.author?.email || 'Admin',
        images: post.featured_image ? [
          {
            url: post.featured_image,
            width: 1200,
            height: 630,
            alt: post.title,
          }
        ] : [],
        url: `/blog/${post.slug}`
      },
      twitter: {
        card: 'summary_large_image',
        title: post.title,
        description: post.excerpt,
        images: post.featured_image ? [post.featured_image] : []
      },
      alternates: {
        canonical: `/blog/${post.slug}`
      },
      keywords: post.tags?.map(tagItem => tagItem.name).join(', ')
    }
  } catch (error) {
    return {
      title: 'Error',
      description: 'Terjadi kesalahan saat memuat artikel.'
    }
  }
}

async function getPost(slug: string) {
  try {
    const post = await blogApi.getPostBySlug(slug)
    return post
  } catch (error) {
    console.error('Error fetching post:', error)
    return null
  }
}

async function getRelatedPosts(categoryId?: string, currentPostId?: string) {
  try {
    if (!categoryId || !currentPostId) return []

    const relatedPosts = await blogApi.getPosts({
      category: categoryId,
      limit: 3
    })

    return relatedPosts.filter(post => post.id !== currentPostId).slice(0, 3)
  } catch (error) {
    console.error('Error fetching related posts:', error)
    return []
  }
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params
  const post = await getPost(slug)

  if (!post) {
    notFound()
  }

  const relatedPosts = await getRelatedPosts(post.category?.id, post.id)

  const publishedDate = new Date(post.published_at || '').toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  })

  const authorName = post.author?.user_metadata?.name || post.author?.email || 'Admin Travel'

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: post.title,
          text: post.excerpt,
          url: window.location.href,
        })
      } catch (error) {
        console.log('Error sharing:', error)
      }
    } else {
      // Fallback: Copy to clipboard
      navigator.clipboard.writeText(window.location.href)
      // You could show a toast notification here
    }
  }

  const handleBookmark = () => {
    // Implement bookmark functionality
    // This could save to localStorage or backend
    console.log('Bookmark functionality to be implemented')
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Back to Blog */}
      <div className="bg-gray-50 border-b">
        <div className="container-custom py-4">
          <Link href="/blog">
            <Button variant="ghost" className="gap-2 text-gray-600 hover:text-brand-600">
              <ArrowLeft className="w-4 h-4" />
              Kembali ke Blog
            </Button>
          </Link>
        </div>
      </div>

      {/* Hero Section with Featured Image */}
      {post.featured_image && (
        <div className="relative aspect-video lg:aspect-[2/1] overflow-hidden">
          <Image
            src={post.featured_image}
            alt={post.title}
            fill
            className="object-cover"
            priority
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 100vw, 1200px"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

          {/* Category Badge */}
          {post.category && (
            <div className="absolute top-8 left-8">
              <span className="bg-brand-600 text-white px-4 py-2 rounded-full text-sm font-medium">
                {post.category.name}
              </span>
            </div>
          )}
        </div>
      )}

      {/* Article Header */}
      <div className="container-custom section-padding">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-6 leading-tight">
              {post.title}
            </h1>

            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              {post.excerpt}
            </p>

            {/* Article Meta */}
            <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-gray-500 mb-8">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4" />
                <span>{authorName}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span>{publishedDate}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span>5 menit baca</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-center gap-4">
              <Button
                onClick={handleShare}
                variant="outline"
                className="gap-2"
              >
                <Share2 className="w-4 h-4" />
                Bagikan
              </Button>
              <Button
                onClick={handleBookmark}
                variant="outline"
                className="gap-2"
              >
                <Bookmark className="w-4 h-4" />
                Simpan
              </Button>
            </div>
          </div>

          {/* Tags */}
          {post.tags && post.tags.length > 0 && (
            <div className="flex flex-wrap items-center justify-center gap-2 mb-8">
              <span className="text-sm text-gray-500 mr-2">Tags:</span>
              {post.tags.map((tagItem, index) => (
                <span
                  key={index}
                  className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm"
                >
                  #{tagItem.name}
                </span>
              ))}
            </div>
          )}

          {/* Article Content */}
          <div className="prose prose-lg max-w-none">
            <BlogPostContent content={post.content} />
          </div>
        </div>
      </div>

      {/* Related Posts */}
      {relatedPosts.length > 0 && (
        <section className="bg-gray-50 section-padding">
          <div className="container-custom">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-3xl font-bold text-center mb-12 text-gray-900">
                Artikel Terkait
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {relatedPosts.map((relatedPost) => (
                  <Link
                    key={relatedPost.id}
                    href={`/blog/${relatedPost.slug}`}
                    className="group"
                  >
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow duration-300">
                      {relatedPost.featured_image ? (
                        <div className="aspect-video overflow-hidden">
                          <Image
                            src={relatedPost.featured_image}
                            alt={relatedPost.title}
                            width={400}
                            height={225}
                            className="object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        </div>
                      ) : (
                        <div className="aspect-video bg-gradient-to-br from-brand-100 to-blue-100 flex items-center justify-center">
                          <div className="text-center">
                            <div className="w-12 h-12 bg-brand-200 rounded-full mx-auto mb-2 flex items-center justify-center">
                              <span className="text-brand-600 font-bold">T</span>
                            </div>
                          </div>
                        </div>
                      )}

                      <div className="p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-brand-600 transition-colors">
                          {relatedPost.title}
                        </h3>
                        <p className="text-gray-600 text-sm line-clamp-3">
                          {relatedPost.excerpt}
                        </p>
                        <div className="mt-4 text-sm text-brand-600 font-medium">
                          Baca selengkapnya →
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-brand-600 to-blue-600 text-white section-padding">
        <div className="container-custom text-center">
          <h2 className="text-3xl font-bold mb-4">
            Butuh Bantuan Perjalanan?
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto text-blue-100">
            Tim ahli travel kami siap membantu Anda merencanakan perjalanan impian
          </p>
          <Button
            size="lg"
            className="bg-white text-brand-600 hover:bg-gray-100 font-semibold px-8"
            onClick={() => {
              const chatButton = document.querySelector('[data-chat-button="true"]') as HTMLElement
              if (chatButton) {
                chatButton.click()
              }
            }}
          >
            Konsultasi Gratis
          </Button>
        </div>
      </section>
    </div>
  )
}