'use client'

import React from 'react'
import { formatCurrency, formatDate } from '@/lib/utils'

export interface InvoiceData {
  invoiceNumber: string
  date: string
  dueDate: string
  client: {
    name: string
    address: string
    city: string
  }
  items: Array<{
    description: string
    quantity: number
    unitPrice: number
  }>
  subtotal: number
  tax: number
  total: number
  notes?: string
}

interface InvoicePreviewProps {
  invoice: InvoiceData
  onSend?: () => void
  isLoading?: boolean
}

export function InvoicePreview({
  invoice,
  onSend,
  isLoading = false,
}: InvoicePreviewProps) {
  return (
    <div className="space-y-4">
      <div className="sophia-card space-y-8 p-8 bg-white dark:bg-gray-900">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              FACTUUR
            </h1>
            <div className="text-sm text-gray-600 dark:text-gray-400 mt-2">
              <div>Nummer: {invoice.invoiceNumber}</div>
              <div>Datum: {formatDate(invoice.date)}</div>
              <div>Vervaldatum: {formatDate(invoice.dueDate)}</div>
            </div>
          </div>
          <div className="text-right text-gray-700 dark:text-gray-300">
            <div className="font-bold">Rassers Advocaten</div>
            <div className="text-sm">Amsterdam</div>
          </div>
        </div>

        <div>
          <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
            Gefactureerd aan:
          </h3>
          <div className="text-gray-700 dark:text-gray-300">
            <div className="font-semibold">{invoice.client.name}</div>
            <div>{invoice.client.address}</div>
            <div>{invoice.client.city}</div>
          </div>
        </div>

        <table className="w-full">
          <thead>
            <tr className="border-b-2 border-gray-300 dark:border-gray-700">
              <th className="text-left py-2 font-semibold text-gray-900 dark:text-white">
                Omschrijving
              </th>
              <th className="text-right py-2 font-semibold text-gray-900 dark:text-white">
                Hoeveelheid
              </th>
              <th className="text-right py-2 font-semibold text-gray-900 dark:text-white">
                Prijs/eenheid
              </th>
              <th className="text-right py-2 font-semibold text-gray-900 dark:text-white">
                Totaal
              </th>
            </tr>
          </thead>
          <tbody>
            {invoice.items.map((item, index) => (
              <tr
                key={index}
                className="border-b border-gray-200 dark:border-gray-800"
              >
                <td className="py-2 text-gray-700 dark:text-gray-300">
                  {item.description}
                </td>
                <td className="text-right py-2 text-gray-700 dark:text-gray-300">
                  {item.quantity}
                </td>
                <td className="text-right py-2 text-gray-700 dark:text-gray-300">
                  {formatCurrency(item.unitPrice)}
                </td>
                <td className="text-right py-2 text-gray-900 dark:text-white font-semibold">
                  {formatCurrency(item.quantity * item.unitPrice)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="flex justify-end">
          <div className="w-64 space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-700 dark:text-gray-300">Subtotaal:</span>
              <span className="text-gray-700 dark:text-gray-300">
                {formatCurrency(invoice.subtotal)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-700 dark:text-gray-300">Btw (21%):</span>
              <span className="text-gray-700 dark:text-gray-300">
                {formatCurrency(invoice.tax)}
              </span>
            </div>
            <div className="border-t-2 border-gray-300 dark:border-gray-700 pt-2 flex justify-between font-bold text-lg text-gray-900 dark:text-white">
              <span>Totaal:</span>
              <span>{formatCurrency(invoice.total)}</span>
            </div>
          </div>
        </div>

        {invoice.notes && (
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
              Opmerkingen:
            </h3>
            <p className="text-gray-700 dark:text-gray-300 whitespace-pre-line">
              {invoice.notes}
            </p>
          </div>
        )}
      </div>

      {onSend && (
        <div className="flex gap-2">
          <button
            onClick={onSend}
            disabled={isLoading}
            className="sophia-button-primary flex-1 disabled:opacity-50"
          >
            {isLoading ? 'Verzenden...' : 'Factuur verzenden'}
          </button>
        </div>
      )}
    </div>
  )
}
