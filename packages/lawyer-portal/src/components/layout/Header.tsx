'use client'

import React, { useState } from 'react'
import { useAuth } from '@/hooks/useAuth'

interface HeaderProps {
  onSearchChange?: (query: string) => void
}

export function Header({ onSearchChange }: HeaderProps) {
  const { lawyer, logout } = useAuth()
  const [showUserMenu, setShowUserMenu] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  const handleLogout = async () => {
    await logout()
  }

  return (
    <header className="fixed top-0 left-64 right-0 h-20 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between px-8 z-40">
      <div className="flex-1">
        <input
          type="text"
          placeholder="Zoeken..."
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value)
            onSearchChange?.(e.target.value)
          }}
          className="sophia-input w-96 max-w-md"
        />
      </div>

      <div className="flex items-center gap-6">
        <button className="text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white text-xl">
          🔔
        </button>

        <div className="relative">
          <button
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            <div className="w-8 h-8 rounded-full bg-[#16a085] flex items-center justify-center text-white font-bold text-sm">
              {lawyer?.name.charAt(0).toUpperCase()}
            </div>
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              {lawyer?.name}
            </span>
          </button>

          {showUserMenu && (
            <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-900 rounded-lg shadow-lg border border-gray-200 dark:border-gray-800 z-50">
              <div className="p-4 border-b border-gray-200 dark:border-gray-800">
                <div className="text-sm font-medium text-gray-900 dark:text-white">
                  {lawyer?.name}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  {lawyer?.email}
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                Uitloggen
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
