import { createClient } from '@supabase/supabase-js'
import type { Property } from './properties'
import { getSupabaseConfig, hasSupabaseConfig } from './supabase/client'

type PropertyRow = {
  id: string
  slug: string
  name: string
  owner_company_name: string | null
  location: string
  price: number
  listing: 'buy' | 'rent'
  beds: number
  baths: number
  area: number
  style: string
  description: string
  features: string[]
  year_built: number
  lot_size: string
  image_urls: string[]
}

function toProperty(row: PropertyRow): Property {
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    ownerCompanyName: row.owner_company_name,
    location: row.location,
    price: Number(row.price),
    listing: row.listing,
    beds: row.beds,
    baths: Number(row.baths),
    area: row.area,
    style: row.style,
    visual: 'from-[#b8a27c] via-[#75876d] to-[#394f3d]',
    description: row.description,
    features: row.features,
    yearBuilt: row.year_built,
    lotSize: row.lot_size,
    imageUrls: row.image_urls,
  }
}

function getServerClient() {
  if (!hasSupabaseConfig()) return null

  const { url, key } = getSupabaseConfig()
  return createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  })
}

export async function getPublishedProperties(): Promise<Property[]> {
  const supabase = getServerClient()
  if (!supabase) return []

  const { data, error } = await supabase
    .from('properties')
    .select('id, slug, name, owner_company_name, location, price, listing, beds, baths, area, style, description, features, year_built, lot_size, image_urls')
    .eq('status', 'published')
    .order('created_at', { ascending: false })

  if (error) throw new Error(`Unable to load published properties: ${error.message}`)
  return (data as PropertyRow[]).map(toProperty)
}

export async function getPublishedPropertyBySlug(slug: string): Promise<Property | undefined> {
  const supabase = getServerClient()
  if (!supabase) return undefined

  const { data, error } = await supabase
    .from('properties')
    .select('id, slug, name, owner_company_name, location, price, listing, beds, baths, area, style, description, features, year_built, lot_size, image_urls')
    .eq('slug', slug)
    .eq('status', 'published')
    .maybeSingle()

  if (error) throw new Error(`Unable to load property listing: ${error.message}`)
  return data ? toProperty(data as PropertyRow) : undefined
}
