'use client'

import React from 'react'
import Link from 'next/link'
import { TopBar } from '@/components/layout/TopBar'
import { DossierTable } from '@/components/dossier/DossierTable'
import { useDossiers } from '@/hooks/useDossiers'

export default function DossiersPage() {
  const { dossiers, isLoading } = useDossiers()

  return (
    <div className="space-y-6">
      <TopBar
        title="Dossiers"
        actions={
          <Link href="/dossiers/new" className="sophia-button-primary">
            Nieuw dossier
          </Link>
        }
      />

      <DossierTable dossiers={dossiers} isLoading={isLoading} />
    </div>
  )
}
