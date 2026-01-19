import { getSession } from '@/lib/auth/session'
import { db } from '@/lib/db'
import { qrCodes } from '@/lib/db/schema'
import { eq, asc } from 'drizzle-orm'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import Image from 'next/image'
import { Plus, Edit, Trash2 } from 'lucide-react'
import { QrCodeActions } from '@/components/qr-management/qr-code-actions'

export default async function QrCodesPage() {
  const session = await getSession()

  const userQrCodes = await db
    .select()
    .from(qrCodes)
    .where(eq(qrCodes.userId, session!.user.id))
    .orderBy(asc(qrCodes.order))

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">My QR Codes</h1>
          <p className="text-muted-foreground">Manage your payment QR codes</p>
        </div>
        <Link href="/qr-codes/upload">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Upload QR Code
          </Button>
        </Link>
      </div>

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
            <Card key={qr.id} className="overflow-hidden group">
              <div className="aspect-square relative bg-muted">
                <Image
                  src={qr.imageUrl}
                  alt={qr.title}
                  fill
                  className="object-contain p-6"
                />
                {!qr.isActive && (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                    <span className="text-white font-semibold">Inactive</span>
                  </div>
                )}
              </div>
              <CardContent className="p-4">
                <div className="space-y-2">
                  <h3 className="font-semibold text-lg truncate">{qr.title}</h3>
                  {qr.description && (
                    <p className="text-sm text-muted-foreground line-clamp-2">{qr.description}</p>
                  )}
                  {qr.accountName && (
                    <p className="text-xs text-muted-foreground">
                      <span className="font-medium">Account:</span> {qr.accountName}
                    </p>
                  )}
                  {qr.accountNumber && (
                    <p className="text-xs text-muted-foreground">
                      <span className="font-medium">Number:</span> {qr.accountNumber}
                    </p>
                  )}
                </div>
                <QrCodeActions qrCode={qr} />
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
