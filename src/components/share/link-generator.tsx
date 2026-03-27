'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { createShareLinkAction } from '@/actions/share-links'
import { toast } from 'sonner'
import { Loader2, Copy, Check, Link as LinkIcon, Clock, Ticket } from 'lucide-react'

const UNITS = [
  { value: 'minutes', label: 'Minutes', max: 43200, toHours: (v: number) => v / 60 },
  { value: 'hours',   label: 'Hours',   max: 720,   toHours: (v: number) => v },
  { value: 'days',    label: 'Days',    max: 30,    toHours: (v: number) => v * 24 },
] as const

type Unit = typeof UNITS[number]['value']

export function LinkGenerator({ onLinkCreated }: { onLinkCreated?: () => void }) {
  const [isLoading, setIsLoading] = useState(false)
  const [linkType, setLinkType] = useState<'expiring' | 'one-time'>('expiring')
  const [expiresIn, setExpiresIn] = useState('24')
  const [unit, setUnit] = useState<Unit>('hours')
  const [generatedUrl, setGeneratedUrl] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)

  const currentUnit = UNITS.find((u) => u.value === unit)!

  const handleUnitChange = (newUnit: Unit) => {
    const newUnitDef = UNITS.find((u) => u.value === newUnit)!
    // Convert current value to hours, then to the new unit
    const oldUnitDef = UNITS.find((u) => u.value === unit)!
    const inHours = oldUnitDef.toHours(parseFloat(expiresIn) || 0)
    let converted: number
    if (newUnit === 'minutes') converted = inHours * 60
    else if (newUnit === 'hours') converted = inHours
    else converted = inHours / 24
    const clamped = Math.min(Math.max(1, Math.round(converted)), newUnitDef.max)
    setExpiresIn(String(clamped))
    setUnit(newUnit)
  }

  const handleGenerate = async () => {
    setIsLoading(true)
    try {
      const expiresInHours = linkType === 'expiring'
        ? currentUnit.toHours(parseFloat(expiresIn) || 1)
        : undefined

      const result = await createShareLinkAction({
        linkType,
        expiresIn: expiresInHours,
      })

      if (result.success && result.token) {
        setGeneratedUrl(`${window.location.origin}/share/${result.token}`)
        toast.success('Share link created!')
        onLinkCreated?.()
      } else {
        toast.error(result.error || 'Failed to create link')
      }
    } catch (error) {
      toast.error('An error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  const handleCopy = async () => {
    if (!generatedUrl) return

    try {
      await navigator.clipboard.writeText(generatedUrl)
      setCopied(true)
      toast.success('Link copied to clipboard!')
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      toast.error('Failed to copy link')
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Generate Share Link</CardTitle>
        <CardDescription>
          Create a secure link to share your payment QR codes
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <Label>Link Type</Label>
          <RadioGroup value={linkType} onValueChange={(v) => setLinkType(v as any)}>
            <div className="flex items-start space-x-3 p-4 border rounded-lg hover:bg-accent cursor-pointer">
              <RadioGroupItem value="expiring" id="expiring" />
              <div className="flex-1">
                <Label htmlFor="expiring" className="cursor-pointer">
                  <div className="flex items-center gap-2 mb-1">
                    <Clock className="h-4 w-4" />
                    <span className="font-semibold">Expiring Link</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Link expires after a specified duration
                  </p>
                </Label>
              </div>
            </div>

            <div className="flex items-start space-x-3 p-4 border rounded-lg hover:bg-accent cursor-pointer">
              <RadioGroupItem value="one-time" id="one-time" />
              <div className="flex-1">
                <Label htmlFor="one-time" className="cursor-pointer">
                  <div className="flex items-center gap-2 mb-1">
                    <Ticket className="h-4 w-4" />
                    <span className="font-semibold">One-Time Link</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Link can only be accessed once
                  </p>
                </Label>
              </div>
            </div>
          </RadioGroup>
        </div>

        {linkType === 'expiring' && (
          <div className="space-y-2">
            <Label>Expires In</Label>
            <div className="flex gap-2">
              <Input
                id="expiresIn"
                type="number"
                min="1"
                max={currentUnit.max}
                value={expiresIn}
                onChange={(e) => {
                  const val = Math.min(Math.max(1, parseInt(e.target.value) || 1), currentUnit.max)
                  setExpiresIn(String(val))
                }}
                disabled={isLoading}
                className="flex-1"
              />
              <div className="flex rounded-md border overflow-hidden text-sm">
                {UNITS.map((u) => (
                  <button
                    key={u.value}
                    type="button"
                    onClick={() => handleUnitChange(u.value)}
                    disabled={isLoading}
                    className={`px-3 py-2 transition-colors ${
                      unit === u.value
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-background text-muted-foreground hover:bg-accent'
                    }`}
                  >
                    {u.label}
                  </button>
                ))}
              </div>
            </div>
            <p className="text-xs text-muted-foreground">
              Max {currentUnit.max} {currentUnit.label.toLowerCase()} (30 days)
            </p>
          </div>
        )}

        <Button onClick={handleGenerate} disabled={isLoading} className="w-full">
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          <LinkIcon className="mr-2 h-4 w-4" />
          Generate Link
        </Button>

        {generatedUrl && (
          <div className="space-y-2 p-4 bg-primary/10 border border-primary/20 rounded-lg">
            <Label className="text-primary font-medium">Generated Link</Label>
            <div className="flex gap-2">
              <Input
                value={generatedUrl}
                readOnly
                className="bg-background font-mono text-sm"
              />
              <Button
                variant="outline"
                size="icon"
                onClick={handleCopy}
                className="shrink-0"
              >
                {copied ? (
                  <Check className="h-4 w-4 text-primary" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
