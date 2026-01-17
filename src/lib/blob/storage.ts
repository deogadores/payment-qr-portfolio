import { put, del } from '@vercel/blob'
import { writeFile, unlink, mkdir } from 'fs/promises'
import path from 'path'

const isLocalDev = !process.env.BLOB_READ_WRITE_TOKEN

/**
 * Upload a QR code image to Vercel Blob Storage or local storage in dev
 */
export async function uploadQrImage(file: File, userId: string): Promise<string> {
  // Validate file type
  if (!file.type.startsWith('image/')) {
    throw new Error('File must be an image')
  }

  // Validate file size (max 5MB)
  const maxSize = 5 * 1024 * 1024 // 5MB in bytes
  if (file.size > maxSize) {
    throw new Error('File size must be less than 5MB')
  }

  if (isLocalDev) {
    return uploadLocalFile(file, `qr-codes/${userId}`)
  }

  const fileName = `qr-codes/${userId}/${Date.now()}-${file.name}`

  const blob = await put(fileName, file, {
    access: 'public',
    addRandomSuffix: true,
  })

  return blob.url
}

/**
 * Upload a logo image to Vercel Blob Storage or local storage in dev
 */
export async function uploadLogo(file: File, userId: string): Promise<string> {
  // Validate file type
  if (!file.type.startsWith('image/')) {
    throw new Error('File must be an image')
  }

  // Validate file size (max 2MB)
  const maxSize = 2 * 1024 * 1024 // 2MB in bytes
  if (file.size > maxSize) {
    throw new Error('Logo size must be less than 2MB')
  }

  if (isLocalDev) {
    return uploadLocalFile(file, `logos/${userId}`)
  }

  const fileName = `logos/${userId}/logo-${Date.now()}`

  const blob = await put(fileName, file, {
    access: 'public',
    addRandomSuffix: true,
  })

  return blob.url
}

/**
 * Delete an image from Vercel Blob Storage or local storage
 */
export async function deleteImage(url: string): Promise<void> {
  try {
    if (isLocalDev || url.startsWith('/api/uploads/')) {
      // Extract filename from local URL
      const filename = url.replace('/api/uploads/', '')
      const filePath = path.join(process.cwd(), 'uploads', filename)
      await unlink(filePath)
    } else {
      await del(url)
    }
  } catch (error) {
    console.error('Error deleting image:', error)
    // Don't throw - deletion failures shouldn't block operations
  }
}

/**
 * Upload file to local storage (for development)
 */
async function uploadLocalFile(file: File, subdir: string): Promise<string> {
  const uploadsDir = path.join(process.cwd(), 'uploads', subdir)

  // Ensure directory exists
  await mkdir(uploadsDir, { recursive: true })

  // Generate unique filename
  const ext = path.extname(file.name) || '.png'
  const filename = `${Date.now()}-${Math.random().toString(36).substring(7)}${ext}`
  const filePath = path.join(uploadsDir, filename)

  // Convert File to Buffer and write
  const bytes = await file.arrayBuffer()
  const buffer = Buffer.from(bytes)
  await writeFile(filePath, buffer)

  // Return URL that will be served by our API route
  return `/api/uploads/${subdir}/${filename}`
}
