'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { accessRequestSchema, type AccessRequestInput } from '@/lib/utils/validators'
import { submitAccessRequest } from '@/actions/access-requests'
import { toast } from 'sonner'
import { Loader2, CheckCircle2, Mail, User, MessageSquare } from 'lucide-react'

export function ContactForm() {
  const [isLoading, setIsLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<AccessRequestInput>({
    resolver: zodResolver(accessRequestSchema),
  })

  const onSubmit = async (data: AccessRequestInput) => {
    setIsLoading(true)
    try {
      const result = await submitAccessRequest(data)

      if (result.success) {
        toast.success('Access request submitted successfully!')
        setSubmitted(true)
        reset()
      } else {
        toast.error(result.error || 'Failed to submit request')
      }
    } catch {
      toast.error('An error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  if (submitted) {
    return (
      <Card className="max-w-2xl mx-auto border-2">
        <CardContent className="pt-12 pb-12 text-center">
          <div className="w-20 h-20 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="h-10 w-10 text-green-600 dark:text-green-400" />
          </div>
          <h3 className="text-2xl font-bold mb-3">Request Submitted!</h3>
          <p className="text-muted-foreground mb-8 max-w-md mx-auto">
            Thank you for your interest. We&apos;ll review your request and send you a registration phrase via email if approved.
          </p>
          <Button onClick={() => setSubmitted(false)} variant="outline" size="lg">
            Submit Another Request
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="max-w-2xl mx-auto border-2">
      <CardHeader className="text-center pb-2">
        <CardTitle className="text-2xl md:text-3xl">Request Access</CardTitle>
        <CardDescription className="text-base">
          Fill out this form to request a registration phrase
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit(onSubmit)}>
        <CardContent className="space-y-6 pt-6">
          <div className="space-y-2">
            <Label htmlFor="name" className="flex items-center gap-2">
              <User className="h-4 w-4 text-muted-foreground" />
              Full Name
            </Label>
            <Input
              id="name"
              type="text"
              placeholder="John Doe"
              className="h-12"
              {...register('name')}
              disabled={isLoading}
            />
            {errors.name && (
              <p className="text-sm text-destructive">{errors.name.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="email" className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-muted-foreground" />
              Email Address
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="john@example.com"
              className="h-12"
              {...register('email')}
              disabled={isLoading}
            />
            {errors.email && (
              <p className="text-sm text-destructive">{errors.email.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="reason" className="flex items-center gap-2">
              <MessageSquare className="h-4 w-4 text-muted-foreground" />
              Why do you need access? (Optional)
            </Label>
            <Textarea
              id="reason"
              placeholder="Tell us briefly why you need access to the QR Payment Portfolio..."
              rows={4}
              className="resize-none"
              {...register('reason')}
              disabled={isLoading}
            />
            {errors.reason && (
              <p className="text-sm text-destructive">{errors.reason.message}</p>
            )}
          </div>

          <Button type="submit" className="w-full h-12 text-base" disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-5 w-5 animate-spin" />}
            Submit Request
          </Button>
        </CardContent>
      </form>
    </Card>
  )
}
