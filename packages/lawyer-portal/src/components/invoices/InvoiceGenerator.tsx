'use client'

import React, { useState, useMemo } from 'react'
import { formatCurrency } from '@/lib/utils'

interface InvoiceLineItem {
  description: string
  quantity: number
  unitPrice: number
  taxRate: number
}

interface InvoiceGeneratorProps {
  dossierId: string
  clientName: string
  caseRef: string
  onGenerate?: (invoice: {
    dossierId: string
    items: InvoiceLineItem[]
    vatRate: number
    notes: string
  }) => void
  isLoading?: boolean
}

export function InvoiceGenerator({
  dossierId,
  clientName,
  caseRef,
  onGenerate,
  isLoading = false,
}: InvoiceGeneratorProps) {
  const [items, setItems] = useState<InvoiceLineItem[]>([
    {
      description: 'Advies juridisch',
      quantity: 1,
      unitPrice: 250,
      taxRate: 0.21,
    },
  ])
  const [vatRate, _setVatRate] = useState(0.21)
  const [notes, setNotes] = useState('')

  const totals = useMemo(() => {
    let subtotal = 0
    let taxAmount = 0

    items.forEach((item) => {
      const lineTotal = item.quantity * item.unitPrice
      const lineTax = lineTotal * item.taxRate
      subtotal += lineTotal
      taxAmount += lineTax
    })

    return {
      subtotal,
      taxAmount,
      total: subtotal + taxAmount,
    }
  }, [items])

  const handleAddItem = () => {
    setItems([
      ...items,
      {
        description: '',
        quantity: 1,
        unitPrice: 0,
        taxRate: vatRate,
      },
    ])
  }

  const handleRemoveItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index))
  }

  const handleItemChange = (
    index: number,
    field: keyof InvoiceLineItem,
    value: string | number
  ) => {
    const newItems = [...items]
    newItems[index] = {
      ...newItems[index],
      [field]: typeof value === 'string' ? value : value,
    }
    setItems(newItems)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onGenerate?.({
      dossierId,
      items,
      vatRate,
      notes,
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="sophia-card">
        <h3 className="font-semibold text-gray-900 dark:text-white mb-4">
          Factuurgegevens
        </h3>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <div className="text-gray-600 dark:text-gray-400">Cliënt</div>
            <div className="font-semibold text-gray-900 dark:text-white">
              {clientName}
            </div>
          </div>
          <div>
            <div className="text-gray-600 dark:text-gray-400">Zaakreferentie</div>
            <div className="font-semibold text-gray-900 dark:text-white">
              {caseRef}
            </div>
          </div>
        </div>
      </div>

      <div className="sophia-card space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-gray-900 dark:text-white">
            Posten
          </h3>
          <button
            type="button"
            onClick={handleAddItem}
            className="sophia-button-secondary text-sm"
          >
            Post toevoegen
          </button>
        </div>

        <div className="space-y-3">
          {items.map((item, index) => (
            <div
              key={index}
              className="border border-gray-200 dark:border-gray-800 rounded-lg p-3 space-y-2"
            >
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="text"
                  value={item.description}
                  onChange={(e) =>
                    handleItemChange(index, 'description', e.target.value)
                  }
                  placeholder="Omschrijving"
                  className="sophia-input text-sm col-span-2"
                  required
                />
                <input
                  type="number"
                  value={item.quantity}
                  onChange={(e) =>
                    handleItemChange(index, 'quantity', parseFloat(e.target.value) || 0)
                  }
                  placeholder="Aantal"
                  className="sophia-input text-sm"
                  min="0.1"
                  step="0.1"
                  required
                />
                <input
                  type="number"
                  value={item.unitPrice}
                  onChange={(e) =>
                    handleItemChange(index, 'unitPrice', parseFloat(e.target.value) || 0)
                  }
                  placeholder="Prijs per eenheid"
                  className="sophia-input text-sm"
                  min="0"
                  step="0.01"
                  required
                />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {formatCurrency(item.quantity * item.unitPrice)} (incl.
                  {(item.taxRate * 100).toFixed(0)}% btw)
                </span>
                <button
                  type="button"
                  onClick={() => handleRemoveItem(index)}
                  className="text-red-600 hover:text-red-700 text-sm"
                >
                  Verwijder
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="sophia-card space-y-3">
        <div className="flex justify-between text-sm">
          <span>Subtotaal:</span>
          <span className="font-semibold">
            {formatCurrency(totals.subtotal)}
          </span>
        </div>
        <div className="flex justify-between text-sm">
          <span>Btw ({(vatRate * 100).toFixed(0)}%):</span>
          <span className="font-semibold">
            {formatCurrency(totals.taxAmount)}
          </span>
        </div>
        <div className="border-t border-gray-200 dark:border-gray-800 pt-3 flex justify-between font-bold text-lg">
          <span>Totaal:</span>
          <span className="text-[#16a085]">{formatCurrency(totals.total)}</span>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Opmerkingen
        </label>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          className="sophia-input min-h-24"
          placeholder="Additionele opmerkingen voor de factuur..."
        />
      </div>

      <button
        type="submit"
        disabled={isLoading || items.length === 0}
        className="sophia-button-primary w-full disabled:opacity-50"
      >
        {isLoading ? 'Genereren...' : 'Factuur genereren'}
      </button>
    </form>
  )
}
