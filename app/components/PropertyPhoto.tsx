import Image from 'next/image'
import type { CSSProperties } from 'react'

type PropertyPhotoProps = {
imageUrl?: string
visual: string
alt: string
className?: string
sizes?: string
eager?: boolean
}

export default function PropertyPhoto({
imageUrl,
visual,
alt,
className = '',
sizes = '100vw',
eager = false,
}: PropertyPhotoProps) {
if (imageUrl) {
return (
<div className={`relative overflow-hidden ${className}`}>
<Image
src={imageUrl}
alt={alt}
fill
sizes={sizes}
loading={eager ? 'eager' : 'lazy'}
unoptimized
className="object-cover"
/>
</div>
)
}

const houseStyle = {
'--house-sky': 'rgba(239, 229, 208, .38)',
} as CSSProperties

return (
<div
aria-label={`${alt} — illustrative preview`}
role="img"
style={houseStyle}
className={`relative isolate overflow-hidden bg-linear-to-br ${visual} ${className}`}
>
<div aria-hidden="true" className="absolute -right-10 -top-20 h-56 w-56 rounded-full bg-(--house-sky) blur-3xl" />
<div aria-hidden="true" className="absolute inset-x-0 bottom-0 h-1/3 bg-[#263d2d]/25" />
<div aria-hidden="true" className="absolute bottom-0 left-1/2 h-[52%] w-[58%] -translate-x-1/2 bg-[#eee5d3] shadow-2xl">
<div className="absolute top-[-18%] left-[-8%] h-[24%] w-[116%] -skew-x-12 bg-[#38483b]" />
<div className="absolute bottom-0 left-[10%] h-[49%] w-[19%] border-[5px] border-[#806b4d] bg-[#b9c6b3]" />
<div className="absolute bottom-0 right-[10%] h-[49%] w-[19%] border-[5px] border-[#806b4d] bg-[#b9c6b3]" />
<div className="absolute bottom-0 left-1/2 h-[62%] w-[21%] -translate-x-1/2 border-[5px] border-[#806b4d] bg-[#a99a7d]" />
</div>
<span className="absolute bottom-3 left-3 rounded bg-black/35 px-2 py-1 text-[10px] font-medium uppercase tracking-wider text-white/90">
Illustrative preview
</span>
</div>
)
}
