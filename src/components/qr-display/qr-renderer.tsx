'use client'

import Image from 'next/image'
import { createPortal } from 'react-dom'
import { Button } from '@/components/ui/button'
import { Download, X, ZoomIn, ZoomOut, Maximize2, RotateCcw } from 'lucide-react'
import { useImageBgColor } from './use-image-bg-color'
import { useState, useEffect, useRef, useCallback } from 'react'

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
  showDownloadButton?: boolean
  primaryColor?: string
  secondaryColor?: string
}

const MIN_SCALE = 1
const MAX_SCALE = 5
const ZOOM_STEP = 0.5

export function QrRenderer({
  qr,
  showAccountDetails = true,
  showDownloadButton = true,
  primaryColor = '#6366f1',
  secondaryColor = '#8b5cf6',
}: QrRendererProps) {
  const bgColor = useImageBgColor(qr.imageUrl)
  const [zoomed, setZoomed] = useState(false)
  const [scale, setScale] = useState(1)
  const [offset, setOffset] = useState({ x: 0, y: 0 })

  // Drag state kept in a ref to avoid stale closures in event listeners
  const drag = useRef({ active: false, startX: 0, startY: 0, originX: 0, originY: 0 })
  // Pinch state
  const pinch = useRef({ active: false, startDist: 0, startScale: 1 })

  const reset = useCallback(() => {
    setScale(1)
    setOffset({ x: 0, y: 0 })
  }, [])

  const closeLightbox = useCallback(() => {
    setZoomed(false)
    reset()
  }, [reset])

  // Keyboard
  useEffect(() => {
    if (!zoomed) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeLightbox()
      if (e.key === '+' || e.key === '=') setScale(s => Math.min(s + ZOOM_STEP, MAX_SCALE))
      if (e.key === '-') setScale(s => Math.max(s - ZOOM_STEP, MIN_SCALE))
      if (e.key === '0') reset()
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [zoomed, closeLightbox, reset])

  // Reset pan when scale returns to 1
  useEffect(() => {
    if (scale === 1) setOffset({ x: 0, y: 0 })
  }, [scale])

  // ── Mouse drag ──────────────────────────────────────────────
  const onMouseDown = (e: React.MouseEvent) => {
    if (scale === 1) return
    e.preventDefault()
    drag.current = { active: true, startX: e.clientX, startY: e.clientY, originX: offset.x, originY: offset.y }
  }

  const onMouseMove = (e: React.MouseEvent) => {
    if (!drag.current.active) return
    setOffset({
      x: drag.current.originX + (e.clientX - drag.current.startX),
      y: drag.current.originY + (e.clientY - drag.current.startY),
    })
  }

  const onMouseUp = () => { drag.current.active = false }

  // ── Wheel zoom ──────────────────────────────────────────────
  const onWheel = (e: React.WheelEvent) => {
    e.preventDefault()
    const delta = e.deltaY > 0 ? -ZOOM_STEP : ZOOM_STEP
    setScale(s => Math.min(Math.max(s + delta, MIN_SCALE), MAX_SCALE))
  }

  // ── Touch: pinch-to-zoom + single-finger pan ────────────────
  const getDistance = (a: React.Touch, b: React.Touch) =>
    Math.hypot(b.clientX - a.clientX, b.clientY - a.clientY)

  const onTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 2) {
      pinch.current = { active: true, startDist: getDistance(e.touches[0], e.touches[1]), startScale: scale }
    } else if (e.touches.length === 1 && scale > 1) {
      const t = e.touches[0]
      drag.current = { active: true, startX: t.clientX, startY: t.clientY, originX: offset.x, originY: offset.y }
    }
  }

  const onTouchMove = (e: React.TouchEvent) => {
    if (e.touches.length === 2 && pinch.current.active) {
      const dist = getDistance(e.touches[0], e.touches[1])
      const next = Math.min(Math.max(pinch.current.startScale * (dist / pinch.current.startDist), MIN_SCALE), MAX_SCALE)
      setScale(next)
    } else if (e.touches.length === 1 && drag.current.active) {
      const t = e.touches[0]
      setOffset({
        x: drag.current.originX + (t.clientX - drag.current.startX),
        y: drag.current.originY + (t.clientY - drag.current.startY),
      })
    }
  }

  const onTouchEnd = () => {
    pinch.current.active = false
    drag.current.active = false
  }

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

  const noSaveStyle: React.CSSProperties = { pointerEvents: 'none', userSelect: 'none', WebkitTouchCallout: 'none' as any }

  return (
    <>
      <div className="qr-card bg-white rounded-lg shadow-lg overflow-hidden">
        <button
          className="aspect-square relative w-full cursor-zoom-in group"
          style={{ backgroundColor: bgColor }}
          onClick={() => setZoomed(true)}
          onContextMenu={(e) => e.preventDefault()}
          aria-label="Zoom QR code"
        >
          <Image src={qr.imageUrl} alt={qr.title} fill className="object-contain p-8" priority draggable={false} style={noSaveStyle} />
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/10">
            <div className="bg-white/90 rounded-full p-2 shadow">
              <ZoomIn className="h-5 w-5 text-gray-700" />
            </div>
          </div>
        </button>

        <div className="p-6 space-y-4">
          <div>
            <h3 className="qr-title text-2xl font-bold mb-2" style={{ color: primaryColor }}>
              {qr.title}
            </h3>
            {qr.description && <p className="text-gray-600">{qr.description}</p>}
          </div>

          {showAccountDetails && (qr.accountName || qr.accountNumber) && (
            <div className="space-y-1 pt-4 border-t">
              {qr.accountName && (
                <p className="text-sm">
                  <span className="font-medium" style={{ color: secondaryColor }}>Account Name:</span>{' '}
                  <span className="text-gray-700">{qr.accountName}</span>
                </p>
              )}
              {qr.accountNumber && (
                <p className="text-sm">
                  <span className="font-medium" style={{ color: secondaryColor }}>Account Number:</span>{' '}
                  <span className="text-gray-700">{qr.accountNumber}</span>
                </p>
              )}
            </div>
          )}

          {showDownloadButton && (
            <Button onClick={handleDownload} className="w-full" style={{ backgroundColor: primaryColor }}>
              <Download className="h-4 w-4 mr-2" />
              Download QR Code
            </Button>
          )}
        </div>
      </div>

      {/* Lightbox */}
      {zoomed && createPortal(
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
          onClick={closeLightbox}
          onContextMenu={(e) => e.preventDefault()}
        >
          {/* Close */}
          <button
            className="absolute top-4 right-4 bg-white/10 hover:bg-white/20 text-white rounded-full p-2 transition-colors z-10"
            onClick={closeLightbox}
            aria-label="Close"
          >
            <X className="h-6 w-6" />
          </button>

          {/* Zoom controls */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2 z-10">
            <button
              onClick={(e) => { e.stopPropagation(); setScale(s => Math.max(s - ZOOM_STEP, MIN_SCALE)) }}
              className="bg-white/15 hover:bg-white/25 text-white rounded-full p-2.5 transition-colors"
              aria-label="Zoom out"
            >
              <ZoomOut className="h-5 w-5" />
            </button>

            <span className="text-white text-sm font-medium bg-white/15 rounded-full px-3 py-1.5 min-w-[52px] text-center select-none">
              {Math.round(scale * 100)}%
            </span>

            <button
              onClick={(e) => { e.stopPropagation(); setScale(s => Math.min(s + ZOOM_STEP, MAX_SCALE)) }}
              className="bg-white/15 hover:bg-white/25 text-white rounded-full p-2.5 transition-colors"
              aria-label="Zoom in"
            >
              <ZoomIn className="h-5 w-5" />
            </button>

            <button
              onClick={(e) => { e.stopPropagation(); setScale(s => Math.min(s + ZOOM_STEP * 2, MAX_SCALE)) }}
              className="bg-white/15 hover:bg-white/25 text-white rounded-full p-2.5 transition-colors"
              aria-label="Maximise"
            >
              <Maximize2 className="h-5 w-5" />
            </button>

            {scale > 1 && (
              <button
                onClick={(e) => { e.stopPropagation(); reset() }}
                className="bg-white/15 hover:bg-white/25 text-white rounded-full p-2.5 transition-colors"
                aria-label="Reset zoom"
              >
                <RotateCcw className="h-5 w-5" />
              </button>
            )}
          </div>

          {/* Image container */}
          <div
            className="relative w-full max-w-lg aspect-square rounded-2xl overflow-hidden shadow-2xl select-none"
            style={{
              backgroundColor: bgColor,
              cursor: scale > 1 ? 'grab' : 'default',
            }}
            onClick={(e) => e.stopPropagation()}
            onMouseDown={onMouseDown}
            onMouseMove={onMouseMove}
            onMouseUp={onMouseUp}
            onMouseLeave={onMouseUp}
            onWheel={onWheel}
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
            onTouchEnd={onTouchEnd}
          >
            <div
              className="absolute inset-0"
              style={{
                transform: `scale(${scale}) translate(${offset.x / scale}px, ${offset.y / scale}px)`,
                transition: drag.current.active || pinch.current.active ? 'none' : 'transform 0.15s ease',
              }}
            >
              <Image src={qr.imageUrl} alt={qr.title} fill className="object-contain p-8" priority draggable={false} style={noSaveStyle} />
            </div>
          </div>
        </div>,
        document.body
      )}
    </>
  )
}
