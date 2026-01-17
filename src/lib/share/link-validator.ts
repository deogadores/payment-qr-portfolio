import { db } from '@/lib/db'
import { shareLinks, shareLinkLogs } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'

export interface LinkValidationResult {
  valid: boolean
  reason?: string
  link?: typeof shareLinks.$inferSelect
}

/**
 * Validate a share link token
 * Checks if the link exists, hasn't expired, and hasn't been used (for one-time links)
 */
export async function validateShareLink(
  token: string,
  ipAddress?: string,
  userAgent?: string
): Promise<LinkValidationResult> {
  try {
    const links = await db
      .select()
      .from(shareLinks)
      .where(eq(shareLinks.token, token))
      .limit(1)
    const link = links[0]

    if (!link) {
      return { valid: false, reason: 'not_found' }
    }

    // Check if one-time link has been used
    if (link.linkType === 'one-time' && link.isUsed) {
      return { valid: false, reason: 'already_used' }
    }

    // Check if expiring link has expired
    if (link.linkType === 'expiring' && link.expiresAt && link.expiresAt < new Date()) {
      return { valid: false, reason: 'expired' }
    }

    // Update access statistics
    await db
      .update(shareLinks)
      .set({
        accessCount: link.accessCount + 1,
        lastAccessedAt: new Date(),
        ...(link.linkType === 'one-time' ? { isUsed: true, usedAt: new Date() } : {}),
      })
      .where(eq(shareLinks.id, link.id))

    // Log the access (optional)
    if (ipAddress || userAgent) {
      await db.insert(shareLinkLogs).values({
        shareLinkId: link.id,
        ipAddress,
        userAgent,
      })
    }

    return { valid: true, link }
  } catch (error) {
    console.error('Error validating share link:', error)
    return { valid: false, reason: 'validation_error' }
  }
}
