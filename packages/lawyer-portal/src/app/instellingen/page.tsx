'use client'

import React, { useState } from 'react'
import { TopBar } from '@/components/layout/TopBar'
import { useAuth } from '@/hooks/useAuth'

export default function InstellingenPage() {
  const { lawyer } = useAuth()
  const [settings, setSettings] = useState({
    hourlyRate: 175,
    notifications: true,
    emailNotifications: true,
    darkMode: false,
    language: 'nl',
  })

  const handleSettingChange = (key: string, value: unknown) => {
    setSettings((prev) => ({ ...prev, [key]: value }))
  }

  const handleSave = async () => {
    console.log('Saving settings:', settings)
  }

  return (
    <div className="space-y-6">
      <TopBar title="Instellingen" />

      <div className="max-w-2xl space-y-6">
        <div className="sophia-card">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Profiel
          </h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Naam
              </label>
              <input
                type="text"
                value={lawyer?.name || ''}
                disabled
                className="sophia-input bg-gray-100 dark:bg-gray-800"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                E-mailadres
              </label>
              <input
                type="email"
                value={lawyer?.email || ''}
                disabled
                className="sophia-input bg-gray-100 dark:bg-gray-800"
              />
            </div>
          </div>
        </div>

        <div className="sophia-card">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Factuurinstellingen
          </h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Uurtarief (EUR)
              </label>
              <input
                type="number"
                value={settings.hourlyRate}
                onChange={(e) =>
                  handleSettingChange('hourlyRate', parseFloat(e.target.value))
                }
                className="sophia-input"
                min="0"
                step="5"
              />
            </div>
          </div>
        </div>

        <div className="sophia-card">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Meldingen
          </h2>
          <div className="space-y-4">
            <label className="flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.notifications}
                onChange={(e) =>
                  handleSettingChange('notifications', e.target.checked)
                }
                className="rounded border-gray-300 dark:border-gray-700"
              />
              <span className="ml-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                In-app meldingen inschakelen
              </span>
            </label>
            <label className="flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.emailNotifications}
                onChange={(e) =>
                  handleSettingChange('emailNotifications', e.target.checked)
                }
                className="rounded border-gray-300 dark:border-gray-700"
              />
              <span className="ml-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                E-mailmeldingen inschakelen
              </span>
            </label>
          </div>
        </div>

        <div className="sophia-card">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Voorkeur
          </h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Taal
              </label>
              <select
                value={settings.language}
                onChange={(e) =>
                  handleSettingChange('language', e.target.value)
                }
                className="sophia-input"
              >
                <option value="nl">Nederlands</option>
                <option value="en">English</option>
              </select>
            </div>
          </div>
        </div>

        <button
          onClick={handleSave}
          className="sophia-button-primary w-full"
        >
          Instellingen opslaan
        </button>
      </div>
    </div>
  )
}
