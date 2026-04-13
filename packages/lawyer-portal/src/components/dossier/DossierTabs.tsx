'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'

interface Tab {
  label: string
  value: string
  href: string
  icon?: string
}

interface DossierTabsProps {
  dossierId: string
  currentTab?: string
}

export function DossierTabs({ dossierId, currentTab: _currentTab }: DossierTabsProps) {
  const pathname = usePathname()

  const tabs: Tab[] = [
    { label: 'Overzicht', value: 'overview', href: `/dossiers/${dossierId}`, icon: '📋' },
    { label: 'Analyse', value: 'analyse', href: `/dossiers/${dossierId}/analyse`, icon: '🔍' },
    { label: 'Documenten', value: 'documenten', href: `/dossiers/${dossierId}/documenten`, icon: '📄' },
    { label: 'Berichten', value: 'berichten', href: `/dossiers/${dossierId}/berichten`, icon: '💬' },
    { label: 'Advies', value: 'advies', href: `/dossiers/${dossierId}/advies`, icon: '✍️' },
    { label: 'Factuur', value: 'factuur', href: `/dossiers/${dossierId}/factuur`, icon: '💰' },
    { label: 'Tijdregistratie', value: 'tijdregistratie', href: `/dossiers/${dossierId}/tijdregistratie`, icon: '⏱️' },
  ]

  const getActiveTab = () => {
    const pathSegment = pathname.split('/').pop()
    const baseSegment = pathname.split('/')[2]

    if (pathSegment === dossierId || baseSegment === dossierId) return 'overview'
    return pathSegment || 'overview'
  }

  const active = getActiveTab()

  return (
    <div className="border-b border-gray-200 dark:border-gray-800">
      <div className="flex gap-1 overflow-x-auto">
        {tabs.map((tab) => (
          <Link
            key={tab.value}
            href={tab.href}
            className={cn(
              'px-4 py-3 whitespace-nowrap border-b-2 transition-colors flex items-center gap-2',
              active === tab.value
                ? 'border-[#16a085] text-[#16a085] font-medium'
                : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
            )}
          >
            <span>{tab.icon}</span>
            <span>{tab.label}</span>
          </Link>
        ))}
      </div>
    </div>
  )
}
