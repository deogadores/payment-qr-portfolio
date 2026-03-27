import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/** Returns perceived luminance (0 = black, 1 = white) for a hex color. */
export function hexLuminance(hex: string): number {
  const clean = hex.replace('#', '')
  if (clean.length !== 6) return 1
  const r = parseInt(clean.substring(0, 2), 16)
  const g = parseInt(clean.substring(2, 4), 16)
  const b = parseInt(clean.substring(4, 6), 16)
  return (0.299 * r + 0.587 * g + 0.114 * b) / 255
}
