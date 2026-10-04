import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft, Bath, BedDouble, Check, MapPin, Ruler } from 'lucide-react'
import PropertyCard from '../../components/PropertyCard'
import PropertyPhoto from '../../components/PropertyPhoto'
import SharePropertyButton from '../../components/SharePropertyButton'
import { getPropertyBySlug, sampleProperties } from '../../lib/properties'

type PropertyPageProps = {
  params: Promise<{ slug: string }>
}

const currency = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 0,
})

export function generateStaticParams() {
  return sampleProperties.map(({ slug }) => ({ slug }))
}

export async function generateMetadata({ params }: PropertyPageProps): Promise<Metadata> {
  const { slug } = await params
  const property = getPropertyBySlug(slug)

  if (!property) return { title: 'Property not found | Gracious Crossing' }

  return {
    title: `${property.name} | Gracious Crossing`,
    description: `${property.style} in ${property.location}.`,
  }
}

export default async function PropertyPage({ params }: PropertyPageProps) {
  const { slug } = await params
  const property = getPropertyBySlug(slug)

  if (!property) notFound()

  const galleryImages = property.imageUrls
  const heroImages = galleryImages.slice(0, 5)
  const remainingImages = galleryImages.slice(5)
  const similarProperties = sampleProperties
    .filter((item) => item.slug !== property.slug && item.listing === property.listing)
    .slice(0, 3)

  return (
    <main className="flex-1">
      <div className="mx-auto max-w-7xl px-5 pt-6 sm:px-8">
        <Link href="/properties" className="inline-flex items-center gap-2 text-sm font-medium text-stone-600 hover:text-[#315b48]">
          <ArrowLeft size={16} aria-hidden="true" /> Back to properties
        </Link>
      </div>

      <section className="mx-auto max-w-7xl px-5 pb-8 pt-5 sm:px-8">
        <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
          <div>
            <span className="inline-flex rounded-sm bg-[#e9e5da] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-[#52654f]">
              {property.listing === 'buy' ? 'For sale' : 'For rent'} · Sample listing
            </span>
            <h1 className="mt-3 font-serif text-3xl text-[#24372c] sm:text-4xl">{property.name}</h1>
            <p className="mt-2 flex items-center gap-1.5 text-sm text-stone-600">
              <MapPin size={16} aria-hidden="true" /> {property.location}
            </p>
          </div>
          <SharePropertyButton />
        </div>

        <div className="grid gap-2 overflow-hidden rounded-md md:h-110 md:grid-cols-[1.55fr_1fr]">
          <PropertyPhoto
            imageUrl={heroImages[0]}
            visual={property.visual}
            alt={`${property.name} exterior`}
            className="h-72 md:h-full"
            sizes="(max-width: 768px) 100vw, 60vw"
            eager
          />
          <div className="hidden min-h-0 grid-cols-2 grid-rows-2 gap-2 md:grid">
            {[1, 2, 3, 4].map((index) => (
              <PropertyPhoto
                key={index}
                imageUrl={heroImages[index]}
                visual={property.visual}
                alt={`${property.name} property view ${index + 1}`}
                className="min-h-0"
                sizes="(max-width: 1200px) 25vw, 20vw"
              />
            ))}
          </div>
        </div>
        <p className="mt-2 text-xs text-stone-500">
          {heroImages.length > 0
            ? 'Listing images provided for this property.'
            : 'Illustrative property preview. Add property photos to show a real photo gallery here.'}
        </p>
        {remainingImages.length > 0 && (
          <div className="mt-6">
            <h2 className="font-serif text-xl text-[#24372c]">More photos</h2>
            <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {remainingImages.map((imageUrl, index) => (
                <PropertyPhoto
                  key={imageUrl}
                  imageUrl={imageUrl}
                  visual={property.visual}
                  alt={`${property.name} additional photo ${index + 6}`}
                  className="h-48 rounded-md"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                />
              ))}
            </div>
          </div>
        )}
      </section>

      <section className="mx-auto grid max-w-7xl gap-10 px-5 pb-16 sm:px-8 lg:grid-cols-[1fr_360px] lg:gap-14">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center justify-between gap-5 border-b border-stone-200 pb-6">
            <div>
              <p className="text-3xl font-semibold text-[#24372c]">
                {currency.format(property.price)}
                {property.listing === 'rent' && <span className="text-base font-normal text-stone-500"> / month</span>}
              </p>
              <p className="mt-1 text-sm text-stone-500">{property.style}</p>
            </div>
            <div className="flex flex-wrap gap-x-6 gap-y-3 text-sm font-medium text-stone-700">
              <span className="inline-flex items-center gap-2"><BedDouble size={18} aria-hidden="true" />{property.beds} beds</span>
              <span className="inline-flex items-center gap-2"><Bath size={18} aria-hidden="true" />{property.baths} baths</span>
              <span className="inline-flex items-center gap-2"><Ruler size={18} aria-hidden="true" />{property.area.toLocaleString()} sq ft</span>
            </div>
          </div>

          <section className="border-b border-stone-200 py-8">
            <h2 className="font-serif text-2xl text-[#24372c]">About this home</h2>
            <p className="mt-4 max-w-3xl text-sm leading-7 text-stone-600">{property.description}</p>
          </section>

          <section className="border-b border-stone-200 py-8">
            <h2 className="font-serif text-2xl text-[#24372c]">Property details</h2>
            <dl className="mt-5 grid gap-x-8 gap-y-5 sm:grid-cols-2">
              <div className="flex justify-between gap-4 border-b border-stone-100 pb-3 text-sm">
                <dt className="text-stone-500">Property type</dt>
                <dd className="font-medium capitalize text-stone-800">{property.listing === 'buy' ? 'Residential' : 'Rental home'}</dd>
              </div>
              <div className="flex justify-between gap-4 border-b border-stone-100 pb-3 text-sm">
                <dt className="text-stone-500">Year built</dt>
                <dd className="font-medium text-stone-800">{property.yearBuilt}</dd>
              </div>
              <div className="flex justify-between gap-4 border-b border-stone-100 pb-3 text-sm">
                <dt className="text-stone-500">Lot</dt>
                <dd className="font-medium text-stone-800">{property.lotSize}</dd>
              </div>
              <div className="flex justify-between gap-4 border-b border-stone-100 pb-3 text-sm">
                <dt className="text-stone-500">Living area</dt>
                <dd className="font-medium text-stone-800">{property.area.toLocaleString()} sq ft</dd>
              </div>
            </dl>
          </section>

          <section className="border-b border-stone-200 py-8">
            <h2 className="font-serif text-2xl text-[#24372c]">Features</h2>
            <ul className="mt-5 grid gap-3 sm:grid-cols-2">
              {property.features.map((feature) => (
                <li key={feature} className="flex items-center gap-3 text-sm text-stone-700">
                  <Check size={17} className="shrink-0 text-[#53775d]" aria-hidden="true" /> {feature}
                </li>
              ))}
            </ul>
          </section>

          <section className="py-8">
            <h2 className="font-serif text-2xl text-[#24372c]">Neighborhood</h2>
            <p className="mt-2 text-sm text-stone-600">{property.location}</p>
            <div className="relative mt-5 grid h-64 place-items-center overflow-hidden rounded-md border border-stone-200 bg-[#e8e8dc]">
              <div aria-hidden="true" className="absolute inset-0 bg-[linear-gradient(30deg,transparent_45%,#fff_46%,#fff_49%,transparent_50%),linear-gradient(120deg,transparent_46%,#fff_47%,#fff_50%,transparent_51%),linear-gradient(0deg,transparent_48%,#d0d6c3_49%,#d0d6c3_55%,transparent_56%)] bg-size-[120px_110px,160px_140px,100%_100%] opacity-60" />
              <div className="relative rounded-full bg-[#315b48] p-3 text-white shadow-lg"><MapPin size={22} aria-hidden="true" /></div>
              <span className="absolute bottom-3 rounded bg-white/90 px-3 py-1.5 text-xs text-stone-600">Neighborhood map preview · map integration not connected</span>
            </div>
          </section>
        </div>

        <aside className="h-fit rounded-md border border-stone-200 bg-white p-6 shadow-sm lg:sticky lg:top-24">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#806b44]">Interested in this home?</p>
          <p className="mt-3 font-serif text-2xl text-[#24372c]">Let&apos;s talk through the details.</p>
          <p className="mt-3 text-sm leading-6 text-stone-600">
            This is an illustrative sample listing, not a verified available property. Reach out to discuss your home search.
          </p>
          <Link
            href={`/contact?property=${encodeURIComponent(property.slug)}`}
            className="mt-6 flex min-h-12 items-center justify-center rounded bg-[#315b48] px-5 text-sm font-semibold text-white hover:bg-[#244636] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#315b48]"
          >
            Contact Gracious Crossing
          </Link>
          <p className="mt-4 text-center text-xs leading-5 text-stone-500">
            Business contact details and inquiry delivery are not configured yet.
          </p>
        </aside>
      </section>

      {similarProperties.length > 0 && (
        <section className="border-t border-stone-200 bg-white">
          <div className="mx-auto max-w-7xl px-5 py-12 sm:px-8">
            <h2 className="font-serif text-3xl text-[#24372c]">More homes to explore</h2>
            <div className="mt-7 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {similarProperties.map((item) => <PropertyCard key={item.slug} property={item} />)}
            </div>
          </div>
        </section>
      )}
    </main>
  )
}
