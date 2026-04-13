'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'

interface NavItem {
  label: string
  href: string
  icon?: string
}

const navItems: NavItem[] = [
  { label: 'Dashboard', href: '/dashboard', icon: '📊' },
  { label: 'Dossiers', href: '/dossiers', icon: '📁' },
  { label: 'Clienten', href: '/clienten', icon: '👥' },
  { label: 'Rapportages', href: '/rapportages', icon: '📈' },
  { label: 'Skills', href: '/skills', icon: '⚙️' },
  { label: 'Instellingen', href: '/instellingen', icon: '🔧' },
]

export function Sidebar() {
  const pathname = usePathname()

  const isActive = (href: string): boolean => {
    return pathname.startsWith(href)
  }

  return (
    <aside className="sophia-sidebar fixed left-0 top-0 h-screen w-64 flex flex-col">
      <div className="flex items-center justify-center h-20 border-b border-[#2d2d44]">
        <div className="text-[#16a085] font-bold text-2xl">Sophia</div>
      </div>

      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-2">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              'sophia-sidebar-item',
              isActive(item.href) && 'sophia-sidebar-item active'
            )}
          >
            <span className="text-xl">{item.icon}</span>
            <span>{item.label}</span>
          </Link>
        ))}
      </nav>

      <div className="p-4 border-t border-[#2d2d44] text-xs text-[#b8b8b8]">
        <div className="mb-2">Rechtenbank v2.0</div>
        <div>© 2024 Rassers</div>
      </div>
    </aside>
  )
}
