'use client';

import React, { useState, useEffect } from 'react';
import { apiGet } from '@/lib/api';
import { formatCurrency, formatNumber } from '@/lib/utils';

interface Stats {
  totalCases: number;
  activeCases: number;
  totalRevenue: number;
  pendingInvoices: number;
  usersByRole: {
    lawyers: number;
    admins: number;
    clients: number;
  };
}

interface PlatformStatsProps {
  refreshTrigger?: number;
}

export function PlatformStats({ refreshTrigger }: PlatformStatsProps) {
  const [stats, setStats] = useState<Stats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadStats();
  }, [refreshTrigger]);

  const loadStats = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await apiGet<Stats>('/admin/stats');
      setStats(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load stats');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className="sophia-card p-6 animate-pulse"
          >
            <div className="h-6 bg-gray-200 rounded mb-2" />
            <div className="h-8 bg-gray-200 rounded" />
          </div>
        ))}
      </div>
    );
  }

  if (error || !stats) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg">
        {error || 'Failed to load statistics'}
      </div>
    );
  }

  const statCards = [
    {
      label: 'Totale zaken',
      value: formatNumber(stats.totalCases),
      subtext: `${formatNumber(stats.activeCases)} actief`,
      icon: '📋',
      color: 'bg-blue-50 border-blue-200',
    },
    {
      label: 'Totale inkomsten',
      value: formatCurrency(stats.totalRevenue),
      subtext: 'Alle tijd',
      icon: '💰',
      color: 'bg-green-50 border-green-200',
    },
    {
      label: 'Openstaande facturen',
      value: formatNumber(stats.pendingInvoices),
      subtext: 'Te factureren',
      icon: '📄',
      color: 'bg-orange-50 border-orange-200',
    },
    {
      label: 'Advocaten',
      value: formatNumber(stats.usersByRole.lawyers),
      subtext: 'Actieve gebruikers',
      icon: '⚖️',
      color: 'bg-purple-50 border-purple-200',
    },
    {
      label: 'Clients',
      value: formatNumber(stats.usersByRole.clients),
      subtext: 'Platform gebruikers',
      icon: '👥',
      color: 'bg-pink-50 border-pink-200',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
      {statCards.map((card, index) => (
        <div
          key={index}
          className={`sophia-card p-6 border ${card.color}`}
        >
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">{card.label}</p>
              <p className="text-2xl font-bold text-gray-900 mt-2">
                {card.value}
              </p>
              <p className="text-xs text-gray-500 mt-1">{card.subtext}</p>
            </div>
            <div className="text-3xl">{card.icon}</div>
          </div>
        </div>
      ))}
    </div>
  );
}
