import { Toaster } from '@/components/ui/sonner'
import { Footer } from '@/components/footer'

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <div className="relative flex-1 flex items-center justify-center bg-background p-4">
        <div className="w-full max-w-md">
          {children}
        </div>
      </div>
      <Footer />
      <Toaster />
    </>
  )
}
