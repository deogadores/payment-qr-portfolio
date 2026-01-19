'use server'

import { getSession } from '@/lib/auth/session'
import { db } from '@/lib/db'
import { shareLinks } from '@/lib/db/schema'
import { eq, and, desc } from 'drizzle-orm'
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

    revalidatePath('/share')
    return { success: true, url: result.url, link: result.link }
  } catch (error) {
    console.error('Error creating share link:', error)
    return { success: false, error: 'Failed to create share link' }
  }
}

export async function getShareLinksAction() {
  try {
    const session = await requireUser()

    const links = await db
      .select()
      .from(shareLinks)
      .where(eq(shareLinks.userId, session.user.id))
      .orderBy(desc(shareLinks.createdAt))

    return { success: true, links }
  } catch (error) {
    console.error('Error fetching share links:', error)
    return { success: false, error: 'Failed to fetch share links', links: [] }
  }
}

export async function revokeShareLinkAction(linkId: string) {
  try {
    const session = await requireUser()

    // Delete the link (only if it belongs to the user)
    await db
      .delete(shareLinks)
      .where(and(eq(shareLinks.id, linkId), eq(shareLinks.userId, session.user.id)))

    revalidatePath('/share')
    return { success: true }
  } catch (error) {
    console.error('Error revoking share link:', error)
    return { success: false, error: 'Failed to revoke share link' }
  }
}
