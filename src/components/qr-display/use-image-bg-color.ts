'use client'

import { useEffect, useState } from 'react'

export function useImageBgColor(imageUrl: string, fallback = '#ffffff'): string {
  const [bgColor, setBgColor] = useState<string>(fallback)

  useEffect(() => {
    const img = document.createElement('img')
    img.crossOrigin = 'anonymous'

    img.onload = () => {
      try {
        const canvas = document.createElement('canvas')
        canvas.width = img.naturalWidth
        canvas.height = img.naturalHeight
        const ctx = canvas.getContext('2d')
        if (!ctx) return
        ctx.drawImage(img, 0, 0)

        const w = img.naturalWidth
        const h = img.naturalHeight
        const offset = Math.max(2, Math.round(Math.min(w, h) * 0.02))

        // Sample the 4 corners — QR quiet zones are always the background color
        const samples = [
          ctx.getImageData(offset, offset, 1, 1).data,
          ctx.getImageData(w - offset - 1, offset, 1, 1).data,
          ctx.getImageData(offset, h - offset - 1, 1, 1).data,
          ctx.getImageData(w - offset - 1, h - offset - 1, 1, 1).data,
        ]

        const [r, g, b] = samples
          .reduce((acc, px) => [acc[0] + px[0], acc[1] + px[1], acc[2] + px[2]], [0, 0, 0])
          .map((v) => Math.round(v / samples.length))

        setBgColor(`rgb(${r}, ${g}, ${b})`)
      } catch {
        // CORS or canvas taint — keep fallback
      }
    }

    img.src = imageUrl
  }, [imageUrl])

  return bgColor
}
