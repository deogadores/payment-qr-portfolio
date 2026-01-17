'use server'

import { auth } from '@/lib/auth/auth'
import { db } from '@/lib/db'
import { userSettings } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'

async function requireUser() {
  const session = await auth()
  if (!session?.user) {
    redirect('/login')
  }
  return session
}

export async function updateSettingsAction(data: {
  displayStyle?: 'carousel' | 'grid' | 'single'
  primaryColor?: string
  secondaryColor?: string
  backgroundColor?: string
  customCss?: string
  showAccountDetails?: boolean
  pageTitle?: string
  pageDescription?: string
}) {
  try {
    const session = await requireUser()

    // Get or create settings
    const [existing] = await db
      .select()
      .from(userSettings)
      .where(eq(userSettings.userId, session.user.id))
      .limit(1)

    if (existing) {
      // Update existing settings
      const [updated] = await db
        .update(userSettings)
        .set(data)
        .where(eq(userSettings.userId, session.user.id))
        .returning()

      revalidatePath('/settings')
      return { success: true, settings: updated }
    } else {
      // Create new settings
      const [created] = await db
        .insert(userSettings)
        .values({
          userId: session.user.id,
          ...data,
        })
        .returning()

      revalidatePath('/settings')
      return { success: true, settings: created }
    }
  } catch (error) {
    console.error('Error updating settings:', error)
    return { success: false, error: 'Failed to update settings' }
  }
}

export async function uploadLogoAction(imageUrl: string) {
  try {
    const session = await requireUser()

    const [updated] = await db
      .update(userSettings)
      .set({ logoUrl: imageUrl })
      .where(eq(userSettings.userId, session.user.id))
      .returning()

    revalidatePath('/settings')
    return { success: true, settings: updated }
  } catch (error) {
    console.error('Error uploading logo:', error)
    return { success: false, error: 'Failed to upload logo' }
  }
}
