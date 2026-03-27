import { Suspense } from 'react'
import { RegisterForm } from '@/components/auth/register-form'
import { getSession } from '@/lib/auth/session'
import { redirect } from 'next/navigation'

export default async function RegisterPage() {
  const session = await getSession()
  if (session?.user) redirect('/dashboard')
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <RegisterForm />
    </Suspense>
  )
}
