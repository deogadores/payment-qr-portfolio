'use client'

import { useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Save } from 'lucide-react'
import { toast } from 'sonner'
import { DisplaySettings } from './display-settings'
import { AppearanceSettings } from './appearance-settings'
import { PageSettings } from './page-settings'
import { SettingsTabs } from './settings-tabs'
import { PreviewButton } from './preview-button'

type QrCode = {
  id: string
  title: string
  description: string | null
  imageUrl: string
  accountName: string | null
  accountNumber: string | null
  isActive: boolean
}

type InitialSettings = {
  displayStyle?: string | null
  primaryColor?: string | null
  secondaryColor?: string | null
  backgroundColor?: string | null
  logoUrl?: string | null
  showAccountDetails?: boolean | null
  showDownloadButton?: boolean | null
  pageTitle?: string | null
  pageDescription?: string | null
}

type DisplayStyle = 'carousel' | 'grid' | 'single' | 'list'

const VALID_TABS = ['display', 'appearance', 'page'] as const
type TabValue = (typeof VALID_TABS)[number]

interface SettingsClientProps {
  settings: InitialSettings
  qrCodes: QrCode[]
  userName: string | null
  onSave: (data: any) => Promise<void>
}

export function SettingsClient({ settings, qrCodes, userName, onSave }: SettingsClientProps) {
  const searchParams = useSearchParams()
  const tabParam = searchParams.get('tab') as TabValue | null
  const activeTab: TabValue = tabParam && VALID_TABS.includes(tabParam) ? tabParam : 'display'

  const [displayStyle, setDisplayStyle] = useState<'carousel' | 'grid' | 'single' | 'list'>(
    (settings.displayStyle as 'carousel' | 'grid' | 'single' | 'list') || 'carousel'
  )
  const [primaryColor, setPrimaryColor] = useState(settings.primaryColor || '#6366f1')
  const [secondaryColor, setSecondaryColor] = useState(settings.secondaryColor || '#8b5cf6')
  const [backgroundColor, setBackgroundColor] = useState(settings.backgroundColor || '#ffffff')
  const [logoUrl, setLogoUrl] = useState<string | null>(settings.logoUrl || null)
  const [pageTitle, setPageTitle] = useState(settings.pageTitle || '')
  const [pageDescription, setPageDescription] = useState(settings.pageDescription || '')
  const [showAccountDetails, setShowAccountDetails] = useState(settings.showAccountDetails ?? true)
  const [showDownloadButton, setShowDownloadButton] = useState(settings.showDownloadButton ?? true)
  const [isSaving, setIsSaving] = useState(false)

  const liveSettings = {
    displayStyle,
    primaryColor,
    secondaryColor,
    backgroundColor,
    logoUrl,
    pageTitle,
    pageDescription,
    showAccountDetails,
    showDownloadButton,
  }

  const hasChanges =
    displayStyle !== ((settings.displayStyle as DisplayStyle) || 'carousel') ||
    primaryColor !== (settings.primaryColor || '#6366f1') ||
    secondaryColor !== (settings.secondaryColor || '#8b5cf6') ||
    backgroundColor !== (settings.backgroundColor || '#ffffff') ||
    pageTitle !== (settings.pageTitle || '') ||
    pageDescription !== (settings.pageDescription || '') ||
    showAccountDetails !== (settings.showAccountDetails ?? true) ||
    showDownloadButton !== (settings.showDownloadButton ?? true)

  const handleSave = async () => {
    setIsSaving(true)
    try {
      await onSave({
        displayStyle,
        primaryColor,
        secondaryColor,
        backgroundColor,
        pageTitle,
        pageDescription,
        showAccountDetails,
        showDownloadButton,
      })
      toast.success('Settings saved')
    } catch {
      toast.error('Failed to save settings')
    } finally {
      setIsSaving(false)
    }
  }

  const tabs = [
    {
      value: 'display',
      label: 'Display',
      content: <DisplaySettings displayStyle={displayStyle} onChange={setDisplayStyle} />,
    },
    {
      value: 'appearance',
      label: 'Appearance',
      content: (
        <AppearanceSettings
          primaryColor={primaryColor}
          secondaryColor={secondaryColor}
          backgroundColor={backgroundColor}
          logoUrl={logoUrl}
          onPrimaryColorChange={setPrimaryColor}
          onSecondaryColorChange={setSecondaryColor}
          onBackgroundColorChange={setBackgroundColor}
          onLogoChange={setLogoUrl}
        />
      ),
    },
    {
      value: 'page',
      label: 'Page Info',
      content: (
        <PageSettings
          pageTitle={pageTitle}
          pageDescription={pageDescription}
          showAccountDetails={showAccountDetails}
          showDownloadButton={showDownloadButton}
          onPageTitleChange={setPageTitle}
          onPageDescriptionChange={setPageDescription}
          onShowAccountDetailsChange={setShowAccountDetails}
          onShowDownloadButtonChange={setShowDownloadButton}
        />
      ),
    },
  ]

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Settings</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Customize your payment page appearance and behavior
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <PreviewButton settings={liveSettings} qrCodes={qrCodes} userName={userName} />
          <Button onClick={handleSave} disabled={isSaving || !hasChanges} size="sm">
            <Save className="h-4 w-4 mr-2" />
            {isSaving ? 'Saving…' : 'Save'}
          </Button>
        </div>
      </div>

      <SettingsTabs activeTab={activeTab} tabs={tabs} />
    </div>
  )
}
