'use client'

import React, { useState } from 'react'

interface AdviesEditorProps {
  content?: string
  onSave?: (content: string) => void
  isLoading?: boolean
  onSubmitToClient?: () => void
}

export function AdviesEditor({
  content = '',
  onSave,
  isLoading = false,
  onSubmitToClient,
}: AdviesEditorProps) {
  const [adviesContent, setAdviesContent] = useState(content)
  const [isPreview, setIsPreview] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  const handleSave = async () => {
    setIsSaving(true)
    try {
      await onSave?.(adviesContent)
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
          Juridisch Advies
        </h2>
        <button
          onClick={() => setIsPreview(!isPreview)}
          className="text-sm sophia-button-secondary"
        >
          {isPreview ? 'Bewerk' : 'Voorbeeld'}
        </button>
      </div>

      {isPreview ? (
        <div className="sophia-card prose dark:prose-invert max-w-none min-h-96">
          {adviesContent || (
            <p className="text-gray-500 dark:text-gray-400">
              Geen advies geschreven
            </p>
          )}
        </div>
      ) : (
        <textarea
          value={adviesContent}
          onChange={(e) => setAdviesContent(e.target.value)}
          className="sophia-input min-h-96 font-serif text-base"
          placeholder="Schrijf hier het juridische advies voor de client..."
        />
      )}

      <div className="flex gap-2">
        {onSave && (
          <button
            onClick={handleSave}
            disabled={isSaving || isLoading}
            className="sophia-button-secondary disabled:opacity-50"
          >
            {isSaving ? 'Opslaan...' : 'Opslaan'}
          </button>
        )}
        {onSubmitToClient && (
          <button
            onClick={onSubmitToClient}
            disabled={!adviesContent || isLoading}
            className="sophia-button-primary disabled:opacity-50"
          >
            Vrijgeven aan cliënt
          </button>
        )}
      </div>
    </div>
  )
}
