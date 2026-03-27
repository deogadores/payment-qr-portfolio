import { UploadForm } from '@/components/qr-management/upload-form'

export default function UploadPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Upload QR Code</h1>
        <p className="text-gray-600">Add a new payment QR code to your portfolio</p>
      </div>
      <UploadForm />
    </div>
  )
}
