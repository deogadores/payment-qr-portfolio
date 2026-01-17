'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { qrCodeSchema, type QrCodeInput } from '@/lib/utils/validators'
import { createQrCodeAction } from '@/actions/qr-codes'
import { toast } from 'sonner'
import { Loader2, Upload, X } from 'lucide-react'
import Image from 'next/image'

export function UploadForm() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<QrCodeInput>({
    resolver: zodResolver(qrCodeSchema),
  })

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (!file.type.startsWith('image/')) {
        toast.error('Please select an image file')
        return
      }
      if (file.size > 5 * 1024 * 1024) {
        toast.error('File size must be less than 5MB')
        return
      }
      setSelectedFile(file)
      setPreviewUrl(URL.createObjectURL(file))
    }
  }

  const removeFile = () => {
    setSelectedFile(null)
    setPreviewUrl(null)
  }

  const onSubmit = async (data: QrCodeInput) => {
    if (!selectedFile) {
      toast.error('Please select an image')
      return
    }

    setIsLoading(true)
    try {
      // Upload image
      const formData = new FormData()
      formData.append('file', selectedFile)

      const uploadRes = await fetch('/api/qr-codes/upload', {
        method: 'POST',
        body: formData,
      })

      const uploadData = await uploadRes.json()

      if (!uploadRes.ok) {
        throw new Error(uploadData.error || 'Upload failed')
      }

      // Create QR code record
      const result = await createQrCodeAction({
        ...data,
        imageUrl: uploadData.imageUrl,
      })

      if (result.success) {
        toast.success('QR code uploaded successfully!')
        router.push('/qr-codes')
        router.refresh()
      } else {
        toast.error(result.error || 'Failed to create QR code')
      }
    } catch (error: any) {
      toast.error(error.message || 'An error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Upload QR Code</CardTitle>
      </CardHeader>
      <form onSubmit={handleSubmit(onSubmit)}>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label>QR Code Image *</Label>
            {!previewUrl ? (
              <div className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-primary transition-colors">
                <Upload className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <label htmlFor="file-upload" className="cursor-pointer">
                  <span className="text-primary hover:text-primary/80 font-medium">
                    Choose a file
                  </span>
                  <span className="text-muted-foreground"> or drag and drop</span>
                  <input
                    id="file-upload"
                    type="file"
                    accept="image/*"
                    className="sr-only"
                    onChange={handleFileChange}
                    disabled={isLoading}
                  />
                </label>
                <p className="text-xs text-muted-foreground mt-2">PNG, JPG up to 5MB</p>
              </div>
            ) : (
              <div className="relative border rounded-lg p-4 bg-muted">
                <Button
                  type="button"
                  variant="destructive"
                  size="icon"
                  className="absolute top-2 right-2"
                  onClick={removeFile}
                  disabled={isLoading}
                >
                  <X className="h-4 w-4" />
                </Button>
                <div className="aspect-square relative max-w-sm mx-auto">
                  <Image
                    src={previewUrl}
                    alt="Preview"
                    fill
                    className="object-contain"
                  />
                </div>
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              type="text"
              placeholder="e.g., PayPal, Bank Transfer, GCash"
              {...register('title')}
              disabled={isLoading}
            />
            {errors.title && (
              <p className="text-sm text-destructive">{errors.title.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description (Optional)</Label>
            <Textarea
              id="description"
              placeholder="Add details about this payment method"
              {...register('description')}
              disabled={isLoading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="accountName">Account Name (Optional)</Label>
            <Input
              id="accountName"
              type="text"
              placeholder="e.g., John Doe"
              {...register('accountName')}
              disabled={isLoading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="accountNumber">Account Number (Optional)</Label>
            <Input
              id="accountNumber"
              type="text"
              placeholder="e.g., **** **** 1234"
              {...register('accountNumber')}
              disabled={isLoading}
            />
          </div>

          <div className="flex gap-4">
            <Button
              type="button"
              variant="outline"
              className="flex-1"
              onClick={() => router.back()}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button type="submit" className="flex-1" disabled={isLoading || !selectedFile}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Upload QR Code
            </Button>
          </div>
        </CardContent>
      </form>
    </Card>
  )
}
