'use client'

import React from 'react'
import Link from 'next/link'

export interface Skill {
  id: string
  name: string
  description: string
  enabled: boolean
  category: string
}

interface SkillListProps {
  skills: Skill[]
  onToggle?: (id: string, enabled: boolean) => void
  isLoading?: boolean
}

export function SkillList({ skills, onToggle, isLoading = false }: SkillListProps) {
  if (isLoading) {
    return <div className="text-center py-8">Laden...</div>
  }

  if (skills.length === 0) {
    return (
      <div className="sophia-card text-center py-8 text-gray-500 dark:text-gray-400">
        Geen skills beschikbaar
      </div>
    )
  }

  return (
    <div className="grid gap-4">
      {skills.map((skill) => (
        <div
          key={skill.id}
          className="sophia-card flex items-center justify-between p-6"
        >
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-semibold text-gray-900 dark:text-white">
                {skill.name}
              </h3>
              <span className="text-xs sophia-badge sophia-badge-info">
                {skill.category}
              </span>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {skill.description}
            </p>
          </div>

          <div className="flex items-center gap-3 ml-6">
            <label className="flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={skill.enabled}
                onChange={(e) => onToggle?.(skill.id, e.target.checked)}
                className="rounded border-gray-300 dark:border-gray-700"
              />
              <span className="ml-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                {skill.enabled ? 'Actief' : 'Inactief'}
              </span>
            </label>

            <Link
              href={`/skills/${skill.id}`}
              className="sophia-button-secondary text-sm"
            >
              Bewerk
            </Link>
          </div>
        </div>
      ))}
    </div>
  )
}
