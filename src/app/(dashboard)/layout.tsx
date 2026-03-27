import { getSession } from '@/lib/auth/session'
import { redirect } from 'next/navigation'
import { DashboardNav } from '@/components/dashboard/dashboard-nav'
import { Toaster } from '@/components/ui/sonner'
import { Footer } from '@/components/footer'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getSession()

  if (!session?.user) {
    redirect('/login')
  }

  return (
    <>
      <div className="flex-1 flex flex-col bg-background">
        <DashboardNav email={session.user.email} />
        <main className="container mx-auto px-4 py-8 flex-1">{children}</main>
      </div>
      <Footer />
      <Toaster />
    </>
  )
}
