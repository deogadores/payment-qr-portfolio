'use client'

import Image from 'next/image'
import { CardContent } from '@/components/ui/card'
import { useImageBgColor } from '@/components/qr-display/use-image-bg-color'
import { QrCodeActions } from './qr-code-actions'
import type { QrCode } from '@/lib/db/schema'

export function QrCodeCard({ qr, preview = false }: { qr: QrCode; preview?: boolean }) {
  const bgColor = useImageBgColor(qr.imageUrl)

  return (
    <div className="rounded-xl overflow-hidden border bg-card shadow-sm">
      <div className="aspect-square relative p-6" style={{ backgroundColor: bgColor }}>
        <Image src={qr.imageUrl} alt={qr.title} fill className="object-contain" />
        {!qr.isActive && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <span className="text-white font-semibold">Inactive</span>
          </div>
        )}
      </div>
      <CardContent className="p-4">
        <div className="space-y-2">
          <h3 className="font-semibold text-lg truncate">{qr.title}</h3>
          {qr.description && (
            <p className="text-sm text-muted-foreground line-clamp-2">{qr.description}</p>
          )}
          {qr.accountName && (
            <p className="text-xs text-muted-foreground">
              <span className="font-medium">Account:</span> {qr.accountName}
            </p>
          )}
          {qr.accountNumber && (
            <p className="text-xs text-muted-foreground">
              <span className="font-medium">Number:</span> {qr.accountNumber}
            </p>
          )}
        </div>
        {!preview && <QrCodeActions qrCode={qr} />}
      </CardContent>
    </div>
  )
}
