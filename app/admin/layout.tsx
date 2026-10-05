'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { useAuth } from '../hooks/useAuth'

export default function OwnerLayout({ children }: { children: React.ReactNode }) {
  const { user, profile, loading, error } = useAuth()
  const pathname = usePathname()
  const router = useRouter()
  const canManageProperties = profile?.role === 'owner' || profile?.role === 'admin'

  useEffect(() => {
    if (!loading && !user) {
      router.replace(`/login?redirect=${encodeURIComponent(pathname)}`)
    }
  }, [loading, pathname, router, user])

  if (loading) {
    return <main className="flex-1 px-5 py-20 text-center text-sm text-stone-600">Checking your account…</main>
  }

  if (error) {
    return (
      <main className="flex-1 px-5 py-20 text-center">
        <h1 className="font-serif text-3xl text-[#24372c]">We couldn&apos;t verify your account</h1>
        <p className="mx-auto mt-3 max-w-xl text-sm text-stone-600">{error.message}</p>
      </main>
    )
  }

  if (!user) {
    return <main className="flex-1 px-5 py-20 text-center text-sm text-stone-600">Taking you to sign in…</main>
  }

  if (!canManageProperties) {
    return (
      <main className="flex-1 px-5 py-20 text-center">
        <h1 className="font-serif text-3xl text-[#24372c]">Owner access is required</h1>
        <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-stone-600">
          Regular accounts can request property-owner access from the account page. Once an administrator approves your request, you can create and manage listings here.
        </p>
        <Link href="/account" className="mt-6 inline-flex rounded bg-[#315b48] px-5 py-3 text-sm font-semibold text-white">
          Go to my account
        </Link>
      </main>
    )
  }

  return <>{children}</>
}
