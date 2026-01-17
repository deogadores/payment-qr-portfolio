'use client'

import { useState } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
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

type SingleCardViewProps = {
  qrCodes: QrCode[]
  showAccountDetails?: boolean
  primaryColor?: string
  secondaryColor?: string
}

export function SingleCardView({
  qrCodes,
  showAccountDetails,
  primaryColor,
  secondaryColor,
}: SingleCardViewProps) {
  const [selectedQr, setSelectedQr] = useState(qrCodes[0]?.id || '')

  if (qrCodes.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">No QR codes available</p>
      </div>
    )
  }

  return (
    <Tabs value={selectedQr} onValueChange={setSelectedQr} className="w-full">
      <TabsList className="w-full justify-start mb-6 overflow-x-auto flex-nowrap">
        {qrCodes.map((qr) => (
          <TabsTrigger key={qr.id} value={qr.id} className="whitespace-nowrap">
            {qr.title}
          </TabsTrigger>
        ))}
      </TabsList>

      {qrCodes.map((qr) => (
        <TabsContent key={qr.id} value={qr.id}>
          <div className="max-w-md mx-auto">
            <QrRenderer
              qr={qr}
              showAccountDetails={showAccountDetails}
              primaryColor={primaryColor}
              secondaryColor={secondaryColor}
            />
          </div>
        </TabsContent>
      ))}
    </Tabs>
  )
}
