'use client'

import { motion } from 'framer-motion'
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

const container = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.08,
    },
  },
}

const cardVariant = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { type: 'spring' as const, bounce: 0.3, duration: 0.5 } },
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
    <motion.div
      className={`grid ${cols} gap-6`}
      variants={container}
      initial="hidden"
      animate="show"
    >
      {qrCodes.map((qr) => (
        <motion.div
          key={qr.id}
          variants={cardVariant}
          whileHover={{ y: -6, boxShadow: '0 20px 40px rgba(0,0,0,0.12)' }}
          transition={{ type: 'spring', bounce: 0.3, duration: 0.3 }}
          className="rounded-lg"
        >
          <QrRenderer
            qr={qr}
            showAccountDetails={showAccountDetails}
            showDownloadButton={showDownloadButton}
            primaryColor={primaryColor}
            secondaryColor={secondaryColor}
          />
        </motion.div>
      ))}
    </motion.div>
  )
}
