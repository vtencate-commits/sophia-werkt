'use client'

import React, { useState } from 'react'
import { TopBar } from '@/components/layout/TopBar'
import { DossierTabs } from '@/components/dossier/DossierTabs'
import { formatDateTime } from '@/lib/utils'

interface Message {
  id: string
  from: string
  to: string
  content: string
  timestamp: string
  isFromClient: boolean
}

interface BerichtenPageProps {
  params: { id: string }
}

export default function BerichtenPage({ params }: BerichtenPageProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      from: 'Client',
      to: 'Jij',
      content: 'Kunt u mij informeren over de status van mijn zaak?',
      timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
      isFromClient: true,
    },
    {
      id: '2',
      from: 'Jij',
      to: 'Client',
      content: 'Ik ben nog bezig met de analyse. Ik zal u volgende week contacteren met een voortgangsrapport.',
      timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
      isFromClient: false,
    },
  ])
  const [replyText, setReplyText] = useState('')

  const handleSendReply = (e: React.FormEvent) => {
    e.preventDefault()
    if (replyText.trim()) {
      const newMessage: Message = {
        id: String(messages.length + 1),
        from: 'Jij',
        to: 'Client',
        content: replyText,
        timestamp: new Date().toISOString(),
        isFromClient: false,
      }
      setMessages([...messages, newMessage])
      setReplyText('')
    }
  }

  return (
    <div className="space-y-6">
      <TopBar
        breadcrumbs={[
          { label: 'Dashboard', href: '/dashboard' },
          { label: 'Dossiers', href: '/dossiers' },
          { label: 'Berichten' },
        ]}
      />

      <DossierTabs dossierId={params.id} currentTab="berichten" />

      <div className="sophia-card space-y-4">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
          Berichten met cliënt
        </h2>

        <div className="space-y-3 max-h-96 overflow-y-auto p-4 bg-gray-50 dark:bg-gray-800 rounded">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.isFromClient ? 'justify-start' : 'justify-end'}`}
            >
              <div
                className={`max-w-xs px-4 py-2 rounded-lg ${
                  message.isFromClient
                    ? 'bg-gray-300 dark:bg-gray-700 text-gray-900 dark:text-white'
                    : 'bg-[#16a085] text-white'
                }`}
              >
                <p className="text-sm">{message.content}</p>
                <p className="text-xs opacity-70 mt-1">
                  {formatDateTime(message.timestamp)}
                </p>
              </div>
            </div>
          ))}
        </div>

        <form onSubmit={handleSendReply} className="flex gap-2">
          <textarea
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
            className="sophia-input flex-1 min-h-20 resize-none"
            placeholder="Typ uw bericht..."
          />
          <button
            type="submit"
            disabled={!replyText.trim()}
            className="sophia-button-primary self-end disabled:opacity-50"
          >
            Verzenden
          </button>
        </form>
      </div>
    </div>
  )
}
