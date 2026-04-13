'use client'

import React, { useMemo } from 'react'
import { TimeEntry } from '@/hooks/useDossiers'
import { formatDate, formatDuration } from '@/lib/utils'

interface TimeEntryListProps {
  entries: TimeEntry[]
  isLoading?: boolean
}

export function TimeEntryList({ entries, isLoading = false }: TimeEntryListProps) {
  const totals = useMemo(() => {
    const billable = entries
      .filter((e) => e.billable)
      .reduce((sum, e) => sum + e.duration, 0)
    const nonBillable = entries
      .filter((e) => !e.billable)
      .reduce((sum, e) => sum + e.duration, 0)
    const total = billable + nonBillable

    return { billable, nonBillable, total }
  }, [entries])

  if (isLoading) {
    return <div className="text-center py-4 text-gray-500">Laden...</div>
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-3 gap-4">
        <div className="sophia-card text-center">
          <div className="text-2xl font-bold text-[#16a085]">
            {formatDuration(totals.billable)}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">
            Facturabel
          </div>
        </div>
        <div className="sophia-card text-center">
          <div className="text-2xl font-bold text-gray-700 dark:text-gray-300">
            {formatDuration(totals.nonBillable)}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">
            Niet facturabel
          </div>
        </div>
        <div className="sophia-card text-center">
          <div className="text-2xl font-bold text-gray-900 dark:text-white">
            {formatDuration(totals.total)}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">
            Totaal
          </div>
        </div>
      </div>

      {entries.length === 0 ? (
        <div className="sophia-card text-center py-8 text-gray-500 dark:text-gray-400">
          Geen urenregistraties
        </div>
      ) : (
        <div className="sophia-card overflow-x-auto">
          <table className="sophia-table">
            <thead>
              <tr>
                <th>Datum</th>
                <th>Activiteit</th>
                <th>Duur</th>
                <th>Omschrijving</th>
                <th>Facturabel</th>
              </tr>
            </thead>
            <tbody>
              {entries
                .sort(
                  (a, b) =>
                    new Date(b.date).getTime() - new Date(a.date).getTime()
                )
                .map((entry) => (
                  <tr key={entry.id}>
                    <td className="font-medium">
                      {formatDate(entry.date)}
                    </td>
                    <td className="capitalize text-sm text-gray-600 dark:text-gray-400">
                      {entry.activityType}
                    </td>
                    <td className="font-semibold">
                      {formatDuration(entry.duration)}
                    </td>
                    <td className="text-sm text-gray-600 dark:text-gray-400">
                      {entry.description}
                    </td>
                    <td>
                      {entry.billable ? (
                        <span className="sophia-badge sophia-badge-success">
                          Ja
                        </span>
                      ) : (
                        <span className="sophia-badge sophia-badge-info">
                          Nee
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
