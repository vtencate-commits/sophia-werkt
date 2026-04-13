'use client'

import React from 'react'

interface ConflictCheckBadgeProps {
  status: 'pending' | 'passed' | 'failed'
  onClick?: () => void
}

export function ConflictCheckBadge({
  status,
  onClick,
}: ConflictCheckBadgeProps) {
  const statusConfig = {
    pending: {
      label: 'Conflict check: In behandeling',
      color: 'sophia-badge-warning',
      icon: '⏳',
    },
    passed: {
      label: 'Conflict check: OK',
      color: 'sophia-badge-success',
      icon: '✓',
    },
    failed: {
      label: 'Conflict check: Conflict!',
      color: 'sophia-badge-error',
      icon: '✗',
    },
  }

  const config = statusConfig[status]

  return (
    <button
      onClick={onClick}
      className={`sophia-badge ${config.color} cursor-pointer hover:opacity-80 transition-opacity flex items-center gap-1`}
    >
      <span>{config.icon}</span>
      <span>{config.label}</span>
    </button>
  )
}
