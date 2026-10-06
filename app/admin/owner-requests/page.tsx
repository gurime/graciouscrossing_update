'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { useAuth } from '../../hooks/useAuth'
import Navbar from '@/app/components/navbar'
import SiteFooter from '@/app/components/SiteFooter'

type OwnerAccessRequest = {
id: string
user_id: string
contact_email: string
company_name: string
message: string
status: 'pending' | 'approved' | 'rejected'
created_at: string
}

export default function OwnerRequestsPage() {
const { supabase, user, loading: authLoading, error: authError, isAdmin } = useAuth()
const [requests, setRequests] = useState<OwnerAccessRequest[]>([])
const [loading, setLoading] = useState(true)
const [reviewingId, setReviewingId] = useState<string | null>(null)
const [error, setError] = useState('')

useEffect(() => {
if (authLoading) return
if (!user || !isAdmin) return

let active = true
async function loadRequests() {
try {
const { data, error: queryError } = await supabase
.from('owner_access_requests')
.select('id, user_id, contact_email, company_name, message, status, created_at')
.eq('status', 'pending')
.order('created_at', { ascending: true })

if (!active) return
if (queryError) {
setError(queryError.message)
} else {
setRequests(data as OwnerAccessRequest[])
}
} catch (cause: unknown) {
if (active) {
setError(cause instanceof Error ? cause.message : 'Unable to load owner-access requests.')
}
} finally {
if (active) setLoading(false)
}
}

void loadRequests()
return () => {
active = false
}
}, [authLoading, isAdmin, supabase, user])

async function reviewRequest(requestId: string, approve: boolean) {
setReviewingId(requestId)
setError('')
try {
const { error: reviewError } = await supabase.rpc('review_owner_access_request', {
p_request_id: requestId,
p_approve: approve,
})

if (reviewError) {
setError(reviewError.message)
} else {
setRequests((current) => current.filter((request) => request.id !== requestId))
}
} catch (cause: unknown) {
setError(cause instanceof Error ? cause.message : 'Unable to review this owner-access request.')
} finally {
setReviewingId(null)
}
}

if (authLoading) {
return <main className="flex-1 px-5 py-20 text-center text-sm text-stone-600">Checking administrator access…</main>
}

if (authError) {
return <main className="flex-1 px-5 py-20 text-center"><p role="alert" className="text-sm text-red-800">{authError.message}</p></main>
}

if (!user) {
return <main className="flex-1 px-5 py-20 text-center text-sm text-stone-600">Sign in to continue.</main>
}

if (!isAdmin) {
return (
<main className="flex-1 px-5 py-20 text-center">
<h1 className="font-serif text-3xl text-[#24372c]">Administrator access required</h1>
<p className="mt-3 text-sm text-stone-600">Only site administrators can review owner-access requests.</p>
<Link href="/account" className="mt-5 inline-flex text-sm font-semibold text-[#315b48] hover:underline">Return to your account</Link>
</main>
)
}

return (
    <>
    <Navbar/>
<main className="flex-1 bg-[#f7f6f1]">
<section className="bg-[#1e362b] text-white">
<div className="mx-auto max-w-5xl px-5 py-12 sm:px-8">
<p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#dfc99d]">Administration</p>
<h1 className="mt-3 font-serif text-4xl sm:text-5xl">Owner access requests</h1>
<p className="mt-3 text-sm text-white/75">Verify each request before enabling property listing access.</p>
</div>
</section>
<section className="mx-auto max-w-5xl px-5 py-10 sm:px-8">
{error && <p role="alert" className="mb-6 rounded border border-red-200 bg-red-50 p-4 text-sm text-red-800">{error}</p>}
{loading ? (
<p role="status" className="py-12 text-center text-sm text-stone-600">Loading requests…</p>
) : requests.length ? (
<ul className="space-y-4">
{requests.map((request) => (
<li key={request.id} className="rounded-md border border-stone-200 bg-white p-6">
<div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
<div>
<h2 className="font-serif text-2xl text-[#24372c]">{request.company_name}</h2>
<a href={`mailto:${request.contact_email}`} className="mt-1 inline-block text-sm text-[#315b48] hover:underline">{request.contact_email}</a>
<p className="mt-1 text-xs text-stone-500">Submitted {new Date(request.created_at).toLocaleDateString()}</p>
<p className="mt-4 whitespace-pre-wrap text-sm leading-6 text-stone-700">{request.message}</p>
</div>
<div className="flex shrink-0 gap-3">
<button
type="button"
onClick={() => void reviewRequest(request.id, true)}
disabled={reviewingId !== null}
className="rounded bg-[#315b48] px-4 py-2 text-sm font-semibold text-white hover:bg-[#244636] disabled:opacity-60"
>
{reviewingId === request.id ? 'Saving…' : 'Approve'}
</button>
<button
type="button"
onClick={() => void reviewRequest(request.id, false)}
disabled={reviewingId !== null}
className="rounded border border-stone-300 px-4 py-2 text-sm font-semibold text-stone-700 hover:bg-stone-50 disabled:opacity-60"
>
Reject
</button>
</div>
</div>
</li>
))}
</ul>
) : (
<div className="rounded-md border border-dashed border-stone-300 bg-white px-6 py-16 text-center">
<h2 className="font-serif text-2xl text-[#24372c]">No pending requests</h2>
<p className="mt-3 text-sm text-stone-600">New owner-access requests will appear here for review.</p>
</div>
)}
</section>
</main>
<SiteFooter/>
</>
)
}
