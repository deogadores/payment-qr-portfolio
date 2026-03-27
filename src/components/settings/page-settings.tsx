'use client'

import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Switch } from '@/components/ui/switch'
import { Eye, EyeOff, Download, X } from 'lucide-react'

type PageSettingsProps = {
  pageTitle: string
  pageDescription: string
  showAccountDetails: boolean
  showDownloadButton: boolean
  onPageTitleChange: (v: string) => void
  onPageDescriptionChange: (v: string) => void
  onShowAccountDetailsChange: (v: boolean) => void
  onShowDownloadButtonChange: (v: boolean) => void
}

export function PageSettings({
  pageTitle,
  pageDescription,
  showAccountDetails,
  showDownloadButton,
  onPageTitleChange,
  onPageDescriptionChange,
  onShowAccountDetailsChange,
  onShowDownloadButtonChange,
}: PageSettingsProps) {
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Page Information</CardTitle>
          <CardDescription>
            Customize the title and description shown on your public payment page
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="pageTitle">Page Title</Label>
            <Input
              id="pageTitle"
              placeholder="e.g., My Payment Methods"
              value={pageTitle}
              onChange={(e) => onPageTitleChange(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="pageDescription">Page Description</Label>
            <Textarea
              id="pageDescription"
              placeholder="e.g., Choose your preferred payment method below"
              value={pageDescription}
              onChange={(e) => onPageDescriptionChange(e.target.value)}
              rows={3}
              className="resize-none"
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Visibility</CardTitle>
          <CardDescription>Control what information is shown on QR cards</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {/* Account Details toggle */}
          <label
            htmlFor="showAccountDetails"
            className={`flex items-center justify-between rounded-lg border p-4 transition-colors cursor-pointer ${showAccountDetails ? 'border-primary/40 bg-primary/5' : 'border-border bg-muted/30'}`}
          >
            <div className="flex items-center gap-3">
              <div className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 ${showAccountDetails ? 'bg-primary/10' : 'bg-muted'}`}>
                {showAccountDetails
                  ? <Eye className="h-4 w-4 text-primary" />
                  : <EyeOff className="h-4 w-4 text-muted-foreground" />
                }
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <p className="font-medium text-sm">Show Account Details</p>
                  <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-full ${showAccountDetails ? 'bg-primary/15 text-primary' : 'bg-muted text-muted-foreground'}`}>
                    {showAccountDetails ? 'Visible' : 'Hidden'}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Display account names and numbers on QR cards
                </p>
              </div>
            </div>
            <Switch
              id="showAccountDetails"
              checked={showAccountDetails}
              onCheckedChange={onShowAccountDetailsChange}
            />
          </label>

          {/* Download Button toggle */}
          <label
            htmlFor="showDownloadButton"
            className={`flex items-center justify-between rounded-lg border p-4 transition-colors cursor-pointer ${showDownloadButton ? 'border-primary/40 bg-primary/5' : 'border-border bg-muted/30'}`}
          >
            <div className="flex items-center gap-3">
              <div className={`relative w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 ${showDownloadButton ? 'bg-primary/10' : 'bg-muted'}`}>
                <Download className={`h-4 w-4 ${showDownloadButton ? 'text-primary' : 'text-muted-foreground'}`} />
                {!showDownloadButton && (
                  <X className="h-2.5 w-2.5 text-muted-foreground absolute bottom-1 right-1" />
                )}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <p className="font-medium text-sm">Show Download Button</p>
                  <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-full ${showDownloadButton ? 'bg-primary/15 text-primary' : 'bg-muted text-muted-foreground'}`}>
                    {showDownloadButton ? 'Visible' : 'Hidden'}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Allow visitors to download QR code images
                </p>
              </div>
            </div>
            <Switch
              id="showDownloadButton"
              checked={showDownloadButton}
              onCheckedChange={onShowDownloadButtonChange}
            />
          </label>
        </CardContent>
      </Card>
    </div>
  )
}
