'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ArrowLeft, ArrowRight } from 'lucide-react'

export default function NotFound() {
const router = useRouter()

return (
<main className="flex flex-1 items-center justify-center bg-[#faf9f6] px-5 py-20 sm:px-8">
<section className="w-full max-w-2xl text-center">

<p
aria-hidden="true"
className="mt-5 font-serif text-8xl leading-none text-[#315b48] sm:text-9xl"
>
404
</p>
<h1 className="mt-6 font-serif text-3xl text-[#24372c] sm:text-4xl">
Page not found
</h1>
<p className="mx-auto mt-4 max-w-md text-base leading-7 text-stone-600">
The page you are looking for may have moved or no longer exists.
</p>

<div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
<button
type="button"
onClick={() => router.back()}
className="inline-flex min-h-12 items-center gap-2 rounded bg-[#315b48] px-5 text-sm font-semibold text-white transition hover:bg-[#244636] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#315b48]"
>
<ArrowLeft size={16} aria-hidden="true" />
Go back
</button>
<Link
href="/"
className="inline-flex min-h-12 items-center gap-2 px-3 text-sm font-semibold text-[#315b48] transition hover:text-[#203f30] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#315b48]"
>
Return to homepage
<ArrowRight size={16} aria-hidden="true" />
</Link>
</div>
</section>
</main>
)
}
