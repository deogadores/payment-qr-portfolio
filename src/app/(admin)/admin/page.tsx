import { db } from '@/lib/db'
import { users, registrationPhrases, accessRequests, qrCodes } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Users, Key, Inbox, QrCode } from 'lucide-react'
import { PhraseGenerator } from '@/components/admin/phrase-generator'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default async function AdminDashboardPage() {
  // Fetch statistics
  const allUsers = await db.select().from(users)
  const allPhrases = await db.select().from(registrationPhrases)
  const pendingRequests = await db
    .select()
    .from(accessRequests)
    .where(eq(accessRequests.status, 'pending'))
  const allQrCodes = await db.select().from(qrCodes)

  const stats = [
    {
      title: 'Total Users',
      value: allUsers.length,
      icon: Users,
      href: '/admin/users',
      color: 'bg-blue-500',
    },
    {
      title: 'Registration Phrases',
      value: allPhrases.length,
      icon: Key,
      href: '/admin/registration-phrases',
      color: 'bg-purple-500',
    },
    {
      title: 'Pending Requests',
      value: pendingRequests.length,
      icon: Inbox,
      href: '/admin/access-requests',
      color: 'bg-orange-500',
    },
    {
      title: 'Total QR Codes',
      value: allQrCodes.length,
      icon: QrCode,
      href: '/admin/users',
      color: 'bg-green-500',
    },
  ]

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
        <p className="text-muted-foreground">
          Manage users, registration phrases, and access requests
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <Link key={stat.title} href={stat.href}>
              <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    {stat.title}
                  </CardTitle>
                  <div className={`${stat.color} p-2 rounded-lg`}>
                    <Icon className="h-4 w-4 text-white" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{stat.value}</div>
                </CardContent>
              </Card>
            </Link>
          )
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <PhraseGenerator />

        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Link href="/admin/access-requests">
              <Button variant="outline" className="w-full justify-start">
                <Inbox className="mr-2 h-4 w-4" />
                Review Access Requests
                {pendingRequests.length > 0 && (
                  <span className="ml-auto bg-orange-500 text-white text-xs px-2 py-1 rounded-full">
                    {pendingRequests.length}
                  </span>
                )}
              </Button>
            </Link>
            <Link href="/admin/users">
              <Button variant="outline" className="w-full justify-start">
                <Users className="mr-2 h-4 w-4" />
                Manage Users
              </Button>
            </Link>
            <Link href="/admin/registration-phrases">
              <Button variant="outline" className="w-full justify-start">
                <Key className="mr-2 h-4 w-4" />
                View All Phrases
              </Button>
            </Link>
            <Link href="/dashboard">
              <Button variant="outline" className="w-full justify-start">
                Switch to User View
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
