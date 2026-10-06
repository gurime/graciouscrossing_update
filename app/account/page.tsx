'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import type { FormEvent } from 'react'
import { useAuth } from '../hooks/useAuth'
import Navbar from '../components/navbar'
import SiteFooter from '../components/SiteFooter'

type OwnerAccessRequest = {
id: string
company_name: string
message: string
status: 'pending' | 'approved' | 'rejected'
created_at: string
}

const inputClassName =
'w-full rounded border border-stone-300 bg-white px-4 py-3 text-sm text-[#202820] outline-none transition focus-visible:border-[#315b48] focus-visible:ring-2 focus-visible:ring-[#315b48]/20'

export default function AccountPage() {
const { supabase, user, profile, loading, error: authError } = useAuth()
const router = useRouter()
const [request, setRequest] = useState<OwnerAccessRequest | null>(null)
const [requestLoading, setRequestLoading] = useState(true)
const [submitting, setSubmitting] = useState(false)
const [companyName, setCompanyName] = useState('')
const [showRejected, setShowRejected] = useState(false)
const [message, setMessage] = useState('')
const [error, setError] = useState('')
const [notice, setNotice] = useState('')
const [reload, setReload] = useState(0)

useEffect(() => {
if (!loading && !user) {
router.replace('/login?redirect=%2Faccount')
}
}, [loading, router, user])

useEffect(() => {
if (loading || !user) return

let active = true
const userId = user.id
async function loadRequest() {
try {
const { data, error: queryError } = await supabase
.from('owner_access_requests')
.select('id, company_name, message, status, created_at')
.eq('user_id', userId)
.order('created_at', { ascending: false })
.limit(1)
.maybeSingle()

if (!active) return
if (queryError) {
setError(queryError.message)
} else {
setRequest(data as OwnerAccessRequest | null)
}
} catch (cause: unknown) {
if (active) {
setError(cause instanceof Error ? cause.message : 'Unable to load your owner-access request.')
}
} finally {
if (active) setRequestLoading(false)
}
}

void loadRequest()
return () => {
active = false
}
}, [loading, reload, supabase, user])

useEffect(() => {
if (request?.status !== 'rejected') {
setShowRejected(false)
return
}

setShowRejected(true)
const timer = setTimeout(() => setShowRejected(false), 10000)
return () => clearTimeout(timer)
}, [request?.status])

async function submitOwnerRequest(event: FormEvent<HTMLFormElement>) {
event.preventDefault()
setSubmitting(true)
setError('')
setNotice('')

try {
const { error: submitError } = await supabase.rpc('submit_owner_access_request', {
p_company_name: companyName.trim(),
p_message: message.trim(),
})

if (submitError) {
setError(submitError.message)
} else {
setCompanyName('')
setMessage('')
setNotice('Your request was sent. We’ll review it and contact you at your account email.')
setRequestLoading(true)
setReload((current) => current + 1)
}
} catch (cause: unknown) {
setError(cause instanceof Error ? cause.message : 'Unable to send your owner-access request.')
} finally {
setSubmitting(false)
}
}

useEffect(() => {
if (!notice) return
const timer = setTimeout(() => setNotice(''), 10000)
return () => clearTimeout(timer)
}, [notice])

if (loading || (!user && !authError)) {
return <main className="flex-1 px-5 py-20 text-center text-sm text-stone-600">Loading your account…</main>
}

if (authError) {
return (
<main className="flex-1 px-5 py-20 text-center">
<h1 className="font-serif text-3xl text-[#24372c]">We couldn&apos;t load your account</h1>
<p role="alert" className="mx-auto mt-3 max-w-xl text-sm text-stone-600">{authError.message}</p>
</main>
)
}

if (!user) return null

const fullName = [profile?.first_name, profile?.last_name].filter(Boolean).join(' ') || 'Not added'
const roleLabel = profile?.role === 'admin'
? 'Site administrator'
: profile?.role === 'owner'
? 'Property owner'
: 'Regular account'

return (
    <>
    <Navbar/>

<main className="flex-1 bg-[#f7f6f1]">
<section className="bg-[#1e362b] text-white">
<div className="mx-auto max-w-4xl px-5 py-12 sm:px-8">
<p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#dfc99d]">Your account</p>
<h1 className="mt-3 font-serif text-4xl sm:text-5xl">Welcome, {fullName}</h1>
<p className="mt-3 text-sm text-white/75">Manage your account and property-owner access.</p>
</div>
</section>

<section className="mx-auto grid max-w-4xl gap-6 px-5 py-10 sm:px-8 md:grid-cols-2">
<div className="rounded-md border border-stone-200 bg-white p-6">
<h2 className="font-serif text-2xl text-[#24372c]">Account details</h2>
<dl className="mt-5 space-y-4 text-sm">
<div>
<dt className="text-stone-500">Name</dt>
<dd className="mt-1 font-medium text-stone-800">{fullName}</dd>
</div>
<div>
<dt className="text-stone-500">Email</dt>
<dd className="mt-1 font-medium text-stone-800">{user.email ?? 'Not available'}</dd>
</div>
<div>
<dt className="text-stone-500">Account type</dt>
<dd className="mt-1 font-medium text-stone-800">{roleLabel}</dd>
</div>
</dl>
{(profile?.role === 'owner' || profile?.role === 'admin') && (
<Link href="/admin" className="mt-6 inline-flex text-sm font-semibold text-[#315b48] hover:underline">
Go to your property listings
</Link>
)}
</div>

<div className="rounded-md border border-stone-200 bg-white p-6">
<h2 className="font-serif text-2xl text-[#24372c]">Want to list a property?</h2>
{profile?.role === 'owner' || profile?.role === 'admin' ? (
<>
<p className="mt-3 text-sm leading-6 text-stone-600">Your account can manage property listings.</p>
<Link href="/admin" className="mt-5 inline-flex rounded bg-[#315b48] px-5 py-3 text-sm font-semibold text-white hover:bg-[#244636]">
Manage listings
</Link>
</>
) : requestLoading ? (
<p role="status" className="mt-3 text-sm text-stone-600">Checking your request…</p>
) : request?.status === 'pending' ? (
<div className="mt-4 rounded border border-amber-200 bg-amber-50 p-4 text-sm leading-6 text-amber-900">
Your request for <strong>{request.company_name}</strong> is under review. We&apos;ll contact you at your account email.
</div>
) : (
<>
<p className="mt-3 text-sm leading-6 text-stone-600">
Request owner access and we&apos;ll review your details before enabling listing management. Owner access is reviewed by our team; it is not granted by a payment.
</p>
{showRejected && (
<p className="mt-4 rounded border border-stone-200 bg-stone-50 p-3 text-sm text-stone-700">
Your previous request wasn&apos;t approved. You may submit an updated request.
</p>
)}
{error && <p role="alert" className="mt-4 rounded border border-red-200 bg-red-50 p-3 text-sm text-red-800">{error}</p>}
{notice && <p role="status" className="mt-4 rounded border border-[#c8d6c9] bg-[#f2f6f0] p-3 text-sm text-[#315b48]">{notice}</p>}
<form onSubmit={submitOwnerRequest} className="mt-5 space-y-4">
<div>
<label htmlFor="company-name" className="mb-1.5 block text-sm font-medium text-stone-700">Business or owner name</label>
<input
id="company-name"
className={inputClassName}
value={companyName}
onChange={(event) => setCompanyName(event.target.value)}
maxLength={120}
required
/>
</div>
<div>
<label htmlFor="request-message" className="mb-1.5 block text-sm font-medium text-stone-700">Tell us about the property you represent</label>
<textarea
id="request-message"
className={inputClassName}
value={message}
onChange={(event) => setMessage(event.target.value)}
rows={4}
maxLength={2000}
required
/>
</div>
<button
type="submit"
disabled={submitting}
className="inline-flex min-h-11 items-center rounded bg-[#315b48] px-5 text-sm font-semibold text-white hover:bg-[#244636] disabled:cursor-not-allowed disabled:opacity-60"
>
{submitting ? 'Sending request…' : 'Request owner access'}
</button>
</form>
</>
)}
</div>
</section>
</main>  
<SiteFooter/>
  </>
)
}
