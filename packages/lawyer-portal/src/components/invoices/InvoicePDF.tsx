'use client'

import React from 'react'
import { formatCurrency, formatDate } from '@/lib/utils'

export interface InvoicePDFProps {
  invoiceNumber: string
  date: string
  dueDate: string
  clientName: string
  clientAddress: string
  clientCity: string
  items: Array<{
    description: string
    quantity: number
    unitPrice: number
    total: number
  }>
  subtotal: number
  tax: number
  total: number
  notes?: string
}

export function InvoicePDF({
  invoiceNumber,
  date,
  dueDate,
  clientName,
  clientAddress,
  clientCity,
  items,
  subtotal,
  tax,
  total,
  notes,
}: InvoicePDFProps) {
  return (
    <div className="w-full max-w-4xl mx-auto p-8 bg-white text-black" style={{ fontFamily: 'Arial, sans-serif' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '40px' }}>
        <div>
          <h1 style={{ fontSize: '28px', fontWeight: 'bold', margin: '0 0 10px 0' }}>
            FACTUUR
          </h1>
          <div style={{ fontSize: '12px', lineHeight: '1.6' }}>
            <div>Nummer: {invoiceNumber}</div>
            <div>Datum: {formatDate(date)}</div>
            <div>Vervaldatum: {formatDate(dueDate)}</div>
          </div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontWeight: 'bold' }}>Rassers Advocaten</div>
          <div style={{ fontSize: '12px' }}>Amsterdam</div>
        </div>
      </div>

      <div style={{ marginBottom: '30px' }}>
        <h3 style={{ fontWeight: 'bold', marginBottom: '10px' }}>Gefactureerd aan:</h3>
        <div>
          <div style={{ fontWeight: 'bold' }}>{clientName}</div>
          <div>{clientAddress}</div>
          <div>{clientCity}</div>
        </div>
      </div>

      <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '30px' }}>
        <thead>
          <tr style={{ borderBottom: '2px solid #333' }}>
            <th style={{ textAlign: 'left', padding: '10px 0', fontWeight: 'bold' }}>
              Omschrijving
            </th>
            <th style={{ textAlign: 'right', padding: '10px 0', fontWeight: 'bold' }}>
              Hoeveelheid
            </th>
            <th style={{ textAlign: 'right', padding: '10px 0', fontWeight: 'bold' }}>
              Prijs/eenheid
            </th>
            <th style={{ textAlign: 'right', padding: '10px 0', fontWeight: 'bold' }}>
              Totaal
            </th>
          </tr>
        </thead>
        <tbody>
          {items.map((item, index) => (
            <tr key={index} style={{ borderBottom: '1px solid #ddd' }}>
              <td style={{ padding: '10px 0' }}>{item.description}</td>
              <td style={{ textAlign: 'right', padding: '10px 0' }}>{item.quantity}</td>
              <td style={{ textAlign: 'right', padding: '10px 0' }}>
                {formatCurrency(item.unitPrice)}
              </td>
              <td style={{ textAlign: 'right', padding: '10px 0', fontWeight: 'bold' }}>
                {formatCurrency(item.total)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '30px' }}>
        <div style={{ width: '300px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
            <span>Subtotaal:</span>
            <span>{formatCurrency(subtotal)}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
            <span>Btw (21%):</span>
            <span>{formatCurrency(tax)}</span>
          </div>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              fontWeight: 'bold',
              fontSize: '16px',
              borderTop: '2px solid #333',
              paddingTop: '10px',
            }}
          >
            <span>Totaal:</span>
            <span>{formatCurrency(total)}</span>
          </div>
        </div>
      </div>

      {notes && (
        <div>
          <h3 style={{ fontWeight: 'bold', marginBottom: '10px' }}>Opmerkingen:</h3>
          <p style={{ whiteSpace: 'pre-line', fontSize: '12px' }}>{notes}</p>
        </div>
      )}
    </div>
  )
}
