import { getSession } from '@/lib/auth/session'
import { db } from '@/lib/db'
import { qrCodes } from '@/lib/db/schema'
import { eq, and } from 'drizzle-orm'
import { redirect, notFound } from 'next/navigation'
import { EditForm } from '@/components/qr-management/edit-form'

export default async function EditQrPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await getSession()
  if (!session?.user) redirect('/login')

  const { id } = await params

  const result = await db
    .select()
    .from(qrCodes)
    .where(and(eq(qrCodes.id, id), eq(qrCodes.userId, session.user.id)))
    .limit(1)

  const qrCode = result[0]
  if (!qrCode) notFound()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Edit QR Code</h1>
        <p className="text-muted-foreground">Update your payment QR code details</p>
      </div>
      <EditForm qrCode={qrCode} />
    </div>
  )
}
