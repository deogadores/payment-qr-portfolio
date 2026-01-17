'use server'

import { auth } from '@/lib/auth/auth'
import { db } from '@/lib/db'
import { qrCodes } from '@/lib/db/schema'
import { eq, and, desc } from 'drizzle-orm'
import { redirect } from 'next/navigation'
import { deleteImage } from '@/lib/blob/storage'
import { revalidatePath } from 'next/cache'

async function requireUser() {
  const session = await auth()
  if (!session?.user) {
    redirect('/login')
  }
  return session
}

export async function createQrCodeAction(data: {
  title: string
  description?: string
  imageUrl: string
  accountName?: string
  accountNumber?: string
}) {
  try {
    const session = await requireUser()

    // Get the current max order
    const existingQrs = await db
      .select()
      .from(qrCodes)
      .where(eq(qrCodes.userId, session.user.id))

    const maxOrder = existingQrs.length > 0 ? Math.max(...existingQrs.map(q => q.order)) : -1

    const newQrCodes = await db
      .insert(qrCodes)
      .values({
        userId: session.user.id,
        ...data,
        order: maxOrder + 1,
      })
      .returning() as (typeof qrCodes.$inferSelect)[]

    revalidatePath('/qr-codes')
    return { success: true, qrCode: newQrCodes[0] }
  } catch (error) {
    console.error('Error creating QR code:', error)
    return { success: false, error: 'Failed to create QR code' }
  }
}

export async function updateQrCodeAction(
  qrCodeId: string,
  data: {
    title?: string
    description?: string
    accountName?: string
    accountNumber?: string
    isActive?: boolean
  }
) {
  try {
    const session = await requireUser()

    const updatedQrCodes = await db
      .update(qrCodes)
      .set(data)
      .where(and(eq(qrCodes.id, qrCodeId), eq(qrCodes.userId, session.user.id)))
      .returning() as (typeof qrCodes.$inferSelect)[]
    const updated = updatedQrCodes[0]

    if (!updated) {
      return { success: false, error: 'QR code not found' }
    }

    revalidatePath('/qr-codes')
    return { success: true, qrCode: updated }
  } catch (error) {
    console.error('Error updating QR code:', error)
    return { success: false, error: 'Failed to update QR code' }
  }
}

export async function deleteQrCodeAction(qrCodeId: string) {
  try {
    const session = await requireUser()

    const qrCodesResult = await db
      .select()
      .from(qrCodes)
      .where(and(eq(qrCodes.id, qrCodeId), eq(qrCodes.userId, session.user.id)))
      .limit(1)
    const qrCode = qrCodesResult[0]

    if (!qrCode) {
      return { success: false, error: 'QR code not found' }
    }

    // Delete the image from blob storage
    if (qrCode.imageUrl) {
      await deleteImage(qrCode.imageUrl)
    }

    // Delete from database
    await db.delete(qrCodes).where(eq(qrCodes.id, qrCodeId))

    revalidatePath('/qr-codes')
    return { success: true }
  } catch (error) {
    console.error('Error deleting QR code:', error)
    return { success: false, error: 'Failed to delete QR code' }
  }
}

export async function updateQrCodeOrderAction(updates: { id: string; order: number }[]) {
  try {
    const session = await requireUser()

    // Update each QR code's order
    await Promise.all(
      updates.map(({ id, order }) =>
        db
          .update(qrCodes)
          .set({ order })
          .where(and(eq(qrCodes.id, id), eq(qrCodes.userId, session.user.id)))
      )
    )

    revalidatePath('/qr-codes')
    return { success: true }
  } catch (error) {
    console.error('Error updating order:', error)
    return { success: false, error: 'Failed to update order' }
  }
}
