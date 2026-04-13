'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface NavItem {
  label: string;
  href: string;
  icon: React.ReactNode;
}

const navItems: NavItem[] = [
  {
    label: 'Dashboard',
    href: '/dashboard',
    icon: <span className='text-lg'>📊</span>,
  },
  {
    label: 'Dossiers',
    href: '/dossier',
    icon: <span className='text-lg'>📁</span>,
  },
  {
    label: 'Profiel',
    href: '/profiel',
    icon: <span className='text-lg'>👤</span>,
  },
  {
    label: 'Help',
    href: '/help',
    icon: <span className='text-lg'>❓</span>,
  },
];

export function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  return (
    <>
      <aside
        className={cn(
          'fixed left-0 top-0 z-40 flex h-screen w-64 flex-col border-r border-gray-200 bg-sophia-card transition-transform duration-300 lg:translate-x-0 lg:static',
          isOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <div className='flex items-center justify-between p-6 lg:block'>
          <div className='flex items-center gap-2'>
            <div className='h-8 w-8 rounded-lg bg-gradient-to-br from-sophia-primary to-sophia-secondary' />
            <span className='text-xl font-bold text-sophia-primary'>Sophia</span>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className='lg:hidden'
            aria-label='Close sidebar'
          >
            <X className='h-6 w-6 text-sophia-text' />
          </button>
        </div>

        <nav className='flex-1 space-y-2 px-3 py-4'>
          {navItems.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className={cn(
                  'flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-sophia-secondary text-white'
                    : 'text-sophia-text hover:bg-sophia-bg'
                )}
              >
                {item.icon}
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className='border-t border-gray-200 p-4'>
          <p className='text-xs text-sophia-muted'>© 2026 Sophia Werkt</p>
        </div>
      </aside>

      <button
        onClick={() => setIsOpen(!isOpen)}
        className='fixed left-4 top-4 z-50 rounded-lg bg-sophia-secondary p-2 text-white lg:hidden'
        aria-label='Toggle sidebar'
      >
        {isOpen ? <X className='h-6 w-6' /> : <Menu className='h-6 w-6' />}
      </button>
    </>
  );
}
