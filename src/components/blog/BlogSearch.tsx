'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Search, X, ChevronRight, Star } from 'lucide-react'
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
    <div ref={searchRef} className="relative w-full max-w-3xl">
      <div className="relative group">
        {/* Glow effect on focus */}
        <div className="absolute inset-0 bg-gradient-to-r from-jni-400 to-jni-500 rounded-2xl opacity-0 group-focus-within:opacity-20 transition-opacity duration-300 blur-xl"></div>

        <Input
          ref={inputRef}
          type="text"
          placeholder="Cari artikel travel, tips panduan umroh, atau informasi bisnis..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => query.length > 2 && setShowSuggestions(true)}
          className="relative w-full pl-14 pr-32 h-16 text-base text-gray-900 bg-white/98 backdrop-blur-sm border border-white/20 focus:border-jni-300 focus:bg-white focus:shadow-2xl transition-all duration-300 rounded-2xl shadow-lg placeholder:text-gray-400"
          disabled={isSearching}
        />

        <Search className="absolute left-5 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-jni-600 transition-colors duration-300" />

        <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center gap-2">
          {query && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={handleClear}
              className="h-10 w-10 p-0 hover:bg-gray-100 transition-all duration-200 rounded-xl"
            >
              <X className="w-4 h-4 text-gray-500 hover:text-gray-700" />
            </Button>
          )}

          <Button
            onClick={() => handleSearch()}
            disabled={isSearching || !query.trim()}
            className="h-10 px-6 bg-gradient-to-r from-jni-600 to-jni-700 hover:from-jni-700 hover:to-jni-800 text-white text-sm font-semibold transition-all duration-200 rounded-xl shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSearching ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Mencari...
              </div>
            ) : (
              <div className="flex items-center gap-2">
                Cari
                <Search className="w-4 h-4" />
              </div>
            )}
          </Button>
        </div>
      </div>

      {/* Search Suggestions */}
      {showSuggestions && (
        <div className="absolute top-full left-0 right-0 mt-3 bg-white/98 backdrop-blur-xl rounded-2xl shadow-2xl border border-gray-200/50 z-50 max-h-80 overflow-hidden">
          {suggestions.length > 0 ? (
            <div className="p-3">
              <div className="flex items-center gap-2 px-3 py-2 mb-2">
                <Search className="w-4 h-4 text-jni-600" />
                <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Saran Pencarian</p>
              </div>
              <div className="space-y-1">
                {suggestions.map((suggestion, index) => (
                  <button
                    key={index}
                    onClick={() => handleSuggestionClick(suggestion)}
                    className="w-full text-left px-4 py-3 hover:bg-jni-50 rounded-xl transition-all duration-200 flex items-center gap-3 group group/item"
                  >
                    <Search className="w-4 h-4 text-gray-400 group-hover:text-jni-600 transition-colors flex-shrink-0" />
                    <span className="text-sm text-gray-700 group-hover:text-jni-600 font-medium transition-colors">
                      {suggestion}
                    </span>
                    <div className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                      <ChevronRight className="w-4 h-4 text-jni-600" />
                    </div>
                  </button>
                ))}
              </div>
            </div>
          ) : query.length > 2 ? (
            <div className="p-6 text-center">
              <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Search className="w-6 h-6 text-gray-400" />
              </div>
              <p className="text-sm text-gray-500">Tidak ada saran untuk "<span className="font-medium text-gray-700">{query}</span>"</p>
            </div>
          ) : (
            <div className="p-4">
              <div className="flex items-center gap-2 px-3 py-2 mb-3">
                <Star className="w-4 h-4 text-jni-600" />
                <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Pencarian Populer</p>
              </div>
              <div className="flex flex-wrap gap-2">
                {popularSearches.slice(0, 6).map((term, index) => (
                  <button
                    key={index}
                    onClick={() => handleSuggestionClick(term)}
                    className="px-4 py-2 bg-gradient-to-r from-gray-50 to-gray-100 hover:from-jni-50 hover:to-jni-100 text-gray-700 hover:text-jni-700 text-xs font-medium rounded-full transition-all duration-200 border border-gray-200 hover:border-jni-200"
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