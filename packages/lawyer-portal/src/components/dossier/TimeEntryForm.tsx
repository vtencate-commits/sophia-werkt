'use client'

import React, { useState } from 'react'
import { TimeEntry } from '@/hooks/useDossiers'

interface TimeEntryFormProps {
  onSubmit?: (entry: Omit<TimeEntry, 'id'>) => void
  isLoading?: boolean
}

type ActivityType = 'analyse' | 'advies' | 'communicatie' | 'onderhandeling'

export function TimeEntryForm({ onSubmit, isLoading = false }: TimeEntryFormProps) {
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    duration: 60,
    activityType: 'analyse' as ActivityType,
    description: '',
    billable: true,
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit?.({
      ...formData,
      activityType: formData.activityType as ActivityType,
    })
    setFormData({
      date: new Date().toISOString().split('T')[0],
      duration: 60,
      activityType: 'analyse',
      description: '',
      billable: true,
    })
  }

  const activityTypes: { value: ActivityType; label: string }[] = [
    { value: 'analyse', label: 'Analyse' },
    { value: 'advies', label: 'Advies' },
    { value: 'communicatie', label: 'Communicatie' },
    { value: 'onderhandeling', label: 'Onderhandeling' },
  ]

  return (
    <form onSubmit={handleSubmit} className="sophia-card space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Datum
          </label>
          <input
            type="date"
            value={formData.date}
            onChange={(e) =>
              setFormData({ ...formData, date: e.target.value })
            }
            className="sophia-input"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Duur (minuten)
          </label>
          <input
            type="number"
            min="1"
            step="15"
            value={formData.duration}
            onChange={(e) =>
              setFormData({
                ...formData,
                duration: Math.max(1, parseInt(e.target.value) || 0),
              })
            }
            className="sophia-input"
            required
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Activiteit
        </label>
        <select
          value={formData.activityType}
          onChange={(e) =>
            setFormData({
              ...formData,
              activityType: e.target.value as ActivityType,
            })
          }
          className="sophia-input"
          required
        >
          {activityTypes.map((type) => (
            <option key={type.value} value={type.value}>
              {type.label}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Omschrijving
        </label>
        <textarea
          value={formData.description}
          onChange={(e) =>
            setFormData({ ...formData, description: e.target.value })
          }
          className="sophia-input min-h-20"
          placeholder="Wat is er gedaan..."
          required
        />
      </div>

      <div className="flex items-center">
        <input
          type="checkbox"
          id="billable"
          checked={formData.billable}
          onChange={(e) =>
            setFormData({ ...formData, billable: e.target.checked })
          }
          className="rounded border-gray-300 dark:border-gray-700 cursor-pointer"
        />
        <label
          htmlFor="billable"
          className="ml-2 text-sm font-medium text-gray-700 dark:text-gray-300 cursor-pointer"
        >
          Facturabel
        </label>
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="sophia-button-primary w-full disabled:opacity-50"
      >
        {isLoading ? 'Toevoegen...' : 'Urenregistratie toevoegen'}
      </button>
    </form>
  )
}
