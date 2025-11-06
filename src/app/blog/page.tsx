import { Metadata } from 'next'
import { blogApi } from '@/lib/supabase'
import { BlogPostCard } from '@/components/blog/BlogPostCard'
import { BlogPagination } from '@/components/blog/BlogPagination'
import { BlogSearch } from '@/components/blog/BlogSearch'
import { BlogCategories } from '@/components/blog/BlogCategories'
import { ConsultationButton } from '@/components/blog/ConsultationButton'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Search, Star } from 'lucide-react'
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
      <section className="section-padding bg-gradient-to-br from-jni-600 via-jni-700 to-jni-800 text-white relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Ccircle cx='30' cy='30' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}></div>
        </div>

        <div className="container-custom relative">
          <div className="text-center max-w-5xl mx-auto py-12 md:py-16">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-medium text-blue-100 mb-6">
              <Star className="w-4 h-4" />
              <span>Blog Travel & Bisnis Terpercaya</span>
            </div>

            {/* Main Title */}
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
              Blog <span className="text-transparent bg-clip-text bg-gradient-to-r from-jni-100 to-white">Travel Indonesia</span>
            </h1>

            {/* Subtitle */}
            <p className="text-xl md:text-2xl lg:text-3xl mb-12 text-jni-100 max-w-3xl mx-auto leading-relaxed font-light">
              Tips, Panduan, dan Informasi Perjalanan Terpercaya untuk Perjalanan Spiritual dan Bisnis Anda
            </p>

            {/* Search Bar */}
            <div className="max-w-2xl mx-auto">
              <Suspense fallback={
                <div className="h-16 bg-white/20 backdrop-blur-sm rounded-2xl animate-pulse shadow-2xl"></div>
              }>
                <BlogSearch />
              </Suspense>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16 max-w-4xl mx-auto">
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-white mb-2">500+</div>
                <div className="text-jni-100 text-sm md:text-base">Artikel Bermanfaat</div>
              </div>
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-white mb-2">50K+</div>
                <div className="text-jni-100 text-sm md:text-base">Pembaca Setia</div>
              </div>
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-white mb-2">6+</div>
                <div className="text-jni-100 text-sm md:text-base">Tahun Pengalaman</div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Gradient Fade */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-gray-50 to-transparent"></div>
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
      <section className="section-padding bg-gradient-to-r from-jni-600 to-jni-700 text-white">
        <div className="container-custom text-center">
          <h2 className="text-3xl font-bold mb-4">
            Butuh Bantuan Perjalanan Anda?
          </h2>
          <p className="text-xl mb-8 text-jni-100 max-w-2xl mx-auto">
            Tim ahli travel kami siap membantu Anda merencanakan perjalanan impian
          </p>
          <ConsultationButton />
        </div>
      </section>
    </div>
  )
}