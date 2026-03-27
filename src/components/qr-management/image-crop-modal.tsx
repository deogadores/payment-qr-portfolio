'use client'

import { useState, useCallback } from 'react'
import Cropper from 'react-easy-crop'
import type { Area } from 'react-easy-crop'
import { Button } from '@/components/ui/button'

async function getCroppedBlob(imageSrc: string, cropPx: Area): Promise<Blob> {
  const img = await new Promise<HTMLImageElement>((resolve, reject) => {
    const i = new Image()
    i.onload = () => resolve(i)
    i.onerror = reject
    i.src = imageSrc
  })
  const canvas = document.createElement('canvas')
  canvas.width = cropPx.width
  canvas.height = cropPx.height
  const ctx = canvas.getContext('2d')!
  ctx.drawImage(img, cropPx.x, cropPx.y, cropPx.width, cropPx.height, 0, 0, cropPx.width, cropPx.height)
  return new Promise((resolve, reject) =>
    canvas.toBlob((b) => (b ? resolve(b) : reject(new Error('Canvas empty'))), 'image/jpeg', 0.92)
  )
}

interface ImageCropModalProps {
  src: string
  onConfirm: (blob: Blob) => void
  onCancel: () => void
}

export function ImageCropModal({ src, onConfirm, onCancel }: ImageCropModalProps) {
  const [crop, setCrop] = useState({ x: 0, y: 0 })
  const [zoom, setZoom] = useState(1)
  const [croppedAreaPx, setCroppedAreaPx] = useState<Area | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)

  const onCropComplete = useCallback((_: Area, px: Area) => {
    setCroppedAreaPx(px)
  }, [])

  async function handleConfirm() {
    if (!croppedAreaPx) return
    setIsProcessing(true)
    try {
      const blob = await getCroppedBlob(src, croppedAreaPx)
      onConfirm(blob)
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <>
      <div className="fixed inset-0 z-[60] bg-black/70" onClick={onCancel} />
      <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
        <div className="w-full max-w-md rounded-2xl border border-border bg-card shadow-xl overflow-hidden">
          <div className="px-4 pt-4 pb-2">
            <p className="text-sm font-semibold">Crop image</p>
            <p className="text-xs text-muted-foreground mt-0.5">Pan to reposition · Pinch or scroll to zoom</p>
          </div>

          {/* Crop area */}
          <div className="relative w-full" style={{ height: 300 }}>
            <Cropper
              image={src}
              crop={crop}
              zoom={zoom}
              aspect={1}
              onCropChange={setCrop}
              onZoomChange={setZoom}
              onCropComplete={onCropComplete}
              style={{ containerStyle: { background: '#0f172a' } }}
            />
          </div>

          {/* Zoom slider */}
          <div className="px-4 pt-3 pb-1 flex items-center gap-3">
            <span className="text-xs text-muted-foreground w-4 text-right">–</span>
            <input
              type="range"
              min={1}
              max={3}
              step={0.01}
              value={zoom}
              onChange={(e) => setZoom(Number(e.target.value))}
              className="flex-1 accent-primary"
            />
            <span className="text-xs text-muted-foreground w-4">+</span>
          </div>

          <div className="flex gap-2 p-4">
            <Button onClick={handleConfirm} disabled={isProcessing} className="flex-1">
              {isProcessing ? 'Processing…' : 'Use this crop'}
            </Button>
            <Button onClick={onCancel} variant="outline" className="flex-1" disabled={isProcessing}>
              Cancel
            </Button>
          </div>
        </div>
      </div>
    </>
  )
}
