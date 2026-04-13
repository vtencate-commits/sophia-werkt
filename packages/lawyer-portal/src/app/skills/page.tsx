'use client'

import React, { useState } from 'react'
import { TopBar } from '@/components/layout/TopBar'
import { SkillList, Skill } from '@/components/skills/SkillList'

export default function SkillsPage() {
  const [skills, setSkills] = useState<Skill[]>([
    {
      id: '1',
      name: 'Juridische Analyse',
      description: 'Analyseert zaakdossiers en identificeert juridische kwesties',
      enabled: true,
      category: 'Analyse',
    },
    {
      id: '2',
      name: 'Risicobeoordeling',
      description: 'Evalueert juridische risico\'s en mogelijke uitkomsten',
      enabled: true,
      category: 'Risico',
    },
    {
      id: '3',
      name: 'Processtrategie',
      description: 'Adviseert over procedurestrategie en timingsbeslissingen',
      enabled: false,
      category: 'Strategie',
    },
    {
      id: '4',
      name: 'Overeenkomst Revieww',
      description: 'Controleert contracten op juridische risico\'s',
      enabled: true,
      category: 'Contracten',
    },
  ])

  const handleToggleSkill = async (id: string, enabled: boolean) => {
    setSkills((prev) =>
      prev.map((skill) =>
        skill.id === id ? { ...skill, enabled } : skill
      )
    )
    console.log('Toggling skill:', id, enabled)
  }

  return (
    <div className="space-y-6">
      <TopBar title="AI Skills" />

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        <div className="sophia-card text-center">
          <div className="text-3xl font-bold text-[#16a085]">
            {skills.filter((s) => s.enabled).length}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">
            Actieve skills
          </div>
        </div>
        <div className="sophia-card text-center">
          <div className="text-3xl font-bold text-gray-700 dark:text-gray-300">
            {skills.length}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">
            Totale skills
          </div>
        </div>
      </div>

      <SkillList skills={skills} onToggle={handleToggleSkill} />

      <div className="sophia-card">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Informatie
        </h2>
        <div className="space-y-3 text-sm text-gray-600 dark:text-gray-400">
          <p>
            AI Skills zijn intelligente modules die specifieke juridische taken
            automatiseren. U kunt ze activeren/deactiveren en hun prompts aanpassen.
          </p>
          <p>
            Klik op "Bewerk" om de system prompt en template variabelen voor een skill aan
            te passen.
          </p>
          <p>
            <strong>Let op:</strong> Wijzigingen aan prompts kunnen de output van de skill
            beïnvloeden.
          </p>
        </div>
      </div>
    </div>
  )
}
