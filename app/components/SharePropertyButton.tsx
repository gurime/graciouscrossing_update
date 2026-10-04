'use client'

import { useState } from 'react'
import { Check, Share2 } from 'lucide-react'

export default function SharePropertyButton() {
  const [message, setMessage] = useState('')

  const shareProperty = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href)
      setMessage('Link copied')
    } catch {
      setMessage('Could not copy link')
    }
  }

  return (
    <div className="flex flex-col items-end gap-1">
      <button
        className="inline-flex min-h-10 items-center gap-2 rounded border border-stone-300 bg-white px-3 text-sm font-medium text-stone-700 hover:bg-stone-50 focus-visible:outline-2 focus-visible:outline-[#315b48]"
        type="button"
        onClick={shareProperty}
        aria-label="Copy property link"
      >
        {message === 'Link copied' ? <Check size={16} aria-hidden="true" /> : <Share2 size={16} aria-hidden="true" />}
        Share
      </button>
      <span aria-live="polite" className="text-xs text-stone-500">{message}</span>
    </div>
  )
}
