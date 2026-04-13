'use client';

import React, { useState, useEffect } from 'react';
import { apiGet } from '@/lib/api';
import { formatDateTime } from '@/lib/utils';

interface AuditLog {
  id: string;
  timestamp: string;
  userId: string;
  userName: string;
  action: string;
  entityType: string;
  entityId: string;
  details: Record<string, any>;
  ipAddress: string;
}

interface AuditLogViewerProps {
  onAuditLoaded?: (count: number) => void;
}

export function AuditLogViewer({ onAuditLoaded }: AuditLogViewerProps) {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState({
    userId: '',
    action: '',
    entityType: '',
    startDate: '',
    endDate: '',
  });

  useEffect(() => {
    loadAuditLogs();
  }, [filters]);

  const loadAuditLogs = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const params = new URLSearchParams();
      if (filters.userId) params.append('userId', filters.userId);
      if (filters.action) params.append('action', filters.action);
      if (filters.entityType) params.append('entityType', filters.entityType);
      if (filters.startDate) params.append('startDate', filters.startDate);
      if (filters.endDate) params.append('endDate', filters.endDate);

      const data = await apiGet<{ logs: AuditLog[] }>(
        `/admin/audit-logs?${params.toString()}`
      );
      setLogs(data.logs);
      onAuditLoaded?.(data.logs.length);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load audit logs');
    } finally {
      setIsLoading(false);
    }
  };

  const handleFilterChange = (field: string, value: string) => {
    setFilters({ ...filters, [field]: value });
  };

  const clearFilters = () => {
    setFilters({
      userId: '',
      action: '',
      entityType: '',
      startDate: '',
      endDate: '',
    });
  };

  const actionColors: Record<string, string> = {
    CREATE: 'bg-green-100 text-green-800',
    UPDATE: 'bg-blue-100 text-blue-800',
    DELETE: 'bg-red-100 text-red-800',
    LOGIN: 'bg-purple-100 text-purple-800',
    EXPORT: 'bg-yellow-100 text-yellow-800',
  };

  if (isLoading && logs.length === 0) {
    return <div className="flex items-center justify-center py-12">Laden...</div>;
  }

  return (
    <div className="space-y-6">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      <div className="sophia-card p-6">
        <h3 className="text-lg font-semibold mb-4">Filters</h3>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <input
            type="text"
            placeholder="Gebruiker ID"
            value={filters.userId}
            onChange={(e) => handleFilterChange('userId', e.target.value)}
            className="sophia-input"
          />
          <input
            type="text"
            placeholder="Actie"
            value={filters.action}
            onChange={(e) => handleFilterChange('action', e.target.value)}
            className="sophia-input"
          />
          <input
            type="text"
            placeholder="Entity type"
            value={filters.entityType}
            onChange={(e) => handleFilterChange('entityType', e.target.value)}
            className="sophia-input"
          />
          <input
            type="date"
            value={filters.startDate}
            onChange={(e) => handleFilterChange('startDate', e.target.value)}
            className="sophia-input"
          />
          <input
            type="date"
            value={filters.endDate}
            onChange={(e) => handleFilterChange('endDate', e.target.value)}
            className="sophia-input"
          />
          <button
            onClick={clearFilters}
            className="sophia-btn sophia-btn-secondary md:col-span-5"
          >
            Filters wissen
          </button>
        </div>
      </div>

      <div className="sophia-card overflow-x-auto">
        <table className="sophia-table">
          <thead>
            <tr>
              <th>Timestamp</th>
              <th>Gebruiker</th>
              <th>Actie</th>
              <th>Entity Type</th>
              <th>Entity ID</th>
              <th>IP-adres</th>
              <th>Details</th>
            </tr>
          </thead>
          <tbody>
            {logs.map((log) => (
              <tr key={log.id}>
                <td className="text-sm font-medium">
                  {formatDateTime(log.timestamp)}
                </td>
                <td className="text-sm">
                  <div className="font-medium">{log.userName}</div>
                  <div className="text-gray-600">{log.userId}</div>
                </td>
                <td>
                  <span
                    className={`sophia-badge ${
                      actionColors[log.action] ||
                      'bg-gray-100 text-gray-800'
                    }`}
                  >
                    {log.action}
                  </span>
                </td>
                <td className="text-sm">{log.entityType}</td>
                <td className="text-sm font-mono text-gray-600">
                  {log.entityId}
                </td>
                <td className="text-sm font-mono text-gray-600">
                  {log.ipAddress}
                </td>
                <td className="text-sm">
                  <details className="cursor-pointer">
                    <summary className="text-blue-600 hover:text-blue-800">
                      Tonen
                    </summary>
                    <div className="mt-2 bg-gray-50 p-2 rounded text-xs font-mono whitespace-pre-wrap break-words">
                      {JSON.stringify(log.details, null, 2)}
                    </div>
                  </details>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {logs.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            Geen audit logs gevonden
          </div>
        )}
      </div>
    </div>
  );
}
