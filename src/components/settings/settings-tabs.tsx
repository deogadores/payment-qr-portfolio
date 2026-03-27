'use client'

import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import * as TabsPrimitive from '@radix-ui/react-tabs'
import { cn } from '@/lib/utils'
import { ReactNode } from 'react'
import { motion } from 'framer-motion'

interface Tab {
  value: string
  label: string
  content: ReactNode
}

export function SettingsTabs({ tabs, activeTab }: { tabs: Tab[]; activeTab: string }) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  function handleTabChange(value: string) {
    const params = new URLSearchParams(searchParams.toString())
    params.set('tab', value)
    router.replace(`${pathname}?${params.toString()}`)
  }

  return (
    <TabsPrimitive.Root value={activeTab} onValueChange={handleTabChange} className="space-y-4">
      <TabsPrimitive.List className="flex w-full rounded-md border bg-card p-1 gap-1">
        {tabs.map((tab) => {
          const isActive = tab.value === activeTab
          return (
            <TabsPrimitive.Trigger
              key={tab.value}
              value={tab.value}
              className={cn(
                'relative flex-1 rounded-sm px-3 py-1.5 text-sm font-medium transition-colors',
                isActive
                  ? 'text-primary-foreground'
                  : 'text-muted-foreground hover:text-foreground'
              )}
            >
              {isActive && (
                <motion.div
                  layoutId="settings-tab-highlight"
                  className="absolute inset-0 rounded-sm bg-primary shadow-md"
                  transition={{ type: 'spring', bounce: 0.2, duration: 0.35 }}
                />
              )}
              <span className="relative z-10">{tab.label}</span>
            </TabsPrimitive.Trigger>
          )
        })}
      </TabsPrimitive.List>

      {tabs.map((tab) => (
        <TabsPrimitive.Content key={tab.value} value={tab.value}>
          {tab.content}
        </TabsPrimitive.Content>
      ))}
    </TabsPrimitive.Root>
  )
}
