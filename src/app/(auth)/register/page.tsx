import { Suspense } from 'react'
import Link from 'next/link'
import { RegisterForm } from '@/components/auth/register-form'
import { getSession } from '@/lib/auth/session'
import { redirect } from 'next/navigation'

export default async function RegisterPage() {
  const session = await getSession()
  if (session?.user) redirect('/dashboard')
  return (
    <>
      <Link href="/" className="absolute top-3 left-3 text-sm text-muted-foreground hover:text-foreground transition-colors">
        ← Back
      </Link>
      <Suspense fallback={<div>Loading...</div>}>
        <RegisterForm />
      </Suspense>
    </>
  )
}
