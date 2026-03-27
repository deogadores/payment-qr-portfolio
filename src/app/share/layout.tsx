import { Plus_Jakarta_Sans } from 'next/font/google'

const plusJakartaSans = Plus_Jakarta_Sans({ subsets: ['latin'] })

export default function ShareLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className={plusJakartaSans.className}>
      {children}
    </div>
  )
}
