import { Navbar } from '@/components/landing/navbar'
import { HeroSection } from '@/components/landing/hero-section'
import { FeaturesSection } from '@/components/landing/features-section'
import { HowItWorks } from '@/components/landing/how-it-works'
import { ContactForm } from '@/components/landing/contact-form'
import Link from 'next/link'
import { QrCode } from 'lucide-react'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <HeroSection />
      <FeaturesSection />
      <HowItWorks />

      {/* Request Access Section */}
      <section id="request-access" className="py-24 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <span className="text-sm font-semibold text-primary uppercase tracking-wider">Get Started</span>
            <h2 className="text-3xl md:text-5xl font-bold mt-3 mb-4">
              Request Access Today
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Join and start managing your payment QR codes professionally
            </p>
          </div>
          <ContactForm />
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-card">
        <div className="container mx-auto px-4 py-12">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-lg bg-primary flex items-center justify-center">
                <QrCode className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="font-bold text-xl">QR Portfolio</span>
            </div>

            <div className="flex items-center gap-6 text-sm text-muted-foreground">
              <Link href="#features" className="hover:text-foreground transition-colors">
                Features
              </Link>
              <Link href="#how-it-works" className="hover:text-foreground transition-colors">
                How It Works
              </Link>
              <Link href="/login" className="hover:text-foreground transition-colors">
                Sign In
              </Link>
            </div>

            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} QR Portfolio. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
