'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { generatePhraseAction } from '@/actions/admin'
import { toast } from 'sonner'
import { Loader2, Copy, Check } from 'lucide-react'

export function PhraseGenerator() {
  const [isLoading, setIsLoading] = useState(false)
  const [generatedPhrase, setGeneratedPhrase] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)
  const [expiresIn, setExpiresIn] = useState<string>('')

  const handleGenerate = async () => {
    setIsLoading(true)
    try {
      const hours = expiresIn ? parseInt(expiresIn) : undefined
      const result = await generatePhraseAction(hours)

      if (result.success && result.phrase) {
        setGeneratedPhrase(result.phrase.phrase)
        toast.success('Registration phrase generated!')
      } else {
        toast.error(result.error || 'Failed to generate phrase')
      }
    } catch (error) {
      toast.error('An error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  const handleCopy = async () => {
    if (generatedPhrase) {
      await navigator.clipboard.writeText(generatedPhrase)
      setCopied(true)
      toast.success('Phrase copied to clipboard!')
      setTimeout(() => setCopied(false), 2000)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Generate Registration Phrase</CardTitle>
        <CardDescription>
          Create a new registration phrase for users to sign up
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="expiresIn">Expires In (hours, optional)</Label>
          <Input
            id="expiresIn"
            type="number"
            placeholder="Leave empty for no expiration"
            value={expiresIn}
            onChange={(e) => setExpiresIn(e.target.value)}
            min="1"
          />
          <p className="text-xs text-muted-foreground">
            If left empty, the phrase will never expire
          </p>
        </div>

        <Button onClick={handleGenerate} disabled={isLoading} className="w-full">
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Generate Phrase
        </Button>

        {generatedPhrase && (
          <div className="p-4 bg-green-50 border border-green-200 rounded-lg space-y-3">
            <p className="text-sm font-medium text-green-900">
              Registration Phrase Generated:
            </p>
            <div className="flex items-center gap-2">
              <code className="flex-1 p-3 bg-white border border-green-300 rounded text-green-900 font-mono text-lg">
                {generatedPhrase}
              </code>
              <Button
                onClick={handleCopy}
                variant="outline"
                size="icon"
                className="shrink-0"
              >
                {copied ? (
                  <Check className="h-4 w-4 text-green-600" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </Button>
            </div>
            <p className="text-xs text-green-700">
              Share this phrase with the user so they can register
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
