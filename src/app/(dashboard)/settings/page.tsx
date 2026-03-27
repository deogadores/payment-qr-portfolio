import { getSession } from '@/lib/auth/session'
import { db } from '@/lib/db'
import { userSettings, qrCodes } from '@/lib/db/schema'
import { eq, asc } from 'drizzle-orm'
import { redirect } from 'next/navigation'
import { updateSettingsAction } from '@/actions/settings'
import { SettingsClient } from '@/components/settings/settings-client'
import { revalidatePath } from 'next/cache'
import { Suspense } from 'react'

export default async function SettingsPage() {
  const session = await getSession()

  if (!session?.user) {
    redirect('/login')
  }

  // Get or create user settings
  const existingSettings = await db
    .select()
    .from(userSettings)
    .where(eq(userSettings.userId, session.user.id))
    .limit(1)
  let settings = existingSettings[0]

  if (!settings) {
    const createdSettings = await db
      .insert(userSettings)
      .values({ userId: session.user.id, displayStyle: 'carousel' })
      .returning() as (typeof userSettings.$inferSelect)[]
    settings = createdSettings[0]
  }

  // Fetch user's active QR codes for preview
  const userQrCodes = await db
    .select()
    .from(qrCodes)
    .where(eq(qrCodes.userId, session.user.id))
    .orderBy(asc(qrCodes.order))

  async function handleUpdate(data: any): Promise<void> {
    'use server'
    await updateSettingsAction(data)
    revalidatePath('/settings')
  }

  return (
    <Suspense>
      <SettingsClient
        settings={settings}
        qrCodes={userQrCodes}
        userName={session.user.name}
        onSave={handleUpdate}
      />
    </Suspense>
  )
}
