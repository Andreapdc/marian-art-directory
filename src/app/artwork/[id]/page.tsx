import Image from 'next/image'
import { notFound } from 'next/navigation'
import { supabase } from '@/lib/supabase'

async function getArtwork(id: string) {
  const { data: artwork } = await supabase
    .from('locations')
    .select('*')
    .eq('id', id)
    .single()

  if (!artwork) {
    notFound()
  }

  return artwork
}

export default async function ArtworkPage({
  params: { id },
}: {
  params: { id: string }
}) {
  const artwork = await getArtwork(id)

  return (
    <main className="min-h-screen p-8">
      <div className="max-w-5xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Image Section */}
          <div className="relative aspect-square">
            {artwork.photos?.[0] ? (
              <Image
                src={artwork.photos[0]}
                alt={artwork.name}
                fill
                className="object-contain rounded-lg"
                priority
              />
            ) : (
              <div className="w-full h-full bg-gray-100 rounded-lg flex items-center justify-center">
                <span className="text-gray-400">No image available</span>
              </div>
            )}
          </div>

          {/* Details Section */}
          <div>
            <h1 className="text-3xl font-bold mb-4">{artwork.name}</h1>
            <p className="text-gray-600 mb-6">{artwork.description}</p>

            {/* Tags */}
            {artwork.tags && artwork.tags.length > 0 && (
              <div className="mb-6">
                <h2 className="text-lg font-semibold mb-2">Categories</h2>
                <div className="flex gap-2 flex-wrap">
                  {artwork.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-3 py-1 bg-gray-100 rounded-full text-sm text-gray-600"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Metadata */}
            {artwork.metadata && (
              <div>
                <h2 className="text-lg font-semibold mb-2">Additional Information</h2>
                <dl className="grid grid-cols-2 gap-x-4 gap-y-2">
                  {Object.entries(artwork.metadata).map(([key, value]) => (
                    key !== 'source' && (
                      <>
                        <dt className="text-gray-600 capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</dt>
                        <dd className="font-medium">{String(value)}</dd>
                      </>
                    )
                  ))}
                </dl>
              </div>
            )}

            {/* Source Attribution */}
            <div className="mt-8 pt-6 border-t">
              <p className="text-sm text-gray-500">
                Source: {' '}
                {artwork.metadata?.source === 'met' && 'The Metropolitan Museum of Art'}
                {artwork.metadata?.source === 'chicago' && 'Art Institute of Chicago'}
                {artwork.metadata?.source === 'harvard' && 'Harvard Art Museums'}
              </p>
            </div>
          </div>
        </div>

        {/* Additional Images */}
        {artwork.photos && artwork.photos.length > 1 && (
          <div className="mt-12">
            <h2 className="text-2xl font-bold mb-4">Additional Images</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {artwork.photos.slice(1).map((photo, index) => (
                <div key={index} className="relative aspect-square">
                  <Image
                    src={photo}
                    alt={`${artwork.name} - Image ${index + 2}`}
                    fill
                    className="object-cover rounded-lg"
                  />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </main>
  )
}
