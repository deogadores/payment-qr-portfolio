import { db } from '@/lib/db'
import { users, qrCodes } from '@/lib/db/schema'
import { desc, eq, count } from 'drizzle-orm'
import { Card, CardContent } from '@/components/ui/card'
import { Shield, QrCode as QrCodeIcon } from 'lucide-react'

export default async function UsersPage() {
  const allUsers = await db.select().from(users).orderBy(desc(users.createdAt)) as (typeof users.$inferSelect)[]

  // Get QR code counts for each user
  const userStats = await Promise.all(
    allUsers.map(async (user) => {
      const qrCountResult = await db
        .select({ count: count() })
        .from(qrCodes)
        .where(eq(qrCodes.userId, user.id)) as { count: number }[]
      const qrCount = qrCountResult[0]

      return {
        ...user,
        qrCodeCount: qrCount?.count || 0,
      }
    })
  )

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Users</h1>
        <p className="text-muted-foreground">View all registered users and their statistics</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {userStats.map((user) => (
          <Card key={user.id}>
            <CardContent className="p-6">
              <div className="space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-semibold text-lg">{user.name || 'No name'}</h3>
                    <p className="text-sm text-muted-foreground">{user.email}</p>
                  </div>
                  {user.isAdmin && (
                    <div className="bg-purple-100 p-1.5 rounded">
                      <Shield className="h-4 w-4 text-purple-600" />
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <QrCodeIcon className="h-4 w-4" />
                  <span>{user.qrCodeCount} QR Code{user.qrCodeCount !== 1 ? 's' : ''}</span>
                </div>

                <div className="text-xs text-muted-foreground space-y-1">
                  <p>
                    <span className="font-medium">Joined:</span>{' '}
                    {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'Unknown'}
                  </p>
                  <p>
                    <span className="font-medium">Role:</span>{' '}
                    {user.isAdmin ? 'Admin' : 'User'}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {userStats.length === 0 && (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground">No users found</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
