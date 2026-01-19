import { getSession } from '@/lib/auth/session'
import { db } from '@/lib/db'
import { qrCodes, shareLinks } from '@/lib/db/schema'
import { eq, and, gte } from 'drizzle-orm'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { QrCode, Share2, Eye, Plus } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'

export default async function DashboardPage() {
  const session = await getSession()

  // Fetch user's QR codes
  const userQrCodes = await db
    .select()
    .from(qrCodes)
    .where(eq(qrCodes.userId, session!.user.id))

  // Fetch active share links
  const activeLinks = await db
    .select()
    .from(shareLinks)
    .where(
      and(
        eq(shareLinks.userId, session!.user.id),
        gte(shareLinks.expiresAt, new Date())
      )
    )

  // Calculate total views
  const totalViews = activeLinks.reduce((sum, link) => sum + link.accessCount, 0)

  const stats = [
    {
      title: 'Total QR Codes',
      value: userQrCodes.length,
      icon: QrCode,
      href: '/qr-codes',
      color: 'bg-blue-500',
    },
    {
      title: 'Active Share Links',
      value: activeLinks.length,
      icon: Share2,
      href: '/share',
      color: 'bg-green-500',
    },
    {
      title: 'Total Views',
      value: totalViews,
      icon: Eye,
      href: '/share',
      color: 'bg-purple-500',
    },
  ]

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">
            Welcome back, {session!.user.name || 'User'}!
          </h1>
          <p className="text-muted-foreground">Manage your QR payment codes and share links</p>
        </div>
        <Link href="/qr-codes/upload">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Upload QR Code
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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

      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold">Recent QR Codes</h2>
          <Link href="/qr-codes">
            <Button variant="outline" size="sm">
              View All
            </Button>
          </Link>
        </div>

        {userQrCodes.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <QrCode className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No QR Codes Yet</h3>
              <p className="text-muted-foreground mb-4">
                Upload your first payment QR code to get started
              </p>
              <Link href="/qr-codes/upload">
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Upload QR Code
                </Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {userQrCodes.slice(0, 6).map((qr) => (
              <Card key={qr.id} className="overflow-hidden">
                <div className="aspect-square relative bg-muted">
                  <Image
                    src={qr.imageUrl}
                    alt={qr.title}
                    fill
                    className="object-contain p-4"
                  />
                </div>
                <CardContent className="p-4">
                  <h3 className="font-semibold truncate">{qr.title}</h3>
                  {qr.description && (
                    <p className="text-sm text-muted-foreground truncate">{qr.description}</p>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
