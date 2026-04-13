'use client'

import React, { useState } from 'react'
import { TopBar } from '@/components/layout/TopBar'
import { DossierTabs } from '@/components/dossier/DossierTabs'
import { AiAnalyseViewer } from '@/components/dossier/AiAnalyseViewer'
import { AiAnalyseEditor } from '@/components/dossier/AiAnalyseEditor'
import { useAiAnalyse } from '@/hooks/useAiAnalyse'

interface AnalysePageProps {
  params: { id: string }
}

export default function AnalysePage({ params }: AnalysePageProps) {
  const { startAnalysis, pollAnalysis, isLoading } = useAiAnalyse()
  const [analysisContent, setAnalysisContent] = useState<string>('')
  const [isEditing, setIsEditing] = useState(false)
  const [isPolling, setIsPolling] = useState(false)

  const handleStartAnalysis = async (type: string) => {
    setIsPolling(true)
    try {
      const job = await startAnalysis(params.id, type)
      if (job) {
        const result = await pollAnalysis(job.id)
        if (result?.result) {
          setAnalysisContent(result.result)
        }
      }
    } finally {
      setIsPolling(false)
    }
  }

  const handleSaveAnalysis = async (content: string) => {
    setAnalysisContent(content)
    setIsEditing(false)
  }

  return (
    <div className="space-y-6">
      <TopBar
        breadcrumbs={[
          { label: 'Dashboard', href: '/dashboard' },
          { label: 'Dossiers', href: '/dossiers' },
          { label: 'Analyse' },
        ]}
      />

      <DossierTabs dossierId={params.id} currentTab="analyse" />

      <div className="sophia-card">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            AI Analyse
          </h2>
          <div className="flex gap-2">
            {analysisContent && (
              <button
                onClick={() => setIsEditing(!isEditing)}
                className="sophia-button-secondary text-sm"
              >
                {isEditing ? 'Klaar' : 'Bewerk'}
              </button>
            )}
            <button
              onClick={() => handleStartAnalysis('full')}
              disabled={isLoading || isPolling}
              className="sophia-button-primary text-sm disabled:opacity-50"
            >
              {isLoading || isPolling ? 'Analyseren...' : 'Nieuwe analyse'}
            </button>
          </div>
        </div>

        <div className="space-y-4 text-sm text-gray-600 dark:text-gray-400 mb-6">
          <p>Selecteer het type analyse:</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {['zaaksamenvatting', 'risicobeoordeling', 'processtrategie', 'full'].map(
              (type) => (
                <button
                  key={type}
                  onClick={() => handleStartAnalysis(type)}
                  disabled={isLoading || isPolling}
                  className="sophia-button-secondary text-sm py-2 disabled:opacity-50 capitalize"
                >
                  {type.replace('zaaksamenvatting', 'Samenvatting').replace('risicobeoordeling', 'Risico').replace('processtrategie', 'Strategie').replace('full', 'Volledig')}
                </button>
              )
            )}
          </div>
        </div>
      </div>

      {isEditing && analysisContent ? (
        <AiAnalyseEditor
          content={analysisContent}
          onSave={handleSaveAnalysis}
          isLoading={isLoading}
        />
      ) : (
        <AiAnalyseViewer content={analysisContent} isLoading={isPolling} />
      )}
    </div>
  )
}
