import { getSession } from '@/lib/auth/session'
import { db } from '@/lib/db'
import { qrCodes, shareLinks, userSettings } from '@/lib/db/schema'
import { eq, and, gte, or, asc } from 'drizzle-orm'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { QrCodeCard } from '@/components/qr-management/qr-code-card'
import { Button } from '@/components/ui/button'
import { QrCode, Share2, Eye, Plus, Link as LinkIcon } from 'lucide-react'
import Link from 'next/link'

export default async function DashboardPage() {
  const session = await getSession()

  // Fetch user's QR codes
  const userQrCodes = await db
    .select()
    .from(qrCodes)
    .where(eq(qrCodes.userId, session!.user.id))
    .orderBy(asc(qrCodes.order))

  const now = new Date()

  // Fetch active share links — excludes revoked, used one-time, and expired
  const activeLinks = await db
    .select()
    .from(shareLinks)
    .where(
      and(
        eq(shareLinks.userId, session!.user.id),
        eq(shareLinks.isRevoked, false),
        or(
          and(eq(shareLinks.linkType, 'one-time'), eq(shareLinks.isUsed, false)),
          and(eq(shareLinks.linkType, 'expiring'), gte(shareLinks.expiresAt, now))
        )
      )
    )

  const settings = await db
    .select({ totalViews: userSettings.totalViews, totalLinksCreated: userSettings.totalLinksCreated })
    .from(userSettings)
    .where(eq(userSettings.userId, session!.user.id))
    .limit(1)

  const totalViews = settings[0]?.totalViews ?? 0
  const totalLinksCreated = settings[0]?.totalLinksCreated ?? 0

  const stats = [
    {
      title: 'Total QR Codes',
      value: userQrCodes.length,
      icon: QrCode,
      href: '/dashboard',
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
      title: 'Total Unique Views',
      value: totalViews,
      icon: Eye,
      href: '/share',
      color: 'bg-purple-500',
    },
    {
      title: 'Links Created',
      value: totalLinksCreated,
      icon: LinkIcon,
      href: '/share',
      color: 'bg-amber-500',
    },
  ]

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">
            Welcome back, {session!.user.name || 'User'}!
          </h1>
          <p className="text-sm text-muted-foreground mt-1">Manage your QR payment codes and share links</p>
        </div>
        <Link href="/qr-codes/upload" className="shrink-0">
          <Button className="w-full sm:w-auto">
            <Plus className="h-4 w-4 mr-2" />
            Upload QR Code
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
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
        <h2 className="text-2xl font-bold mb-4">My QR Codes</h2>

        {userQrCodes.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <div className="max-w-md mx-auto">
                <div className="h-16 w-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                  <Plus className="h-8 w-8 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-semibold mb-2">No QR Codes Yet</h3>
                <p className="text-muted-foreground mb-4">
                  Start building your payment QR portfolio by uploading your first QR code
                </p>
                <Link href="/qr-codes/upload">
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Upload Your First QR Code
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {userQrCodes.map((qr) => (
              <QrCodeCard key={qr.id} qr={qr} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
