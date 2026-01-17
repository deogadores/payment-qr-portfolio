'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { uploadLogoAction } from '@/actions/settings'
import { toast } from 'sonner'
import { Loader2, Upload, X } from 'lucide-react'
import Image from 'next/image'

type AppearanceSettingsProps = {
  settings: {
    primaryColor?: string | null
    secondaryColor?: string | null
    backgroundColor?: string | null
    logoUrl?: string | null
  }
  onUpdate: (data: any) => Promise<void>
}

export function AppearanceSettings({ settings, onUpdate }: AppearanceSettingsProps) {
  const [isUploading, setIsUploading] = useState(false)
  const [logoPreview, setLogoPreview] = useState<string | null>(settings.logoUrl || null)
  const [primaryColor, setPrimaryColor] = useState(settings.primaryColor || '#6366f1')
  const [secondaryColor, setSecondaryColor] = useState(settings.secondaryColor || '#8b5cf6')
  const [backgroundColor, setBackground] = useState(settings.backgroundColor || '#ffffff')

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file')
      return
    }

    if (file.size > 2 * 1024 * 1024) {
      toast.error('Logo must be less than 2MB')
      return
    }

    setIsUploading(true)
    try {
      const formData = new FormData()
      formData.append('file', file)

      const uploadRes = await fetch('/api/settings/upload-logo', {
        method: 'POST',
        body: formData,
      })

      const uploadData = await uploadRes.json()

      if (!uploadRes.ok) {
        throw new Error(uploadData.error || 'Upload failed')
      }

      const result = await uploadLogoAction(uploadData.logoUrl)

      if (result.success) {
        setLogoPreview(uploadData.logoUrl)
        toast.success('Logo uploaded successfully!')
      } else {
        toast.error(result.error || 'Failed to save logo')
      }
    } catch (error: any) {
      toast.error(error.message || 'An error occurred')
    } finally {
      setIsUploading(false)
    }
  }

  const handleRemoveLogo = async () => {
    setIsUploading(true)
    try {
      const result = await uploadLogoAction('')
      if (result.success) {
        setLogoPreview(null)
        toast.success('Logo removed')
      }
    } catch (error) {
      toast.error('Failed to remove logo')
    } finally {
      setIsUploading(false)
    }
  }

  const handleColorUpdate = async () => {
    await onUpdate({
      primaryColor,
      secondaryColor,
      backgroundColor,
    })
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Logo</CardTitle>
          <CardDescription>Upload a custom logo for your payment page</CardDescription>
        </CardHeader>
        <CardContent>
          {!logoPreview ? (
            <div className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-primary transition-colors">
              <Upload className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <label htmlFor="logo-upload" className="cursor-pointer">
                <span className="text-primary hover:text-primary/80 font-medium">
                  Choose a logo
                </span>
                <span className="text-muted-foreground"> or drag and drop</span>
                <input
                  id="logo-upload"
                  type="file"
                  accept="image/*"
                  className="sr-only"
                  onChange={handleLogoUpload}
                  disabled={isUploading}
                />
              </label>
              <p className="text-xs text-muted-foreground mt-2">PNG, JPG up to 2MB</p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="relative border rounded-lg p-4 bg-muted">
                <Button
                  type="button"
                  variant="destructive"
                  size="icon"
                  className="absolute top-2 right-2"
                  onClick={handleRemoveLogo}
                  disabled={isUploading}
                >
                  <X className="h-4 w-4" />
                </Button>
                <div className="relative h-32 w-32 mx-auto">
                  <Image
                    src={logoPreview}
                    alt="Logo preview"
                    fill
                    className="object-contain"
                  />
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Colors</CardTitle>
          <CardDescription>Customize your payment page colors</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="primaryColor">Primary Color</Label>
            <div className="flex gap-2">
              <Input
                id="primaryColor"
                type="color"
                value={primaryColor}
                onChange={(e) => setPrimaryColor(e.target.value)}
                className="w-20 h-10 p-1 cursor-pointer"
              />
              <Input
                type="text"
                value={primaryColor}
                onChange={(e) => setPrimaryColor(e.target.value)}
                className="flex-1"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="secondaryColor">Secondary Color</Label>
            <div className="flex gap-2">
              <Input
                id="secondaryColor"
                type="color"
                value={secondaryColor}
                onChange={(e) => setSecondaryColor(e.target.value)}
                className="w-20 h-10 p-1 cursor-pointer"
              />
              <Input
                type="text"
                value={secondaryColor}
                onChange={(e) => setSecondaryColor(e.target.value)}
                className="flex-1"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="backgroundColor">Background Color</Label>
            <div className="flex gap-2">
              <Input
                id="backgroundColor"
                type="color"
                value={backgroundColor}
                onChange={(e) => setBackground(e.target.value)}
                className="w-20 h-10 p-1 cursor-pointer"
              />
              <Input
                type="text"
                value={backgroundColor}
                onChange={(e) => setBackground(e.target.value)}
                className="flex-1"
              />
            </div>
          </div>

          <Button onClick={handleColorUpdate} className="w-full">
            {isUploading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Save Colors
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
