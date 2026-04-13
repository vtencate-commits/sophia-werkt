'use client'

import React from 'react'

interface AiAnalyseViewerProps {
  content: string
  isLoading?: boolean
}

export function AiAnalyseViewer({ content, isLoading = false }: AiAnalyseViewerProps) {
  if (isLoading) {
    return (
      <div className="sophia-card space-y-4">
        <div className="sophia-skeleton h-8 w-1/3 rounded"></div>
        <div className="space-y-2">
          <div className="sophia-skeleton h-4 w-full rounded"></div>
          <div className="sophia-skeleton h-4 w-5/6 rounded"></div>
          <div className="sophia-skeleton h-4 w-4/5 rounded"></div>
        </div>
      </div>
    )
  }

  if (!content) {
    return (
      <div className="sophia-card text-center py-8 text-gray-500 dark:text-gray-400">
        Geen analyse beschikbaar
      </div>
    )
  }

  return (
    <div className="sophia-card prose dark:prose-invert max-w-none">
      <div
        className="space-y-4"
        dangerouslySetInnerHTML={{
          __html: content.replace(/^(#{1,6})\s+/gm, '<h3 class="text-lg font-semibold mt-4 mb-2">'),
        }}
      />
    </div>
  )
}
