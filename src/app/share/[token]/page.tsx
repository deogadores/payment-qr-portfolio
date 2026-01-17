import { db } from '@/lib/db'
import { qrCodes, userSettings, users } from '@/lib/db/schema'
import { eq, asc } from 'drizzle-orm'
import { validateShareLink } from '@/lib/share/link-validator'
import { headers } from 'next/headers'
import { CarouselView } from '@/components/qr-display/carousel-view'
import { GridView } from '@/components/qr-display/grid-view'
import { SingleCardView } from '@/components/qr-display/single-card-view'
import Image from 'next/image'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { AlertCircle, Ban, Clock } from 'lucide-react'

type PageProps = {
  params: Promise<{ token: string }>
}

export default async function SharePage({ params }: PageProps) {
  const { token } = await params
  const headersList = await headers()
  const ipAddress = headersList.get('x-forwarded-for') || headersList.get('x-real-ip') || undefined
  const userAgent = headersList.get('user-agent') || undefined

  // Validate the share link
  const validation = await validateShareLink(token, ipAddress, userAgent)

  if (!validation.valid) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <div className="max-w-md w-full">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription className="ml-2">
              {validation.reason === 'not_found' && (
                <>
                  <strong>Link Not Found</strong>
                  <p className="mt-1">This share link does not exist or has been revoked.</p>
                </>
              )}
              {validation.reason === 'already_used' && (
                <>
                  <Ban className="h-4 w-4 inline mr-2" />
                  <strong>Link Already Used</strong>
                  <p className="mt-1">This one-time link has already been accessed.</p>
                </>
              )}
              {validation.reason === 'expired' && (
                <>
                  <Clock className="h-4 w-4 inline mr-2" />
                  <strong>Link Expired</strong>
                  <p className="mt-1">This share link has expired.</p>
                </>
              )}
              {validation.reason === 'validation_error' && (
                <>
                  <strong>Validation Error</strong>
                  <p className="mt-1">An error occurred while validating this link.</p>
                </>
              )}
            </AlertDescription>
          </Alert>
        </div>
      </div>
    )
  }

  // Get user's QR codes
  const userQrCodes = await db
    .select()
    .from(qrCodes)
    .where(eq(qrCodes.userId, validation.link!.userId))
    .orderBy(asc(qrCodes.order))

  // Filter only active QR codes
  const activeQrCodes = userQrCodes.filter((qr) => qr.isActive)

  // Get user settings
  const [settings] = await db
    .select()
    .from(userSettings)
    .where(eq(userSettings.userId, validation.link!.userId))
    .limit(1)

  // Get user info for page title
  const [user] = await db
    .select()
    .from(users)
    .where(eq(users.id, validation.link!.userId))
    .limit(1)

  const displayStyle = settings?.displayStyle || 'carousel'
  const pageTitle = settings?.pageTitle || `${user?.name || 'User'}'s Payment Methods`
  const pageDescription = settings?.pageDescription || 'Choose your preferred payment method'
  const showAccountDetails = settings?.showAccountDetails ?? true
  const primaryColor = settings?.primaryColor || '#6366f1'
  const secondaryColor = settings?.secondaryColor || '#8b5cf6'
  const backgroundColor = settings?.backgroundColor || '#ffffff'
  const logoUrl = settings?.logoUrl

  if (activeQrCodes.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <div className="max-w-md w-full text-center">
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription className="ml-2">
              <strong>No Payment Methods Available</strong>
              <p className="mt-1">This user has not added any payment QR codes yet.</p>
            </AlertDescription>
          </Alert>
        </div>
      </div>
    )
  }

  return (
    <div
      className="min-h-screen py-12 px-4"
      style={{ backgroundColor }}
    >
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            {logoUrl && (
              <div className="relative h-20 w-20 mx-auto mb-6">
                <Image
                  src={logoUrl}
                  alt="Logo"
                  fill
                  className="object-contain"
                />
              </div>
            )}
            <h1
              className="text-4xl font-bold mb-3"
              style={{ color: primaryColor }}
            >
              {pageTitle}
            </h1>
            <p className="text-lg" style={{ color: `${primaryColor}99` }}>{pageDescription}</p>
          </div>

          {/* QR Display based on selected style */}
          {displayStyle === 'carousel' && (
            <CarouselView
              qrCodes={activeQrCodes}
              showAccountDetails={showAccountDetails}
              primaryColor={primaryColor}
              secondaryColor={secondaryColor}
            />
          )}
          {displayStyle === 'grid' && (
            <GridView
              qrCodes={activeQrCodes}
              showAccountDetails={showAccountDetails}
              primaryColor={primaryColor}
              secondaryColor={secondaryColor}
            />
          )}
          {displayStyle === 'single' && (
            <SingleCardView
              qrCodes={activeQrCodes}
              showAccountDetails={showAccountDetails}
              primaryColor={primaryColor}
              secondaryColor={secondaryColor}
            />
          )}
        </div>
    </div>
  )
}
