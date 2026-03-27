import { getSession } from '@/lib/auth/session'
import { db } from '@/lib/db'
import { userSettings } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'
import { redirect } from 'next/navigation'
import { updateSettingsAction } from '@/actions/settings'
import { DisplaySettings } from '@/components/settings/display-settings'
import { AppearanceSettings } from '@/components/settings/appearance-settings'
import { PageSettings } from '@/components/settings/page-settings'
import { SettingsTabs } from '@/components/settings/settings-tabs'
import { revalidatePath } from 'next/cache'
import { Suspense } from 'react'

const VALID_TABS = ['display', 'appearance', 'page'] as const
type TabValue = (typeof VALID_TABS)[number]

export default async function SettingsPage({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string }>
}) {
  const session = await getSession()

  if (!session?.user) {
    redirect('/login')
  }

  const { tab } = await searchParams
  const activeTab: TabValue = VALID_TABS.includes(tab as TabValue) ? (tab as TabValue) : 'display'

  // Get or create user settings
  const existingSettings = await db
    .select()
    .from(userSettings)
    .where(eq(userSettings.userId, session.user.id))
    .limit(1)
  let settings = existingSettings[0]

  if (!settings) {
    // Create default settings
    const createdSettings = await db
      .insert(userSettings)
      .values({
        userId: session.user.id,
        displayStyle: 'carousel',
      })
      .returning() as (typeof userSettings.$inferSelect)[]
    settings = createdSettings[0]
  }

  async function handleUpdate(data: any): Promise<void> {
    'use server'
    await updateSettingsAction(data)
    revalidatePath('/settings')
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Settings</h1>
        <p className="text-sm text-muted-foreground mt-1">Customize your payment page appearance and behavior</p>
      </div>

      <Suspense>
        <SettingsTabs
          activeTab={activeTab}
          tabs={[
            { value: 'display', label: 'Display', content: <DisplaySettings settings={settings} onUpdate={handleUpdate} /> },
            { value: 'appearance', label: 'Appearance', content: <AppearanceSettings settings={settings} onUpdate={handleUpdate} /> },
            { value: 'page', label: 'Page Info', content: <PageSettings settings={settings} onUpdate={handleUpdate} /> },
          ]}
        />
      </Suspense>
    </div>
  )
}
