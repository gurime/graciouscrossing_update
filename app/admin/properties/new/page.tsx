import Link from 'next/link'
import PropertyForm from '../../components/PropertyForm'

export default function NewPropertyPage() {
  return (
    <main className="flex-1 bg-[#f7f6f1]">
      <div className="mx-auto max-w-4xl px-5 py-10 sm:px-8">
        <Link href="/admin" className="text-sm font-medium text-[#315b48] hover:underline">← Back to my listings</Link>
        <p className="mt-8 text-xs font-semibold uppercase tracking-[0.2em] text-[#806b44]">Create a listing</p>
        <h1 className="mt-2 font-serif text-4xl text-[#24372c]">Add your property</h1>
        <p className="mt-3 text-sm leading-6 text-stone-600">Enter the details renters or buyers need to find the right home.</p>
        <div className="mt-8">
          <PropertyForm />
        </div>
      </div>
    </main>
  )
}
