'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Search, X } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

export function BlogSearch() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [query, setQuery] = useState(searchParams?.get('search') || '')
  const [suggestions, setSuggestions] = useState<string[]>([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [isSearching, setIsSearching] = useState(false)
  const searchRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // Sample popular search terms - in production, this would come from API
  const popularSearches = [
    'paket umroh 2025',
    'travel Jakarta Bali',
    'tips backpacker',
    'wisata halal Indonesia',
    'hotel murah Jakarta',
    'panduan visa',
    'tempat wisata Bandung',
    'paket liburan keluarga'
  ]

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSuggestions(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  useEffect(() => {
    const delayedSearch = setTimeout(() => {
      if (query.length > 2) {
        // Filter suggestions based on input
        const filtered = popularSearches.filter(search =>
          search.toLowerCase().includes(query.toLowerCase())
        )
        setSuggestions(filtered)
        setShowSuggestions(true)
      } else {
        setSuggestions([])
        setShowSuggestions(false)
      }
    }, 300)

    return () => clearTimeout(delayedSearch)
  }, [query])

  const handleSearch = (searchTerm: string = query) => {
    if (searchTerm.trim()) {
      setIsSearching(true)
      const params = new URLSearchParams(searchParams?.toString() || '')

      if (searchTerm.trim()) {
        params.set('search', searchTerm.trim())
      } else {
        params.delete('search')
      }

      params.delete('page') // Reset to first page when searching

      router.push(`/blog?${params.toString()}`)
      setShowSuggestions(false)

      // Reset searching state after a short delay
      setTimeout(() => setIsSearching(false), 500)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch()
    } else if (e.key === 'Escape') {
      setShowSuggestions(false)
      inputRef.current?.blur()
    }
  }

  const handleSuggestionClick = (suggestion: string) => {
    setQuery(suggestion)
    handleSearch(suggestion)
  }

  const handleClear = () => {
    setQuery('')
    setSuggestions([])
    setShowSuggestions(false)
    inputRef.current?.focus()

    // Clear search from URL
    const params = new URLSearchParams(searchParams?.toString() || '')
    params.delete('search')
    params.delete('page')
    router.push(`/blog${params.toString() ? '?' + params.toString() : ''}`)
  }

  return (
    <div ref={searchRef} className="relative w-full max-w-2xl">
      <div className="relative">
        <Input
          ref={inputRef}
          type="text"
          placeholder="Cari artikel travel, tips, atau panduan..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => query.length > 2 && setShowSuggestions(true)}
          className="w-full pl-12 pr-24 h-14 text-base bg-white/95 backdrop-blur-sm border-white/20 focus:border-white/40 focus:bg-white transition-all duration-200 rounded-lg shadow-lg"
          disabled={isSearching}
        />

        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />

        <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center gap-1">
          {query && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={handleClear}
              className="h-8 w-8 p-0 hover:bg-gray-100 transition-colors"
            >
              <X className="w-4 h-4 text-gray-500" />
            </Button>
          )}

          <Button
            onClick={() => handleSearch()}
            disabled={isSearching || !query.trim()}
            className="h-8 px-3 bg-brand-600 hover:bg-brand-700 text-white text-sm font-medium transition-colors rounded-md"
          >
            {isSearching ? 'Mencari...' : 'Cari'}
          </Button>
        </div>
      </div>

      {/* Search Suggestions */}
      {showSuggestions && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg shadow-xl border border-gray-200 z-50 max-h-64 overflow-y-auto">
          {suggestions.length > 0 ? (
            <div className="p-2">
              <p className="text-xs text-gray-500 font-medium px-3 py-2">Saran pencarian:</p>
              {suggestions.map((suggestion, index) => (
                <button
                  key={index}
                  onClick={() => handleSuggestionClick(suggestion)}
                  className="w-full text-left px-3 py-2 hover:bg-gray-50 rounded-md transition-colors flex items-center gap-2 group"
                >
                  <Search className="w-4 h-4 text-gray-400 group-hover:text-brand-600" />
                  <span className="text-sm text-gray-700 group-hover:text-brand-600">
                    {suggestion}
                  </span>
                </button>
              ))}
            </div>
          ) : query.length > 2 ? (
            <div className="p-4 text-center">
              <p className="text-sm text-gray-500">Tidak ada saran untuk "{query}"</p>
            </div>
          ) : (
            <div className="p-4">
              <p className="text-xs text-gray-500 font-medium mb-2">Pencarian populer:</p>
              <div className="flex flex-wrap gap-2">
                {popularSearches.slice(0, 4).map((term, index) => (
                  <button
                    key={index}
                    onClick={() => handleSuggestionClick(term)}
                    className="px-3 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs rounded-full transition-colors"
                  >
                    {term}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}