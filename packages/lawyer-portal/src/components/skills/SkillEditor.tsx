'use client'

import React, { useState } from 'react'

interface SkillEditorProps {
  skillId: string
  name: string
  systemPrompt: string
  category: string
  onSave?: (systemPrompt: string) => void
  isLoading?: boolean
}

export function SkillEditor({
  skillId: _skillId,
  name,
  systemPrompt,
  category,
  onSave,
  isLoading = false,
}: SkillEditorProps) {
  const [content, setContent] = useState(systemPrompt)
  const [isSaving, setIsSaving] = useState(false)

  const handleSave = async () => {
    setIsSaving(true)
    try {
      await onSave?.(content)
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="space-y-4">
      <div className="sophia-card">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              {name}
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Categorie: {category}
            </p>
          </div>
        </div>
      </div>

      <div className="sophia-card space-y-4">
        <h3 className="font-semibold text-gray-900 dark:text-white">
          System Prompt
        </h3>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="sophia-input min-h-96 font-mono text-sm"
          placeholder="Beschrijf de rol en gedrag van deze AI skill..."
        />

        <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded text-sm text-blue-900 dark:text-blue-300">
          <strong>Tip:</strong> Definieer duidelijk wat deze skill doet, in welk
          domein het werkt, en wat de verwachte output is.
        </div>
      </div>

      {onSave && (
        <div className="flex gap-2">
          <button
            onClick={handleSave}
            disabled={isSaving || isLoading || content === systemPrompt}
            className="sophia-button-primary disabled:opacity-50"
          >
            {isSaving ? 'Opslaan...' : 'Opslaan'}
          </button>
          <button
            onClick={() => setContent(systemPrompt)}
            disabled={content === systemPrompt}
            className="sophia-button-secondary disabled:opacity-50"
          >
            Ongedaan maken
          </button>
        </div>
      )}
    </div>
  )
}
