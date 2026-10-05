// components/AdminBar.jsx
import Link from 'next/link'

export default function AdminBar({ isAdmin }: { isAdmin: boolean }) {
return (
<div className="bg-neutral-900 text-sm text-neutral-200">
<div className="mx-auto flex min-h-9 max-w-7xl flex-wrap items-center gap-x-6 gap-y-2 px-4 py-2">
<span className="font-semibold uppercase tracking-wider text-[#c9a24d]">{isAdmin ? 'Admin' : 'Property owner'}</span>
<Link href="/admin" className="hover:text-white">My listings</Link>
<Link href="/admin/properties/new" className="hover:text-white">Add property</Link>
{isAdmin && <Link href="/admin/owner-requests" className="hover:text-white">Owner requests</Link>}
</div>
</div>
)
}