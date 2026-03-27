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
  showDownloadButton?: boolean
  primaryColor?: string
  secondaryColor?: string
}

export function GridView({
  qrCodes,
  showAccountDetails,
  showDownloadButton,
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

  const cols =
    qrCodes.length === 1 ? 'grid-cols-1 max-w-sm mx-auto' :
    qrCodes.length === 2 ? 'grid-cols-1 sm:grid-cols-2 max-w-2xl mx-auto' :
    'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'

  return (
    <div className={`grid ${cols} gap-6`}>
      {qrCodes.map((qr) => (
        <QrRenderer
          key={qr.id}
          qr={qr}
          showAccountDetails={showAccountDetails}
          showDownloadButton={showDownloadButton}
          primaryColor={primaryColor}
          secondaryColor={secondaryColor}
        />
      ))}
    </div>
  )
}
