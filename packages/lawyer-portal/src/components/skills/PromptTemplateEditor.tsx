'use client'

import React, { useState } from 'react'

interface TemplateVariable {
  name: string
  placeholder: string
}

interface PromptTemplateEditorProps {
  template: string
  variables: TemplateVariable[]
  onSave?: (template: string) => void
  isLoading?: boolean
}

export function PromptTemplateEditor({
  template,
  variables,
  onSave,
  isLoading = false,
}: PromptTemplateEditorProps) {
  const [content, setContent] = useState(template)

  const insertVariable = (varName: string) => {
    const textarea = document.querySelector(
      'textarea[data-template="true"]'
    ) as HTMLTextAreaElement
    if (textarea) {
      const start = textarea.selectionStart
      const end = textarea.selectionEnd
      const before = content.substring(0, start)
      const after = content.substring(end)
      setContent(`${before}{{${varName}}}${after}`)

      setTimeout(() => {
        textarea.focus()
        textarea.setSelectionRange(
          start + varName.length + 4,
          start + varName.length + 4
        )
      }, 0)
    }
  }

  return (
    <div className="space-y-4">
      <div className="sophia-card">
        <h3 className="font-semibold text-gray-900 dark:text-white mb-4">
          Template variabelen
        </h3>
        <div className="flex flex-wrap gap-2">
          {variables.map((variable) => (
            <button
              key={variable.name}
              onClick={() => insertVariable(variable.name)}
              className="sophia-button-secondary text-sm"
              type="button"
            >
              + {variable.name}
            </button>
          ))}
        </div>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-3">
          Klik op een variabele om deze in te voegen
        </p>
      </div>

      <div className="sophia-card">
        <h3 className="font-semibold text-gray-900 dark:text-white mb-4">
          Template
        </h3>
        <textarea
          data-template="true"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="sophia-input min-h-96 font-mono text-sm"
          placeholder="Schrijf hier de prompt template. Gebruik {{variabelenaam}} voor variabelen..."
        />
      </div>

      {onSave && (
        <button
          onClick={() => onSave(content)}
          disabled={isLoading || content === template}
          className="sophia-button-primary w-full disabled:opacity-50"
        >
          {isLoading ? 'Opslaan...' : 'Template opslaan'}
        </button>
      )}
    </div>
  )
}
