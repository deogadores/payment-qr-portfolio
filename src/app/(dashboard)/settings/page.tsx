import { getSession } from '@/lib/auth/session'
import { db } from '@/lib/db'
import { userSettings } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'
import { redirect } from 'next/navigation'
import { updateSettingsAction } from '@/actions/settings'
import { DisplaySettings } from '@/components/settings/display-settings'
import { AppearanceSettings } from '@/components/settings/appearance-settings'
import { PageSettings } from '@/components/settings/page-settings'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { revalidatePath } from 'next/cache'

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
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Settings</h1>
        <p className="text-muted-foreground">Customize your payment page appearance and behavior</p>
      </div>

      <Tabs defaultValue="display" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="display">Display</TabsTrigger>
          <TabsTrigger value="appearance">Appearance</TabsTrigger>
          <TabsTrigger value="page">Page Info</TabsTrigger>
        </TabsList>

        <TabsContent value="display" className="space-y-4">
          <DisplaySettings settings={settings} onUpdate={handleUpdate} />
        </TabsContent>

        <TabsContent value="appearance" className="space-y-4">
          <AppearanceSettings settings={settings} onUpdate={handleUpdate} />
        </TabsContent>

        <TabsContent value="page" className="space-y-4">
          <PageSettings settings={settings} onUpdate={handleUpdate} />
        </TabsContent>
      </Tabs>
    </div>
  )
}
