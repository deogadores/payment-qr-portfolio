'use client'

import { useState } from 'react'
import { QrRenderer } from './qr-renderer'
import { motion } from 'framer-motion'

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
  showDownloadButton?: boolean
  primaryColor?: string
  secondaryColor?: string
}

export function SingleCardView({
  qrCodes,
  showAccountDetails,
  showDownloadButton,
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

  const activeColor = primaryColor || '#3b82f6'

  return (
    <div className="w-full">
      {/* Tab bar */}
      <div
        className="flex overflow-x-auto overflow-y-hidden mb-6 rounded-md border p-1 gap-1"
        style={{ backgroundColor: `${activeColor}18` }}
      >
        {qrCodes.map((qr) => {
          const isActive = qr.id === selectedQr
          return (
            <button
              key={qr.id}
              onClick={() => setSelectedQr(qr.id)}
              className="relative whitespace-nowrap rounded-sm px-4 py-1.5 text-sm font-medium flex-shrink-0"
              style={{ color: isActive ? '#fff' : activeColor }}
            >
              {isActive && (
                <motion.div
                  layoutId="single-card-highlight"
                  className="absolute inset-0 rounded-sm"
                  style={{ backgroundColor: activeColor, boxShadow: '0 1px 4px rgba(0,0,0,0.2)' }}
                  transition={{ type: 'spring', bounce: 0.2, duration: 0.35 }}
                />
              )}
              <span className="relative z-10">{qr.title}</span>
            </button>
          )
        })}
      </div>

      {/* Active panel */}
      {qrCodes.map((qr) =>
        qr.id === selectedQr ? (
          <div key={qr.id} className="max-w-md mx-auto">
            <QrRenderer
              qr={qr}
              showAccountDetails={showAccountDetails}
              showDownloadButton={showDownloadButton}
              primaryColor={primaryColor}
              secondaryColor={secondaryColor}
            />
          </div>
        ) : null
      )}
    </div>
  )
}
