'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { LayoutGrid, Layers, Square } from 'lucide-react'

type DisplaySettingsProps = {
  settings: {
    displayStyle?: 'carousel' | 'grid' | 'single' | null
  }
  onUpdate: (data: any) => Promise<void>
}

export function DisplaySettings({ settings, onUpdate }: DisplaySettingsProps) {
  const [displayStyle, setDisplayStyle] = useState<'carousel' | 'grid' | 'single'>(
    settings.displayStyle || 'carousel'
  )

  const handleStyleChange = async (value: string) => {
    const newStyle = value as 'carousel' | 'grid' | 'single'
    setDisplayStyle(newStyle)
    await onUpdate({ displayStyle: newStyle })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Display Style</CardTitle>
        <CardDescription>
          Choose how your QR codes will be displayed on the public page
        </CardDescription>
      </CardHeader>
      <CardContent>
        <RadioGroup value={displayStyle} onValueChange={handleStyleChange}>
          <div className="space-y-4">
            <div className="flex items-start space-x-3 p-4 border rounded-lg hover:bg-accent cursor-pointer">
              <RadioGroupItem value="carousel" id="carousel" />
              <div className="flex-1">
                <Label htmlFor="carousel" className="cursor-pointer">
                  <div className="flex items-center gap-2 mb-1">
                    <Layers className="h-4 w-4" />
                    <span className="font-semibold">Carousel</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Swipeable carousel with navigation arrows. Best for mobile viewing.
                  </p>
                </Label>
                <div className="mt-3 border-2 rounded p-2 bg-card">
                  <div className="flex gap-1 justify-center">
                    <div className="w-16 h-20 bg-blue-500/30 dark:bg-blue-400/30 rounded flex items-center justify-center border">
                      <div className="w-10 h-10 bg-card rounded border-2"></div>
                    </div>
                  </div>
                  <div className="flex justify-center gap-1 mt-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary"></div>
                    <div className="w-1.5 h-1.5 rounded-full bg-border"></div>
                    <div className="w-1.5 h-1.5 rounded-full bg-border"></div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-start space-x-3 p-4 border rounded-lg hover:bg-accent cursor-pointer">
              <RadioGroupItem value="grid" id="grid" />
              <div className="flex-1">
                <Label htmlFor="grid" className="cursor-pointer">
                  <div className="flex items-center gap-2 mb-1">
                    <LayoutGrid className="h-4 w-4" />
                    <span className="font-semibold">Grid</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Responsive grid layout. Shows all QR codes at once.
                  </p>
                </Label>
                <div className="mt-3 border-2 rounded p-2 bg-card">
                  <div className="grid grid-cols-3 gap-1">
                    <div className="w-full aspect-square bg-blue-500/30 dark:bg-blue-400/30 rounded flex items-center justify-center border">
                      <div className="w-6 h-6 bg-card rounded border-2"></div>
                    </div>
                    <div className="w-full aspect-square bg-purple-500/30 dark:bg-purple-400/30 rounded flex items-center justify-center border">
                      <div className="w-6 h-6 bg-card rounded border-2"></div>
                    </div>
                    <div className="w-full aspect-square bg-pink-500/30 dark:bg-pink-400/30 rounded flex items-center justify-center border">
                      <div className="w-6 h-6 bg-card rounded border-2"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-start space-x-3 p-4 border rounded-lg hover:bg-accent cursor-pointer">
              <RadioGroupItem value="single" id="single" />
              <div className="flex-1">
                <Label htmlFor="single" className="cursor-pointer">
                  <div className="flex items-center gap-2 mb-1">
                    <Square className="h-4 w-4" />
                    <span className="font-semibold">Single Card</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    One QR code at a time with tab navigation. Clean and focused.
                  </p>
                </Label>
                <div className="mt-3 border-2 rounded p-2 bg-card">
                  <div className="flex flex-col items-center gap-2">
                    <div className="w-20 h-24 bg-blue-500/30 dark:bg-blue-400/30 rounded flex items-center justify-center border">
                      <div className="w-12 h-12 bg-card rounded border-2"></div>
                    </div>
                    <div className="flex gap-1">
                      <div className="w-12 h-1 bg-primary rounded"></div>
                      <div className="w-12 h-1 bg-border rounded"></div>
                      <div className="w-12 h-1 bg-border rounded"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </RadioGroup>
      </CardContent>
    </Card>
  )
}
