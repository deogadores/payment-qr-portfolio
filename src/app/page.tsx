import { QrCode, Share2, Shield } from 'lucide-react'
import { Navbar } from '@/components/landing/navbar'
import { ContactForm } from '@/components/landing/contact-form'
import { getSession } from '@/lib/auth/session'
import { redirect } from 'next/navigation'

export default async function HomePage() {
  const session = await getSession()
  if (session?.user) redirect('/dashboard')
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />

      {/* Hero */}
      <section className="flex-1 flex items-center justify-center px-4 py-20">
        <div className="max-w-2xl mx-auto text-center space-y-6">
          <div className="w-14 h-14 rounded-2xl bg-primary flex items-center justify-center mx-auto">
            <QrCode className="h-7 w-7 text-primary-foreground" />
          </div>

          <h1 className="text-4xl md:text-5xl font-bold tracking-tight leading-tight">
            Share Payment QR Codes
            <span className="block text-primary">Securely</span>
          </h1>

          <p className="text-lg text-muted-foreground max-w-lg mx-auto">
            Upload your e-wallet or bank QR codes and share them via secure, time-limited links.
          </p>

          {/* Quick features */}
          <div className="flex flex-wrap justify-center gap-6 pt-4 text-sm text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <QrCode className="h-4 w-4 text-primary" />
              Manage QR Codes
            </span>
            <span className="flex items-center gap-1.5">
              <Share2 className="h-4 w-4 text-primary" />
              Expiring Links
            </span>
            <span className="flex items-center gap-1.5">
              <Shield className="h-4 w-4 text-primary" />
              Private & Secure
            </span>
          </div>
        </div>
      </section>

      {/* Request Access */}
      <section id="request-access" className="px-4 py-16 bg-muted/30 border-t">
        <div className="max-w-xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold">Request Access</h2>
            <p className="text-muted-foreground mt-1">
              Fill out the form and we&apos;ll send you a registration phrase if approved.
            </p>
          </div>
          <ContactForm />
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t px-4 py-6">
        <div className="max-w-xl mx-auto flex items-center justify-between gap-3 text-sm text-muted-foreground">
          <span className="font-semibold text-foreground">QR Portfolio</span>
          <span>© {new Date().getFullYear()} QR Portfolio</span>
        </div>
      </footer>
    </div>
  )
}
