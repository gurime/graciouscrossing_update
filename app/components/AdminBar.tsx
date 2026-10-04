// components/AdminBar.jsx
import Link from 'next/link'

export default function AdminBar() {
return (
<div className="bg-neutral-900 text-sm text-neutral-200">
<div className="mx-auto flex h-9 max-w-7xl items-center gap-6 px-4">
<span className="font-semibold uppercase tracking-wider text-[#c9a24d]">Admin</span>
<Link href="/admin" className="hover:text-white">Dashboard</Link>
<Link href="/admin/properties/new" className="hover:text-white">Add Property</Link>
<Link href="/admin/properties" className="hover:text-white">Manage Listings</Link>
</div>
</div>
)
}