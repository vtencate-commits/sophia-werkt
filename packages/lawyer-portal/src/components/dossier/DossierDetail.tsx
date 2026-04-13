'use client'

import React from 'react'
import { DossierDetail } from '@/hooks/useDossiers'
import { formatDate, getStatusColor, getStatusLabel } from '@/lib/utils'
import { ConflictCheckBadge } from './ConflictCheckBadge'

interface DossierDetailHeaderProps {
  dossier: DossierDetail
  onStatusChange?: (status: string) => void
}

export function DossierDetailHeader({
  dossier,
  onStatusChange,
}: DossierDetailHeaderProps) {
  return (
    <div className="sophia-card space-y-4">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            {dossier.referentie}
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            {dossier.beschrijving}
          </p>
        </div>
        <div className="text-right">
          <span className={`sophia-badge ${getStatusColor(dossier.status)}`}>
            {getStatusLabel(dossier.status)}
          </span>
          {dossier.conflict_check_status && (
            <div className="mt-2">
              <ConflictCheckBadge status={dossier.conflict_check_status} />
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t border-gray-200 dark:border-gray-800">
        <div>
          <div className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
            Cliënt
          </div>
          <div className="font-semibold text-gray-900 dark:text-white">
            {dossier.clientNaam}
          </div>
        </div>
        <div>
          <div className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
            Type zaak
          </div>
          <div className="font-semibold text-gray-900 dark:text-white">
            {dossier.type}
          </div>
        </div>
        <div>
          <div className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
            Advocaat
          </div>
          <div className="font-semibold text-gray-900 dark:text-white">
            {dossier.advocaatNaam}
          </div>
        </div>
        <div>
          <div className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
            Geopend
          </div>
          <div className="font-semibold text-gray-900 dark:text-white">
            {formatDate(dossier.datumCreated)}
          </div>
        </div>
      </div>

      {(dossier.werkgeverNaam || dossier.datumDeadline) && (
        <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-200 dark:border-gray-800">
          {dossier.werkgeverNaam && (
            <div>
              <div className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
                Werkgever
              </div>
              <div className="font-semibold text-gray-900 dark:text-white">
                {dossier.werkgeverNaam}
              </div>
              {dossier.werkgeverContactperson && (
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  {dossier.werkgeverContactperson}
                </div>
              )}
            </div>
          )}
          {dossier.datumDeadline && (
            <div>
              <div className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
                Deadline
              </div>
              <div className="font-semibold text-gray-900 dark:text-white">
                {formatDate(dossier.datumDeadline)}
              </div>
            </div>
          )}
        </div>
      )}

      {onStatusChange && (
        <div className="pt-4 border-t border-gray-200 dark:border-gray-800">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Wijzig status
          </label>
          <select
            value={dossier.status}
            onChange={(e) => onStatusChange(e.target.value)}
            className="sophia-input max-w-xs"
          >
            <option value="open">Open</option>
            <option value="inprogress">In behandeling</option>
            <option value="pending">In afwachting</option>
            <option value="completed">Voltooid</option>
            <option value="closed">Gesloten</option>
            <option value="archived">Gearchiveerd</option>
          </select>
        </div>
      )}
    </div>
  )
}
