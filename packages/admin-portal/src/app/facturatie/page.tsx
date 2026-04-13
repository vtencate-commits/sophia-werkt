'use client';

import React, { useState, useEffect } from 'react';
import { apiGet } from '@/lib/api';
import { formatDateTime, formatCurrency, formatNumber } from '@/lib/utils';

interface Invoice {
  id: string;
  invoiceNumber: string;
  clientName: string;
  amount: number;
  status: 'DRAFT' | 'SENT' | 'PAID' | 'OVERDUE';
  createdAt: string;
  dueDate: string;
  description: string;
}

interface InvoiceStats {
  totalInvoices: number;
  totalAmount: number;
  paidAmount: number;
  pendingAmount: number;
  overdueAmount: number;
}

export default function FacturatiePage() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [stats, setStats] = useState<InvoiceStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState({
    status: '',
    startDate: '',
    endDate: '',
    clientName: '',
  });

  useEffect(() => {
    loadInvoices();
  }, [filters]);

  const loadInvoices = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const params = new URLSearchParams();
      if (filters.status) params.append('status', filters.status);
      if (filters.startDate) params.append('startDate', filters.startDate);
      if (filters.endDate) params.append('endDate', filters.endDate);
      if (filters.clientName)
        params.append('clientName', filters.clientName);

      const data = await apiGet<{
        invoices: Invoice[];
        stats: InvoiceStats;
      }>(`/admin/invoices?${params.toString()}`);

      setInvoices(data.invoices);
      setStats(data.stats);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load invoices');
    } finally {
      setIsLoading(false);
    }
  };

  const statusBadgeColor = (status: string) => {
    switch (status) {
      case 'PAID':
        return 'sophia-badge-success';
      case 'OVERDUE':
        return 'sophia-badge-danger';
      case 'SENT':
        return 'sophia-badge-info';
      case 'DRAFT':
        return 'sophia-badge-warning';
      default:
        return 'sophia-badge-info';
    }
  };

  const statusLabel = (status: string) => {
    switch (status) {
      case 'PAID':
        return 'Betaald';
      case 'OVERDUE':
        return 'Achterstallig';
      case 'SENT':
        return 'Verzonden';
      case 'DRAFT':
        return 'Concept';
      default:
        return status;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Facturatie</h1>
        <p className="text-gray-600 mt-1">Beheer platform facturen</p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {/* Stats */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div className="sophia-card p-6 bg-blue-50 border-blue-200">
            <p className="text-sm font-medium text-gray-600">
              Totale facturen
            </p>
            <p className="text-2xl font-bold text-gray-900 mt-2">
              {formatNumber(stats.totalInvoices)}
            </p>
          </div>
          <div className="sophia-card p-6 bg-green-50 border-green-200">
            <p className="text-sm font-medium text-gray-600">
              Totaalbedrag
            </p>
            <p className="text-2xl font-bold text-gray-900 mt-2">
              {formatCurrency(stats.totalAmount)}
            </p>
          </div>
          <div className="sophia-card p-6 bg-emerald-50 border-emerald-200">
            <p className="text-sm font-medium text-gray-600">
              Betaald
            </p>
            <p className="text-2xl font-bold text-gray-900 mt-2">
              {formatCurrency(stats.paidAmount)}
            </p>
          </div>
          <div className="sophia-card p-6 bg-orange-50 border-orange-200">
            <p className="text-sm font-medium text-gray-600">
              In afwachting
            </p>
            <p className="text-2xl font-bold text-gray-900 mt-2">
              {formatCurrency(stats.pendingAmount)}
            </p>
          </div>
          <div className="sophia-card p-6 bg-red-50 border-red-200">
            <p className="text-sm font-medium text-gray-600">
              Achterstallig
            </p>
            <p className="text-2xl font-bold text-gray-900 mt-2">
              {formatCurrency(stats.overdueAmount)}
            </p>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="sophia-card p-6">
        <h3 className="text-lg font-semibold mb-4">Filters</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <input
            type="text"
            placeholder="Client naam"
            value={filters.clientName}
            onChange={(e) =>
              setFilters({ ...filters, clientName: e.target.value })
            }
            className="sophia-input"
          />
          <select
            value={filters.status}
            onChange={(e) =>
              setFilters({ ...filters, status: e.target.value })
            }
            className="sophia-input"
          >
            <option value="">Alle statussen</option>
            <option value="DRAFT">Concept</option>
            <option value="SENT">Verzonden</option>
            <option value="PAID">Betaald</option>
            <option value="OVERDUE">Achterstallig</option>
          </select>
          <input
            type="date"
            value={filters.startDate}
            onChange={(e) =>
              setFilters({ ...filters, startDate: e.target.value })
            }
            className="sophia-input"
          />
          <input
            type="date"
            value={filters.endDate}
            onChange={(e) =>
              setFilters({ ...filters, endDate: e.target.value })
            }
            className="sophia-input"
          />
        </div>
      </div>

      {/* Invoices Table */}
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          Laden...
        </div>
      ) : (
        <div className="sophia-card overflow-x-auto">
          <table className="sophia-table">
            <thead>
              <tr>
                <th>Factuurnummer</th>
                <th>Client</th>
                <th>Bedrag</th>
                <th>Status</th>
                <th>Gemaakt</th>
                <th>Vervaldatum</th>
                <th>Beschrijving</th>
              </tr>
            </thead>
            <tbody>
              {invoices.map((invoice) => (
                <tr key={invoice.id}>
                  <td className="font-mono font-semibold">
                    {invoice.invoiceNumber}
                  </td>
                  <td className="font-medium">{invoice.clientName}</td>
                  <td className="font-medium">
                    {formatCurrency(invoice.amount)}
                  </td>
                  <td>
                    <span
                      className={`sophia-badge ${statusBadgeColor(
                        invoice.status
                      )}`}
                    >
                      {statusLabel(invoice.status)}
                    </span>
                  </td>
                  <td className="text-sm">
                    {formatDateTime(invoice.createdAt)}
                  </td>
                  <td className="text-sm">
                    {formatDateTime(invoice.dueDate)}
                  </td>
                  <td className="text-sm text-gray-600 max-w-xs truncate">
                    {invoice.description}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {invoices.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              Geen facturen gevonden
            </div>
          )}
        </div>
      )}
    </div>
  );
}
