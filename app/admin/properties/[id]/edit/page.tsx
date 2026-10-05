
import Link from 'next/link'
import PropertyForm from '../../../components/PropertyForm'
import GoBack from '@/app/components/GoBack'

type EditPropertyPageProps = {
params: Promise<{ id: string }>
}

export default async function EditPropertyPage({ params }: EditPropertyPageProps) {
const { id } = await params


return (
<main className="flex-1 bg-[#f7f6f1]">
<div className="mx-auto max-w-4xl px-5 py-10 sm:px-8">
<div className="flex items-center justify-between">
<GoBack />
<Link 
href="/admin" 
className="rounded-md border border-[#24372c]/20 px-3 py-1.5 text-xs font-medium text-[#24372c] transition-colors hover:bg-[#24372c]/5"
>
Cancel
</Link>
</div>

<p className="mt-8 text-xs font-semibold uppercase tracking-[0.2em] text-[#806b44]">Edit listing</p>
<h1 className="mt-2 font-serif text-4xl text-[#24372c]">Update your property</h1>
<div className="mt-8">
<PropertyForm propertyId={id} />
</div>
</div>
</main>
)
}