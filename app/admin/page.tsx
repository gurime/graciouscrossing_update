'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { useAuth } from '../hooks/useAuth'

type PropertySummary = {
  id: string
  name: string
  owner_company_name: string | null
  location: string
  slug: string
  price: number
  listing: 'buy' | 'rent'
  status: 'draft' | 'published'
  image_urls: string[]
  created_at: string
}

const currency = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 0,
})

function getStoragePath(url: string) {
  const marker = '/storage/v1/object/public/property-images/'
  const index = url.indexOf(marker)
  return index < 0 ? null : decodeURIComponent(url.slice(index + marker.length))
}

export default function OwnerDashboard() {
  const { supabase, user } = useAuth()
  const [properties, setProperties] = useState<PropertySummary[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!user) return

    const ownerId = user.id
    let active = true
    async function loadProperties() {
      const { data, error: queryError } = await supabase
        .from('properties')
        .select('id, name, owner_company_name, location, slug, price, listing, status, image_urls, created_at')
        .eq('owner_id', ownerId)
        .order('created_at', { ascending: false })

      if (!active) return
      if (queryError) {
        setError(queryError.message)
      } else {
        setProperties(data as PropertySummary[])
        setError('')
      }
      setLoading(false)
    }

    void loadProperties()
    return () => {
      active = false
    }
  }, [supabase, user])

  async function deleteProperty(property: PropertySummary) {
    if (!user || !window.confirm(`Delete "${property.name}"? This cannot be undone.`)) return
    setError('')

    const { data: deletedProperty, error: deleteError } = await supabase
      .from('properties')
      .delete()
      .eq('id', property.id)
      .eq('owner_id', user.id)
      .select('id')
      .maybeSingle()
    if (deleteError) {
      setError(deleteError.message)
      return
    }
    if (!deletedProperty) {
      setError('This listing could not be found or you no longer have permission to delete it.')
      return
    }

    const paths = property.image_urls.map(getStoragePath).filter((path): path is string => Boolean(path))
    if (paths.length) {
      const { error: removalError } = await supabase.storage.from('property-images').remove(paths)
      if (removalError) {
        setProperties((current) => current.filter((item) => item.id !== property.id))
        setError(`The listing was deleted, but its photos could not be removed: ${removalError.message}`)
        return
      }
    }

    setProperties((current) => current.filter((item) => item.id !== property.id))
  }

  const publishedCount = properties.filter((property) => property.status === 'published').length

  return (
    <main className="flex-1 bg-[#f7f6f1]">
      <section className="bg-[#1e362b] text-white">
        <div className="mx-auto flex max-w-7xl flex-col justify-between gap-6 px-5 py-12 sm:px-8 md:flex-row md:items-end">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#dfc99d]">Owner dashboard</p>
            <h1 className="mt-3 font-serif text-4xl sm:text-5xl">Your property listings</h1>
            <p className="mt-3 text-sm text-white/75">{properties.length} total · {publishedCount} published</p>
          </div>
          <Link href="/admin/properties/new" className="inline-flex min-h-12 items-center justify-center rounded bg-[#c9a24d] px-5 text-sm font-semibold text-[#202820] hover:bg-[#dfc99d]">
            Add a property
          </Link>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-10 sm:px-8">
        {error && <p role="alert" className="mb-6 rounded border border-red-200 bg-red-50 p-4 text-sm text-red-800">{error}</p>}
        {loading ? (
          <p role="status" className="py-12 text-center text-sm text-stone-600">Loading your listings…</p>
        ) : properties.length ? (
          <div className="overflow-hidden rounded-md border border-stone-200 bg-white">
            <ul className="divide-y divide-stone-200">
              {properties.map((property) => (
                <li key={property.id} className="flex flex-col justify-between gap-4 p-5 sm:flex-row sm:items-center sm:p-6">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h2 className="font-serif text-xl text-[#24372c]">{property.name}</h2>
                      <span className={`rounded px-2 py-1 text-[10px] font-semibold uppercase tracking-wider ${property.status === 'published' ? 'bg-[#e7eee7] text-[#315b48]' : 'bg-stone-100 text-stone-600'}`}>
                        {property.status}
                      </span>
                    </div>
                    <p className="mt-1 text-sm text-stone-500">{property.location}</p>
                    {property.owner_company_name && <p className="mt-1 text-sm text-stone-600">Listed by {property.owner_company_name}</p>}
                    <p className="mt-2 text-sm font-semibold text-[#24372c]">
                      {currency.format(Number(property.price))}
                      {property.listing === 'rent' && <span className="font-normal text-stone-500"> / month</span>}
                    </p>
                  </div>
                  <div className="flex flex-wrap items-center gap-4">
                    {property.status === 'published' && (
                      <Link href={`/properties/${property.slug}`} className="text-sm font-medium text-[#315b48] hover:underline">View listing</Link>
                    )}
                    <Link href={`/admin/properties/${property.id}/edit`} className="text-sm font-medium text-[#315b48] hover:underline">Edit</Link>
                    <button type="button" onClick={() => void deleteProperty(property)} className="text-sm font-medium text-red-700 hover:underline">Delete</button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <div className="rounded-md border border-dashed border-stone-300 bg-white px-6 py-16 text-center">
            <h2 className="font-serif text-2xl text-[#24372c]">Your first listing starts here</h2>
            <p className="mx-auto mt-3 max-w-lg text-sm leading-6 text-stone-600">
              Add your property details, choose photos, then publish it to make it visible on the public property search.
            </p>
            <Link href="/admin/properties/new" className="mt-6 inline-flex min-h-12 items-center rounded bg-[#315b48] px-5 text-sm font-semibold text-white hover:bg-[#244636]">
              Add your first property
            </Link>
          </div>
        )}
      </section>
    </main>
  )
}
