import Link from 'next/link'
import { ArrowRight, MessageCircleMore } from 'lucide-react'
import Navbar from '../components/navbar'
import SiteFooter from '../components/SiteFooter'
import ContactInquiryForm from './ContactInquiryForm'
import { getPropertyBySlug } from '../lib/properties'
import { getPublishedPropertyBySlug } from '../lib/properties-server'

type ContactPageProps = {
  searchParams: Promise<{ property?: string }>
}

export default async function ContactPage({ searchParams }: ContactPageProps) {
  const { property: slug } = await searchParams
  const property = slug
    ? (await getPublishedPropertyBySlug(slug)) ?? getPropertyBySlug(slug)
    : null

  return (
    <>
      <Navbar />
      <main className="flex flex-1 items-center bg-[#faf9f6]">
        <section className="mx-auto grid w-full max-w-7xl gap-10 px-5 py-16 sm:px-8 md:grid-cols-[1fr_0.9fr] md:items-center md:py-24">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#806b44]">Contact</p>
            <h1 className="mt-4 max-w-xl font-serif text-4xl leading-tight text-[#24372c] sm:text-6xl">Let&apos;s talk about what comes next.</h1>
            <p className="mt-6 max-w-xl text-base leading-7 text-stone-600">
              Whether you are searching for a home or planning a move, we want to understand what matters to you.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/properties" className="inline-flex min-h-12 items-center gap-2 rounded bg-[#315b48] px-5 text-sm font-semibold text-white hover:bg-[#244636]">
                Explore sample homes <ArrowRight size={16} aria-hidden="true" />
              </Link>
              <Link href="/about" className="inline-flex min-h-12 items-center rounded border border-stone-300 px-5 text-sm font-semibold text-[#315b48] hover:bg-white">
                Learn about us
              </Link>
            </div>
          </div>
          <aside className="rounded-md border border-stone-200 bg-white p-7 shadow-sm sm:p-9">
            <MessageCircleMore size={28} className="text-[#806b44]" aria-hidden="true" />
            <h2 className="mt-5 font-serif text-2xl text-[#24372c]">Send us a message</h2>
            <p className="mt-2 text-sm leading-6 text-stone-600">
              Tell us a little about how we can help. Your inquiry will be saved for the team to review.
            </p>
            <ContactInquiryForm
              propertySlug={property?.slug ?? null}
              propertyName={property?.name ?? null}
            />
          </aside>
        </section>
      </main>
      <SiteFooter />
    </>
  )
}