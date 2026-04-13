import React from 'react'
import type { Metadata } from 'next'
import { AuthProvider } from '@/lib/auth'
import '@/styles/globals.css'

export const metadata: Metadata = {
  title: 'Sophia Werkt - Advocaten Portal',
  description: 'Beheer je zaakdossiers, AI-analyses en facturen',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="nl">
      <body>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  )
}
