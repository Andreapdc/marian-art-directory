'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import { useDebounce } from 'use-debounce'
import { supabase } from '@/lib/supabase'

interface Location {
  id: string
  name: string
  description: string
  photos: string[]
  tags: string[]
  metadata: Record<string, any>
}

export default function Home() {
  const [searchQuery, setSearchQuery] = useState('')
  const [locations, setLocations] = useState<Location[]>([])
  const [loading, setLoading] = useState(true)
  const [debouncedQuery] = useDebounce(searchQuery, 300)

  useEffect(() => {
    async function fetchLocations() {
      try {
        setLoading(true)
        const response = await fetch(`/api/search?q=${encodeURIComponent(debouncedQuery)}`)
        const data = await response.json()
        setLocations(data)
      } catch (error) {
        console.error('Error fetching locations:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchLocations()
  }, [debouncedQuery])

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
        <main className="flex min-h-screen flex-col items-center p-8">
          <div className="z-10 max-w-7xl w-full">
            {/* Hero Section */}
            <div className="text-center mb-16">
              <h1 className="text-4xl font-bold tracking-tight sm:text-6xl mb-4">
                Discover Cultural Treasures
              </h1>
              <p className="text-lg leading-8 text-gray-600 max-w-2xl mx-auto">
                Explore authentic local experiences and world-renowned artworks, curated by AI and human expertise.
              </p>
            </div>

            {/* Search and Filters */}
            <div className="mb-12">
              <div className="flex gap-4 max-w-2xl mx-auto">
                <input
                  type="text"
                  placeholder="Search artworks, exhibitions, or cultural sites..."
                  className="flex-1 rounded-lg border border-gray-300 px-4 py-2"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>

            {/* Featured Sections */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
              {loading ? (
                // Loading skeletons
                Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="rounded-lg border bg-white p-6 shadow-sm animate-pulse">
                    <div className="aspect-[16/9] relative mb-4 bg-gray-200 rounded-md" />
                    <div className="h-6 bg-gray-200 rounded mb-2" />
                    <div className="h-4 bg-gray-200 rounded mb-2" />
                    <div className="h-4 bg-gray-200 rounded w-2/3" />
                  </div>
                ))
              ) : locations.length > 0 ? (
                locations.map((location) => (
                  <Link
                    key={location.id}
                    href={`/artwork/${location.id}`}
                    className="rounded-lg border bg-white p-6 shadow-sm hover:shadow-md transition-shadow"
                  >
                    {location.photos && location.photos[0] && (
                      <div className="aspect-[16/9] relative mb-4">
                        <Image
                          src={location.photos[0]}
                          alt={location.name}
                          fill
                          className="object-cover rounded-md"
                        />
                      </div>
                    )}
                    <h3 className="text-xl font-semibold mb-2">{location.name}</h3>
                    <p className="text-gray-600 line-clamp-3">{location.description}</p>
                    {location.tags && location.tags.length > 0 && (
                      <div className="flex gap-2 mt-4 flex-wrap">
                        {location.tags.map((tag) => (
                          <span
                            key={tag}
                            className="px-2 py-1 bg-gray-100 rounded-full text-sm text-gray-600"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </Link>
                ))
              ) : (
                <div className="col-span-full text-center py-12">
                  <p className="text-gray-500">No artworks found. Try a different search term.</p>
                </div>
              )}
            </div>

            {/* Categories Section */}
            <div className="mb-16">
              <h2 className="text-2xl font-bold mb-6">Browse by Category</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {['Paintings', 'Sculptures', 'Photography', 'Decorative Arts'].map((category) => (
                  <button
                    key={category}
                    className="p-4 text-center rounded-lg border hover:bg-gray-50"
                    onClick={() => setSearchQuery(category)}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>

            {/* Museums Section */}
            <div>
              <h2 className="text-2xl font-bold mb-6">Featured Museums</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="rounded-lg border bg-white p-6 shadow-sm">
                  <h3 className="text-lg font-semibold mb-2">The Metropolitan Museum of Art</h3>
                  <p className="text-gray-600">
                    Explore over 470,000 artworks from one of the world's largest and most comprehensive art museums.
                  </p>
                </div>
                <div className="rounded-lg border bg-white p-6 shadow-sm">
                  <h3 className="text-lg font-semibold mb-2">Art Institute of Chicago</h3>
                  <p className="text-gray-600">
                    Discover a vast collection of impressionist art and American paintings in this renowned institution.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </main>
      </main>
      <footer className="row-start-3 flex gap-6 flex-wrap items-center justify-center">
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://nextjs.org/learn?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/file.svg"
            alt="File icon"
            width={16}
            height={16}
          />
          Learn
        </a>
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://vercel.com/templates?framework=next.js&utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/window.svg"
            alt="Window icon"
            width={16}
            height={16}
          />
          Examples
        </a>
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://nextjs.org?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/globe.svg"
            alt="Globe icon"
            width={16}
            height={16}
          />
          Go to nextjs.org →
        </a>
      </footer>
    </div>
  )
}
