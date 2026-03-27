'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { LayoutGrid, Layers, Square, List, Check } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

// --- Animated previews ---

function CarouselPreview({ active }: { active: boolean }) {
  const [dot, setDot] = useState(0)

  useEffect(() => {
    if (!active) { setDot(0); return }
    const t = setInterval(() => setDot(d => (d + 1) % 3), 900)
    return () => clearInterval(t)
  }, [active])

  return (
    <div className="flex flex-col items-center gap-2 py-1">
      <div className="flex items-center gap-1.5">
        <motion.div
          className="w-6 h-10 rounded bg-border/50 opacity-40"
          animate={active ? { x: [0, -3, 0] } : { x: 0 }}
          transition={{ duration: 0.9, repeat: Infinity, ease: 'easeInOut', repeatDelay: 0.6 }}
        />
        <div className="w-14 h-16 rounded-lg border-2 border-primary/40 bg-primary/5 flex flex-col items-center justify-center gap-1 shadow-sm">
          <div className="w-8 h-8 rounded bg-primary/20 grid grid-cols-3 gap-0.5 p-0.5">
            {Array.from({ length: 9 }).map((_, i) => (
              <div key={i} className="rounded-sm bg-primary/60" />
            ))}
          </div>
          <div className="w-8 h-1 rounded bg-muted-foreground/30" />
        </div>
        <motion.div
          className="w-6 h-10 rounded bg-border/50 opacity-40"
          animate={active ? { x: [0, 3, 0] } : { x: 0 }}
          transition={{ duration: 0.9, repeat: Infinity, ease: 'easeInOut', repeatDelay: 0.6 }}
        />
      </div>
      <div className="flex gap-1">
        {[0, 1, 2].map(i => (
          <motion.div
            key={i}
            className="rounded-full bg-primary"
            animate={{ width: dot === i ? 16 : 8, opacity: dot === i ? 1 : 0.3 }}
            transition={{ type: 'spring', bounce: 0.3, duration: 0.4 }}
            style={{ height: 8 }}
          />
        ))}
      </div>
    </div>
  )
}

function GridPreview({ active }: { active: boolean }) {
  const colors = [
    'bg-blue-400/30', 'bg-purple-400/30', 'bg-pink-400/30',
    'bg-emerald-400/30', 'bg-amber-400/30', 'bg-sky-400/30',
  ]

  return (
    <div className="grid grid-cols-3 gap-1.5 px-2 py-1">
      {colors.map((color, i) => (
        <motion.div
          key={i}
          className={`aspect-square rounded-lg border ${color} flex items-center justify-center`}
          initial={false}
          animate={active ? { scale: 1, opacity: 1 } : { scale: 0.85, opacity: 0.5 }}
          transition={{ type: 'spring', bounce: 0.3, duration: 0.4, delay: active ? i * 0.05 : 0 }}
        >
          <div className="w-4 h-4 rounded grid grid-cols-3 gap-px p-px">
            {Array.from({ length: 9 }).map((_, j) => (
              <div key={j} className="rounded-sm bg-foreground/30" />
            ))}
          </div>
        </motion.div>
      ))}
    </div>
  )
}

function SinglePreview({ active }: { active: boolean }) {
  const [tab, setTab] = useState(0)

  useEffect(() => {
    if (!active) { setTab(0); return }
    const t = setInterval(() => setTab(d => (d + 1) % 3), 1000)
    return () => clearInterval(t)
  }, [active])

  return (
    <div className="flex flex-col items-center gap-2 px-4 py-1">
      <div className="flex gap-1 w-full">
        {[0, 1, 2].map(i => (
          <div key={i} className="relative flex-1 h-1.5 rounded-full bg-border overflow-hidden">
            <AnimatePresence>
              {tab === i && (
                <motion.div
                  layoutId="single-preview-tab"
                  className="absolute inset-0 rounded-full bg-primary"
                  transition={{ type: 'spring', bounce: 0.2, duration: 0.4 }}
                />
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>
      <AnimatePresence mode="wait">
        <motion.div
          key={tab}
          className="w-full border-2 border-primary/30 bg-primary/5 rounded-lg py-3 flex flex-col items-center gap-1.5"
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -4 }}
          transition={{ duration: 0.2 }}
        >
          <div className="w-12 h-12 rounded bg-primary/20 grid grid-cols-3 gap-0.5 p-0.5">
            {Array.from({ length: 9 }).map((_, i) => (
              <div key={i} className="rounded-sm bg-primary/60" />
            ))}
          </div>
          <div className="w-12 h-1.5 rounded bg-muted-foreground/30" />
          <div className="w-8 h-1 rounded bg-muted-foreground/20" />
        </motion.div>
      </AnimatePresence>
    </div>
  )
}

function ListPreview({ active }: { active: boolean }) {
  const rows = [0, 1, 2]
  return (
    <div className="flex flex-col gap-1.5 px-3 py-2 w-full">
      {rows.map((i) => (
        <motion.div
          key={i}
          className="flex items-center gap-2 rounded-lg border bg-card p-1.5"
          initial={false}
          animate={active ? { opacity: 1, x: 0 } : { opacity: 0.4, x: -4 }}
          transition={{ type: 'spring', bounce: 0.2, duration: 0.4, delay: active ? i * 0.07 : 0 }}
        >
          <div className="w-6 h-6 rounded bg-primary/20 flex-shrink-0 grid grid-cols-3 gap-px p-px">
            {Array.from({ length: 9 }).map((_, j) => (
              <div key={j} className="rounded-sm bg-primary/50" />
            ))}
          </div>
          <div className="flex-1 space-y-1">
            <div className="h-1.5 rounded bg-primary/30" style={{ width: `${55 + i * 12}%` }} />
            <div className="h-1 rounded bg-muted-foreground/20" style={{ width: `${40 + i * 8}%` }} />
          </div>
          <div className="w-4 h-4 rounded bg-muted flex-shrink-0" />
        </motion.div>
      ))}
    </div>
  )
}

// --- Options ---

const options = [
  {
    value: 'carousel',
    label: 'Carousel',
    description: 'Swipeable cards, one at a time. Best for mobile.',
    icon: Layers,
    Preview: CarouselPreview,
  },
  {
    value: 'grid',
    label: 'Grid',
    description: 'All QR codes shown in a responsive grid.',
    icon: LayoutGrid,
    Preview: GridPreview,
  },
  {
    value: 'single',
    label: 'Single Card',
    description: 'One QR code at a time with tab navigation.',
    icon: Square,
    Preview: SinglePreview,
  },
  {
    value: 'list',
    label: 'List',
    description: 'Compact rows with thumbnail and quick actions. Best when showing account names and numbers.',
    icon: List,
    Preview: ListPreview,
  },
] as const

type DisplayStyle = 'carousel' | 'grid' | 'single' | 'list'

type DisplaySettingsProps = {
  displayStyle: DisplayStyle
  onChange: (value: DisplayStyle) => void
}

export function DisplaySettings({ displayStyle, onChange }: DisplaySettingsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Display Style</CardTitle>
        <CardDescription>
          Choose how your QR codes appear on your public payment page
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-3">
          {options.map(({ value, label, description, icon: Icon, Preview }) => {
            const active = displayStyle === value
            return (
              <motion.button
                key={value}
                onClick={() => onChange(value)}
                className={`w-full text-left rounded-xl border-2 transition-colors overflow-hidden ${
                  active
                    ? 'border-primary bg-primary/5'
                    : 'border-border hover:border-border/80 hover:bg-accent/50'
                }`}
                animate={{ scale: active ? 1 : 0.99 }}
                transition={{ type: 'spring', bounce: 0.3, duration: 0.3 }}
              >
                {/* Header row */}
                <div className="flex items-center gap-3 px-4 pt-4 pb-3">
                  <div className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 ${active ? 'bg-primary/10' : 'bg-muted'}`}>
                    <Icon className={`h-4 w-4 ${active ? 'text-primary' : 'text-muted-foreground'}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm">{label}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{description}</p>
                  </div>
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${active ? 'border-primary bg-primary' : 'border-border'}`}>
                    {active && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: 'spring', bounce: 0.4, duration: 0.3 }}
                      >
                        <Check className="h-3 w-3 text-primary-foreground" />
                      </motion.div>
                    )}
                  </div>
                </div>

                {/* Preview */}
                <div className={`mx-4 mb-4 rounded-lg border bg-card min-h-[80px] flex items-center justify-center ${active ? 'border-primary/20' : 'border-border'}`}>
                  <Preview active={active} />
                </div>
              </motion.button>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
