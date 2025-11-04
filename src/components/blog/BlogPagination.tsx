'use client'

import Link from 'next/link'
import { ChevronLeft, ChevronRight, MoreHorizontal } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface BlogPaginationProps {
  currentPage: number
  totalPages: number
  category?: string
  tag?: string
  search?: string
}

export function BlogPagination({
  currentPage,
  totalPages,
  category,
  tag,
  search
}: BlogPaginationProps) {
  const createPageUrl = (page: number) => {
    const params = new URLSearchParams()

    if (page > 1) params.set('page', page.toString())
    if (category) params.set('category', category)
    if (tag) params.set('tag', tag)
    if (search) params.set('search', search)

    const queryString = params.toString()
    return queryString ? `/blog?${queryString}` : '/blog'
  }

  const getVisiblePages = () => {
    const delta = 2 // Number of pages to show on each side of current page
    const range = []
    const rangeWithDots: any[] = []
    let l: number | undefined

    for (let i = 1; i <= totalPages; i++) {
      if (i === 1 || i === totalPages || (i >= currentPage - delta && i <= currentPage + delta)) {
        range.push(i)
      }
    }

    range.forEach((i) => {
      if (l) {
        if (i - l === 2) {
          rangeWithDots.push(l + 1)
        } else if (i - l !== 1) {
          rangeWithDots.push('...')
        }
      }
      rangeWithDots.push(i)
      l = i
    })

    return rangeWithDots
  }

  if (totalPages <= 1) return null

  const visiblePages = getVisiblePages()

  return (
    <div className="flex items-center justify-center space-x-1">
      {/* Previous Button */}
      <Button
        variant="outline"
        size="sm"
        asChild
        disabled={currentPage === 1}
        className={cn(
          "flex items-center gap-1",
          currentPage === 1 && "opacity-50 cursor-not-allowed"
        )}
      >
        <Link href={createPageUrl(currentPage - 1)}>
          <ChevronLeft className="w-4 h-4" />
          Previous
        </Link>
      </Button>

      {/* Page Numbers */}
      {visiblePages.map((page, index) => (
        <div key={index}>
          {page === '...' ? (
            <div className="flex items-center justify-center w-8 h-8">
              <MoreHorizontal className="w-4 h-4 text-gray-400" />
            </div>
          ) : (
            <Button
              variant={currentPage === page ? "default" : "outline"}
              size="sm"
              asChild
              className={cn(
                "w-8 h-8 p-0",
                currentPage === page
                  ? "bg-brand-600 hover:bg-brand-700 text-white"
                  : "hover:bg-brand-50 hover:text-brand-600 hover:border-brand-300"
              )}
            >
              <Link href={createPageUrl(page as number)}>
                {page}
              </Link>
            </Button>
          )}
        </div>
      ))}

      {/* Next Button */}
      <Button
        variant="outline"
        size="sm"
        asChild
        disabled={currentPage === totalPages}
        className={cn(
          "flex items-center gap-1",
          currentPage === totalPages && "opacity-50 cursor-not-allowed"
        )}
      >
        <Link href={createPageUrl(currentPage + 1)}>
          Next
          <ChevronRight className="w-4 h-4" />
        </Link>
      </Button>
    </div>
  )
}