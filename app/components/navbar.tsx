// components/Navbar.jsx
'use client'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useState } from 'react'
import { useAuth } from '../hooks/useAuth'
import AdminBar from './AdminBar'

const links = [
{ href: '/', label: 'Home' },
{ href: '/properties', label: 'Properties' },
{ href: '/about', label: 'About' },
{ href: '/contact', label: 'Contact' },
{ href: '/faq', label: 'FAQ' },
{ href: '/mortgage-calculator', label: 'Mortgage calculator' },
]

export default function Navbar() {
const { supabase, user, profile, loading, canManageProperties, isAdmin } = useAuth()
const pathname = usePathname()
const router = useRouter()
const [open, setOpen] = useState(false)
const accountName = [profile?.first_name, profile?.last_name].filter(Boolean).join(' ') || 'My account'

const handleLogout = async () => {
await supabase.auth.signOut()
setOpen(false)
router.push('/')
router.refresh()
}

const linkClass = (href: string) =>
`text-sm font-medium transition-colors hover:text-[#b08a3e] ${
pathname === href ? 'text-[#b08a3e]' : 'text-neutral-700'
}`

return (
<header className="sticky top-0 z-50 bg-white shadow-sm">
{canManageProperties && <AdminBar isAdmin={isAdmin} />}

<nav className="mx-auto flex min-h-16 max-w-7xl items-center justify-between gap-4 px-4 py-2">
<Link href="/" aria-label="Gracious Crossing home">
<Image
src="/images/gracious_crossinggold.png"
alt="Gracious Crossing Homes & Properties"
width={160}
height={160}
priority
className="h-32 w-auto"
/>
</Link>

{/* Desktop */}
<ul className="hidden items-center gap-5 lg:gap-7 lg:flex">
{links.map((l) => (
<li key={l.href}>
<Link href={l.href} className={linkClass(l.href)}>{l.label}</Link>
</li>
))}
</ul>

<div className="hidden items-center gap-3 lg:flex">
{loading ? null : user ? (
<>
<Link href="/account" className="text-sm text-neutral-700 hover:text-[#b08a3e]">
{accountName}
</Link>
<button
onClick={handleLogout}
className="rounded-md border border-neutral-300 px-3 py-1.5 text-sm hover:bg-neutral-100"
>
Log out
</button>
</>
) : (
<>
<Link href="/login" className="text-sm font-medium text-neutral-700 hover:text-[#b08a3e]">
Log in
</Link>
<Link
href="/login?tab=signup"
className="rounded-md bg-[#b08a3e] px-4 py-1.5 text-sm font-medium text-white hover:bg-[#96742f]"
>
Register
</Link>
</>
)}
</div>

{/* Mobile toggle */}
<button
className="lg:hidden"
type="button"
onClick={() => setOpen(!open)}
aria-label="Toggle menu"
aria-expanded={open}
aria-controls="mobile-navigation"
>
<svg className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
{open ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
</svg>
</button>
</nav>

{/* Mobile menu */}
{open && (
<div className="border-t border-stone-200 lg:hidden" id="mobile-navigation">
<ul className="flex flex-col gap-1 px-4 py-3">
{links.map((l) => (
<li key={l.href}>
<Link href={l.href} onClick={() => setOpen(false)} className={`block py-2 ${linkClass(l.href)}`}>
{l.label}
</Link>
</li>
))}
<li className="mt-2 border-t pt-3">
{user ? (
<>
<Link href="/account" onClick={() => setOpen(false)} className="block py-2 text-sm text-neutral-700">My account</Link>
{canManageProperties && <Link href="/admin" onClick={() => setOpen(false)} className="block py-2 text-sm text-neutral-700">My listings</Link>}
{isAdmin && <Link href="/admin/owner-requests" onClick={() => setOpen(false)} className="block py-2 text-sm text-neutral-700">Owner requests</Link>}
<button onClick={handleLogout} className="mt-2 text-sm text-neutral-700">Log out</button>
</>
) : (
<div className="flex gap-4 text-sm">
<Link href="/login" onClick={() => setOpen(false)}>Log in</Link>
<Link href="/login?tab=signup" onClick={() => setOpen(false)}>Register</Link>
</div>
)}
</li>
</ul>
</div>
)}
</header>
)
}