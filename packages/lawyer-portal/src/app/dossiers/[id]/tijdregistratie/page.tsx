'use client'

import React, { useEffect, useState } from 'react'
import { TopBar } from '@/components/layout/TopBar'
import { DossierTabs } from '@/components/dossier/DossierTabs'
import { TimeEntryForm } from '@/components/dossier/TimeEntryForm'
import { TimeEntryList } from '@/components/dossier/TimeEntryList'
import { useDossiers, DossierDetail, TimeEntry } from '@/hooks/useDossiers'

interface TijdregistratiePageProps {
  params: { id: string }
}

export default function TijdregistratiePage({ params }: TijdregistratiePageProps) {
  const { getDossier } = useDossiers()
  const [_dossier, setDossier] = useState<DossierDetail | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [timeEntries, setTimeEntries] = useState<TimeEntry[]>([])

  useEffect(() => {
    const loadDossier = async () => {
      setIsLoading(true)
      const data = await getDossier(params.id)
      if (data) {
        setDossier(data)
        setTimeEntries(data.timeEntries || [])
      }
      setIsLoading(false)
    }

    loadDossier()
  }, [params.id, getDossier])

  const handleAddTimeEntry = async (entry: Omit<TimeEntry, 'id'>) => {
    const newEntry: TimeEntry = {
      ...entry,
      id: String(Date.now()),
    }
    setTimeEntries([...timeEntries, newEntry])
    console.log('Time entry added:', newEntry)
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
          { label: 'Tijdregistratie' },
        ]}
      />

      <DossierTabs dossierId={params.id} currentTab="tijdregistratie" />

      <TimeEntryForm onSubmit={handleAddTimeEntry} isLoading={isLoading} />

      <TimeEntryList entries={timeEntries} isLoading={isLoading} />
    </div>
  )
}
