import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { QrCode } from 'lucide-react'

export function Navbar() {
  return (
    <nav className="sticky top-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <QrCode className="h-4 w-4 text-primary-foreground" />
            </div>
            <span className="font-bold text-lg">Payment QR Portfolio</span>
          </Link>

          <Button asChild variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
            <Link href="/login">Sign In</Link>
          </Button>
        </div>
      </div>
    </nav>
  )
}
