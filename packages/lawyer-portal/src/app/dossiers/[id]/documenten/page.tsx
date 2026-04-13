'use client'

import React, { useEffect, useState } from 'react'
import { TopBar } from '@/components/layout/TopBar'
import { DossierTabs } from '@/components/dossier/DossierTabs'
import { DocumentManager } from '@/components/documents/DocumentManager'
import { useDossiers, DossierDetail } from '@/hooks/useDossiers'

interface DocumentsPageProps {
  params: { id: string }
}

export default function DocumentsPage({ params }: DocumentsPageProps) {
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

  const handleUpload = async (file: File, category: string) => {
    console.log('Upload:', file.name, category)
  }

  const handleToggleVisibility = async (docId: string, visible: boolean) => {
    console.log('Toggle visibility:', docId, visible)
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
          { label: 'Documenten' },
        ]}
      />

      <DossierTabs dossierId={params.id} currentTab="documenten" />

      {dossier && (
        <DocumentManager
          documents={dossier.documenten || []}
          onUpload={handleUpload}
          onToggleVisibility={handleToggleVisibility}
          isLoading={isLoading}
        />
      )}
    </div>
  )
}
