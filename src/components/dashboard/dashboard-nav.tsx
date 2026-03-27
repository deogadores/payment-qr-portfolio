'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { LayoutDashboard, QrCode, Settings, Share2, LogOut, Menu, X } from 'lucide-react'
import { useState } from 'react'
import { logoutAction } from '@/actions/auth'
import { motion } from 'framer-motion'

const navLinks = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/share', label: 'Share Links', icon: Share2 },
  { href: '/settings', label: 'Settings', icon: Settings },
]

export function DashboardNav({ email }: { email: string }) {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()

  return (
    <nav className="sticky top-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <div className="flex items-center gap-8">
            <Link href="/dashboard" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                <QrCode className="h-4 w-4 text-primary-foreground" />
              </div>
              <span className="font-bold text-lg">Payment QR Portfolio</span>
            </Link>

            {/* Desktop links */}
            <div className="hidden md:flex items-center gap-1">
              {navLinks.map(({ href, label, icon: Icon }) => {
                const active = pathname === href || pathname.startsWith(href + '/')
                return (
                  <Link key={href} href={href} className="relative">
                    {active && (
                      <motion.div
                        layoutId="nav-highlight"
                        className="absolute inset-0 rounded-md bg-accent"
                        transition={{ type: 'spring', bounce: 0.2, duration: 0.35 }}
                      />
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      className={`relative z-10 ${active ? 'text-foreground' : 'text-muted-foreground'}`}
                    >
                      <Icon className="h-4 w-4 mr-1.5" />
                      {label}
                    </Button>
                  </Link>
                )
              })}
            </div>
          </div>

          {/* Right side */}
          <div className="flex items-center gap-3">
            {/* User avatar + logout (desktop) */}
            <div className="hidden md:flex items-center gap-3">
              <span className="text-sm text-muted-foreground max-w-[160px] truncate">{email}</span>
              <form action={logoutAction}>
                <Button variant="ghost" size="sm" type="submit" className="text-muted-foreground hover:text-foreground">
                  <LogOut className="h-4 w-4" />
                </Button>
              </form>
            </div>

            {/* Mobile hamburger */}
            <button
              className="md:hidden p-2 rounded-md text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
              onClick={() => setOpen(!open)}
            >
              {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden border-t border-border bg-background px-4 py-3 flex flex-col gap-1">
          {navLinks.map(({ href, label, icon: Icon }) => {
            const active = pathname === href || pathname.startsWith(href + '/')
            return (
              <Link key={href} href={href} onClick={() => setOpen(false)} className="relative">
                {active && (
                  <motion.div
                    layoutId="nav-mobile-highlight"
                    className="absolute inset-0 rounded-md bg-accent"
                    transition={{ type: 'spring', bounce: 0.2, duration: 0.35 }}
                  />
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  className={`relative z-10 w-full justify-start ${active ? 'text-foreground' : 'text-muted-foreground'}`}
                >
                  <Icon className="h-4 w-4 mr-2" />
                  {label}
                </Button>
              </Link>
            )
          })}
          <div className="border-t border-border mt-2 pt-3 flex items-center justify-between">
            <span className="text-sm text-muted-foreground truncate max-w-[180px]">{email}</span>
            <form action={logoutAction}>
              <Button variant="ghost" size="sm" type="submit" className="text-muted-foreground">
                <LogOut className="h-4 w-4 mr-1.5" />
                Logout
              </Button>
            </form>
          </div>
        </div>
      )}
    </nav>
  )
}
