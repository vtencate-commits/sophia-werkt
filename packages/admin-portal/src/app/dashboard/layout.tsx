'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/lib/auth';
import { useRouter, usePathname } from 'next/navigation';

interface NavItem {
  label: string;
  href: string;
  icon: string;
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { session, logout, isAuthenticated } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  React.useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, router]);

  if (!isAuthenticated) {
    return <div>Laden...</div>;
  }

  const navItems: NavItem[] = [
    { label: 'Dashboard', href: '/dashboard', icon: '📊' },
    { label: 'Gebruikers', href: '/gebruikers', icon: '👥' },
    { label: 'Tarieven', href: '/tarieven', icon: '💰' },
    { label: 'Facturatie', href: '/facturatie', icon: '📄' },
    { label: 'Skills', href: '/skills', icon: '🤖' },
    { label: 'Rapportages', href: '/rapportages', icon: '📈' },
    { label: 'Audit', href: '/audit', icon: '🔍' },
    { label: 'Instellingen', href: '/instellingen', icon: '⚙️' },
  ];

  const handleLogout = async () => {
    await logout();
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside
        className={`${
          sidebarOpen ? 'w-64' : 'w-20'
        } bg-gray-900 text-white transition-all duration-300 flex flex-col`}
      >
        {/* Logo */}
        <div className="p-6 border-b border-gray-800">
          <h1 className={`font-bold ${sidebarOpen ? 'text-xl' : 'text-xs'}`}>
            {sidebarOpen ? 'Sophia Werkt' : 'SW'}
          </h1>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                  isActive
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-300 hover:bg-gray-800'
                }`}
                title={item.label}
              >
                <span className="text-xl">{item.icon}</span>
                {sidebarOpen && <span>{item.label}</span>}
              </Link>
            );
          })}
        </nav>

        {/* User Info & Logout */}
        <div className="p-4 border-t border-gray-800 space-y-4">
          {sidebarOpen && (
            <div className="text-sm">
              <p className="text-gray-400 text-xs">Ingelogd als</p>
              <p className="font-medium truncate">{session?.name}</p>
              <p className="text-gray-500 text-xs truncate">{session?.email}</p>
            </div>
          )}
          <button
            onClick={handleLogout}
            className="w-full sophia-btn sophia-btn-secondary text-sm py-2"
          >
            {sidebarOpen ? 'Uitloggen' : '📤'}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="text-gray-600 hover:text-gray-900 text-2xl"
            title="Toggle sidebar"
          >
            ☰
          </button>
          <div className="text-sm text-gray-600">
            {new Date().toLocaleDateString('nl-NL', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-auto p-6">{children}</main>
      </div>
    </div>
  );
}
