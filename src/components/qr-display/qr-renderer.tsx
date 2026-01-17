import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Download } from 'lucide-react'

type QrCode = {
  id: string
  title: string
  description: string | null
  imageUrl: string
  accountName: string | null
  accountNumber: string | null
  isActive: boolean
}

type QrRendererProps = {
  qr: QrCode
  showAccountDetails?: boolean
  primaryColor?: string
  secondaryColor?: string
}

export function QrRenderer({
  qr,
  showAccountDetails = true,
  primaryColor = '#6366f1',
  secondaryColor = '#8b5cf6',
}: QrRendererProps) {
  const handleDownload = async () => {
    try {
      const response = await fetch(qr.imageUrl)
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `${qr.title.replace(/\s+/g, '-')}-qr-code.png`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)
    } catch (error) {
      console.error('Failed to download QR code:', error)
    }
  }

  return (
    <div className="qr-card bg-white rounded-lg shadow-lg overflow-hidden">
      <div className="aspect-square relative bg-gray-50 p-8">
        <Image
          src={qr.imageUrl}
          alt={qr.title}
          fill
          className="object-contain"
          priority
        />
      </div>
      <div className="p-6 space-y-4">
        <div>
          <h3
            className="qr-title text-2xl font-bold mb-2"
            style={{ color: primaryColor }}
          >
            {qr.title}
          </h3>
          {qr.description && (
            <p className="text-gray-600">{qr.description}</p>
          )}
        </div>

        {showAccountDetails && (qr.accountName || qr.accountNumber) && (
          <div className="space-y-1 pt-4 border-t">
            {qr.accountName && (
              <p className="text-sm">
                <span className="font-medium" style={{ color: secondaryColor }}>
                  Account Name:
                </span>{' '}
                <span className="text-gray-700">{qr.accountName}</span>
              </p>
            )}
            {qr.accountNumber && (
              <p className="text-sm">
                <span className="font-medium" style={{ color: secondaryColor }}>
                  Account Number:
                </span>{' '}
                <span className="text-gray-700">{qr.accountNumber}</span>
              </p>
            )}
          </div>
        )}

        <Button
          onClick={handleDownload}
          className="w-full"
          style={{ backgroundColor: primaryColor }}
        >
          <Download className="h-4 w-4 mr-2" />
          Download QR Code
        </Button>
      </div>
    </div>
  )
}
