import { supabase } from '@/lib/supabase'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import { Location } from '@/types'

interface ArtworkPageProps {
  params: {
    id: string
  }
}

export default async function ArtworkPage({ params }: ArtworkPageProps) {
  const { data: artwork, error } = await supabase
    .from('locations')
    .select('*')
    .eq('id', params.id)
    .single()

  if (error || !artwork) {
    notFound()
  }

  return (
    <main className="min-h-screen p-8 bg-gray-100">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {artwork.photos?.[0] && (
            <div className="relative w-full h-96">
              <Image
                src={artwork.photos[0]}
                alt={artwork.name}
                fill
                className="object-cover"
              />
            </div>
          )}
          <div className="p-6">
            <h1 className="text-3xl font-bold mb-4">{artwork.name}</h1>
            <p className="text-gray-600 mb-6">{artwork.description}</p>
            
            {artwork.tags && artwork.tags.length > 0 && (
              <div className="mb-6">
                <h2 className="text-xl font-semibold mb-3">Tags</h2>
                <div className="flex flex-wrap gap-2">
                  {artwork.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {artwork.metadata && (
              <div>
                <h2 className="text-xl font-semibold mb-3">Additional Information</h2>
                <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {artwork.metadata.source && (
                    <div>
                      <dt className="text-gray-600">Source</dt>
                      <dd className="font-medium">{artwork.metadata.source}</dd>
                    </div>
                  )}
                  {artwork.metadata.department && (
                    <div>
                      <dt className="text-gray-600">Department</dt>
                      <dd className="font-medium">{artwork.metadata.department}</dd>
                    </div>
                  )}
                  {artwork.metadata.date && (
                    <div>
                      <dt className="text-gray-600">Date</dt>
                      <dd className="font-medium">{artwork.metadata.date}</dd>
                    </div>
                  )}
                  {artwork.metadata.culture && (
                    <div>
                      <dt className="text-gray-600">Culture</dt>
                      <dd className="font-medium">{artwork.metadata.culture}</dd>
                    </div>
                  )}
                  {artwork.metadata.medium && (
                    <div>
                      <dt className="text-gray-600">Medium</dt>
                      <dd className="font-medium">{artwork.metadata.medium}</dd>
                    </div>
                  )}
                  {artwork.metadata.type && (
                    <div>
                      <dt className="text-gray-600">Type</dt>
                      <dd className="font-medium">{artwork.metadata.type}</dd>
                    </div>
                  )}
                </dl>
              </div>
            )}

            {artwork.metadata?.url && (
              <div className="mt-8">
                <a
                  href={artwork.metadata.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                >
                  View Source
                  <svg
                    className="ml-2 w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                    />
                  </svg>
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  )
}
