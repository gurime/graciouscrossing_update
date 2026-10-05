import Link from 'next/link'
import { Bath, BedDouble, MapPin, MoveUpRight } from 'lucide-react'
import type { Property } from '../lib/properties'
import PropertyPhoto from './PropertyPhoto'

const currency = new Intl.NumberFormat('en-US', {
style: 'currency',
currency: 'USD',
maximumFractionDigits: 0,
})

export default function PropertyCard({ property }: { property: Property }) {
return (
<article className="overflow-hidden rounded-md border border-stone-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
<Link
href={`/properties/${property.slug}`}
className="group block h-full rounded-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#315b48]"
aria-label={`View ${property.name} property details`}
>
<div className="relative">
<PropertyPhoto
imageUrl={property.imageUrls[0]}
visual={property.visual}
alt={property.name}
className="h-56"
sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
/>
<span className="absolute left-4 top-4 rounded-sm bg-white/95 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.12em] text-[#315b48]">
{property.listing === 'buy' ? 'For sale' : 'For rent'}
</span>
</div>
<div className="p-5">
<p className="text-xl font-semibold text-[#26362c]">
{currency.format(property.price)}
{property.listing === 'rent' && <span className="text-sm font-normal text-stone-500"> / month</span>}
</p>
<h3 className="mt-2 font-serif text-2xl text-[#26362c] group-hover:text-[#315b48]">{property.name}</h3>
<p className="mt-2 flex items-center gap-1.5 text-sm text-stone-500">
<MapPin size={15} aria-hidden="true" />
{property.location}
</p>
<p className="mt-3 min-h-10 text-sm leading-5 text-stone-600">{property.style}</p>
<div className="mt-4 flex items-center gap-5 border-t border-stone-100 pt-4 text-xs font-medium text-stone-600">
<span className="flex items-center gap-1.5"><BedDouble size={16} aria-hidden="true" />{property.beds} beds</span>
<span className="flex items-center gap-1.5"><Bath size={16} aria-hidden="true" />{property.baths} baths</span>
<span>{property.area.toLocaleString()} sq ft</span>
</div>
<span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-[#315b48] group-hover:underline">
View property details <MoveUpRight size={15} aria-hidden="true" />
</span>
</div>
</Link>
</article>
)
}
