'use client'

import { useState, useRef, useCallback, useEffect } from 'react'
import { createPortal } from 'react-dom'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { Download, Eye, X, ZoomIn, ZoomOut, Maximize2, RotateCcw } from 'lucide-react'
import { useImageBgColor } from './use-image-bg-color'
import { hexLuminance } from '@/lib/utils'

const MIN_SCALE = 1
const MAX_SCALE = 5
const ZOOM_STEP = 0.5

type QrCode = {
  id: string
  title: string
  description: string | null
  imageUrl: string
  accountName: string | null
  accountNumber: string | null
  isActive: boolean
}

type ListViewProps = {
  qrCodes: QrCode[]
  showAccountDetails?: boolean
  showDownloadButton?: boolean
  primaryColor?: string
  secondaryColor?: string
  backgroundColor?: string
}

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07 } },
}

const rowVariant = {
  hidden: { opacity: 0, x: -20 },
  show: { opacity: 1, x: 0, transition: { type: 'spring' as const, bounce: 0.25, duration: 0.45 } },
}

function ListRow({
  qr,
  showAccountDetails,
  showDownloadButton,
  primaryColor,
  secondaryColor,
  backgroundColor,
}: {
  qr: QrCode
  showAccountDetails?: boolean
  showDownloadButton?: boolean
  primaryColor: string
  secondaryColor: string
  backgroundColor: string
}) {
  // View QR card modal
  const [open, setOpen] = useState(false)

  // Fullscreen zoom lightbox (same as QrRenderer)
  const [zoomed, setZoomed] = useState(false)
  const [scale, setScale] = useState(1)
  const [offset, setOffset] = useState({ x: 0, y: 0 })
  const drag = useRef({ active: false, startX: 0, startY: 0, originX: 0, originY: 0 })
  const pinch = useRef({ active: false, startDist: 0, startScale: 1 })

  const bgColor = useImageBgColor(qr.imageUrl)
  const isDark = hexLuminance(backgroundColor) < 0.4

  const rowBg = isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.04)'
  const rowBorder = isDark ? 'rgba(255,255,255,0.12)' : `${primaryColor}22`
  const mutedText = isDark ? 'rgba(255,255,255,0.5)' : '#6b7280'
  const bodyText = isDark ? 'rgba(255,255,255,0.75)' : '#374151'
  const iconColor = isDark ? 'rgba(255,255,255,0.4)' : '#9ca3af'

  const reset = useCallback(() => {
    setScale(1)
    setOffset({ x: 0, y: 0 })
  }, [])

  const closeLightbox = useCallback(() => {
    setZoomed(false)
    reset()
  }, [reset])

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

  useEffect(() => {
    if (scale === 1) setOffset({ x: 0, y: 0 })
  }, [scale])

  const onMouseDown = (e: React.MouseEvent) => {
    if (scale === 1) return
    e.preventDefault()
    drag.current = { active: true, startX: e.clientX, startY: e.clientY, originX: offset.x, originY: offset.y }
  }
  const onMouseMove = (e: React.MouseEvent) => {
    if (!drag.current.active) return
    setOffset({ x: drag.current.originX + (e.clientX - drag.current.startX), y: drag.current.originY + (e.clientY - drag.current.startY) })
  }
  const onMouseUp = () => { drag.current.active = false }

  const onWheel = (e: React.WheelEvent) => {
    e.preventDefault()
    const delta = e.deltaY > 0 ? -ZOOM_STEP : ZOOM_STEP
    setScale(s => Math.min(Math.max(s + delta, MIN_SCALE), MAX_SCALE))
  }

  const getDistance = (a: React.Touch, b: React.Touch) => Math.hypot(b.clientX - a.clientX, b.clientY - a.clientY)
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
      setScale(Math.min(Math.max(pinch.current.startScale * (dist / pinch.current.startDist), MIN_SCALE), MAX_SCALE))
    } else if (e.touches.length === 1 && drag.current.active) {
      const t = e.touches[0]
      setOffset({ x: drag.current.originX + (t.clientX - drag.current.startX), y: drag.current.originY + (t.clientY - drag.current.startY) })
    }
  }
  const onTouchEnd = () => { pinch.current.active = false; drag.current.active = false }

  const handleDownload = async (e: React.MouseEvent) => {
    e.stopPropagation()
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
      <motion.div
        className="flex items-center gap-4 p-3 sm:p-4 rounded-xl border backdrop-blur-sm shadow-sm"
        style={{ backgroundColor: rowBg, borderColor: rowBorder }}
        whileHover={{ y: -3, boxShadow: '0 10px 24px rgba(0,0,0,0.1)' }}
        transition={{ type: 'spring', bounce: 0.3, duration: 0.25 }}
      >
        {/* Thumbnail — click to open zoom lightbox */}
        <button
          onClick={() => setZoomed(true)}
          className="relative flex-shrink-0 w-16 h-16 sm:w-20 sm:h-20 rounded-lg overflow-hidden group cursor-zoom-in"
          style={{ backgroundColor: bgColor }}
          aria-label={`Zoom ${qr.title}`}
          onContextMenu={(e) => e.preventDefault()}
        >
          <Image
            src={qr.imageUrl}
            alt={qr.title}
            fill
            className="object-contain p-1.5"
            draggable={false}
            style={noSaveStyle}
          />
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/20">
            <div className="bg-white/90 rounded-full p-1 shadow">
              <ZoomIn className="h-3.5 w-3.5 text-gray-700" />
            </div>
          </div>
        </button>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-sm sm:text-base truncate" style={{ color: primaryColor }}>
            {qr.title}
          </p>
          {qr.description && (
            <p className="text-xs mt-0.5 truncate" style={{ color: mutedText }}>{qr.description}</p>
          )}
          {showAccountDetails && (qr.accountName || qr.accountNumber) && (
            <div className="mt-1.5 space-y-0.5">
              {qr.accountName && (
                <p className="text-xs">
                  <span className="font-medium" style={{ color: secondaryColor }}>Name: </span>
                  <span style={{ color: bodyText }}>{qr.accountName}</span>
                </p>
              )}
              {qr.accountNumber && (
                <p className="text-xs">
                  <span className="font-medium" style={{ color: secondaryColor }}>No.: </span>
                  <span style={{ color: bodyText }}>{qr.accountNumber}</span>
                </p>
              )}
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1 flex-shrink-0">
          <button
            onClick={() => setOpen(true)}
            className="p-2 rounded-lg transition-colors hover:bg-black/5"
            aria-label="View QR"
            title="View QR"
          >
            <Eye className="h-4 w-4" style={{ color: iconColor }} />
          </button>
          {showDownloadButton && (
            <button
              onClick={handleDownload}
              className="p-2 rounded-lg transition-colors hover:bg-black/5"
              aria-label="Download"
              title="Download QR"
            >
              <Download className="h-4 w-4" style={{ color: iconColor }} />
            </button>
          )}
        </div>
      </motion.div>

      {/* Zoom lightbox — same implementation as QrRenderer */}
      {zoomed && createPortal(
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
          onClick={closeLightbox}
          onContextMenu={(e) => e.preventDefault()}
        >
          <button
            className="absolute top-4 right-4 bg-white/10 hover:bg-white/20 text-white rounded-full p-2 transition-colors z-10"
            onClick={closeLightbox}
            aria-label="Close"
          >
            <X className="h-6 w-6" />
          </button>

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

          <div
            className="relative w-full max-w-lg aspect-square rounded-2xl overflow-hidden shadow-2xl select-none"
            style={{ backgroundColor: bgColor, cursor: scale > 1 ? 'grab' : 'default' }}
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

      {/* View QR — full info card */}
      {open && createPortal(
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
          onClick={() => setOpen(false)}
        >
          <div
            className="rounded-2xl shadow-2xl overflow-hidden w-full max-w-sm"
            style={{ backgroundColor }}
            onClick={(e) => e.stopPropagation()}
          >
            <div
              className="relative aspect-square w-full"
              style={{ backgroundColor: bgColor }}
              onContextMenu={(e) => e.preventDefault()}
            >
              <Image
                src={qr.imageUrl}
                alt={qr.title}
                fill
                className="object-contain p-8"
                draggable={false}
                style={noSaveStyle}
              />
              <button
                className="absolute top-3 right-3 bg-black/20 hover:bg-black/40 text-white rounded-full p-1.5 transition-colors"
                onClick={() => setOpen(false)}
                aria-label="Close"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="p-5 space-y-3">
              <div>
                <h3 className="text-lg font-bold" style={{ color: primaryColor }}>{qr.title}</h3>
                {qr.description && (
                  <p className="text-sm mt-0.5" style={{ color: mutedText }}>{qr.description}</p>
                )}
              </div>
              <div className="space-y-1">
                {qr.accountName && (
                  <p className="text-sm">
                    <span className="font-medium" style={{ color: secondaryColor }}>Account Name: </span>
                    <span style={{ color: bodyText }}>{qr.accountName}</span>
                  </p>
                )}
                {qr.accountNumber && (
                  <p className="text-sm">
                    <span className="font-medium" style={{ color: secondaryColor }}>Account Number: </span>
                    <span style={{ color: bodyText }}>{qr.accountNumber}</span>
                  </p>
                )}
              </div>
              {showDownloadButton && (
                <button
                  onClick={handleDownload}
                  className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium text-white transition-opacity hover:opacity-90"
                  style={{ backgroundColor: primaryColor }}
                >
                  <Download className="h-4 w-4" />
                  Download QR Code
                </button>
              )}
            </div>
          </div>
        </div>,
        document.body
      )}
    </>
  )
}

export function ListView({
  qrCodes,
  showAccountDetails,
  showDownloadButton,
  primaryColor = '#6366f1',
  secondaryColor = '#8b5cf6',
  backgroundColor = '#ffffff',
}: ListViewProps) {
  if (qrCodes.length === 0) {
    return (
      <div className="text-center py-12">
        <p style={{ color: `${primaryColor}99` }}>No QR codes available</p>
      </div>
    )
  }

  return (
    <motion.div
      className="max-w-2xl mx-auto space-y-3"
      variants={container}
      initial="hidden"
      animate="show"
    >
      {qrCodes.map((qr) => (
        <motion.div key={qr.id} variants={rowVariant}>
          <ListRow
            qr={qr}
            showAccountDetails={showAccountDetails}
            showDownloadButton={showDownloadButton}
            primaryColor={primaryColor}
            secondaryColor={secondaryColor}
            backgroundColor={backgroundColor}
          />
        </motion.div>
      ))}
    </motion.div>
  )
}
