'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Info } from 'lucide-react'

type CustomCssEditorProps = {
  settings: {
    customCss?: string | null
  }
  onUpdate: (data: any) => Promise<void>
}

export function CustomCssEditor({ settings, onUpdate }: CustomCssEditorProps) {
  const [customCss, setCustomCss] = useState(settings.customCss || '')

  const handleSave = async () => {
    await onUpdate({ customCss })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Custom CSS</CardTitle>
        <CardDescription>
          Add custom CSS to personalize your payment page
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Alert>
          <Info className="h-4 w-4" />
          <AlertDescription>
            Your custom CSS will be applied to the public payment page. Use caution with
            styling to ensure QR codes remain scannable.
          </AlertDescription>
        </Alert>

        <div className="space-y-2">
          <Textarea
            value={customCss}
            onChange={(e) => setCustomCss(e.target.value)}
            placeholder={`/* Example CSS */
.qr-card {
  border-radius: 16px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.qr-title {
  font-family: 'Inter', sans-serif;
  font-weight: 600;
}`}
            className="font-mono text-sm min-h-[300px]"
          />
        </div>

        <div className="flex gap-2">
          <Button onClick={handleSave} className="flex-1">
            Save Custom CSS
          </Button>
          <Button
            variant="outline"
            onClick={() => setCustomCss('')}
            disabled={!customCss}
          >
            Clear
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
