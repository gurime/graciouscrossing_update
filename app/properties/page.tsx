import Link from 'next/link'
import { connection } from 'next/server'
import PropertyCard from '../components/PropertyCard'
import { sampleProperties } from '../lib/properties'
import { getPublishedProperties } from '../lib/properties-server'
import Navbar from '../components/navbar'
import SiteFooter from '../components/SiteFooter'

type PropertiesPageProps = {
searchParams: Promise<{
location?: string | string[]
listing?: string | string[]
}>
}

export default async function PropertiesPage({ searchParams }: PropertiesPageProps) {
await connection()
const params = await searchParams
const publishedProperties = await getPublishedProperties()
const allProperties = [...publishedProperties, ...sampleProperties]
const location = typeof params.location === 'string' ? params.location.trim() : ''
const requestedListing = typeof params.listing === 'string' ? params.listing : 'all'
const listing = requestedListing === 'buy' || requestedListing === 'rent' ? requestedListing : 'all'
const normalizedLocation = location.toLowerCase()
const properties = allProperties.filter((property) => {
const matchesLocation =
!normalizedLocation ||
property.location.toLowerCase().includes(normalizedLocation) ||
property.name.toLowerCase().includes(normalizedLocation)
const matchesListing = listing === 'all' || property.listing === listing
return matchesLocation && matchesListing
})

return (
    <>
    
    <Navbar/>
    
<main className="flex-1">
<section className="bg-[#e9e5da]">
<div className="mx-auto max-w-7xl px-5 py-14 sm:px-8 sm:py-20">
<p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#806b44]">Find your next place</p>
<h1 className="mt-3 font-serif text-4xl text-[#24372c] sm:text-5xl">Explore properties</h1>
<p className="mt-4 max-w-2xl text-base leading-7 text-stone-600">
Explore homes listed by property owners alongside illustrative sample listings.
</p>
<form action="/properties" className="mt-8 grid gap-3 rounded-md bg-white p-3 shadow-sm sm:grid-cols-[1fr_190px_auto]">
<label className="flex min-h-12 items-center px-3">
<span className="sr-only">City, neighborhood, or property name</span>
<input
className="w-full bg-transparent text-sm text-stone-900 outline-none placeholder:text-stone-400 focus-visible:ring-2 focus-visible:ring-[#315b48]"
type="search"
name="location"
defaultValue={location}
placeholder="City, neighborhood, or property"
/>
</label>
<label className="flex min-h-12 items-center border-t border-stone-200 px-3 sm:border-l sm:border-t-0">
<span className="sr-only">Listing type</span>
<select className="w-full bg-transparent text-sm text-stone-700 outline-none focus-visible:ring-2 focus-visible:ring-[#315b48]" name="listing" defaultValue={listing}>
<option value="all">All properties</option>
<option value="buy">For sale</option>
<option value="rent">For rent</option>
</select>
</label>
<button className="min-h-12 rounded bg-[#315b48] px-6 text-sm font-semibold text-white transition hover:bg-[#244636] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#315b48]" type="submit">
Search
</button>
</form>
</div>
</section>

<section className="mx-auto max-w-7xl px-5 py-12 sm:px-8 lg:py-16">
<div className="mb-7 flex flex-wrap items-end justify-between gap-4">
<div>
<h2 className="font-serif text-2xl text-[#24372c]">Homes to explore</h2>
<p className="mt-1 text-sm text-stone-500">
{properties.length} {properties.length === 1 ? 'property' : 'properties'}
{location ? ` matching “${location}”` : ''}
</p>
</div>
{(location || listing !== 'all') && (
<Link href="/properties" className="text-sm font-semibold text-[#315b48] hover:underline">
Clear filters
</Link>
)}
</div>
{properties.length > 0 ? (
<div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
{properties.map((property) => <PropertyCard key={property.id} property={property} />)}
</div>
) : (
<div className="rounded-md border border-dashed border-stone-300 bg-white px-6 py-14 text-center">
<h3 className="font-serif text-2xl text-[#24372c]">No sample properties found</h3>
<p className="mx-auto mt-2 max-w-md text-sm leading-6 text-stone-600">
Try a broader location or clear the filters to see all of the example listings.
</p>
<Link href="/properties" className="mt-5 inline-flex rounded bg-[#315b48] px-5 py-3 text-sm font-semibold text-white hover:bg-[#244636]">
Show all properties
</Link>
</div>
)}
<p className="mt-6 text-xs text-stone-500">Listings marked as sample content are illustrative and do not represent active properties or market pricing.</p>
</section>
</main>
<SiteFooter/>
</>
)
}
