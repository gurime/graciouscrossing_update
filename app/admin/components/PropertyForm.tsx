'use client'

import { useEffect, useState } from 'react'
import type { FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '../../hooks/useAuth'
import Navbar from '@/app/components/navbar'
import SiteFooter from '@/app/components/SiteFooter'

type ExistingProperty = {
id: string
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
status: 'draft' | 'published'
slug: string
}

type PropertyFormProps = { propertyId?: string }

const inputClass = 'mt-1 w-full rounded border border-stone-300 bg-white px-3 py-2.5 text-sm text-stone-900 outline-none focus:border-[#315b48] focus:ring-2 focus:ring-[#315b48]/20'
const labelClass = 'block text-sm font-medium text-stone-700'
const maxPhotos = 9
const maxPhotoBytes = 8 * 1024 * 1024
const supportedPhotoTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/avif']

function getStoragePath(url: string) {
const marker = '/storage/v1/object/public/property-images/'
const index = url.indexOf(marker)
return index < 0 ? null : decodeURIComponent(url.slice(index + marker.length))
}

function makeSlug(name: string) {
const base = name
.normalize('NFKD')
.replace(/[\u0300-\u036f]/g, '')
.toLowerCase()
.replace(/[^a-z0-9]+/g, '-')
.replace(/^-|-$/g, '')
return `${base || 'property'}-${crypto.randomUUID().slice(0, 8)}`
}

export default function PropertyForm({ propertyId }: PropertyFormProps) {
const { supabase, user } = useAuth()
const router = useRouter()
const [property, setProperty] = useState<ExistingProperty | null>(null)
const [loadError, setLoadError] = useState('')
const [selectedPhotos, setSelectedPhotos] = useState<File[]>([])
const [removedPhotos, setRemovedPhotos] = useState<string[]>([])
const [saving, setSaving] = useState(false)
const [error, setError] = useState('')

useEffect(() => {
if (!propertyId || !user) return

const ownerId = user.id
let active = true
async function loadProperty() {
const { data, error: queryError } = await supabase
.from('properties')
.select('id, name, owner_company_name, location, price, listing, beds, baths, area, style, description, features, year_built, lot_size, image_urls, status, slug')
.eq('id', propertyId)
.eq('owner_id', ownerId)
.maybeSingle()

if (!active) return
if (queryError) {
setLoadError(queryError.message)
} else if (!data) {
setLoadError('This property could not be found in your listings.')
} else {
setProperty(data as ExistingProperty)
}
}

void loadProperty()
return () => {
active = false
}
}, [propertyId, supabase, user])

function handlePhotoSelection(files: FileList | null) {
if (!files) return
const next = Array.from(files)
const currentCount = (property?.image_urls.length ?? 0) - removedPhotos.length + selectedPhotos.length

if (currentCount + next.length > maxPhotos) {
setError(`You can add up to ${maxPhotos} photos per listing.`)
return
}
const invalid = next.find((file) => !supportedPhotoTypes.includes(file.type) || file.size > maxPhotoBytes)
if (invalid) {
setError('Photos must be JPG, PNG, WebP, or AVIF and no larger than 8 MB each.')
return
}

setError('')
setSelectedPhotos((current) => [...current, ...next])
}

async function handleSubmit(event: FormEvent<HTMLFormElement>) {
event.preventDefault()
if (!user) {
setError('Sign in to save a property listing.')
return
}

setSaving(true)
setError('')
const formData = new FormData(event.currentTarget)
const name = String(formData.get('name') ?? '').trim()
const imageUrls = property?.image_urls.filter((url) => !removedPhotos.includes(url)) ?? []
const uploadedPaths: string[] = []

try {
for (const photo of selectedPhotos) {
const path = `${user.id}/${crypto.randomUUID()}-${photo.name.replace(/[^a-zA-Z0-9._-]/g, '-')}`
const { error: uploadError } = await supabase.storage
.from('property-images')
.upload(path, photo, { contentType: photo.type, upsert: false })
if (uploadError) throw uploadError
uploadedPaths.push(path)
imageUrls.push(supabase.storage.from('property-images').getPublicUrl(path).data.publicUrl)
}

const listing = {
name,
owner_company_name: String(formData.get('owner_company_name') ?? '').trim() || null,
location: String(formData.get('location') ?? '').trim(),
price: Number(formData.get('price')),
listing: String(formData.get('listing')),
beds: Number(formData.get('beds')),
baths: Number(formData.get('baths')),
area: Number(formData.get('area')),
style: String(formData.get('style') ?? '').trim(),
description: String(formData.get('description') ?? '').trim(),
features: String(formData.get('features') ?? '')
.split(/[\n,]/)
.map((feature) => feature.trim())
.filter(Boolean),
year_built: Number(formData.get('year_built')),
lot_size: String(formData.get('lot_size') ?? '').trim(),
image_urls: imageUrls,
status: String(formData.get('status')),
}

const result = propertyId
? await supabase
.from('properties')
.update(listing)
.eq('id', propertyId)
.eq('owner_id', user.id)
.select('id')
.maybeSingle()
: await supabase
.from('properties')
.insert({ ...listing, owner_id: user.id, slug: makeSlug(name) })

if (result.error) throw result.error
if (propertyId && !result.data) throw new Error('This listing could not be found or you no longer have permission to edit it.')

const removedPaths = removedPhotos.map(getStoragePath).filter((path): path is string => Boolean(path))
if (removedPaths.length) {
const { error: removalError } = await supabase.storage.from('property-images').remove(removedPaths)
if (removalError) {
setError(`Your listing was saved, but some removed photos could not be deleted: ${removalError.message}`)
setSaving(false)
return
}
}

router.push('/admin')
router.refresh()
} catch (cause) {
if (uploadedPaths.length) {
const { error: cleanupError } = await supabase.storage.from('property-images').remove(uploadedPaths)
if (cleanupError) {
setError(`${cause instanceof Error ? cause.message : 'Unable to save this property.'} Uploaded photos also need cleanup: ${cleanupError.message}`)
setSaving(false)
return
}
}
setError(cause instanceof Error ? cause.message : 'Unable to save this property.')
} finally {
setSaving(false)
}
}

if (propertyId && loadError) {
return <p role="alert" className="rounded border border-red-200 bg-red-50 p-4 text-sm text-red-800">{loadError}</p>
}
if (propertyId && !property) {
return <p role="status" className="py-10 text-center text-sm text-stone-600">Loading property details…</p>
}

const currentPhotos = property?.image_urls.filter((url) => !removedPhotos.includes(url)) ?? []

return (
    <>

<form onSubmit={handleSubmit} className="space-y-8">
{error && <p role="alert" className="rounded border border-red-200 bg-red-50 p-4 text-sm text-red-800">{error}</p>}

<section className="grid gap-5 rounded-md border border-stone-200 bg-white p-5 sm:grid-cols-2 sm:p-7">
<label className={`${labelClass} sm:col-span-2`}>
Property name
<input className={inputClass} name="name" required maxLength={120} defaultValue={property?.name ?? ''} placeholder="e.g. Oak Street home" />
</label>
<label className={`${labelClass} sm:col-span-2`}>
Owner or company name <span className="font-normal text-stone-500">(optional)</span>
<input className={inputClass} name="owner_company_name" maxLength={160} defaultValue={property?.owner_company_name ?? ''} placeholder="e.g. Oak Street Realty" />
</label>
<label className={labelClass}>
Street, city, and state
<input className={inputClass} name="location" required maxLength={200} defaultValue={property?.location ?? ''} placeholder="123 Oak Street, Atlanta, GA" />
</label>
<label className={labelClass}>
Listing type
<select className={inputClass} name="listing" defaultValue={property?.listing ?? 'buy'}>
<option value="buy">For sale</option>
<option value="rent">For rent</option>
</select>
</label>
<label className={labelClass}>
{property?.listing === 'rent' ? 'Monthly rent (USD)' : 'Price (USD)'}
<input className={inputClass} type="number" name="price" required min="1" step="1" defaultValue={property?.price ?? ''} />
</label>
<label className={labelClass}>
Bedrooms
<input className={inputClass} type="number" name="beds" required min="0" max="100" step="1" defaultValue={property?.beds ?? 3} />
</label>
<label className={labelClass}>
Bathrooms
<input className={inputClass} type="number" name="baths" required min="0" max="100" step="0.5" defaultValue={property?.baths ?? 2} />
</label>
<label className={labelClass}>
Interior area (sq ft)
<input className={inputClass} type="number" name="area" required min="1" step="1" defaultValue={property?.area ?? ''} />
</label>
<label className={labelClass}>
Year built
<input className={inputClass} type="number" name="year_built" required min="1600" max="2200" step="1" defaultValue={property?.year_built ?? ''} />
</label>
<label className={labelClass}>
Lot size
<input className={inputClass} name="lot_size"  maxLength={80} defaultValue={property?.lot_size ?? ''} placeholder="e.g. 0.25 acres" />
</label>
<label className={`${labelClass} sm:col-span-2`}>
Headline
<input className={inputClass} name="style" required maxLength={180} defaultValue={property?.style ?? ''} placeholder="What makes this home special?" />
</label>
<label className={`${labelClass} sm:col-span-2`}>
Description
<textarea className={inputClass} name="description" required rows={6} maxLength={5000} defaultValue={property?.description ?? ''} placeholder="Describe the home, its condition, and what buyers or renters should know." />
</label>
<label className={`${labelClass} sm:col-span-2`}>
Features
<textarea className={inputClass} name="features" rows={3} maxLength={1500} defaultValue={property?.features.join('\n') ?? ''} placeholder="Enter features separated by commas or new lines" />
</label>
<label className={labelClass}>
Listing visibility
<select className={inputClass} name="status" defaultValue={property?.status ?? 'published'}>
<option value="published">Publish — visible to everyone</option>
<option value="draft">Save as draft — only visible to you</option>
</select>
</label>
</section>

<section className="rounded-md border border-stone-200 bg-white p-5 sm:p-7">
<h2 className="font-serif text-2xl text-[#24372c]">Property photos</h2>
<p className="mt-2 text-sm text-stone-600">Add up to {maxPhotos} JPG, PNG, WebP, or AVIF photos (8 MB maximum each).</p>
<label className={`${labelClass} mt-5 block`}>
Choose photos
<input
className="mt-2 block w-full text-sm text-stone-600 file:mr-4 file:rounded file:border-0 file:bg-[#315b48] file:px-4 file:py-2 file:font-semibold file:text-white"
type="file"
accept="image/jpeg,image/png,image/webp,image/avif"
multiple
onChange={(event) => handlePhotoSelection(event.currentTarget.files)}
/>
</label>
{(currentPhotos.length > 0 || selectedPhotos.length > 0) && (
<ul className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
{currentPhotos.map((url) => (
<li key={url} className="relative overflow-hidden rounded border border-stone-200">
{/* eslint-disable-next-line @next/next/no-img-element */}
<img src={url} alt="Current property photo" className="h-36 w-full object-cover" />
<button
className="absolute right-2 top-2 rounded bg-white/95 px-2 py-1 text-xs font-semibold text-red-700"
type="button"
onClick={() => setRemovedPhotos((photos) => [...photos, url])}
>
Remove
</button>
</li>
))}
{selectedPhotos.map((photo, index) => (
<li key={`${photo.name}-${index}`} className="flex h-36 items-center justify-between gap-3 rounded border border-stone-200 p-3 text-sm text-stone-700">
<span className="min-w-0 break-all">{photo.name}</span>
<button
className="shrink-0 text-xs font-semibold text-red-700"
type="button"
onClick={() => setSelectedPhotos((photos) => photos.filter((_, photoIndex) => photoIndex !== index))}
>
Remove
</button>
</li>
))}
</ul>
)}
</section>

<div className="flex flex-wrap items-center justify-between gap-4">
<p className="max-w-xl text-xs leading-5 text-stone-500">Only publish a property you are authorized to represent. You can save a draft and publish it later.</p>
<button
className="min-h-12 rounded bg-[#315b48] px-6 text-sm font-semibold text-white transition hover:bg-[#244636] disabled:cursor-not-allowed disabled:opacity-60"
type="submit"
disabled={saving}
>
{saving ? 'Saving…' : propertyId ? 'Save changes' : 'Create listing'}
</button>
</div>
</form>  
  </>
)
}
