'use client'

import React, { useState, useRef } from 'react'
import { Document } from '@/hooks/useDossiers'
import { formatDate } from '@/lib/utils'

interface DocumentManagerProps {
  documents: Document[]
  onUpload?: (file: File, category: string) => void
  onToggleVisibility?: (docId: string, visible: boolean) => void
  isLoading?: boolean
}

export function DocumentManager({
  documents,
  onUpload,
  onToggleVisibility,
  isLoading = false,
}: DocumentManagerProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [selectedCategory, setSelectedCategory] = useState('overig')

  const categories = [
    'contract',
    'correspondentie',
    'jurisprudentie',
    'wet',
    'overig',
  ]

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      onUpload?.(file, selectedCategory)
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }

  return (
    <div className="space-y-4">
      <div className="sophia-card space-y-4">
        <h3 className="font-semibold text-gray-900 dark:text-white">
          Document uploaden
        </h3>
        <div className="flex gap-4 items-end">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Categorie
            </label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="sophia-input"
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat.charAt(0).toUpperCase() + cat.slice(1)}
                </option>
              ))}
            </select>
          </div>
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={isLoading}
            className="sophia-button-secondary disabled:opacity-50"
          >
            Bestand kiezen
          </button>
          <input
            ref={fileInputRef}
            type="file"
            onChange={handleFileSelect}
            className="hidden"
          />
        </div>
      </div>

      {documents.length === 0 ? (
        <div className="sophia-card text-center py-8 text-gray-500 dark:text-gray-400">
          Geen documenten
        </div>
      ) : (
        <div className="sophia-card overflow-x-auto">
          <table className="sophia-table">
            <thead>
              <tr>
                <th>Naam</th>
                <th>Categorie</th>
                <th>Datum</th>
                <th>Zichtbaar cliënt</th>
                <th>Acties</th>
              </tr>
            </thead>
            <tbody>
              {documents.map((doc) => (
                <tr key={doc.id}>
                  <td className="font-medium text-gray-900 dark:text-white">
                    {doc.name}
                  </td>
                  <td className="text-sm text-gray-600 dark:text-gray-400">
                    {doc.category}
                  </td>
                  <td className="text-sm text-gray-600 dark:text-gray-400">
                    {formatDate(doc.uploadDate)}
                  </td>
                  <td>
                    <button
                      onClick={() =>
                        onToggleVisibility?.(doc.id, !doc.visibleToClient)
                      }
                      className={`sophia-badge ${
                        doc.visibleToClient
                          ? 'sophia-badge-success'
                          : 'sophia-badge-info'
                      }`}
                    >
                      {doc.visibleToClient ? 'Ja' : 'Nee'}
                    </button>
                  </td>
                  <td>
                    <a
                      href={doc.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#16a085] hover:underline text-sm"
                    >
                      Download
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
