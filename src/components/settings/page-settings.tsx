'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Switch } from '@/components/ui/switch'

type PageSettingsProps = {
  settings: {
    pageTitle?: string | null
    pageDescription?: string | null
    showAccountDetails?: boolean | null
  }
  onUpdate: (data: any) => Promise<void>
}

export function PageSettings({ settings, onUpdate }: PageSettingsProps) {
  const [pageTitle, setPageTitle] = useState(settings.pageTitle || '')
  const [pageDescription, setPageDescription] = useState(settings.pageDescription || '')
  const [showAccountDetails, setShowAccountDetails] = useState(settings.showAccountDetails ?? true)

  const handleSave = async () => {
    await onUpdate({
      pageTitle,
      pageDescription,
      showAccountDetails,
    })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Page Information</CardTitle>
        <CardDescription>
          Customize the title and description for your public payment page
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="pageTitle">Page Title</Label>
          <Input
            id="pageTitle"
            type="text"
            placeholder="e.g., My Payment Methods"
            value={pageTitle}
            onChange={(e) => setPageTitle(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="pageDescription">Page Description</Label>
          <Textarea
            id="pageDescription"
            placeholder="e.g., Choose your preferred payment method below"
            value={pageDescription}
            onChange={(e) => setPageDescription(e.target.value)}
            rows={3}
          />
        </div>

        <div className="flex items-center justify-between space-x-2">
          <div className="space-y-0.5">
            <Label htmlFor="showAccountDetails">Show Account Details</Label>
            <p className="text-sm text-muted-foreground">
              Display account names and numbers on QR cards
            </p>
          </div>
          <Switch
            id="showAccountDetails"
            checked={showAccountDetails}
            onCheckedChange={setShowAccountDetails}
          />
        </div>

        <Button onClick={handleSave} className="w-full">
          Save Page Settings
        </Button>
      </CardContent>
    </Card>
  )
}
