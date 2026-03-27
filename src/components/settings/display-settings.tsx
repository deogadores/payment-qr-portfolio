'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { LayoutGrid, Layers, Square, Check } from 'lucide-react'
import { toast } from 'sonner'

const options = [
  {
    value: 'carousel',
    label: 'Carousel',
    description: 'Swipeable cards, one at a time. Best for mobile.',
    icon: Layers,
    preview: (
      <div className="flex flex-col items-center gap-2 py-1">
        {/* Single card centered with side peek */}
        <div className="flex items-center gap-1.5">
          <div className="w-6 h-10 rounded bg-border/50 opacity-40" />
          <div className="w-14 h-16 rounded-lg border-2 border-primary/40 bg-primary/5 flex flex-col items-center justify-center gap-1 shadow-sm">
            <div className="w-8 h-8 rounded bg-primary/20 grid grid-cols-3 gap-0.5 p-0.5">
              {Array.from({ length: 9 }).map((_, i) => (
                <div key={i} className="rounded-sm bg-primary/60" />
              ))}
            </div>
            <div className="w-8 h-1 rounded bg-muted-foreground/30" />
          </div>
          <div className="w-6 h-10 rounded bg-border/50 opacity-40" />
        </div>
        {/* Dots */}
        <div className="flex gap-1">
          <div className="w-2 h-2 rounded-full bg-primary" />
          <div className="w-2 h-2 rounded-full bg-border" />
          <div className="w-2 h-2 rounded-full bg-border" />
        </div>
      </div>
    ),
  },
  {
    value: 'grid',
    label: 'Grid',
    description: 'All QR codes shown in a responsive grid.',
    icon: LayoutGrid,
    preview: (
      <div className="grid grid-cols-3 gap-1.5 px-2 py-1">
        {[
          'bg-blue-400/30',
          'bg-purple-400/30',
          'bg-pink-400/30',
          'bg-emerald-400/30',
          'bg-amber-400/30',
          'bg-sky-400/30',
        ].map((color, i) => (
          <div
            key={i}
            className={`aspect-square rounded-lg border ${color} flex items-center justify-center`}
          >
            <div className="w-4 h-4 rounded grid grid-cols-3 gap-px p-px">
              {Array.from({ length: 9 }).map((_, j) => (
                <div key={j} className="rounded-sm bg-foreground/30" />
              ))}
            </div>
          </div>
        ))}
      </div>
    ),
  },
  {
    value: 'single',
    label: 'Single Card',
    description: 'One QR code at a time with tab navigation.',
    icon: Square,
    preview: (
      <div className="flex flex-col items-center gap-2 px-4 py-1">
        {/* Tabs */}
        <div className="flex gap-1 w-full">
          <div className="flex-1 h-1.5 rounded-full bg-primary" />
          <div className="flex-1 h-1.5 rounded-full bg-border" />
          <div className="flex-1 h-1.5 rounded-full bg-border" />
        </div>
        {/* Card */}
        <div className="w-full border-2 border-primary/30 bg-primary/5 rounded-lg py-3 flex flex-col items-center gap-1.5">
          <div className="w-12 h-12 rounded bg-primary/20 grid grid-cols-3 gap-0.5 p-0.5">
            {Array.from({ length: 9 }).map((_, i) => (
              <div key={i} className="rounded-sm bg-primary/60" />
            ))}
          </div>
          <div className="w-12 h-1.5 rounded bg-muted-foreground/30" />
          <div className="w-8 h-1 rounded bg-muted-foreground/20" />
        </div>
      </div>
    ),
  },
] as const

type DisplayStyle = 'carousel' | 'grid' | 'single'

type DisplaySettingsProps = {
  settings: { displayStyle?: DisplayStyle | null }
  onUpdate: (data: any) => Promise<void>
}

export function DisplaySettings({ settings, onUpdate }: DisplaySettingsProps) {
  const [displayStyle, setDisplayStyle] = useState<DisplayStyle>(
    settings.displayStyle || 'carousel'
  )
  const [isSaving, setIsSaving] = useState(false)
  const hasChanged = displayStyle !== (settings.displayStyle || 'carousel')

  const handleSave = async () => {
    setIsSaving(true)
    try {
      await onUpdate({ displayStyle })
      toast.success('Display style saved')
    } catch {
      toast.error('Failed to save display style')
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Display Style</CardTitle>
        <CardDescription>
          Choose how your QR codes appear on your public payment page
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-3">
          {options.map(({ value, label, description, icon: Icon, preview }) => {
            const active = displayStyle === value
            return (
              <button
                key={value}
                onClick={() => setDisplayStyle(value)}
                className={`w-full text-left rounded-xl border-2 transition-all overflow-hidden ${
                  active
                    ? 'border-primary bg-primary/5'
                    : 'border-border hover:border-border/80 hover:bg-accent/50'
                }`}
              >
                {/* Header row */}
                <div className="flex items-center gap-3 px-4 pt-4 pb-3">
                  <div className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 ${active ? 'bg-primary/10' : 'bg-muted'}`}>
                    <Icon className={`h-4 w-4 ${active ? 'text-primary' : 'text-muted-foreground'}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm">{label}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{description}</p>
                  </div>
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${active ? 'border-primary bg-primary' : 'border-border'}`}>
                    {active && <Check className="h-3 w-3 text-primary-foreground" />}
                  </div>
                </div>
                {/* Preview */}
                <div className={`mx-4 mb-4 rounded-lg border bg-card min-h-[80px] flex items-center justify-center ${active ? 'border-primary/20' : 'border-border'}`}>
                  {preview}
                </div>
              </button>
            )
          })}
        </div>

        <Button onClick={handleSave} disabled={isSaving || !hasChanged} className="w-full">
          {hasChanged ? (isSaving ? 'Saving…' : 'Save Display Style') : 'No Changes'}
        </Button>
      </CardContent>
    </Card>
  )
}
