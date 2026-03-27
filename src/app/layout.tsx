import type { Metadata } from 'next'
import { Plus_Jakarta_Sans } from 'next/font/google'
import './globals.css'

const plusJakartaSans = Plus_Jakarta_Sans({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Payment QR Portfolio',
  description:
    'Create a professional portfolio of your payment QR codes with customizable presentations and secure, time-limited sharing links.',
  openGraph: {
    title: 'Payment QR Portfolio',
    description:
      'Create a professional portfolio of your payment QR codes with customizable presentations and secure, time-limited sharing links.',
    url: 'https://payment-qr-portfolio.jdgadores.dev',
    siteName: 'Payment QR Portfolio',
    images: [
      {
        url: 'https://payment-qr-portfolio.jdgadores.dev/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Payment QR Portfolio — customizable QR code sharing',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Payment QR Portfolio',
    description:
      'Create a professional portfolio of your payment QR codes with customizable presentations and secure, time-limited sharing links.',
    images: ['https://payment-qr-portfolio.jdgadores.dev/og-image.png'],
  },
  metadataBase: new URL('https://payment-qr-portfolio.jdgadores.dev'),
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <body className={`${plusJakartaSans.className} flex flex-col min-h-screen`}>
        {children}
      </body>
    </html>
  )
}
