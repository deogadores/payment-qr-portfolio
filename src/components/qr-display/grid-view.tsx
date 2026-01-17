'use client'

import { QrRenderer } from './qr-renderer'

type QrCode = {
  id: string
  title: string
  description: string | null
  imageUrl: string
  accountName: string | null
  accountNumber: string | null
  isActive: boolean
}

type GridViewProps = {
  qrCodes: QrCode[]
  showAccountDetails?: boolean
  primaryColor?: string
  secondaryColor?: string
}

export function GridView({
  qrCodes,
  showAccountDetails,
  primaryColor,
  secondaryColor,
}: GridViewProps) {
  if (qrCodes.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">No QR codes available</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {qrCodes.map((qr) => (
        <QrRenderer
          key={qr.id}
          qr={qr}
          showAccountDetails={showAccountDetails}
          primaryColor={primaryColor}
          secondaryColor={secondaryColor}
        />
      ))}
    </div>
  )
}
