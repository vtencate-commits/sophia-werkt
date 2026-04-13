'use client'

import React, { useState } from 'react'

interface Section {
  id: string
  title: string
  content: string
}

interface AiAnalyseEditorProps {
  content: string
  onSave?: (content: string) => void
  isLoading?: boolean
}

export function AiAnalyseEditor({
  content,
  onSave,
  isLoading = false,
}: AiAnalyseEditorProps) {
  const [sections, setSections] = useState<Section[]>(() => {
    const lines = content.split('\n')
    const parsed: Section[] = []
    let currentSection: Section | null = null

    lines.forEach((line) => {
      if (line.startsWith('##')) {
        if (currentSection) {
          parsed.push(currentSection)
        }
        currentSection = {
          id: Math.random().toString(36).substr(2, 9),
          title: line.replace(/^##\s+/, ''),
          content: '',
        }
      } else if (currentSection) {
        currentSection.content += (currentSection.content ? '\n' : '') + line
      }
    })

    if (currentSection) {
      parsed.push(currentSection)
    }

    return parsed.length > 0
      ? parsed
      : [
        {
          id: '1',
          title: 'Inleiding',
          content: content,
        },
      ]
  })

  const [editingSectionId, setEditingSectionId] = useState<string | null>(null)

  const handleSectionChange = (id: string, content: string) => {
    setSections(
      sections.map((section) =>
        section.id === id ? { ...section, content } : section
      )
    )
  }

  const handleSave = () => {
    const fullContent = sections
      .map((section) => `## ${section.title}\n\n${section.content}`)
      .join('\n\n')
    onSave?.(fullContent)
  }

  return (
    <div className="space-y-4">
      {sections.map((section) => (
        <div key={section.id} className="sophia-card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              {section.title}
            </h3>
            <button
              onClick={() =>
                setEditingSectionId(
                  editingSectionId === section.id ? null : section.id
                )
              }
              className="text-sm sophia-button-secondary"
            >
              {editingSectionId === section.id ? 'Klaar' : 'Bewerk'}
            </button>
          </div>

          {editingSectionId === section.id ? (
            <textarea
              value={section.content}
              onChange={(e) =>
                handleSectionChange(section.id, e.target.value)
              }
              className="sophia-input min-h-64 font-mono text-sm"
              placeholder="Inhoud hier..."
            />
          ) : (
            <div className="prose dark:prose-invert max-w-none text-gray-700 dark:text-gray-300">
              {section.content}
            </div>
          )}
        </div>
      ))}

      {onSave && (
        <div className="flex gap-2">
          <button
            onClick={handleSave}
            disabled={isLoading}
            className="sophia-button-primary disabled:opacity-50"
          >
            {isLoading ? 'Opslaan...' : 'Alles opslaan'}
          </button>
        </div>
      )}
    </div>
  )
}
