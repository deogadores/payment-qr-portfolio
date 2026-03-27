import { ResetPasswordForm } from '@/components/auth/reset-password-form'
import { redirect } from 'next/navigation'

interface ResetPasswordPageProps {
  searchParams: Promise<{ token?: string }>
}

export default async function ResetPasswordPage({ searchParams }: ResetPasswordPageProps) {
  const { token } = await searchParams
  if (!token) redirect('/forgot-password')
  return <ResetPasswordForm token={token} />
}
