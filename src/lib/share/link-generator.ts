import { db } from '@/lib/db'
import { shareLinks } from '@/lib/db/schema'
import { generateToken } from '@/lib/utils/crypto'

interface CreateShareLinkOptions {
  userId: string
  linkType: 'expiring' | 'one-time'
  expiresIn?: number // hours
}

export async function createShareLink(options: CreateShareLinkOptions) {
  const { userId, linkType, expiresIn } = options

  const token = generateToken()

  const expiresAt =
    linkType === 'expiring' && expiresIn
      ? new Date(Date.now() + expiresIn * 60 * 60 * 1000)
      : null

  const links = await db
    .insert(shareLinks)
    .values({
      userId,
      token,
      linkType,
      expiresAt,
    })
    .returning() as (typeof shareLinks.$inferSelect)[]
  const link = links[0]

  const url = `${process.env.NEXT_PUBLIC_APP_URL}/share/${token}`

  return { url, link }
}
