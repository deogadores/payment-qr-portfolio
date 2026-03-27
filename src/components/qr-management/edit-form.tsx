'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ImageCropModal } from './image-crop-modal'
import { updateQrCodeAction } from '@/actions/qr-codes'
import { toast } from 'sonner'
import { Loader2, Upload, X } from 'lucide-react'
import type { QrCode } from '@/lib/db/schema'

export function EditForm({ qrCode }: { qrCode: QrCode }) {
  const router = useRouter()

  const [title, setTitle] = useState(qrCode.title)
  const [description, setDescription] = useState(qrCode.description ?? '')
  const [accountName, setAccountName] = useState(qrCode.accountName ?? '')
  const [accountNumber, setAccountNumber] = useState(qrCode.accountNumber ?? '')

  const [cropSrc, setCropSrc] = useState<string | null>(null)
  const [croppedBlob, setCroppedBlob] = useState<Blob | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)

  const [isSaving, setIsSaving] = useState(false)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    e.target.value = ''
    if (!file) return

    if (!file.type.match(/^image\/(jpeg|png|webp)$/)) {
      toast.error('Please select a JPG, PNG, or WebP image')
      return
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error('File size must be less than 5MB')
      return
    }

    setCropSrc(URL.createObjectURL(file))
  }

  const handleCropConfirm = (blob: Blob) => {
    setCroppedBlob(blob)
    setPreviewUrl(URL.createObjectURL(blob))
    setCropSrc(null)
  }

  const handleCropCancel = () => {
    if (cropSrc) URL.revokeObjectURL(cropSrc)
    setCropSrc(null)
  }

  const clearNewImage = () => {
    if (previewUrl) URL.revokeObjectURL(previewUrl)
    setCroppedBlob(null)
    setPreviewUrl(null)
  }

  const handleSave = async () => {
    if (!title.trim()) {
      toast.error('Title is required')
      return
    }

    setIsSaving(true)
    try {
      let imageUrl: string | undefined

      if (croppedBlob) {
        const formData = new FormData()
        formData.append('file', croppedBlob, 'qr-code.jpg')

        const uploadRes = await fetch('/api/qr-codes/upload', {
          method: 'POST',
          body: formData,
        })
        const uploadData = await uploadRes.json()

        if (!uploadRes.ok) throw new Error(uploadData.error || 'Upload failed')
        imageUrl = uploadData.imageUrl
      }

      const result = await updateQrCodeAction(qrCode.id, {
        title: title.trim(),
        description: description.trim() || undefined,
        accountName: accountName.trim() || undefined,
        accountNumber: accountNumber.trim() || undefined,
        ...(imageUrl ? { imageUrl, oldImageUrl: qrCode.imageUrl } : {}),
      })

      if (result.success) {
        toast.success('QR code updated')
        router.push('/dashboard')
      } else {
        toast.error(result.error || 'Failed to update QR code')
      }
    } catch (error: any) {
      toast.error(error.message || 'An error occurred')
    } finally {
      setIsSaving(false)
    }
  }

  const displayImage = previewUrl ?? qrCode.imageUrl

  return (
    <>
      {cropSrc && (
        <ImageCropModal
          src={cropSrc}
          onConfirm={handleCropConfirm}
          onCancel={handleCropCancel}
        />
      )}

      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>{qrCode.title}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Image */}
          <div className="space-y-2">
            <Label>QR Code Image</Label>
            <div className="relative border-2 border-border rounded-lg bg-muted/40">
              <div className="aspect-square relative max-w-xs mx-auto p-6">
                <Image src={displayImage} alt={qrCode.title} fill className="object-contain" />
              </div>
              {previewUrl && (
                <div className="absolute top-3 left-3 bg-primary text-primary-foreground text-[11px] font-semibold px-2 py-0.5 rounded-full">
                  New image
                </div>
              )}
              <div className="flex items-center justify-center gap-4 pb-4">
                <label
                  htmlFor="edit-file-upload"
                  className="flex items-center gap-1.5 text-sm text-primary hover:text-primary/80 cursor-pointer"
                >
                  <Upload className="h-4 w-4" />
                  {previewUrl ? 'Replace again' : 'Replace image'}
                  <input
                    id="edit-file-upload"
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    className="sr-only"
                    onChange={handleFileChange}
                    disabled={isSaving}
                  />
                </label>
                {previewUrl && (
                  <button
                    onClick={clearNewImage}
                    className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
                  >
                    <X className="h-3.5 w-3.5" />
                    Undo
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., PayPal, GCash, Bank Transfer"
              disabled={isSaving}
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Description <span className="text-muted-foreground font-normal text-sm">(optional)</span></Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Add details about this payment method"
              rows={3}
              className="resize-none"
              disabled={isSaving}
            />
          </div>

          {/* Account Name */}
          <div className="space-y-2">
            <Label htmlFor="accountName">Account Name <span className="text-muted-foreground font-normal text-sm">(optional)</span></Label>
            <Input
              id="accountName"
              value={accountName}
              onChange={(e) => setAccountName(e.target.value)}
              placeholder="e.g., John Doe"
              disabled={isSaving}
            />
          </div>

          {/* Account Number */}
          <div className="space-y-2">
            <Label htmlFor="accountNumber">Account Number <span className="text-muted-foreground font-normal text-sm">(optional)</span></Label>
            <Input
              id="accountNumber"
              value={accountNumber}
              onChange={(e) => setAccountNumber(e.target.value)}
              placeholder="e.g., **** **** 1234"
              disabled={isSaving}
            />
          </div>

          {/* Actions */}
          <div className="flex gap-4 pt-2">
            <Button
              type="button"
              variant="outline"
              className="flex-1"
              onClick={() => router.back()}
              disabled={isSaving}
            >
              Cancel
            </Button>
            <Button className="flex-1" onClick={handleSave} disabled={isSaving}>
              {isSaving && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              {isSaving ? 'Saving…' : 'Save Changes'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </>
  )
}
