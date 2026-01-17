'use server'

import { auth } from '@/lib/auth/auth'
import { db } from '@/lib/db'
import { registrationPhrases, accessRequests, users } from '@/lib/db/schema'
import { generateRegistrationPhrase } from '@/lib/utils/crypto'
import { eq } from 'drizzle-orm'
import { redirect } from 'next/navigation'
import { sendEmail } from '@/lib/email/resend'
import { accessApprovedEmailTemplate } from '@/lib/email/templates/access-approved'
import { accessRejectedEmailTemplate } from '@/lib/email/templates/access-rejected'

async function requireAdmin() {
  const session = await auth()
  if (!session?.user?.isAdmin) {
    redirect('/dashboard')
  }
  return session
}

export async function generatePhraseAction(expiresIn?: number) {
  try {
    const session = await requireAdmin()

    const phrase = generateRegistrationPhrase()
    const expiresAt = expiresIn
      ? new Date(Date.now() + expiresIn * 60 * 60 * 1000)
      : null

    const [newPhrase] = await db
      .insert(registrationPhrases)
      .values({
        phrase,
        createdBy: session.user.email!,
        expiresAt,
      })
      .returning()

    return { success: true, phrase: newPhrase }
  } catch (error) {
    console.error('Error generating phrase:', error)
    return { success: false, error: 'Failed to generate phrase' }
  }
}

export async function reviewAccessRequestAction(
  requestId: string,
  status: 'approved' | 'rejected'
) {
  try {
    const session = await requireAdmin()

    // Get the access request details first
    const [request] = await db
      .select()
      .from(accessRequests)
      .where(eq(accessRequests.id, requestId))
      .limit(1)

    if (!request) {
      return { success: false, error: 'Request not found' }
    }

    // Update the request status
    await db
      .update(accessRequests)
      .set({
        status,
        reviewedBy: session.user.email!,
        reviewedAt: new Date(),
      })
      .where(eq(accessRequests.id, requestId))

    // If approved, generate a registration phrase and send email
    if (status === 'approved') {
      // Generate a registration phrase (expires in 72 hours)
      const phrase = generateRegistrationPhrase()
      const expiresAt = new Date(Date.now() + 72 * 60 * 60 * 1000) // 72 hours

      await db.insert(registrationPhrases).values({
        phrase,
        createdBy: session.user.email!,
        expiresAt,
      })

      // Send approval email with registration phrase
      const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'

      await sendEmail({
        to: request.email,
        subject: 'Your Access Request Has Been Approved - QR Payment Portfolio',
        html: accessApprovedEmailTemplate({
          name: request.name,
          registrationPhrase: phrase,
          expiresAt,
          appUrl,
        }),
      })
    }

    // If rejected, send rejection email
    if (status === 'rejected') {
      const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'

      await sendEmail({
        to: request.email,
        subject: 'Access Request Update - QR Payment Portfolio',
        html: accessRejectedEmailTemplate({
          name: request.name,
          appUrl,
        }),
      })
    }

    return { success: true }
  } catch (error) {
    console.error('Error reviewing request:', error)
    return { success: false, error: 'Failed to update request' }
  }
}

export async function revokePhraseAction(phraseId: string) {
  try {
    await requireAdmin()

    // Delete the phrase if it hasn't been used
    const [phrase] = await db
      .select()
      .from(registrationPhrases)
      .where(eq(registrationPhrases.id, phraseId))
      .limit(1)

    if (!phrase) {
      return { success: false, error: 'Phrase not found' }
    }

    if (phrase.isUsed) {
      return { success: false, error: 'Cannot revoke a used phrase' }
    }

    await db.delete(registrationPhrases).where(eq(registrationPhrases.id, phraseId))

    return { success: true }
  } catch (error) {
    console.error('Error revoking phrase:', error)
    return { success: false, error: 'Failed to revoke phrase' }
  }
}

export async function getAdminStatsAction() {
  try {
    await requireAdmin()

    const [totalUsers] = await db.select().from(users)
    const [totalPhrases] = await db.select().from(registrationPhrases)
    const [pendingRequests] = await db
      .select()
      .from(accessRequests)
      .where(eq(accessRequests.status, 'pending'))

    return {
      success: true,
      stats: {
        totalUsers: totalUsers.length,
        totalPhrases: totalPhrases.length,
        pendingRequests: pendingRequests.length,
      },
    }
  } catch (error) {
    console.error('Error getting stats:', error)
    return { success: false, error: 'Failed to get statistics' }
  }
}
