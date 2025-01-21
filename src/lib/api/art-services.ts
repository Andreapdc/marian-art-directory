import { supabase, supabaseAdmin } from '@/lib/supabase'

interface WikimediaArtwork {
  title: string
  pageid: number
  extract: string
  thumbnail?: {
    source: string
    width: number
    height: number
  }
  terms?: {
    description?: string[]
    label?: string[]
  }
  categories?: Array<{
    title: string
  }>
}

interface SearchResult {
  pageid: number
  title: string
}

interface WikimediaSearchResponse {
  query: {
    search: SearchResult[]
  }
}

interface MetArtwork {
  objectID: number
  title: string
  objectName: string
  primaryImage: string
  additionalImages: string[]
  department: string
  culture: string
  period: string
  objectDate: string
}

interface ChicagoArtwork {
  id: number
  title: string
  description: string | null
  image_id: string
  date_display: string
  place_of_origin: string
  medium_display: string
  artwork_type_title: string
}

interface Artwork {
  name: string
  description: string
  photos: string[]
  tags: string[]
  metadata: {
    source: string
    id: number
    url?: string
    department?: string
    date?: string
    culture?: string
    medium?: string
    type?: string
  }
}

export async function fetchWikimediaArt(limit = 10): Promise<Artwork[]> {
  console.log('Fetching Wikimedia art data...')
  try {
    // First search for art-related pages
    const searchResponse = await fetch(
      `https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=art%20museum%20painting%20sculpture&format=json&origin=*&srlimit=${limit}`
    )
    
    if (!searchResponse.ok) {
      throw new Error(`Wikimedia search API responded with status: ${searchResponse.status}`)
    }
    
    const searchData = (await searchResponse.json()) as WikimediaSearchResponse
    const pageIds = searchData.query.search.map(result => result.pageid).join('|')

    // Then get detailed information for each page
    const detailsResponse = await fetch(
      `https://en.wikipedia.org/w/api.php?action=query&format=json&origin=*&prop=extracts|pageimages|pageterms|categories&exintro=1&pithumbsize=1000&pilimit=${limit}&pageids=${pageIds}`
    )

    if (!detailsResponse.ok) {
      throw new Error(`Wikimedia details API responded with status: ${detailsResponse.status}`)
    }

    const detailsData = await detailsResponse.json()
    const pages = Object.values(detailsData.query.pages) as WikimediaArtwork[]

    return pages.map(page => ({
      name: page.title.replace(/_/g, ' '),
      description: page.extract || page.terms?.description?.[0] || 'No description available',
      photos: page.thumbnail ? [page.thumbnail.source] : [],
      tags: page.categories
        ?.map(cat => cat.title.replace('Category:', '').replace(/_/g, ' '))
        .filter(cat => !cat.includes('Articles') && !cat.includes('Pages'))
        || [],
      metadata: {
        source: 'wikimedia',
        id: page.pageid,
        url: `https://en.wikipedia.org/wiki/${encodeURIComponent(page.title)}`
      }
    }))
  } catch (error) {
    console.error('Error fetching Wikimedia art data:', error)
    throw new Error(`Wikimedia API error: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}

export async function fetchMetArt(limit = 10): Promise<Artwork[]> {
  console.log('Fetching Met Art data...')
  try {
    const searchResponse = await fetch(
      `https://collectionapi.metmuseum.org/public/collection/v1/search?hasImages=true&q=art`
    )
    
    if (!searchResponse.ok) {
      throw new Error(`Met API search responded with status: ${searchResponse.status}`)
    }
    
    const { objectIDs } = await searchResponse.json()
    const selectedIds = objectIDs.slice(0, limit)
    
    const artworks = await Promise.all(
      selectedIds.map(async (id: number) => {
        const response = await fetch(
          `https://collectionapi.metmuseum.org/public/collection/v1/objects/${id}`
        )
        if (!response.ok) {
          console.warn(`Failed to fetch Met artwork ${id}`)
          return null
        }
        return response.json()
      })
    )
    
    return artworks
      .filter((artwork): artwork is MetArtwork => artwork !== null)
      .map((artwork) => ({
        name: artwork.title,
        description: `${artwork.objectName} from ${artwork.department}`,
        photos: [
          artwork.primaryImage,
          ...artwork.additionalImages
        ].filter(Boolean),
        tags: [
          artwork.department,
          artwork.culture,
          artwork.period,
          artwork.objectDate
        ].filter(Boolean),
        metadata: {
          source: 'met',
          id: artwork.objectID,
          department: artwork.department,
          date: artwork.objectDate,
          culture: artwork.culture
        }
      }))
  } catch (error) {
    console.error('Error fetching Met Art data:', error)
    throw new Error(`Met Art API error: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}

export async function fetchChicagoArt(limit = 10): Promise<Artwork[]> {
  console.log('Fetching Chicago Art data...')
  try {
    const response = await fetch(
      `https://api.artic.edu/api/v1/artworks?limit=${limit}&fields=id,title,description,image_id,date_display,place_of_origin,medium_display,artwork_type_title`
    )
    
    if (!response.ok) {
      throw new Error(`Chicago API responded with status: ${response.status}`)
    }
    
    const data = await response.json()
    return data.data.map((artwork: ChicagoArtwork) => ({
      name: artwork.title,
      description: artwork.description || `${artwork.artwork_type_title} from ${artwork.place_of_origin}`,
      photos: artwork.image_id ? [
        `https://www.artic.edu/iiif/2/${artwork.image_id}/full/843,/0/default.jpg`
      ] : [],
      tags: [
        artwork.artwork_type_title,
        artwork.place_of_origin,
        artwork.medium_display,
        artwork.date_display
      ].filter(Boolean),
      metadata: {
        source: 'chicago',
        id: artwork.id,
        date: artwork.date_display,
        medium: artwork.medium_display,
        type: artwork.artwork_type_title
      }
    }))
  } catch (error) {
    console.error('Error fetching Chicago Art data:', error)
    throw new Error(`Chicago Art API error: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}

export async function syncArtData(): Promise<{
  total: number
  new: number
  sources: {
    wikimedia: number
    met: number
    chicago: number
  }
}> {
  console.log('Starting art data sync...')
  try {
    const [wikiArt, metArt, chicagoArt] = await Promise.all([
      fetchWikimediaArt(10).catch(error => {
        console.error('Wikimedia Art fetch failed:', error)
        return []
      }),
      fetchMetArt(10).catch(error => {
        console.error('Met Art fetch failed:', error)
        return []
      }),
      fetchChicagoArt(10).catch(error => {
        console.error('Chicago Art fetch failed:', error)
        return []
      })
    ])

    const allArtworks = [...wikiArt, ...metArt, ...chicagoArt]
    console.log(`Fetched ${allArtworks.length} total artworks`)

    const { data: existingArtworks, error: fetchError } = await supabaseAdmin
      .from('locations')
      .select('metadata->source, metadata->id')

    if (fetchError) {
      throw new Error(`Failed to fetch existing artworks: ${fetchError.message}`)
    }

    const newArtworks = allArtworks.filter(artwork => {
      return !existingArtworks?.some(
        existing => 
          existing.metadata?.source === artwork.metadata.source && 
          existing.metadata?.id === artwork.metadata.id
      )
    })

    console.log(`Found ${newArtworks.length} new artworks to insert`)

    if (newArtworks.length > 0) {
      const { error: insertError } = await supabaseAdmin
        .from('locations')
        .insert(newArtworks)

      if (insertError) {
        throw new Error(`Failed to insert new artworks: ${insertError.message}`)
      }
    }

    return {
      total: allArtworks.length,
      new: newArtworks.length,
      sources: {
        wikimedia: wikiArt.length,
        met: metArt.length,
        chicago: chicagoArt.length
      }
    }
  } catch (error) {
    console.error('Error in syncArtData:', error)
    throw error
  }
}

export async function searchArtworks(query: string): Promise<Artwork[]> {
  console.log('Searching artworks:', query)
  try {
    const { data: locations, error } = await supabase
      .from('locations')
      .select('*')
      .or(`name.ilike.%${query}%, description.ilike.%${query}%`)
      .order('created_at', { ascending: false })

    if (error) {
      throw error
    }

    return locations || []
  } catch (error) {
    console.error('Error searching artworks:', error)
    throw new Error(`Search error: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}
