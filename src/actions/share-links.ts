'use server'

import { getSession } from '@/lib/auth/session'
import { db } from '@/lib/db'
import { shareLinks, userSettings } from '@/lib/db/schema'
import { eq, and, desc, inArray, sql } from 'drizzle-orm'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import { createShareLink } from '@/lib/share/link-generator'

async function requireUser() {
  const session = await getSession()
  if (!session?.user) {
    redirect('/login')
  }
  return session
}

export async function createShareLinkAction(data: {
  linkType: 'expiring' | 'one-time'
  expiresIn?: number // hours for expiring links
}) {
  try {
    const session = await requireUser()

    const result = await createShareLink({
      userId: session.user.id,
      linkType: data.linkType,
      expiresIn: data.expiresIn,
    })

    await db
      .insert(userSettings)
      .values({ userId: session.user.id, totalLinksCreated: 1 })
      .onConflictDoUpdate({
        target: userSettings.userId,
        set: { totalLinksCreated: sql`total_links_created + 1` },
      })

    revalidatePath('/share')
    return { success: true, token: result.token, link: result.link }
  } catch (error) {
    console.error('Error creating share link:', error)
    return { success: false, error: 'Failed to create share link' }
  }
}

export async function getShareLinksAction() {
  try {
    const session = await requireUser()

    const allLinks = await db
      .select()
      .from(shareLinks)
      .where(eq(shareLinks.userId, session.user.id))
      .orderBy(desc(shareLinks.createdAt))

    const now = new Date()

    const activeLinks = allLinks.filter((link) => {
      if (link.isRevoked) return false
      if (link.linkType === 'one-time') return !link.isUsed
      return link.expiresAt !== null && link.expiresAt > now
    })

    const allPastLinks = allLinks.filter((link) => {
      if (link.isRevoked) return true
      if (link.linkType === 'one-time') return link.isUsed
      return link.expiresAt === null || link.expiresAt <= now
    })

    // Delete records beyond the 10 most recent past links
    if (allPastLinks.length > 10) {
      const toDelete = allPastLinks.slice(10).map((l) => l.id)
      await db.delete(shareLinks).where(inArray(shareLinks.id, toDelete))
    }

    const pastLinks = allPastLinks.slice(0, 10)

    return { success: true, links: allLinks, activeLinks, pastLinks }
  } catch (error) {
    console.error('Error fetching share links:', error)
    return { success: false, error: 'Failed to fetch share links', links: [], activeLinks: [], pastLinks: [] }
  }
}

export async function revokeShareLinkAction(linkId: string) {
  try {
    const session = await requireUser()

    await db
      .update(shareLinks)
      .set({ isRevoked: true, revokedAt: new Date() })
      .where(and(eq(shareLinks.id, linkId), eq(shareLinks.userId, session.user.id)))

    revalidatePath('/share')
    return { success: true }
  } catch (error) {
    console.error('Error revoking share link:', error)
    return { success: false, error: 'Failed to revoke share link' }
  }
}
