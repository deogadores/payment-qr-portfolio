'use client'

import { Toaster as Sonner } from 'sonner'

export function Toaster() {
  return (
    <Sonner
      theme="dark"
      position="bottom-right"
      richColors
      closeButton
      expand
      duration={3500}
      gap={8}
      toastOptions={{
        classNames: {
          toast: [
            'flex items-start gap-3 rounded-xl border px-4 py-3 shadow-xl',
            'bg-card/95 backdrop-blur-md border-border',
            'text-sm font-medium text-foreground',
          ].join(' '),
          title: 'font-semibold text-sm leading-snug',
          description: 'text-xs text-muted-foreground mt-0.5 font-normal',
          success: '!border-emerald-500/30 !bg-emerald-950/80',
          error: '!border-red-500/30 !bg-red-950/80',
          warning: '!border-amber-500/30 !bg-amber-950/80',
          info: '!border-blue-500/30 !bg-blue-950/80',
          closeButton: [
            '!border-border !bg-card !text-muted-foreground',
            'hover:!bg-accent hover:!text-foreground transition-colors',
          ].join(' '),
        },
      }}
    />
  )
}
