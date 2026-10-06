'use client'

import { useState } from 'react'
import type { FormEvent } from 'react'
import Link from 'next/link'
import { getSupabaseBrowserClient, hasSupabaseConfig } from '../lib/supabase/client'

const inputClass =
  'mt-1 w-full rounded border border-stone-300 bg-white px-3 py-2.5 text-sm text-stone-900 outline-none focus:border-[#315b48] focus:ring-2 focus:ring-[#315b48]/20'
const labelClass = 'block text-sm font-medium text-stone-700'

type ContactInquiryFormProps = {
  /** Slug of the property the visitor is asking about (from /contact?property=...) */
  propertySlug?: string | null
  /** Display name for that property, looked up on the server */
  propertyName?: string | null
}

export default function ContactInquiryForm({ propertySlug = null, propertyName = null }: ContactInquiryFormProps) {
  const [submitting, setSubmitting] = useState(false)
  const [notice, setNotice] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
  const hasProperty = Boolean(propertySlug && propertyName)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setNotice(null)

    if (!hasSupabaseConfig()) {
      setNotice({
        type: 'error',
        text: 'The contact form is not configured yet. Please try again later.',
      })
      return
    }

    const form = event.currentTarget
    const formData = new FormData(form)
    const inquiry = {
      full_name: String(formData.get('full_name') ?? '').trim(),
      email: String(formData.get('email') ?? '').trim(),
      phone: String(formData.get('phone') ?? '').trim() || null,
      inquiry_type: String(formData.get('inquiry_type') ?? ''),
      message: String(formData.get('message') ?? '').trim(),
      property_slug: hasProperty ? propertySlug : null,
    }

    setSubmitting(true)
    try {
      const { error } = await getSupabaseBrowserClient()
        .from('contact_inquiries')
        .insert(inquiry)

      if (error) {
        const errorMessage =
          error.code === 'PGRST204' || error.code === 'PGRST205'
            ? 'The contact form database is missing a table or column. Run supabase/contact-inquiries.sql in the Supabase SQL Editor, then try again.'
            : error.code === '23514'
              ? 'The database rejected this inquiry topic. Run the latest supabase/contact-inquiries.sql in the Supabase SQL Editor, then try again.'
              : error.code === '42501'
                ? 'Supabase is not allowing contact form submissions. Check the contact_inquiries table permissions and row-level security policy.'
                : `We could not save your message (database error ${error.code}). Check the contact_inquiries table setup in Supabase.`
        setNotice({
          type: 'error',
          text: errorMessage,
        })
        return
      }

      form.reset()
      setNotice({
        type: 'success',
        text: 'Thanks for reaching out. Your message has been received.',
      })
    } catch (cause) {
      setNotice({
        type: 'error',
        text:
          cause instanceof Error
            ? `We could not submit your message: ${cause.message}`
            : 'We could not submit your message because of an unexpected error.',
      })
      setTimeout(() => {
        setNotice(null)
      }, 10000)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mt-6 space-y-4">
      {hasProperty && (
        <div className="rounded border border-stone-200 bg-[#f4f1e8] px-4 py-3 text-sm text-stone-700">
          <span className="text-stone-500">Asking about:</span>{' '}
          <Link
            href={`/properties/${propertySlug}`}
            className="font-medium text-[#315b48] hover:underline"
          >
            {propertyName}
          </Link>
        </div>
      )}

      <div>
        <label htmlFor="contact-name" className={labelClass}>Name</label>
        <input
          id="contact-name"
          name="full_name"
          type="text"
          autoComplete="name"
          maxLength={120}
          required
          className={inputClass}
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="contact-email" className={labelClass}>Email</label>
          <input
            id="contact-email"
            name="email"
            type="email"
            autoComplete="email"
            maxLength={254}
            required
            className={inputClass}
          />
        </div>
        <div>
          <label htmlFor="contact-phone" className={labelClass}>
            Phone <span className="font-normal text-stone-500">(optional)</span>
          </label>
          <input
            id="contact-phone"
            name="phone"
            type="tel"
            autoComplete="tel"
            maxLength={40}
            className={inputClass}
          />
        </div>
      </div>

      <div>
        <label htmlFor="contact-topic" className={labelClass}>What can we help with?</label>
        <select
          id="contact-topic"
          name="inquiry_type"
          required
          defaultValue=""
          className={inputClass}
        >
          <option value="" disabled>Select a topic</option>
          {hasProperty ? (
            <>
              <option value="property_viewing">Schedule a viewing</option>
              <option value="property_availability">Is it still available?</option>
              <option value="property_terms">Price or lease terms</option>
              <option value="property_other">Other question about this property</option>
            </>
          ) : (
            <>
              <option value="buying">Buying a home</option>
              <option value="renting">Renting a home</option>
              <option value="selling">Selling a property</option>
              <option value="general">General question</option>
            </>
          )}
        </select>
      </div>

      <div>
        <label htmlFor="contact-message" className={labelClass}>Message</label>
        <textarea
          id="contact-message"
          name="message"
          rows={4}
          minLength={10}
          maxLength={5000}
          required
          className={inputClass}
        />
      </div>

      <p className="text-xs leading-5 text-stone-500">
        Please don&apos;t include sensitive financial or personal information.
      </p>

      {notice && (
        <p
          role={notice.type === 'error' ? 'alert' : 'status'}
          aria-live={notice.type === 'error' ? 'assertive' : 'polite'}
          className={`text-sm ${notice.type === 'error' ? 'text-red-700' : 'text-[#315b48]'}`}
        >
          {notice.text}
        </p>
      )}

      <button
        type="submit"
        disabled={submitting}
        className="inline-flex min-h-12 w-full items-center justify-center rounded bg-[#315b48] px-5 text-sm font-semibold text-white transition hover:bg-[#244636] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#315b48] disabled:cursor-wait disabled:opacity-60"
      >
        {submitting ? 'Sending…' : 'Send message'}
      </button>
    </form>
  )
}