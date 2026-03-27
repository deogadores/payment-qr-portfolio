import { db } from '@/lib/db'
import { shareLinks, shareLinkLogs, userSettings } from '@/lib/db/schema'
import { eq, and, sql } from 'drizzle-orm'
import { createHash } from 'crypto'

export interface LinkValidationResult {
  valid: boolean
  reason?: string
  link?: typeof shareLinks.$inferSelect
}

/**
 * Produces a short fingerprint from IP + User-Agent.
 * Used to deduplicate views from the same visitor.
 */
function visitorFingerprint(ipAddress?: string, userAgent?: string): string | null {
  if (!ipAddress && !userAgent) return null
  return createHash('sha256')
    .update(`${ipAddress ?? ''}|${userAgent ?? ''}`)
    .digest('hex')
    .slice(0, 16)
}

/**
 * Validate a share link token.
 * Counts a view only once per unique visitor (fingerprinted by IP + User-Agent).
 * Falls back to counting every request when neither value is available.
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

    if (!link) return { valid: false, reason: 'not_found' }
    if (link.isRevoked) return { valid: false, reason: 'revoked' }
    if (link.linkType === 'one-time' && link.isUsed) return { valid: false, reason: 'already_used' }
    if (link.linkType === 'expiring' && link.expiresAt && link.expiresAt < new Date()) {
      return { valid: false, reason: 'expired' }
    }

    // Determine whether this is a new unique visitor
    const fingerprint = visitorFingerprint(ipAddress, userAgent)
    let isUniqueVisitor = true

    if (fingerprint) {
      const existing = await db
        .select({ id: shareLinkLogs.id })
        .from(shareLinkLogs)
        .where(
          and(
            eq(shareLinkLogs.shareLinkId, link.id),
            eq(shareLinkLogs.visitorFingerprint, fingerprint)
          )
        )
        .limit(1)
      isUniqueVisitor = existing.length === 0
    }

    // Always update lastAccessedAt; only increment counts for unique visitors
    await db
      .update(shareLinks)
      .set({
        lastAccessedAt: new Date(),
        ...(isUniqueVisitor ? { accessCount: link.accessCount + 1 } : {}),
        ...(link.linkType === 'one-time' ? { isUsed: true, usedAt: new Date() } : {}),
      })
      .where(eq(shareLinks.id, link.id))

    if (isUniqueVisitor) {
      await db
        .insert(userSettings)
        .values({ userId: link.userId, totalViews: 1 })
        .onConflictDoUpdate({
          target: userSettings.userId,
          set: { totalViews: sql`total_views + 1` },
        })
    }

    // Always log the visit (raw access log, not deduplicated)
    await db.insert(shareLinkLogs).values({
      shareLinkId: link.id,
      ipAddress,
      userAgent,
      visitorFingerprint: fingerprint ?? undefined,
    })

    return { valid: true, link }
  } catch (error) {
    console.error('Error validating share link:', error)
    return { valid: false, reason: 'validation_error' }
  }
}
