import { QrCode } from 'lucide-react'
import Link from 'next/link'
import { ContactForm } from '@/components/landing/contact-form'
import { FeaturesShowcase } from '@/components/landing/features-showcase'
import { Button } from '@/components/ui/button'
import { Footer } from '@/components/footer'
import { Toaster } from '@/components/ui/sonner'
import { getSession } from '@/lib/auth/session'
import { redirect } from 'next/navigation'

export default async function HomePage() {
  const session = await getSession()
  if (session?.user) redirect('/dashboard')
  return (
    <>
    <div className="min-h-screen bg-background flex flex-col">
      {/* Hero */}
      <section className="relative flex-1 flex items-center justify-center px-4 py-24 overflow-hidden">
        {/* Background glow */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-primary/10 blur-3xl" />
        </div>

        <div className="max-w-3xl mx-auto text-center space-y-8">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary/30 bg-primary/10 text-primary text-sm font-medium">
            <QrCode className="h-3.5 w-3.5" />
            Payment QR Portfolio
          </div>

          {/* Headline */}
          <h1 className="text-5xl md:text-6xl font-bold tracking-tight leading-[1.1]">
            Share your payment QR codes{' '}
            <span className="bg-gradient-to-r from-blue-300 to-cyan-300 bg-clip-text text-transparent">
              safely and simply
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-lg md:text-xl text-muted-foreground max-w-xl mx-auto leading-relaxed">
            Upload your e-wallet and bank QR codes once. Share them through secure, time-limited links — no more screenshots in group chats.
          </p>

          {/* CTAs */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <Button asChild size="lg" className="px-8">
              <Link href="/login">Sign In</Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="px-8">
              <Link href="#request-access">Request Access</Link>
            </Button>
          </div>

          {/* Animated features */}
          <FeaturesShowcase />
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
    </div>
    <Footer />
    <Toaster />
  </>
  )
}
