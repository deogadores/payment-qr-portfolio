'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Eye, X } from 'lucide-react'
import { CarouselView } from '@/components/qr-display/carousel-view'
import { GridView } from '@/components/qr-display/grid-view'
import { SingleCardView } from '@/components/qr-display/single-card-view'
import { ListView } from '@/components/qr-display/list-view'
import { hexLuminance } from '@/lib/utils'
import Image from 'next/image'

type QrCode = {
  id: string
  title: string
  description: string | null
  imageUrl: string
  accountName: string | null
  accountNumber: string | null
  isActive: boolean
}

type Settings = {
  displayStyle?: string | null
  primaryColor?: string | null
  secondaryColor?: string | null
  backgroundColor?: string | null
  logoUrl?: string | null
  showAccountDetails?: boolean | null
  showDownloadButton?: boolean | null
  pageTitle?: string | null
  pageDescription?: string | null
}

interface PreviewButtonProps {
  settings: Settings
  qrCodes: QrCode[]
  userName: string | null
}

export function PreviewButton({ settings, qrCodes, userName }: PreviewButtonProps) {
  const [open, setOpen] = useState(false)

  // Lock body scroll when modal is open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [open])

  // Close on Escape
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false) }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [open])

  const displayStyle = settings.displayStyle || 'carousel'
  const primaryColor = settings.primaryColor || '#3b82f6'
  const secondaryColor = settings.secondaryColor || '#1e40af'
  const backgroundColor = settings.backgroundColor || '#ffffff'
  const logoUrl = settings.logoUrl
  const showAccountDetails = settings.showAccountDetails ?? true
  const showDownloadButton = settings.showDownloadButton ?? true
  const pageTitle = settings.pageTitle || `${userName || 'User'}'s Payment Methods`
  const pageDescription = settings.pageDescription || 'Choose your preferred payment method'

  const bgLuminance = hexLuminance(backgroundColor)
  const bgIsDark = bgLuminance < 0.4
  const bgIsLight = bgLuminance > 0.85
  const logoOverlayStyle = bgIsDark
    ? { backgroundColor: 'rgba(255,255,255,0.12)', boxShadow: '0 0 0 1px rgba(255,255,255,0.18)' }
    : bgIsLight
    ? { backgroundColor: 'rgba(0,0,0,0.05)', boxShadow: '0 0 0 1px rgba(0,0,0,0.08)' }
    : undefined

  const activeQrCodes = qrCodes.filter(qr => qr.isActive)

  return (
    <>
      <Button variant="outline" size="sm" onClick={() => setOpen(true)}>
        <Eye className="h-4 w-4 mr-2" />
        Preview
      </Button>

      <AnimatePresence>
        {open && (
          <>
            {/* Backdrop */}
            <motion.div
              className="fixed inset-0 z-[80] bg-black/70 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setOpen(false)}
            />

            {/* Modal */}
            <motion.div
              className="fixed inset-4 md:inset-8 z-[90] flex flex-col rounded-2xl overflow-hidden shadow-2xl border border-border"
              initial={{ opacity: 0, scale: 0.95, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 16 }}
              transition={{ type: 'spring', bounce: 0.2, duration: 0.35 }}
            >
              {/* Header bar */}
              <div className="flex items-center gap-3 px-4 h-12 bg-card border-b border-border shrink-0">
                <div className="flex-1 flex justify-center">
                  <div className="bg-muted rounded-md px-4 py-1 text-xs text-muted-foreground font-mono max-w-xs truncate w-full text-center">
                    payment-qr-portfolio.jdgadores.dev/share/preview
                  </div>
                </div>
                <button
                  onClick={() => setOpen(false)}
                  className="text-muted-foreground hover:text-foreground transition-colors"
                  aria-label="Close preview"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {/* Page content */}
              <div className="flex-1 overflow-y-auto" style={{ backgroundColor }}>
                {activeQrCodes.length === 0 ? (
                  <div className="flex items-center justify-center h-full min-h-[300px]">
                    <p className="text-sm" style={{ color: `${primaryColor}99` }}>
                      No active QR codes to preview. Upload some first.
                    </p>
                  </div>
                ) : (
                  <div className="max-w-6xl mx-auto py-12 px-4">
                    {/* Header */}
                    <div className="text-center mb-12">
                      {logoUrl && (
                        <div
                          className="relative h-20 w-20 mx-auto mb-6 rounded-2xl"
                          style={logoOverlayStyle}
                        >
                          <Image src={logoUrl} alt="Logo" fill className="object-contain p-2" />
                        </div>
                      )}
                      <h1
                        className="text-4xl font-bold mb-3"
                        style={{ color: primaryColor }}
                      >
                        {pageTitle}
                      </h1>
                      <p className="text-lg" style={{ color: `${primaryColor}99` }}>
                        {pageDescription}
                      </p>
                    </div>

                    {/* QR display */}
                    {displayStyle === 'carousel' && (
                      <CarouselView
                        qrCodes={activeQrCodes}
                        showAccountDetails={showAccountDetails}
                        showDownloadButton={showDownloadButton}
                        primaryColor={primaryColor}
                        secondaryColor={secondaryColor}
                      />
                    )}
                    {displayStyle === 'grid' && (
                      <GridView
                        qrCodes={activeQrCodes}
                        showAccountDetails={showAccountDetails}
                        showDownloadButton={showDownloadButton}
                        primaryColor={primaryColor}
                        secondaryColor={secondaryColor}
                      />
                    )}
                    {displayStyle === 'single' && (
                      <SingleCardView
                        qrCodes={activeQrCodes}
                        showAccountDetails={showAccountDetails}
                        showDownloadButton={showDownloadButton}
                        primaryColor={primaryColor}
                        secondaryColor={secondaryColor}
                      />
                    )}
                    {displayStyle === 'list' && (
                      <ListView
                        qrCodes={activeQrCodes}
                        showAccountDetails={showAccountDetails}
                        showDownloadButton={showDownloadButton}
                        primaryColor={primaryColor}
                        secondaryColor={secondaryColor}
                        backgroundColor={backgroundColor}
                      />
                    )}
                  </div>
                )}
              </div>

              {/* Footer note */}
              <div className="shrink-0 px-4 py-2 bg-card border-t border-border text-center">
                <p className="text-xs text-muted-foreground">
                  Previewing your current settings (unsaved changes included)
                </p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
