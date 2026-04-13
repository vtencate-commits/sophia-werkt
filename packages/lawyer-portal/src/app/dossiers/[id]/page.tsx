'use client'

import React, { useEffect, useState } from 'react'
import { TopBar } from '@/components/layout/TopBar'
import { DossierDetailHeader } from '@/components/dossier/DossierDetail'
import { DossierTabs } from '@/components/dossier/DossierTabs'
import { useDossiers, DossierDetail as DossierDetailType } from '@/hooks/useDossiers'

interface DossierPageProps {
  params: { id: string }
}

export default function DossierPage({ params }: DossierPageProps) {
  const { getDossier, updateStatus } = useDossiers()
  const [dossier, setDossier] = useState<DossierDetailType | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadDossier = async () => {
      setIsLoading(true)
      const data = await getDossier(params.id)
      setDossier(data)
      setIsLoading(false)
    }

    loadDossier()
  }, [params.id, getDossier])

  const handleStatusChange = async (newStatus: string) => {
    if (dossier) {
      await updateStatus(dossier.id, newStatus as any)
      const updated = await getDossier(params.id)
      setDossier(updated)
    }
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <TopBar />
        <div className="text-center py-8 text-gray-500">Laden...</div>
      </div>
    )
  }

  if (!dossier) {
    return (
      <div className="space-y-6">
        <TopBar />
        <div className="text-center py-8 text-gray-500">Dossier niet gevonden</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <TopBar
        breadcrumbs={[
          { label: 'Dashboard', href: '/dashboard' },
          { label: 'Dossiers', href: '/dossiers' },
          { label: dossier.referentie },
        ]}
      />

      <DossierDetailHeader
        dossier={dossier}
        onStatusChange={handleStatusChange}
      />

      <DossierTabs dossierId={params.id} />

      <div className="sophia-card">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Zaakoverzicht
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="font-medium text-gray-700 dark:text-gray-300 mb-3">
              Documenten
            </h3>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              {dossier.documenten?.length || 0}
            </p>
          </div>
          <div>
            <h3 className="font-medium text-gray-700 dark:text-gray-300 mb-3">
              Analyses
            </h3>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              {dossier.analyses?.length || 0}
            </p>
          </div>
          <div>
            <h3 className="font-medium text-gray-700 dark:text-gray-300 mb-3">
              Urenregistraties
            </h3>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              {dossier.timeEntries?.length || 0}
            </p>
          </div>
          <div>
            <h3 className="font-medium text-gray-700 dark:text-gray-300 mb-3">
              Advies
            </h3>
            <p className="text-lg">
              {dossier.advies ? (
                <span className="text-green-600 dark:text-green-400">✓ Aanwezig</span>
              ) : (
                <span className="text-gray-500 dark:text-gray-400">Nog te schrijven</span>
              )}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
