'use client'

import React, { useEffect, useState } from 'react'
import { TopBar } from '@/components/layout/TopBar'
import { DossierTabs } from '@/components/dossier/DossierTabs'
import { InvoiceGenerator } from '@/components/invoices/InvoiceGenerator'
import { InvoicePreview, InvoiceData } from '@/components/invoices/InvoicePreview'
import { useDossiers, DossierDetail } from '@/hooks/useDossiers'

interface FactuurPageProps {
  params: { id: string }
}

export default function FactuurPage({ params }: FactuurPageProps) {
  const { getDossier } = useDossiers()
  const [dossier, setDossier] = useState<DossierDetail | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [invoice, setInvoice] = useState<InvoiceData | null>(null)

  useEffect(() => {
    const loadDossier = async () => {
      setIsLoading(true)
      const data = await getDossier(params.id)
      setDossier(data)
      setIsLoading(false)
    }

    loadDossier()
  }, [params.id, getDossier])

  const handleGenerateInvoice = async (data: any) => {
    const invoiceData: InvoiceData = {
      invoiceNumber: `INV-${Date.now()}`,
      date: new Date().toISOString(),
      dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
      client: {
        name: dossier?.clientNaam || '',
        address: 'Adres',
        city: 'Amsterdam',
      },
      items: data.items.map((item: any) => ({
        description: item.description,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        total: item.quantity * item.unitPrice,
      })),
      subtotal: data.items.reduce(
        (sum: number, item: any) => sum + item.quantity * item.unitPrice,
        0
      ),
      tax: data.items.reduce(
        (sum: number, item: any) =>
          sum + item.quantity * item.unitPrice * item.taxRate,
        0
      ),
      total:
        data.items.reduce(
          (sum: number, item: any) => sum + item.quantity * item.unitPrice,
          0
        ) +
        data.items.reduce(
          (sum: number, item: any) =>
            sum + item.quantity * item.unitPrice * item.taxRate,
          0
        ),
      notes: data.notes,
    }
    setInvoice(invoiceData)
  }

  const handleSendInvoice = async () => {
    console.log('Sending invoice:', invoice)
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <TopBar />
        <div className="text-center py-8 text-gray-500">Laden...</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <TopBar
        breadcrumbs={[
          { label: 'Dashboard', href: '/dashboard' },
          { label: 'Dossiers', href: '/dossiers' },
          { label: 'Factuur' },
        ]}
      />

      <DossierTabs dossierId={params.id} currentTab="factuur" />

      {!invoice && dossier ? (
        <InvoiceGenerator
          dossierId={params.id}
          clientName={dossier.clientNaam}
          caseRef={dossier.referentie}
          onGenerate={handleGenerateInvoice}
          isLoading={isLoading}
        />
      ) : invoice ? (
        <InvoicePreview
          invoice={invoice}
          onSend={handleSendInvoice}
          isLoading={isLoading}
        />
      ) : null}
    </div>
  )
}
