import Link from 'next/link'
import { Compass, Handshake, HeartHandshake } from 'lucide-react'

const values = [
  {
    icon: HeartHandshake,
    title: 'People before paperwork',
    text: 'A home decision is personal. We make space for your goals, questions, and timing.',
  },
  {
    icon: Compass,
    title: 'Clear guidance',
    text: 'We help make each step easier to understand, so you can move forward with confidence.',
  },
  {
    icon: Handshake,
    title: 'Care that continues',
    text: 'Good relationships matter beyond closing day. We aim to be a resource through every chapter.',
  },
]

export default function AboutPage() {
  return (
    <main className="flex-1">
      <section className="bg-[#1e362b] text-white">
        <div className="mx-auto max-w-7xl px-5 py-20 sm:px-8 sm:py-28">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#dfc99d]">About Gracious Crossing</p>
          <h1 className="mt-4 max-w-3xl font-serif text-4xl leading-tight sm:text-6xl">Real estate is about more than an address.</h1>
          <p className="mt-6 max-w-2xl text-base leading-7 text-white/75 sm:text-lg">
            It is about the people, plans, and possibilities that make a place feel like home. Our approach starts by listening.
          </p>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-12 px-5 py-16 sm:px-8 md:grid-cols-[0.9fr_1.1fr] md:py-24">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#806b44]">A thoughtful approach</p>
          <h2 className="mt-3 font-serif text-3xl text-[#24372c] sm:text-4xl">Your goals set the direction.</h2>
        </div>
        <div className="space-y-5 text-base leading-7 text-stone-600">
          <p>
            Gracious Crossing is being built around a simple idea: buying, renting, or selling a home should feel informed, personal, and well supported.
          </p>
          <p>
            We are shaping a real estate experience where practical advice and genuine care belong together. As the site grows, this space will introduce our team and the communities we serve.
          </p>
          <Link href="/contact" className="inline-flex font-semibold text-[#315b48] hover:underline">Start a conversation <span aria-hidden="true">→</span></Link>
        </div>
      </section>

      <section className="border-y border-stone-200 bg-white">
        <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8 md:py-20">
          <div className="mb-10 max-w-2xl">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#806b44]">What guides us</p>
            <h2 className="mt-3 font-serif text-3xl text-[#24372c] sm:text-4xl">The experience we want to create</h2>
          </div>
          <div className="grid gap-8 md:grid-cols-3">
            {values.map(({ icon: Icon, title, text }) => (
              <article key={title} className="rounded-md border border-stone-200 bg-[#faf9f6] p-6">
                <Icon size={26} className="text-[#806b44]" aria-hidden="true" />
                <h3 className="mt-5 font-serif text-2xl text-[#24372c]">{title}</h3>
                <p className="mt-3 text-sm leading-6 text-stone-600">{text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
    </main>
  )
}
