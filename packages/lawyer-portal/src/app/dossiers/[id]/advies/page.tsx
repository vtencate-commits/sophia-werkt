'use client'

import React, { useEffect, useState } from 'react'
import { TopBar } from '@/components/layout/TopBar'
import { DossierTabs } from '@/components/dossier/DossierTabs'
import { AdviesEditor } from '@/components/dossier/AdviesEditor'
import { useDossiers, DossierDetail } from '@/hooks/useDossiers'

interface AdviesPageProps {
  params: { id: string }
}

export default function AdviesPage({ params }: AdviesPageProps) {
  const { getDossier } = useDossiers()
  const [dossier, setDossier] = useState<DossierDetail | null>(null)
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

  const handleSaveAdvice = async (content: string) => {
    console.log('Saving advice:', content)
  }

  const handleSubmitToClient = async () => {
    console.log('Submitting advice to client')
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <TopBar />
        <div className="text-center py-8 text-gray-500">Laden...</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <TopBar
        breadcrumbs={[
          { label: 'Dashboard', href: '/dashboard' },
          { label: 'Dossiers', href: '/dossiers' },
          { label: 'Advies' },
        ]}
      />

      <DossierTabs dossierId={params.id} currentTab="advies" />

      {dossier && (
        <AdviesEditor
          content={dossier.advies || ''}
          onSave={handleSaveAdvice}
          onSubmitToClient={handleSubmitToClient}
          isLoading={isLoading}
        />
      )}
    </div>
  )
}
