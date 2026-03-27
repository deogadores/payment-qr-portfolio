import { ForgotPasswordForm } from '@/components/auth/forgot-password-form'
import { getSession } from '@/lib/auth/session'
import { redirect } from 'next/navigation'

export default async function ForgotPasswordPage() {
  const session = await getSession()
  if (session?.user) redirect('/dashboard')
  return <ForgotPasswordForm />
}
