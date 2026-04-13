'use client'

import React, { useState, useEffect } from 'react'
import { TopBar } from '@/components/layout/TopBar'
import { KpiCards } from '@/components/analytics/KpiCards'
import { RevenueChart } from '@/components/analytics/RevenueChart'
import { DossierStatusChart } from '@/components/analytics/DossierStatusChart'
import { useDossiers } from '@/hooks/useDossiers'

export default function DashboardPage() {
  const { dossiers, isLoading } = useDossiers()
  const [kpis, setKpis] = useState([
    { label: 'Nieuwe zaken', value: 0, change: 12, icon: '📋', color: 'text-blue-600 dark:text-blue-400' },
    { label: 'Actieve zaken', value: 0, change: 5, icon: '📁', color: 'text-green-600 dark:text-green-400' },
    { label: 'Nog af te ronden', value: 0, change: -8, icon: '⏳', color: 'text-yellow-600 dark:text-yellow-400' },
    { label: 'Gesloten zaken', value: 0, change: 15, icon: '✓', color: 'text-purple-600 dark:text-purple-400' },
  ])

  const [revenueData, _setRevenueData] = useState([
    { month: 'Jan', revenue: 4500, forecast: 4800 },
    { month: 'Feb', revenue: 5200, forecast: 5400 },
    { month: 'Mar', revenue: 4800, forecast: 5000 },
    { month: 'Apr', revenue: 6200, forecast: 6000 },
    { month: 'Mei', revenue: 5800, forecast: 6200 },
    { month: 'Jun', revenue: 6500, forecast: 6800 },
  ])

  const [statusData, setStatusData] = useState([
    { name: 'Open', value: 0 },
    { name: 'In behandeling', value: 0 },
    { name: 'In afwachting', value: 0 },
    { name: 'Afgerond', value: 0 },
  ])

  useEffect(() => {
    if (dossiers && dossiers.length > 0) {
      const newCases = dossiers.filter((d) => {
        const createdDate = new Date(d.datumCreated)
        const thirtyDaysAgo = new Date()
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
        return createdDate > thirtyDaysAgo
      }).length

      const activeCases = dossiers.filter((d) =>
        ['open', 'inprogress', 'pending'].includes(d.status)
      ).length

      const pendingAdvice = dossiers.filter(
        (d) => d.status === 'pending'
      ).length

      const closedCases = dossiers.filter((d) =>
        ['completed', 'closed', 'archived'].includes(d.status)
      ).length

      setKpis((prev) => [
        { ...prev[0], value: newCases },
        { ...prev[1], value: activeCases },
        { ...prev[2], value: pendingAdvice },
        { ...prev[3], value: closedCases },
      ])

      const statusCounts = {
        'Open': dossiers.filter((d) => d.status === 'open').length,
        'In behandeling': dossiers.filter((d) => d.status === 'inprogress').length,
        'In afwachting': dossiers.filter((d) => d.status === 'pending').length,
        'Afgerond': dossiers.filter((d) =>
          ['completed', 'closed', 'archived'].includes(d.status)
        ).length,
      }

      setStatusData((prev) =>
        prev.map((item) => ({
          ...item,
          value: statusCounts[item.name as keyof typeof statusCounts],
        }))
      )
    }
  }, [dossiers])

  const urgentCases = dossiers
    .filter((d) => d.datumDeadline && new Date(d.datumDeadline) <= new Date(Date.now() + 7 * 24 * 60 * 60 * 1000))
    .slice(0, 5)

  return (
    <div className="space-y-8">
      <TopBar title="Dashboard" />

      <KpiCards kpis={kpis} isLoading={isLoading} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RevenueChart data={revenueData} isLoading={isLoading} />
        <DossierStatusChart data={statusData} isLoading={isLoading} />
      </div>

      <div className="sophia-card">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
          Bedenktermijn waarschuwingen
        </h2>
        {urgentCases.length === 0 ? (
          <p className="text-gray-600 dark:text-gray-400">
            Geen zaken met aanstaande bedenktermijn
          </p>
        ) : (
          <div className="space-y-2">
            {urgentCases.map((caseItem) => {
              const daysUntil = Math.ceil(
                (new Date(caseItem.datumDeadline!).getTime() - new Date().getTime()) /
                  (1000 * 60 * 60 * 24)
              )
              return (
                <div
                  key={caseItem.id}
                  className="flex items-center justify-between p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded"
                >
                  <div>
                    <div className="font-semibold text-yellow-900 dark:text-yellow-400">
                      {caseItem.referentie}
                    </div>
                    <div className="text-sm text-yellow-800 dark:text-yellow-300">
                      {caseItem.clientNaam} - {daysUntil} dagen tot deadline
                    </div>
                  </div>
                  <a
                    href={`/dossiers/${caseItem.id}`}
                    className="text-[#16a085] hover:underline text-sm font-medium"
                  >
                    Bekijk
                  </a>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
