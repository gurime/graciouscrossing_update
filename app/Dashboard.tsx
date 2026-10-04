  import Link from 'next/link'
  import { ArrowRight, BadgeCheck, Building2, KeyRound, MapPin, Search, ShieldCheck } from 'lucide-react'
  import PropertyCard from './components/PropertyCard'
  import { sampleProperties } from './lib/properties'

  const services = [
  {
  icon: KeyRound,
  title: 'Find your place',
  description: 'Explore homes with guidance at every step, from the first tour to closing day.',
  href: '/properties?listing=buy',
  link: 'Browse homes',
  },
  {
  icon: Building2,
  title: 'Make your next move',
  description: 'Get thoughtful support as you prepare, price, and market your property.',
  href: '/contact',
  link: 'Talk with our team',
  },
  {
  icon: ShieldCheck,
  title: 'Plan with confidence',
  description: 'Understand the numbers and feel prepared before you make an offer.',
  href: '/mortgage-calculator',
  link: 'Estimate a payment',
  },
  ]

  export default function Dashboard() {
  return (
  <main>
  <section className="relative isolate overflow-hidden bg-[#1e362b] text-white">
  <div
  aria-hidden="true"
  className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_78%_20%,rgba(177,147,91,0.38),transparent_34%),linear-gradient(120deg,#1e362b_10%,#31523f_60%,#243d31)]"
  />
  <div className="mx-auto grid min-h-[590px] max-w-7xl items-center gap-12 px-5 py-16 sm:px-8 lg:grid-cols-[1fr_0.82fr] lg:py-24">
  <div className="max-w-2xl">
  <p className="mb-5 text-xs font-semibold uppercase tracking-[0.24em] text-[#dfc99d]">
  A more considered way home
  </p>
  <h1 className="max-w-xl font-serif text-5xl leading-[1.08] tracking-tight sm:text-6xl lg:text-7xl">
  Find a place that feels like <em className="font-normal text-[#dfc99d]">yours.</em>
  </h1>
  <p className="mt-6 max-w-lg text-base leading-7 text-white/75 sm:text-lg">
  Thoughtful real estate guidance for finding, selling, and settling into your next chapter.
  </p>

  <form
  action="/properties"
  className="mt-10 grid gap-3 rounded-md bg-white p-3 shadow-xl sm:grid-cols-[1fr_170px_auto] sm:items-center"
  >
  <label className="flex min-h-12 items-center gap-3 px-3 text-stone-500">
  <MapPin size={18} aria-hidden="true" />
  <span className="sr-only">City, neighborhood, or ZIP code</span>
  <input
  className="min-w-0 flex-1 bg-transparent text-sm text-stone-900 outline-none placeholder:text-stone-400 focus-visible:ring-2 focus-visible:ring-[#315b48]"
  type="search"
  name="location"
  placeholder="City, neighborhood, or ZIP"
  />
  </label>
  <label className="flex min-h-12 items-center border-t border-stone-200 px-3 sm:border-l sm:border-t-0">
  <span className="sr-only">Listing type</span>
  <select
  className="w-full bg-transparent text-sm text-stone-700 outline-none focus-visible:ring-2 focus-visible:ring-[#315b48]"
  name="listing"
  defaultValue="buy"
  >
  <option value="buy">For sale</option>
  <option value="rent">For rent</option>
  </select>
  </label>
  <button
  className="flex min-h-12 items-center justify-center gap-2 rounded bg-[#315b48] px-5 text-sm font-semibold text-white transition hover:bg-[#244636] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#315b48]"
  type="submit"
  >
  <Search size={17} aria-hidden="true" />
  Search homes
  </button>
  </form>
  <p className="mt-3 text-xs text-white/60">
  Search results currently use sample listings while the property database is being connected.
  </p>
  </div>

  <div className="relative hidden min-h-[390px] items-end justify-center lg:flex">
  <div className="absolute right-0 top-4 h-72 w-72 rounded-full border border-white/15" />
  <div className="absolute right-10 top-14 h-52 w-52 rounded-full border border-white/15" />
  <div className="relative w-full max-w-[450px] rounded-t-[48%] border border-white/15 bg-gradient-to-b from-[#79917a] via-[#526f5b] to-[#243e31] px-8 pb-8 pt-28 shadow-2xl">
  <div className="mx-auto flex h-56 max-w-xs items-end justify-center overflow-hidden rounded-t-[48%] border-x border-t border-white/25 bg-gradient-to-b from-[#d9c69c] via-[#a68d65] to-[#596e59]">
  <div className="relative flex h-40 w-64 items-end justify-center bg-[#f1e8d5] shadow-xl">
  <div className="absolute -top-11 h-14 w-72 -skew-x-12 bg-[#384a3d]" />
  <div className="mb-0 h-28 w-20 border-4 border-[#765e43] bg-[#b7c3b1]" />
  <div className="absolute bottom-0 left-5 h-24 w-12 border-4 border-[#765e43] bg-[#b7c3b1]" />
  <div className="absolute bottom-0 right-5 h-24 w-12 border-4 border-[#765e43] bg-[#b7c3b1]" />
  </div>
  </div>
  <div className="mt-5 flex items-center justify-between border-t border-white/20 pt-4 text-sm">
  <span className="font-serif text-lg">A home with room to grow</span>
  <BadgeCheck size={20} className="text-[#dfc99d]" aria-hidden="true" />
  </div>
  </div>
  </div>
  </div>
  </section>

  <section className="mx-auto max-w-7xl px-5 py-20 sm:px-8 lg:py-24">
  <div className="mb-10 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
  <div>
  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#8c7348]">A place to begin</p>
  <h2 className="mt-3 font-serif text-3xl text-[#24372c] sm:text-4xl">Explore homes and possibilities</h2>
  <p className="mt-3 max-w-xl text-sm leading-6 text-stone-600">
  A few examples of the homes and support you can explore with Gracious Crossing.
  </p>
  </div>
  <Link
  href="/properties"
  className="inline-flex w-fit items-center gap-2 text-sm font-semibold text-[#315b48] hover:text-[#203f30]"
  >
  See all properties <ArrowRight size={16} aria-hidden="true" />
  </Link>
  </div>
  <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
  {sampleProperties.slice(0, 3).map((property) => (
  <PropertyCard key={property.id} property={property} />
  ))}
  </div>
  <p className="mt-5 text-xs text-stone-500">
  These are illustrative sample listings, not active properties.
  </p>
  </section>

  <section className="border-y border-stone-200 bg-white">
  <div className="mx-auto max-w-7xl px-5 py-20 sm:px-8 lg:py-24">
  <div className="mx-auto mb-12 max-w-2xl text-center">
  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#8c7348]">Here for your next step</p>
  <h2 className="mt-3 font-serif text-3xl text-[#24372c] sm:text-4xl">Real estate, with people in mind</h2>
  </div>
  <div className="grid gap-10 md:grid-cols-3">
  {services.map(({ icon: Icon, title, description, href, link }) => (
  <article key={title} className="border-t-2 border-[#bdad88] pt-6">
  <Icon size={25} className="text-[#7f6a44]" aria-hidden="true" />
  <h3 className="mt-5 font-serif text-2xl text-[#24372c]">{title}</h3>
  <p className="mt-3 min-h-14 text-sm leading-6 text-stone-600">{description}</p>
  <Link href={href} className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-[#315b48] hover:underline">
  {link} <ArrowRight size={15} aria-hidden="true" />
  </Link>
  </article>
  ))}
  </div>
  </div>
  </section>

  <section className="mx-auto my-16 max-w-7xl px-5 sm:px-8">
  <div className="flex flex-col items-start justify-between gap-6 rounded-lg bg-[#e9e5da] px-7 py-10 sm:px-12 sm:py-12 md:flex-row md:items-center">
  <div>
  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#806b44]">Your next chapter starts here</p>
  <h2 className="mt-3 max-w-xl font-serif text-3xl text-[#24372c]">A good move starts with a good conversation.</h2>
  </div>
  <Link href="/contact" className="inline-flex min-h-12 items-center gap-2 rounded bg-[#315b48] px-5 text-sm font-semibold text-white transition hover:bg-[#244636]">
  Get in touch <ArrowRight size={16} aria-hidden="true" />
  </Link>
  </div>
  </section>
  </main>
  )
  }
