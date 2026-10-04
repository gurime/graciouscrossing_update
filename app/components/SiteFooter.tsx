import Image from 'next/image'
import Link from 'next/link'

const footerLinks = [
  { href: '/properties', label: 'Explore properties' },
  { href: '/about', label: 'About us' },
  { href: '/contact', label: 'Contact' },
  { href: '/faq', label: 'FAQs' },
]

export default function SiteFooter() {
  return (
    <footer className="mt-auto bg-[#1e3027] text-white">
      <div className="mx-auto grid max-w-7xl gap-10 px-5 py-12 sm:px-8 md:grid-cols-[1.4fr_0.8fr_0.8fr]">
        <div>
          <Link href="/" aria-label="Gracious Crossing home" className="inline-flex rounded bg-white p-2">
            <Image src="/images/gracious_crossinggold.png" alt="Gracious Crossing" width={160} height={64} className="h-12 w-auto object-contain" />
          </Link>
          <p className="mt-4 max-w-sm text-sm leading-6 text-white/65">
            Thoughtful real estate guidance for finding, selling, and settling into your next chapter.
          </p>
        </div>
        <div>
          <h2 className="text-xs font-semibold uppercase tracking-[0.18em] text-[#dfc99d]">Explore</h2>
          <ul className="mt-4 space-y-3">
            {footerLinks.map(({ href, label }) => (
              <li key={href}><Link href={href} className="text-sm text-white/75 hover:text-white hover:underline">{label}</Link></li>
            ))}
          </ul>
        </div>
        <div>
          <h2 className="text-xs font-semibold uppercase tracking-[0.18em] text-[#dfc99d]">Planning tools</h2>
          <ul className="mt-4 space-y-3">
            <li><Link href="/mortgage-calculator" className="text-sm text-white/75 hover:text-white hover:underline">Mortgage calculator</Link></li>
            <li><Link href="/faq" className="text-sm text-white/75 hover:text-white hover:underline">Frequently asked questions</Link></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="mx-auto max-w-7xl px-5 py-4 text-xs text-white/50 sm:px-8">
          © {new Date().getFullYear()} Gracious Crossing. Sample property information is for demonstration only.
        </div>
      </div>
    </footer>
  )
}
