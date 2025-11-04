import { Metadata } from 'next'
import { blogApi } from '@/lib/supabase'
import { BlogPostCard } from '@/components/blog/BlogPostCard'
import { BlogPagination } from '@/components/blog/BlogPagination'
import { BlogSearch } from '@/components/blog/BlogSearch'
import { BlogCategories } from '@/components/blog/BlogCategories'
import { ConsultationButton } from '@/components/blog/ConsultationButton'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Search } from 'lucide-react'
import { Suspense } from 'react'

interface BlogPageProps {
  searchParams: Promise<{
    page?: string
    category?: string
    tag?: string
    search?: string
  }>
}

export const revalidate = 3600 // Revalidate every hour

export async function generateMetadata({ searchParams }: BlogPageProps): Promise<Metadata> {
  const resolvedSearchParams = await searchParams
  const page = parseInt(resolvedSearchParams.page || '1')
  const category = resolvedSearchParams.category
  const tag = resolvedSearchParams.tag
  const search = resolvedSearchParams.search

  const title = search
    ? `Hasil Pencarian: "${search}" | Blog Travel Indonesia`
    : category
    ? `Artikel ${category} | Blog Travel Indonesia`
    : 'Blog Travel Indonesia - Tips & Informasi Perjalanan'

  const description = search
    ? `Temukan ${page} artikel tentang "${search}" untuk membantu perjalanan travel Anda.`
    : 'Blog Travel Indonesia menyediakan tips, panduan, dan informasi lengkap tentang perjalanan, umroh, dan wisata.'

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'website',
      url: `/blog${search ? `?search=${encodeURIComponent(search)}` : category ? `?category=${category}` : tag ? `?tag=${tag}` : page > 1 ? `?page=${page}` : ''}`
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description
    },
    alternates: {
      canonical: '/blog'
    }
  }
}

async function getPosts(searchParams: BlogPageProps['searchParams']) {
  const resolvedSearchParams = await searchParams
  const page = parseInt(resolvedSearchParams.page || '1')
  const limit = 12
  const offset = (page - 1) * limit

  return await blogApi.getPosts({
    limit,
    offset,
    category: resolvedSearchParams.category,
    tag: resolvedSearchParams.tag,
    search: resolvedSearchParams.search,
    status: 'published'
  })
}

async function getCategories() {
  return await blogApi.getCategories()
}

export default async function BlogPage({ searchParams }: BlogPageProps) {
  const resolvedSearchParams = await searchParams
  const [posts, categories] = await Promise.all([
    getPosts(searchParams),
    getCategories()
  ])

  const currentPage = parseInt(resolvedSearchParams.page || '1')
  const totalPages = Math.ceil(posts.length / 12)

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Section */}
      <section className="section-padding bg-gradient-to-br from-brand-600 to-blue-600 text-white">
        <div className="container-custom">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Blog Travel Indonesia
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-blue-100">
              Tips, Panduan, dan Informasi Perjalanan Terpercaya
            </p>

            {/* Search Bar */}
            <Suspense fallback={<div className="h-12 bg-white/20 rounded-lg animate-pulse" />}>
              <BlogSearch />
            </Suspense>
          </div>
        </div>
      </section>

      {/* Categories Filter */}
      <section className="section-padding">
        <div className="container-custom">
          <Suspense fallback={<div className="h-24 bg-gray-100 rounded-lg animate-pulse" />}>
            <BlogCategories
              categories={categories}
              activeCategory={resolvedSearchParams.category}
            />
          </Suspense>
        </div>
      </section>

      {/* Blog Posts */}
      <section className="section-padding">
        <div className="container-custom">
          {posts.length === 0 ? (
            <div className="text-center py-16">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
                <Search className="w-8 h-8 text-gray-400" />
              </div>
              <h2 className="text-2xl font-semibold text-gray-600 mb-2">
                Belum Ada Artikel
              </h2>
              <p className="text-gray-500 max-w-md mx-auto">
                {resolvedSearchParams.search
                  ? `Tidak ada hasil untuk "${resolvedSearchParams.search}"`
                  : 'Belum ada artikel yang dipublikas. Silakan coba lagi nanti.'
                }
              </p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
                {posts.map((post) => (
                  <BlogPostCard key={post.id} post={post} />
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center mt-8">
                  <Suspense fallback={<div className="h-12 bg-gray-100 rounded-lg animate-pulse w-64" />}>
                    <BlogPagination
                      currentPage={currentPage}
                      totalPages={totalPages}
                      category={resolvedSearchParams.category}
                      tag={resolvedSearchParams.tag}
                      search={resolvedSearchParams.search}
                    />
                  </Suspense>
                </div>
              )}
            </>
          )}
        </div>
      </section>

      {/* Call to Action */}
      <section className="section-padding bg-gradient-to-r from-brand-600 to-blue-600 text-white">
        <div className="container-custom text-center">
          <h2 className="text-3xl font-bold mb-4">
            Butuh Bantuan Perjalanan Anda?
          </h2>
          <p className="text-xl mb-8 text-blue-100 max-w-2xl mx-auto">
            Tim ahli travel kami siap membantu Anda merencanakan perjalanan impian
          </p>
          <ConsultationButton />
        </div>
      </section>
    </div>
  )
}