'use client'

import React from 'react'
import { PieChart, Pie, Cell, Legend, Tooltip, ResponsiveContainer } from 'recharts'

interface StatusData {
  name: string
  value: number
  color?: string
}

interface DossierStatusChartProps {
  data: StatusData[]
  isLoading?: boolean
}

const defaultColors = {
  open: '#3b82f6',
  inprogress: '#f59e0b',
  pending: '#f59e0b',
  completed: '#10b981',
  closed: '#10b981',
  archived: '#6b7280',
}

export function DossierStatusChart({
  data,
  isLoading = false,
}: DossierStatusChartProps) {
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

  const enrichedData = data.map((item) => ({
    ...item,
    color:
      item.color ||
      defaultColors[item.name.toLowerCase() as keyof typeof defaultColors] ||
      '#9ca3af',
  }))

  return (
    <div className="sophia-card">
      <h3 className="font-semibold text-gray-900 dark:text-white mb-4">
        Dossiers per status
      </h3>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={enrichedData}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ name, value, percent }) =>
              `${name} ${value} (${(percent * 100).toFixed(0)}%)`
            }
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
          >
            {enrichedData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip formatter={(value) => `${value} dossiers`} />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}
