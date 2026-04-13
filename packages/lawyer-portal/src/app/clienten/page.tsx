'use client'

import React, { useState, useMemo } from 'react'
import Link from 'next/link'
import { TopBar } from '@/components/layout/TopBar'
import { useDossiers } from '@/hooks/useDossiers'

interface Client {
  id: string
  name: string
  email?: string
  dossiersCount: number
  status: 'active' | 'inactive'
}

export default function ClientenPage() {
  const { dossiers } = useDossiers()
  const [filterStatus, setFilterStatus] = useState<string>('')

  const clients: Client[] = useMemo(() => {
    const clientMap = new Map<string, Client>()

    dossiers.forEach((dossier) => {
      const id = dossier.clientId
      const existing = clientMap.get(id)

      if (existing) {
        existing.dossiersCount++
      } else {
        clientMap.set(id, {
          id,
          name: dossier.clientNaam,
          dossiersCount: 1,
          status: dossier.status === 'closed' || dossier.status === 'archived' ? 'inactive' : 'active',
        })
      }
    })

    return Array.from(clientMap.values())
  }, [dossiers])

  const filteredClients = useMemo(() => {
    return clients.filter((client) => {
      if (filterStatus && client.status !== filterStatus) return false
      return true
    })
  }, [clients, filterStatus])

  return (
    <div className="space-y-6">
      <TopBar title="Clienten" />

      <div className="flex gap-4 mb-4">
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
            <option value="active">Actief</option>
            <option value="inactive">Inactief</option>
          </select>
        </div>
      </div>

      {filteredClients.length === 0 ? (
        <div className="sophia-card text-center py-8 text-gray-500 dark:text-gray-400">
          Geen clienten gevonden
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredClients.map((client) => (
            <div
              key={client.id}
              className="sophia-card hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">
                    {client.name}
                  </h3>
                  <span
                    className={`text-xs sophia-badge ${
                      client.status === 'active'
                        ? 'sophia-badge-success'
                        : 'sophia-badge-info'
                    }`}
                  >
                    {client.status === 'active' ? 'Actief' : 'Inactief'}
                  </span>
                </div>
              </div>

              <div className="border-t border-gray-200 dark:border-gray-800 pt-4">
                <div className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                  {client.dossiersCount} zaak{client.dossiersCount !== 1 ? 'en' : ''}
                </div>
                <Link
                  href={`/dossiers?client=${client.id}`}
                  className="text-[#16a085] hover:underline text-sm font-medium"
                >
                  Zaken bekijken
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
