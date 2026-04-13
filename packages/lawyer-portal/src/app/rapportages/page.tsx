'use client'

import React, { useState } from 'react'
import { TopBar } from '@/components/layout/TopBar'
import { RevenueChart } from '@/components/analytics/RevenueChart'
import { DossierStatusChart } from '@/components/analytics/DossierStatusChart'

export default function RapportagesPage() {
  const [timeRange, setTimeRange] = useState('6months')

  const revenueData = [
    { month: 'Jan', revenue: 4500, forecast: 4800 },
    { month: 'Feb', revenue: 5200, forecast: 5400 },
    { month: 'Mar', revenue: 4800, forecast: 5000 },
    { month: 'Apr', revenue: 6200, forecast: 6000 },
    { month: 'Mei', revenue: 5800, forecast: 6200 },
    { month: 'Jun', revenue: 6500, forecast: 6800 },
  ]

  const statusData = [
    { name: 'Open', value: 12 },
    { name: 'In behandeling', value: 28 },
    { name: 'In afwachting', value: 8 },
    { name: 'Afgerond', value: 45 },
  ]

  const metrics = [
    { label: 'Totale omzet', value: '€32.500', icon: '💰' },
    { label: 'Gem. omzet per zaak', value: '€2.150', icon: '📊' },
    { label: 'Gemiddelde tijd per zaak', value: '18,5u', icon: '⏱️' },
    { label: 'Client satisfactie', value: '4,8/5', icon: '⭐' },
  ]

  return (
    <div className="space-y-6">
      <TopBar title="Rapportages" />

      <div className="flex gap-4">
        <select
          value={timeRange}
          onChange={(e) => setTimeRange(e.target.value)}
          className="sophia-input max-w-xs"
        >
          <option value="1month">Afgelopen maand</option>
          <option value="3months">Afgelopen 3 maanden</option>
          <option value="6months">Afgelopen 6 maanden</option>
          <option value="1year">Afgelopen jaar</option>
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((metric, index) => (
          <div key={index} className="sophia-card text-center">
            <div className="text-3xl mb-2">{metric.icon}</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              {metric.label}
            </div>
            <div className="text-2xl font-bold text-gray-900 dark:text-white mt-2">
              {metric.value}
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RevenueChart data={revenueData} />
        <DossierStatusChart data={statusData} />
      </div>

      <div className="sophia-card">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Meest actieve zaken
        </h2>
        <div className="overflow-x-auto">
          <table className="sophia-table">
            <thead>
              <tr>
                <th>Referentie</th>
                <th>Cliënt</th>
                <th>Uren</th>
                <th>Omzet</th>
              </tr>
            </thead>
            <tbody>
              {[
                { ref: 'REF-2024-001', client: 'Bedrijf A', hours: 45, revenue: 3500 },
                { ref: 'REF-2024-002', client: 'Bedrijf B', hours: 38, revenue: 2950 },
                { ref: 'REF-2024-003', client: 'Bedrijf C', hours: 32, revenue: 2480 },
                { ref: 'REF-2024-004', client: 'Bedrijf D', hours: 28, revenue: 2170 },
              ].map((item) => (
                <tr key={item.ref}>
                  <td className="font-medium text-[#16a085]">{item.ref}</td>
                  <td>{item.client}</td>
                  <td>{item.hours}u</td>
                  <td className="font-semibold">€{item.revenue}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
