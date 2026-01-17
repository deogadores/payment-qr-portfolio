import { auth } from '@/lib/auth/auth'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { logoutAction } from '@/actions/auth'
import { Shield, Users, Key, LayoutDashboard, LogOut } from 'lucide-react'

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth()

  if (!session?.user?.isAdmin) {
    redirect('/dashboard')
  }

  return (
    <div className="min-h-screen bg-gray-900">
      <nav className="bg-gray-800 border-b border-gray-700">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-8">
              <div className="flex items-center gap-2">
                <Shield className="h-6 w-6 text-indigo-400" />
                <span className="font-bold text-xl text-white">Admin Panel</span>
              </div>
              <div className="hidden md:flex items-center gap-4">
                <Link href="/admin">
                  <Button variant="ghost" size="sm">
                    <LayoutDashboard className="h-4 w-4 mr-2" />
                    Dashboard
                  </Button>
                </Link>
                <Link href="/admin/access-requests">
                  <Button variant="ghost" size="sm">
                    <Users className="h-4 w-4 mr-2" />
                    Access Requests
                  </Button>
                </Link>
                <Link href="/admin/registration-phrases">
                  <Button variant="ghost" size="sm">
                    <Key className="h-4 w-4 mr-2" />
                    Registration Phrases
                  </Button>
                </Link>
                <Link href="/admin/users">
                  <Button variant="ghost" size="sm">
                    <Users className="h-4 w-4 mr-2" />
                    Users
                  </Button>
                </Link>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-300">{session.user.email}</span>
              <form action={logoutAction}>
                <Button variant="outline" size="sm" type="submit">
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </Button>
              </form>
            </div>
          </div>
        </div>
      </nav>
      <main className="container mx-auto px-4 py-8">{children}</main>
    </div>
  )
}
