import { LoginForm } from '@/components/auth/login-form'
import { getSession } from '@/lib/auth/session'
import { redirect } from 'next/navigation'

export default async function LoginPage() {
  const session = await getSession()
  if (session?.user) redirect('/dashboard')
  return <LoginForm />
}
