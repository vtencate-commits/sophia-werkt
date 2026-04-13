'use client'

import React from 'react'

interface DocumentPreviewProps {
  url: string
  filename: string
  contentType?: string
}

export function DocumentPreview({
  url,
  filename,
  contentType,
}: DocumentPreviewProps) {
  const isPDF = contentType?.includes('pdf') || filename.endsWith('.pdf')

  if (isPDF) {
    return (
      <div className="w-full h-96">
        <embed
          src={url}
          type="application/pdf"
          width="100%"
          height="100%"
        />
      </div>
    )
  }

  if (contentType?.startsWith('image/')) {
    return (
      <div className="w-full max-h-96 overflow-auto">
        <img src={url} alt={filename} className="max-w-full" />
      </div>
    )
  }

  return (
    <div className="sophia-card text-center py-8">
      <div className="text-gray-500 dark:text-gray-400">
        <div className="text-4xl mb-2">📄</div>
        <p className="font-medium">{filename}</p>
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-[#16a085] hover:underline text-sm mt-2 inline-block"
        >
          Openen in nieuw tabblad
        </a>
      </div>
    </div>
  )
}
