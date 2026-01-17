'use client'

import { useCallback, useEffect, useState } from 'react'
import useEmblaCarousel from 'embla-carousel-react'
import { Button } from '@/components/ui/button'
import { ChevronLeft, ChevronRight } from 'lucide-react'
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

type CarouselViewProps = {
  qrCodes: QrCode[]
  showAccountDetails?: boolean
  primaryColor?: string
  secondaryColor?: string
}

export function CarouselView({
  qrCodes,
  showAccountDetails,
  primaryColor,
  secondaryColor,
}: CarouselViewProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true })
  const [selectedIndex, setSelectedIndex] = useState(0)

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev()
  }, [emblaApi])

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext()
  }, [emblaApi])

  const scrollTo = useCallback(
    (index: number) => {
      if (emblaApi) emblaApi.scrollTo(index)
    },
    [emblaApi]
  )

  const onSelect = useCallback(() => {
    if (!emblaApi) return
    setSelectedIndex(emblaApi.selectedScrollSnap())
  }, [emblaApi])

  useEffect(() => {
    if (!emblaApi) return
    onSelect()
    emblaApi.on('select', onSelect)
    return () => {
      emblaApi.off('select', onSelect)
    }
  }, [emblaApi, onSelect])

  if (qrCodes.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">No QR codes available</p>
      </div>
    )
  }

  return (
    <div className="relative">
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex">
          {qrCodes.map((qr) => (
            <div key={qr.id} className="flex-[0_0_100%] min-w-0 px-4">
              <div className="max-w-md mx-auto">
                <QrRenderer
                  qr={qr}
                  showAccountDetails={showAccountDetails}
                  primaryColor={primaryColor}
                  secondaryColor={secondaryColor}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {qrCodes.length > 1 && (
        <>
          <Button
            variant="outline"
            size="icon"
            className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full shadow-lg"
            onClick={scrollPrev}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full shadow-lg"
            onClick={scrollNext}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>

          <div className="flex justify-center gap-2 mt-6">
            {qrCodes.map((_, index) => (
              <button
                key={index}
                className={`h-2 rounded-full transition-all ${
                  index === selectedIndex ? 'w-8' : 'w-2'
                }`}
                style={{
                  backgroundColor:
                    index === selectedIndex
                      ? primaryColor || '#6366f1'
                      : '#d1d5db',
                }}
                onClick={() => scrollTo(index)}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  )
}
