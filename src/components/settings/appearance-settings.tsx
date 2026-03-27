'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { uploadLogoAction } from '@/actions/settings'
import { toast } from 'sonner'
import { Loader2, Upload, X, Check } from 'lucide-react'
import Image from 'next/image'

const LIGHT_PRESETS = [
  { name: 'Ocean',   primary: '#3b82f6', secondary: '#1e40af', background: '#ffffff' },
  { name: 'Violet',  primary: '#6366f1', secondary: '#8b5cf6', background: '#ffffff' },
  { name: 'Emerald', primary: '#10b981', secondary: '#059669', background: '#ffffff' },
  { name: 'Rose',    primary: '#f43f5e', secondary: '#e11d48', background: '#ffffff' },
  { name: 'Amber',   primary: '#f59e0b', secondary: '#d97706', background: '#fffbeb' },
  { name: 'Forest',  primary: '#22c55e', secondary: '#16a34a', background: '#f0fdf4' },
  { name: 'Slate',   primary: '#64748b', secondary: '#475569', background: '#f8fafc' },
  { name: 'Blush',   primary: '#ec4899', secondary: '#db2777', background: '#fdf2f8' },
] as const

const DARK_PRESETS = [
  { name: 'Midnight', primary: '#818cf8', secondary: '#a78bfa', background: '#0f172a' },
  { name: 'Obsidian', primary: '#38bdf8', secondary: '#0ea5e9', background: '#0c0c0c' },
  { name: 'Aurora',   primary: '#34d399', secondary: '#a78bfa', background: '#0d1117' },
  { name: 'Ember',    primary: '#fb923c', secondary: '#f87171', background: '#1c0f0a' },
] as const

type AppearanceSettingsProps = {
  primaryColor: string
  secondaryColor: string
  backgroundColor: string
  logoUrl: string | null
  onPrimaryColorChange: (v: string) => void
  onSecondaryColorChange: (v: string) => void
  onBackgroundColorChange: (v: string) => void
  onLogoChange: (url: string | null) => void
}

function ColorRow({
  id,
  label,
  value,
  onChange,
}: {
  id: string
  label: string
  value: string
  onChange: (v: string) => void
}) {
  return (
    <div className="flex items-center gap-3">
      <div className="relative flex-shrink-0">
        <input
          id={id}
          type="color"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-10 h-10 rounded-lg border border-border cursor-pointer p-0.5 bg-transparent"
        />
      </div>
      <div className="flex-1 space-y-1">
        <Label htmlFor={id} className="text-xs text-muted-foreground">{label}</Label>
        <Input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="h-8 font-mono text-sm"
          maxLength={7}
        />
      </div>
    </div>
  )
}

export function AppearanceSettings({
  primaryColor,
  secondaryColor,
  backgroundColor,
  logoUrl,
  onPrimaryColorChange,
  onSecondaryColorChange,
  onBackgroundColorChange,
  onLogoChange,
}: AppearanceSettingsProps) {
  const [isUploading, setIsUploading] = useState(false)

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

      if (!uploadRes.ok) throw new Error(uploadData.error || 'Upload failed')

      const result = await uploadLogoAction(uploadData.logoUrl)
      if (result.success) {
        onLogoChange(uploadData.logoUrl)
        toast.success('Logo uploaded')
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
        onLogoChange(null)
        toast.success('Logo removed')
      }
    } catch {
      toast.error('Failed to remove logo')
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <div className="space-y-4">
      {/* Logo */}
      <Card>
        <CardHeader>
          <CardTitle>Logo</CardTitle>
          <CardDescription>Upload a custom logo for your payment page</CardDescription>
        </CardHeader>
        <CardContent>
          {!logoUrl ? (
            <label
              htmlFor="logo-upload"
              className="flex flex-col items-center justify-center gap-3 border-2 border-dashed border-border rounded-lg p-8 cursor-pointer hover:border-primary hover:bg-primary/5 transition-colors"
            >
              {isUploading
                ? <Loader2 className="h-8 w-8 text-muted-foreground animate-spin" />
                : <Upload className="h-8 w-8 text-muted-foreground" />
              }
              <div className="text-center">
                <p className="text-sm font-medium">
                  {isUploading ? 'Uploading…' : 'Click to upload a logo'}
                </p>
                <p className="text-xs text-muted-foreground mt-1">PNG, JPG up to 2MB</p>
              </div>
              <input
                id="logo-upload"
                type="file"
                accept="image/*"
                className="sr-only"
                onChange={handleLogoUpload}
                disabled={isUploading}
              />
            </label>
          ) : (
            <div className="flex items-center gap-4 p-4 border rounded-lg bg-muted/30">
              <div className="relative w-16 h-16 flex-shrink-0 rounded-lg overflow-hidden border bg-background">
                <Image src={logoUrl} alt="Logo" fill className="object-contain p-1" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium">Logo uploaded</p>
                <p className="text-xs text-muted-foreground mt-0.5">Showing on your payment page</p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleRemoveLogo}
                disabled={isUploading}
                className="text-destructive hover:text-destructive hover:bg-destructive/10"
              >
                <X className="h-4 w-4 mr-1.5" />
                Remove
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Colors */}
      <Card>
        <CardHeader>
          <CardTitle>Colors</CardTitle>
          <CardDescription>Customize your payment page color scheme</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Presets */}
          <div className="space-y-3">
            {([['Light', LIGHT_PRESETS], ['Dark', DARK_PRESETS]] as const).map(([group, presets]) => (
              <div key={group}>
                <p className="text-xs font-medium text-muted-foreground mb-2">{group}</p>
                <div className="grid grid-cols-4 gap-2">
                  {presets.map((preset) => {
                    const isActive =
                      primaryColor === preset.primary &&
                      secondaryColor === preset.secondary &&
                      backgroundColor === preset.background
                    return (
                      <button
                        key={preset.name}
                        onClick={() => {
                          onPrimaryColorChange(preset.primary)
                          onSecondaryColorChange(preset.secondary)
                          onBackgroundColorChange(preset.background)
                        }}
                        className={`relative rounded-lg border-2 p-0.5 transition-all ${isActive ? 'border-primary scale-105 shadow-md' : 'border-border hover:border-primary/50'}`}
                        title={preset.name}
                      >
                        <div className="rounded overflow-hidden aspect-square">
                          <div className="h-3/5 w-full" style={{ backgroundColor: preset.background }} />
                          <div className="h-2/5 w-full flex">
                            <div className="flex-1" style={{ backgroundColor: preset.primary }} />
                            <div className="flex-1" style={{ backgroundColor: preset.secondary }} />
                          </div>
                        </div>
                        {isActive && (
                          <div className="absolute inset-0 flex items-center justify-center">
                            <div className="bg-primary rounded-full p-0.5">
                              <Check className="h-3 w-3 text-primary-foreground" />
                            </div>
                          </div>
                        )}
                        <p className="text-[10px] text-center text-muted-foreground mt-1 leading-none truncate">{preset.name}</p>
                      </button>
                    )
                  })}
                </div>
              </div>
            ))}
          </div>

          <div className="border-t pt-4 space-y-4">
            <ColorRow id="primaryColor" label="Primary Color" value={primaryColor} onChange={onPrimaryColorChange} />
            <ColorRow id="secondaryColor" label="Secondary Color" value={secondaryColor} onChange={onSecondaryColorChange} />
            <ColorRow id="backgroundColor" label="Background Color" value={backgroundColor} onChange={onBackgroundColorChange} />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
