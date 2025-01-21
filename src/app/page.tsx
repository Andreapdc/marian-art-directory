'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import { useDebounce } from 'use-debounce'

interface Location {
  id: string
  name: string
  description: string
  photos: string[]
  tags: string[]
  metadata: {
    source: string
    id: string | number
    url?: string
  }
}

export default function Home() {
  const [searchQuery, setSearchQuery] = useState('')
  const [locations, setLocations] = useState<Location[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [debouncedQuery] = useDebounce(searchQuery, 300)

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        setLoading(true)
        setError(null)
        const response = await fetch(`/api/search?q=${encodeURIComponent(debouncedQuery)}`)
        if (!response.ok) {
          throw new Error('Failed to fetch locations')
        }
        const data = await response.json()
        setLocations(data)
      } catch (err) {
        console.error('Error fetching locations:', err)
        setError(err instanceof Error ? err.message : 'An error occurred')
      } finally {
        setLoading(false)
      }
    }

    fetchLocations()
  }, [debouncedQuery])

  return (
    <main className="min-h-screen p-8">
      <div className="max-w-7xl mx-auto">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold tracking-tight sm:text-6xl mb-4">
            Cultural Directory
          </h1>
          <p className="text-lg leading-8 text-gray-600 max-w-2xl mx-auto">
            Explore art and culture from Wikipedia, the Metropolitan Museum of Art, and the Art Institute of Chicago.
          </p>
        </div>

        {/* Search Section */}
        <div className="mb-12">
          <div className="max-w-2xl mx-auto">
            <div className="relative">
              <input
                type="text"
                placeholder="Search artworks, exhibitions, or cultural sites..."
                className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <div className="absolute right-3 top-3">
                <svg className="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {error && (
          <div className="mb-8 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        {loading ? (
          // Loading skeletons
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          </div>
        ) : locations.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            {locations.map((location) => (
              <Link
                key={location.id}
                href={location.metadata?.url || `/artwork/${location.id}`}
                target={location.metadata?.url ? "_blank" : "_self"}
                className="group rounded-lg border bg-white p-6 shadow-sm hover:shadow-md transition-all duration-200"
              >
                {location.photos && location.photos[0] && (
                  <div className="aspect-[16/9] relative mb-4 overflow-hidden rounded-md">
                    <Image
                      src={location.photos[0]}
                      alt={location.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-200"
                    />
                  </div>
                )}
                <h3 className="text-xl font-semibold mb-2 group-hover:text-blue-600 transition-colors">
                  {location.name}
                </h3>
                <p className="text-gray-600 line-clamp-3 mb-4">
                  {location.description}
                </p>
                {location.tags && location.tags.length > 0 && (
                  <div className="flex gap-2 flex-wrap">
                    {location.tags.slice(0, 3).map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-1 bg-gray-100 rounded-full text-sm text-gray-600"
                      >
                        {tag}
                      </span>
                    ))}
                    {location.tags.length > 3 && (
                      <span className="px-2 py-1 bg-gray-100 rounded-full text-sm text-gray-600">
                        +{location.tags.length - 3} more
                      </span>
                    )}
                  </div>
                )}
                <div className="mt-4 pt-4 border-t text-sm text-gray-500">
                  Source: {location.metadata?.source === 'wikimedia' ? 'Wikipedia' : 
                          location.metadata?.source === 'met' ? 'Metropolitan Museum of Art' :
                          location.metadata?.source === 'chicago' ? 'Art Institute of Chicago' : 
                          'Local Database'}
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="col-span-full text-center py-12">
            No artworks found. Try a different search term.
          </div>
        )}
      </div>
    </main>
  )
}
