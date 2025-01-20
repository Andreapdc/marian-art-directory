import { supabase } from '../supabase'

const MET_API_BASE_URL = 'https://collectionapi.metmuseum.org/public/collection/v1'
const CHICAGO_API_BASE_URL = 'https://api.artic.edu/api/v1'
const HARVARD_API_BASE_URL = 'https://api.harvardartmuseums.org'
const HARVARD_API_KEY = process.env.HARVARD_API_KEY || 'YOUR_API_KEY' // You'll need to get this from Harvard

export interface MetArtwork {
  objectID: number
  title: string
  artistDisplayName: string
  primaryImage: string
  department: string
  objectDate: string
  period: string
  medium: string
  dimensions: string
}

export interface ChicagoArtwork {
  id: number
  title: string
  artist_display: string
  image_id: string
  date_display: string
  medium_display: string
  dimensions: string
}

export interface HarvardArtwork {
  id: number
  title: string
  primaryimageurl: string
  people: Array<{ name: string; role: string }>
  dated: string
  medium: string
  technique: string
  division: string
}

export async function fetchMetArtworks(searchTerm?: string) {
  try {
    // First get object IDs
    const searchUrl = searchTerm
      ? `${MET_API_BASE_URL}/search?q=${encodeURIComponent(searchTerm)}&hasImages=true`
      : `${MET_API_BASE_URL}/objects?hasImages=true`
    
    const response = await fetch(searchUrl)
    const data = await response.json()
    const objectIDs = data.objectIDs?.slice(0, 20) || []

    // Then fetch details for each object
    const artworks = await Promise.all(
      objectIDs.map(async (id: number) => {
        const detailResponse = await fetch(`${MET_API_BASE_URL}/objects/${id}`)
        return detailResponse.json()
      })
    )

    // Store in Supabase
    const { error } = await supabase.from('locations').upsert(
      artworks.map(artwork => ({
        name: artwork.title,
        description: `${artwork.artistDisplayName ? `By ${artwork.artistDisplayName}. ` : ''}${artwork.medium || ''} (${artwork.objectDate || 'Date unknown'})`,
        photos: artwork.primaryImage ? [artwork.primaryImage] : [],
        tags: [artwork.department, artwork.period].filter(Boolean),
        metadata: {
          source: 'met',
          objectID: artwork.objectID,
          dimensions: artwork.dimensions
        }
      })),
      { onConflict: 'name' }
    )

    if (error) throw error
    return artworks
  } catch (error) {
    console.error('Error fetching Met artworks:', error)
    throw error
  }
}

export async function fetchChicagoArtworks(searchTerm?: string) {
  try {
    const searchUrl = `${CHICAGO_API_BASE_URL}/artworks/search${
      searchTerm ? `?q=${encodeURIComponent(searchTerm)}` : ''
    }`
    
    const response = await fetch(searchUrl)
    const data = await response.json()
    
    const artworks = data.data || []

    // Store in Supabase
    const { error } = await supabase.from('locations').upsert(
      artworks.map((artwork: ChicagoArtwork) => ({
        name: artwork.title,
        description: `${artwork.artist_display}. ${artwork.medium_display || ''} (${artwork.date_display || 'Date unknown'})`,
        photos: artwork.image_id ? [`https://www.artic.edu/iiif/2/${artwork.image_id}/full/843,/0/default.jpg`] : [],
        tags: ['Art Institute of Chicago'],
        metadata: {
          source: 'chicago',
          artworkId: artwork.id,
          dimensions: artwork.dimensions
        }
      })),
      { onConflict: 'name' }
    )

    if (error) throw error
    return artworks
  } catch (error) {
    console.error('Error fetching Chicago artworks:', error)
    throw error
  }
}

export async function fetchHarvardArtworks(searchTerm?: string) {
  try {
    const searchUrl = `${HARVARD_API_BASE_URL}/object${
      searchTerm ? `?q=${encodeURIComponent(searchTerm)}` : ''
    }&apikey=${HARVARD_API_KEY}&hasimage=1&size=20`
    
    const response = await fetch(searchUrl)
    const data = await response.json()
    
    const artworks = data.records || []

    // Store in Supabase
    const { error } = await supabase.from('locations').upsert(
      artworks.map((artwork: HarvardArtwork) => ({
        name: artwork.title,
        description: `${artwork.people?.map(p => `${p.role}: ${p.name}`).join(', ') || 'Unknown artist'}. ${artwork.medium || ''} (${artwork.dated || 'Date unknown'})`,
        photos: artwork.primaryimageurl ? [artwork.primaryimageurl] : [],
        tags: [artwork.division, artwork.technique].filter(Boolean),
        metadata: {
          source: 'harvard',
          artworkId: artwork.id,
          technique: artwork.technique
        }
      })),
      { onConflict: 'name' }
    )

    if (error) throw error
    return artworks
  } catch (error) {
    console.error('Error fetching Harvard artworks:', error)
    throw error
  }
}

export async function syncArtData() {
  await Promise.all([
    fetchMetArtworks(),
    fetchChicagoArtworks(),
    fetchHarvardArtworks()
  ])
}
