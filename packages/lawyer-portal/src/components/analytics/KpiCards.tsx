'use client'

import React from 'react'

interface KPI {
  label: string
  value: number | string
  change?: number
  icon: string
  color: string
}

interface KpiCardsProps {
  kpis: KPI[]
  isLoading?: boolean
}

export function KpiCards({ kpis, isLoading = false }: KpiCardsProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="sophia-card">
            <div className="sophia-skeleton h-20 rounded"></div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {kpis.map((kpi, index) => (
        <div key={index} className="sophia-card">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">
                {kpi.label}
              </p>
              <p className={`text-3xl font-bold mt-1 ${kpi.color}`}>
                {kpi.value}
              </p>
              {kpi.change !== undefined && (
                <p
                  className={`text-xs font-semibold mt-2 ${
                    kpi.change >= 0
                      ? 'text-green-600 dark:text-green-400'
                      : 'text-red-600 dark:text-red-400'
                  }`}
                >
                  {kpi.change >= 0 ? '↑' : '↓'} {Math.abs(kpi.change)}% deze maand
                </p>
              )}
            </div>
            <div className="text-4xl">{kpi.icon}</div>
          </div>
        </div>
      ))}
    </div>
  )
}
