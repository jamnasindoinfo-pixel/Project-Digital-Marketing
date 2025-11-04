'use client'

import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { Tag, Filter } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

interface Category {
  id: string
  name: string
  slug: string
  description?: string
  color?: string
  post_count?: number
}

interface BlogCategoriesProps {
  categories: Category[]
  activeCategory?: string
}

export function BlogCategories({ categories, activeCategory }: BlogCategoriesProps) {
  const searchParams = useSearchParams()

  const createCategoryUrl = (categorySlug?: string) => {
    const params = new URLSearchParams(searchParams?.toString() || '')

    if (categorySlug) {
      params.set('category', categorySlug)
    } else {
      params.delete('category')
    }

    params.delete('page') // Reset to first page when changing category

    const queryString = params.toString()
    return queryString ? `/blog?${queryString}` : '/blog'
  }

  // Default categories if no categories provided
  const defaultCategories: Category[] = [
    { id: '1', name: 'Umroh', slug: 'umroh', post_count: 0 },
    { id: '2', name: 'Wisata Domestik', slug: 'wisata-domestik', post_count: 0 },
    { id: '3', name: 'Tips Travel', slug: 'tips-travel', post_count: 0 },
    { id: '4', name: 'Hotel & Akomodasi', slug: 'hotel-akomodasi', post_count: 0 },
    { id: '5', name: 'Kuliner', slug: 'kuliner', post_count: 0 },
    { id: '6', name: 'Panduan Visa', slug: 'panduan-visa', post_count: 0 }
  ]

  const displayCategories = categories.length > 0 ? categories : defaultCategories

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Filter className="w-5 h-5 text-brand-600" />
          <h3 className="text-lg font-semibold text-gray-900">Kategori</h3>
        </div>
        <Tag className="w-4 h-4 text-gray-400" />
      </div>

      <div className="flex flex-wrap gap-2">
        {/* All Categories Link */}
        <Link href={createCategoryUrl()}>
          <Button
            variant={!activeCategory ? "default" : "outline"}
            size="sm"
            className={!activeCategory
              ? "bg-brand-600 hover:bg-brand-700 text-white border-brand-600"
              : "hover:bg-brand-50 hover:text-brand-600 hover:border-brand-300 transition-colors"
            }
          >
            Semua Kategori
            <Badge variant="secondary" className="ml-2 bg-white/20 text-white">
              {displayCategories.reduce((sum, cat) => sum + (cat.post_count || 0), 0)}
            </Badge>
          </Button>
        </Link>

        {/* Individual Categories */}
        {displayCategories.map((category) => (
          <Link key={category.id} href={createCategoryUrl(category.slug)}>
            <Button
              variant={activeCategory === category.slug ? "default" : "outline"}
              size="sm"
              className={activeCategory === category.slug
                ? "bg-brand-600 hover:bg-brand-700 text-white border-brand-600"
                : "hover:bg-brand-50 hover:text-brand-600 hover:border-brand-300 transition-colors"
              }
              style={
                category.color && !activeCategory
                  ? { borderColor: category.color + '40', color: category.color }
                  : undefined
              }
            >
              {category.name}
              {category.post_count !== undefined && (
                <Badge variant="secondary" className="ml-2 bg-white/20 text-white">
                  {category.post_count}
                </Badge>
              )}
            </Button>
          </Link>
        ))}
      </div>

      {/* Category Description */}
      {activeCategory && (
        <div className="mt-4 p-3 bg-brand-50 rounded-lg border border-brand-200">
          <p className="text-sm text-brand-700">
            {displayCategories.find(cat => cat.slug === activeCategory)?.description ||
             `Menampilkan semua artikel dalam kategori "${displayCategories.find(cat => cat.slug === activeCategory)?.name}".`}
          </p>
        </div>
      )}

      {/* No Categories State */}
      {categories.length === 0 && (
        <div className="mt-4 text-center text-sm text-gray-500">
          <p>Kategori akan muncul setelah Anda membuat konten blog.</p>
        </div>
      )}
    </div>
  )
}