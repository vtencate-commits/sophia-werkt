'use client';

import React, { useState, useEffect } from 'react';
import { apiGet } from '@/lib/api';
import { formatCurrency, formatNumber } from '@/lib/utils';

interface ReportData {
  period: string;
  casesCount: number;
  revenue: number;
  averageProcessingTime: number;
  aiTokensUsed: number;
}

interface ReportStats {
  casesByPeriod: ReportData[];
  revenueByPeriod: ReportData[];
  overallStats: {
    totalCases: number;
    totalRevenue: number;
    averageProcessingDays: number;
    totalAITokensUsed: number;
  };
}

export default function RapportagesPage() {
  const [reportData, setReportData] = useState<ReportStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [period, setPeriod] = useState<'month' | 'quarter' | 'year'>('month');

  useEffect(() => {
    loadReports();
  }, [period]);

  const loadReports = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await apiGet<ReportStats>(
        `/admin/reports?period=${period}`
      );
      setReportData(data);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Failed to load reports'
      );
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <div className="flex items-center justify-center py-12">Laden...</div>;
  }

  if (error || !reportData) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg">
        {error || 'Failed to load reports'}
      </div>
    );
  }

  const stats = reportData.overallStats;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Rapportages</h1>
          <p className="text-gray-600 mt-1">
            Platform statistieken en analyses
          </p>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={() => setPeriod('month')}
            className={`sophia-btn ${
              period === 'month'
                ? 'sophia-btn-primary'
                : 'sophia-btn-secondary'
            }`}
          >
            Maand
          </button>
          <button
            onClick={() => setPeriod('quarter')}
            className={`sophia-btn ${
              period === 'quarter'
                ? 'sophia-btn-primary'
                : 'sophia-btn-secondary'
            }`}
          >
            Kwartaal
          </button>
          <button
            onClick={() => setPeriod('year')}
            className={`sophia-btn ${
              period === 'year'
                ? 'sophia-btn-primary'
                : 'sophia-btn-secondary'
            }`}
          >
            Jaar
          </button>
        </div>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="sophia-card p-6 bg-blue-50 border-blue-200">
          <p className="text-sm font-medium text-gray-600">Totale zaken</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">
            {formatNumber(stats.totalCases)}
          </p>
        </div>
        <div className="sophia-card p-6 bg-green-50 border-green-200">
          <p className="text-sm font-medium text-gray-600">
            Totale inkomsten
          </p>
          <p className="text-3xl font-bold text-gray-900 mt-2">
            {formatCurrency(stats.totalRevenue)}
          </p>
        </div>
        <div className="sophia-card p-6 bg-purple-50 border-purple-200">
          <p className="text-sm font-medium text-gray-600">
            Gem. verwerkingstijd
          </p>
          <p className="text-3xl font-bold text-gray-900 mt-2">
            {formatNumber(stats.averageProcessingDays)} d.
          </p>
        </div>
        <div className="sophia-card p-6 bg-orange-50 border-orange-200">
          <p className="text-sm font-medium text-gray-600">
            AI tokens gebruikt
          </p>
          <p className="text-3xl font-bold text-gray-900 mt-2">
            {formatNumber(stats.totalAITokensUsed)}
          </p>
        </div>
      </div>

      {/* Cases by Period */}
      <div className="sophia-card p-6">
        <h2 className="text-xl font-semibold mb-4">Zaken per periode</h2>
        <div className="overflow-x-auto">
          <table className="sophia-table">
            <thead>
              <tr>
                <th>Periode</th>
                <th>Aantal zaken</th>
                <th>Gem. verwerkingstijd</th>
              </tr>
            </thead>
            <tbody>
              {reportData.casesByPeriod.map((row, idx) => (
                <tr key={idx}>
                  <td className="font-medium">{row.period}</td>
                  <td>{formatNumber(row.casesCount)}</td>
                  <td>{formatNumber(row.averageProcessingTime)} dagen</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Revenue by Period */}
      <div className="sophia-card p-6">
        <h2 className="text-xl font-semibold mb-4">Inkomsten per periode</h2>
        <div className="overflow-x-auto">
          <table className="sophia-table">
            <thead>
              <tr>
                <th>Periode</th>
                <th>Inkomsten</th>
                <th>AI tokens gebruikt</th>
              </tr>
            </thead>
            <tbody>
              {reportData.revenueByPeriod.map((row, idx) => (
                <tr key={idx}>
                  <td className="font-medium">{row.period}</td>
                  <td className="font-medium">
                    {formatCurrency(row.revenue)}
                  </td>
                  <td>{formatNumber(row.aiTokensUsed)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Export Section */}
      <div className="sophia-card p-6 bg-gray-50">
        <h2 className="text-lg font-semibold mb-4">Rapporten exporteren</h2>
        <div className="flex flex-wrap gap-3">
          <button className="sophia-btn-primary">
            📊 Exporteren als PDF
          </button>
          <button className="sophia-btn-secondary">
            📈 Exporteren als CSV
          </button>
          <button className="sophia-btn-secondary">
            📋 Exporteren als Excel
          </button>
        </div>
      </div>
    </div>
  );
}
