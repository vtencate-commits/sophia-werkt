'use client'

import React, { useState, useMemo } from 'react'
import Link from 'next/link'
import { Dossier } from '@/hooks/useDossiers'
import { getStatusColor, getStatusLabel, formatDate } from '@/lib/utils'

interface DossierTableProps {
  dossiers: Dossier[]
  isLoading?: boolean
}

type SortField = 'referentie' | 'clientNaam' | 'type' | 'status' | 'advocaatNaam' | 'datumCreated'
type SortOrder = 'asc' | 'desc'

export function DossierTable({ dossiers, isLoading = false }: DossierTableProps) {
  const [sortField, setSortField] = useState<SortField>('datumCreated')
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc')
  const [filterStatus, setFilterStatus] = useState<string>('')
  const [filterType, setFilterType] = useState<string>('')

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortOrder('asc')
    }
  }

  const filteredAndSorted = useMemo(() => {
    let filtered = dossiers.filter((d) => {
      if (filterStatus && d.status !== filterStatus) return false
      if (filterType && d.type !== filterType) return false
      return true
    })

    filtered.sort((a, b) => {
      const aVal = a[sortField]
      const bVal = b[sortField]
      let comparison = 0

      if (typeof aVal === 'string' && typeof bVal === 'string') {
        comparison = aVal.localeCompare(bVal)
      } else if (typeof aVal === 'number' && typeof bVal === 'number') {
        comparison = aVal - bVal
      }

      return sortOrder === 'asc' ? comparison : -comparison
    })

    return filtered
  }, [dossiers, sortField, sortOrder, filterStatus, filterType])

  const statuses = Array.from(new Set(dossiers.map((d) => d.status)))
  const types = Array.from(new Set(dossiers.map((d) => d.type)))

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) return <span className="text-gray-300">⇅</span>
    return sortOrder === 'asc' ? <span>↑</span> : <span>↓</span>
  }

  return (
    <div className="space-y-4">
      <div className="flex gap-4 flex-wrap">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Status
          </label>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="sophia-input"
          >
            <option value="">Alle statussen</option>
            {statuses.map((status) => (
              <option key={status} value={status}>
                {getStatusLabel(status)}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Type
          </label>
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="sophia-input"
          >
            <option value="">Alle types</option>
            {types.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>
      </div>

      {isLoading ? (
        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
          Laden...
        </div>
      ) : filteredAndSorted.length === 0 ? (
        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
          Geen dossiers gevonden
        </div>
      ) : (
        <div className="overflow-x-auto sophia-card">
          <table className="sophia-table">
            <thead>
              <tr>
                <th>
                  <button
                    onClick={() => handleSort('referentie')}
                    className="flex items-center gap-1 hover:text-gray-900 dark:hover:text-white"
                  >
                    Referentie
                    <SortIcon field="referentie" />
                  </button>
                </th>
                <th>
                  <button
                    onClick={() => handleSort('clientNaam')}
                    className="flex items-center gap-1 hover:text-gray-900 dark:hover:text-white"
                  >
                    Cliënt
                    <SortIcon field="clientNaam" />
                  </button>
                </th>
                <th>
                  <button
                    onClick={() => handleSort('type')}
                    className="flex items-center gap-1 hover:text-gray-900 dark:hover:text-white"
                  >
                    Type
                    <SortIcon field="type" />
                  </button>
                </th>
                <th>
                  <button
                    onClick={() => handleSort('status')}
                    className="flex items-center gap-1 hover:text-gray-900 dark:hover:text-white"
                  >
                    Status
                    <SortIcon field="status" />
                  </button>
                </th>
                <th>
                  <button
                    onClick={() => handleSort('advocaatNaam')}
                    className="flex items-center gap-1 hover:text-gray-900 dark:hover:text-white"
                  >
                    Advocaat
                    <SortIcon field="advocaatNaam" />
                  </button>
                </th>
                <th>
                  <button
                    onClick={() => handleSort('datumCreated')}
                    className="flex items-center gap-1 hover:text-gray-900 dark:hover:text-white"
                  >
                    Datum
                    <SortIcon field="datumCreated" />
                  </button>
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredAndSorted.map((dossier) => (
                <tr key={dossier.id}>
                  <td>
                    <Link
                      href={`/dossiers/${dossier.id}`}
                      className="text-[#16a085] hover:underline font-medium"
                    >
                      {dossier.referentie}
                    </Link>
                  </td>
                  <td className="font-medium text-gray-900 dark:text-white">
                    {dossier.clientNaam}
                  </td>
                  <td className="text-sm text-gray-600 dark:text-gray-400">
                    {dossier.type}
                  </td>
                  <td>
                    <span className={`sophia-badge ${getStatusColor(dossier.status)}`}>
                      {getStatusLabel(dossier.status)}
                    </span>
                  </td>
                  <td className="text-sm text-gray-600 dark:text-gray-400">
                    {dossier.advocaatNaam}
                  </td>
                  <td className="text-sm text-gray-600 dark:text-gray-400">
                    {formatDate(dossier.datumCreated)}
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
