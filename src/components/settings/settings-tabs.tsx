'use client'

import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import * as TabsPrimitive from '@radix-ui/react-tabs'
import { cn } from '@/lib/utils'
import { ReactNode } from 'react'

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
                'flex-1 rounded-sm px-3 py-1.5 text-sm font-medium transition-all',
                isActive
                  ? 'bg-primary text-primary-foreground shadow-md'
                  : 'text-muted-foreground hover:bg-accent hover:text-foreground'
              )}
            >
              {tab.label}
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
