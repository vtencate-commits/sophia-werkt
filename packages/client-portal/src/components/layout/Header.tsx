'use client';

import React, { useState } from 'react';
import { LogOut, User } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { getInitials } from '@/lib/utils';
import { NotificationBell } from '../notifications/NotificationBell';

export function Header() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const handleLogout = async () => {
    await logout();
    router.push('/login');
  };

  if (!user) return null;

  return (
    <header className='sticky top-0 z-30 border-b border-gray-200 bg-sophia-card shadow-sm'>
      <div className='flex items-center justify-between px-4 py-4 sm:px-6 lg:px-8'>
        <div className='flex-1' />

        <div className='flex items-center gap-4'>
          <NotificationBell />

          <div className='relative'>
            <button
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              className='flex items-center gap-2 rounded-full bg-sophia-bg p-2 hover:bg-gray-200'
              aria-label='User menu'
            >
              <div className='flex h-8 w-8 items-center justify-center rounded-full bg-sophia-secondary text-sm font-semibold text-white'>
                {getInitials(user.firstName, user.lastName)}
              </div>
              <span className='hidden text-sm font-medium text-sophia-text sm:block'>
                {user.firstName}
              </span>
            </button>

            {showProfileMenu && (
              <div className='absolute right-0 mt-2 w-48 rounded-lg border border-gray-200 bg-white shadow-lg'>
                <Link
                  href='/profiel'
                  className='flex items-center gap-2 px-4 py-3 text-sm text-sophia-text hover:bg-sophia-bg'
                >
                  <User className='h-4 w-4' />
                  Mijn Profiel
                </Link>
                <button
                  onClick={handleLogout}
                  className='flex w-full items-center gap-2 px-4 py-3 text-sm text-sophia-text hover:bg-sophia-bg'
                >
                  <LogOut className='h-4 w-4' />
                  Uitloggen
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

function Link({ href, children, className }: { href: string; children: React.ReactNode; className?: string }) {
  return (
    <a href={href} className={className}>
      {children}
    </a>
  );
}
