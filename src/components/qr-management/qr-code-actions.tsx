'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { deleteQrCodeAction, updateQrCodeAction } from '@/actions/qr-codes'
import { toast } from 'sonner'
import { Trash2, Eye, EyeOff } from 'lucide-react'
import type { QrCode } from '@/lib/db/schema'

interface QrCodeActionsProps {
  qrCode: QrCode
}

export function QrCodeActions({ qrCode }: QrCodeActionsProps) {
  const [isDeleting, setIsDeleting] = useState(false)
  const [isToggling, setIsToggling] = useState(false)

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this QR code?')) {
      return
    }

    setIsDeleting(true)
    try {
      const result = await deleteQrCodeAction(qrCode.id)

      if (result.success) {
        toast.success('QR code deleted successfully')
      } else {
        toast.error(result.error || 'Failed to delete QR code')
      }
    } catch (error) {
      toast.error('An error occurred')
    } finally {
      setIsDeleting(false)
    }
  }

  const handleToggleActive = async () => {
    setIsToggling(true)
    try {
      const result = await updateQrCodeAction(qrCode.id, {
        isActive: !qrCode.isActive,
      })

      if (result.success) {
        toast.success(qrCode.isActive ? 'QR code hidden' : 'QR code activated')
      } else {
        toast.error(result.error || 'Failed to update QR code')
      }
    } catch (error) {
      toast.error('An error occurred')
    } finally {
      setIsToggling(false)
    }
  }

  return (
    <div className="flex gap-2 mt-4">
      <Button
        variant="outline"
        size="sm"
        className="flex-1"
        onClick={handleToggleActive}
        disabled={isToggling}
      >
        {qrCode.isActive ? (
          <>
            <EyeOff className="h-4 w-4 mr-1" />
            Hide
          </>
        ) : (
          <>
            <Eye className="h-4 w-4 mr-1" />
            Show
          </>
        )}
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={handleDelete}
        disabled={isDeleting}
        className="text-red-600 border-red-600 hover:bg-red-50"
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  )
}
