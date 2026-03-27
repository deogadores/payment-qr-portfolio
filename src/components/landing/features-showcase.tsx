'use client'

import { useState, useEffect, useCallback } from 'react'
import { QrCode, Share2, Shield, Clock, Palette } from 'lucide-react'
import { AnimatePresence, motion } from 'framer-motion'

const features = [
  {
    icon: QrCode,
    title: 'Manage QR Codes',
    description: 'Upload and organize all your e-wallet and bank QR codes in one place. Keep everything tidy and accessible.',
    color: 'from-blue-500/20 to-transparent',
    iconBg: 'bg-blue-500/15',
    iconColor: 'text-blue-400',
    glow: 'rgba(59,130,246,0.15)',
  },
  {
    icon: Clock,
    title: 'Expiring Links',
    description: 'Share via time-limited or one-time links that automatically expire. Full control over who sees your codes and for how long.',
    color: 'from-violet-500/20 to-transparent',
    iconBg: 'bg-violet-500/15',
    iconColor: 'text-violet-400',
    glow: 'rgba(139,92,246,0.15)',
  },
  {
    icon: Shield,
    title: 'Private & Secure',
    description: 'Your QR codes stay private. Only people with your link can view them — no public listings, no surprises.',
    color: 'from-emerald-500/20 to-transparent',
    iconBg: 'bg-emerald-500/15',
    iconColor: 'text-emerald-400',
    glow: 'rgba(16,185,129,0.15)',
  },
  {
    icon: Share2,
    title: 'Instant Sharing',
    description: "Generate a shareable link in seconds and send it to anyone. No accounts needed on the recipient's end.",
    color: 'from-sky-500/20 to-transparent',
    iconBg: 'bg-sky-500/15',
    iconColor: 'text-sky-400',
    glow: 'rgba(14,165,233,0.15)',
  },
  {
    icon: Palette,
    title: 'Customization',
    description: 'Personalize your portfolio with custom colors, layouts, and display styles to match your brand.',
    color: 'from-rose-500/20 to-transparent',
    iconBg: 'bg-rose-500/15',
    iconColor: 'text-rose-400',
    glow: 'rgba(244,63,94,0.15)',
  },
]

const INTERVAL_MS = 3500

export function FeaturesShowcase() {
  const [active, setActive] = useState(0)
  const [paused, setPaused] = useState(false)
  const [direction, setDirection] = useState(1)

  const goTo = useCallback((index: number) => {
    setDirection(index > active ? 1 : -1)
    setActive(index)
  }, [active])

  useEffect(() => {
    if (paused) return
    const timer = setInterval(() => {
      setDirection(1)
      setActive(prev => (prev + 1) % features.length)
    }, INTERVAL_MS)
    return () => clearInterval(timer)
  }, [paused])

  const feature = features[active]

  return (
    <div
      className="w-full max-w-lg mx-auto pt-8"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* Spotlight card */}
      <div className="relative rounded-2xl border border-border overflow-hidden" style={{ height: 260 }}>
        {/* Animated background glow */}
        <AnimatePresence mode="wait">
          <motion.div
            key={`glow-${active}`}
            className={`absolute inset-0 bg-gradient-to-b ${feature.color}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
          />
        </AnimatePresence>

        {/* Content */}
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={active}
            custom={direction}
            variants={{
              enter: (d: number) => ({ opacity: 0, x: d * 40 }),
              center: { opacity: 1, x: 0 },
              exit: (d: number) => ({ opacity: 0, x: d * -40 }),
            }}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center"
          >
            {/* Icon */}
            <div className="flex justify-center mb-5">
              <motion.div
                className={`relative w-16 h-16 rounded-2xl flex items-center justify-center ${feature.iconBg}`}
                initial={{ scale: 0.7, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.35, ease: 'backOut' }}
              >
                <div
                  className="absolute inset-0 rounded-2xl blur-xl"
                  style={{ background: feature.glow }}
                />
                <feature.icon className={`relative h-8 w-8 ${feature.iconColor}`} />
              </motion.div>
            </div>

            <motion.h3
              className="text-xl font-bold mb-2"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.05 }}
            >
              {feature.title}
            </motion.h3>

            <motion.p
              className="text-muted-foreground text-sm leading-relaxed max-w-xs mx-auto"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.1 }}
            >
              {feature.description}
            </motion.p>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Progress tabs */}
      <div className="flex justify-center gap-2 mt-5">
        {features.map((f, i) => {
          const Icon = f.icon
          return (
            <button
              key={f.title}
              onClick={() => goTo(i)}
              aria-label={f.title}
              className="group relative flex flex-col items-center gap-1.5 px-3 py-2 rounded-xl transition-colors duration-200 hover:bg-muted"
            >
              <Icon
                className={`h-4 w-4 transition-colors duration-200 ${
                  i === active ? f.iconColor : 'text-muted-foreground group-hover:text-foreground'
                }`}
              />
              {/* Progress bar */}
              <span className="relative block h-0.5 w-6 rounded-full bg-border overflow-hidden">
                {i === active && (
                  <motion.span
                    className="absolute inset-y-0 left-0 rounded-full bg-primary"
                    initial={{ width: '0%' }}
                    animate={{ width: '100%' }}
                    transition={{ duration: INTERVAL_MS / 1000, ease: 'linear' }}
                    key={`progress-${active}-${paused}`}
                  />
                )}
              </span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
