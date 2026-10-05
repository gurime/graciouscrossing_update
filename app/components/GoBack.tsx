'use client'
import { useRouter } from 'next/navigation'
import React from 'react'

export default function GoBack() {
const router = useRouter()

return (
<>
<button 
onClick={() => router.back( )}
className="text-sm font-medium text-[#315b48] hover:underline"
>
← Back to my listings
</button>
</>
)
}
