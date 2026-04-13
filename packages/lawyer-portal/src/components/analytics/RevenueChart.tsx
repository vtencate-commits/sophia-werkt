'use client'

import React from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

interface RevenueData {
  month: string
  revenue: number
  forecast?: number
}

interface RevenueChartProps {
  data: RevenueData[]
  isLoading?: boolean
}

export function RevenueChart({ data, isLoading = false }: RevenueChartProps) {
  if (isLoading) {
    return (
      <div className="sophia-card h-96 flex items-center justify-center">
        <div className="text-gray-500 dark:text-gray-400">Laden...</div>
      </div>
    )
  }

  if (data.length === 0) {
    return (
      <div className="sophia-card h-96 flex items-center justify-center">
        <div className="text-gray-500 dark:text-gray-400">Geen gegevens</div>
      </div>
    )
  }

  return (
    <div className="sophia-card">
      <h3 className="font-semibold text-gray-900 dark:text-white mb-4">
        Omzet per maand
      </h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="#e5e7eb"
          />
          <XAxis
            dataKey="month"
            tick={{ fill: '#6b7280' }}
          />
          <YAxis
            tick={{ fill: '#6b7280' }}
            tickFormatter={(value: number) => `€${value / 1000}k`}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: '#fff',
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
            }}
            formatter={(value) => `€${value}`}
          />
          <Legend />
          <Bar
            dataKey="revenue"
            fill="#16a085"
            name="Werkelijke omzet"
            radius={[8, 8, 0, 0]}
          />
          {data.some((d) => d.forecast) && (
            <Bar
              dataKey="forecast"
              fill="#b8b8b8"
              name="Prognose"
              radius={[8, 8, 0, 0]}
            />
          )}
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
