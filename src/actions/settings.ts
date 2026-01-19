'use server'

import { getSession } from '@/lib/auth/session'
import { db } from '@/lib/db'
import { userSettings } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'

async function requireUser() {
  const session = await getSession()
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
    const existingSettings = await db
      .select()
      .from(userSettings)
      .where(eq(userSettings.userId, session.user.id))
      .limit(1)
    const existing = existingSettings[0]

    if (existing) {
      // Update existing settings
      const updatedSettings = await db
        .update(userSettings)
        .set(data)
        .where(eq(userSettings.userId, session.user.id))
        .returning() as (typeof userSettings.$inferSelect)[]

      revalidatePath('/settings')
      return { success: true, settings: updatedSettings[0] }
    } else {
      // Create new settings
      const createdSettings = await db
        .insert(userSettings)
        .values({
          userId: session.user.id,
          ...data,
        })
        .returning() as (typeof userSettings.$inferSelect)[]

      revalidatePath('/settings')
      return { success: true, settings: createdSettings[0] }
    }
  } catch (error) {
    console.error('Error updating settings:', error)
    return { success: false, error: 'Failed to update settings' }
  }
}

export async function uploadLogoAction(imageUrl: string) {
  try {
    const session = await requireUser()

    const updatedSettings = await db
      .update(userSettings)
      .set({ logoUrl: imageUrl })
      .where(eq(userSettings.userId, session.user.id))
      .returning() as (typeof userSettings.$inferSelect)[]

    revalidatePath('/settings')
    return { success: true, settings: updatedSettings[0] }
  } catch (error) {
    console.error('Error uploading logo:', error)
    return { success: false, error: 'Failed to upload logo' }
  }
}
