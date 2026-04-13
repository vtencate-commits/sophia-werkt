'use client'

import React, { useState } from 'react'
import { TopBar } from '@/components/layout/TopBar'
import { SkillEditor } from '@/components/skills/SkillEditor'
import { PromptTemplateEditor } from '@/components/skills/PromptTemplateEditor'

interface SkillEditorPageProps {
  params: { id: string }
}

const skillData = {
  '1': {
    name: 'Juridische Analyse',
    category: 'Analyse',
    systemPrompt: `Je bent een juridisch analist van het advocatenkantoor Rassers.
Je analyseert zaakdossiers en identificeert relevante juridische kwesties.
Jij geeft advies op basis van Nederlandse jurisprudentie en wetgeving.
Je output is altijd structureel en voorzien van verwijzingen naar relevante jurisprudentie.`,
    templateVariables: [
      { name: 'caseDescription', placeholder: 'Beschrijving van de zaak' },
      { name: 'documents', placeholder: 'Relevante documenten' },
      { name: 'questions', placeholder: 'Specifieke juridische vragen' },
    ],
  },
  '2': {
    name: 'Risicobeoordeling',
    category: 'Risico',
    systemPrompt: `Je bent een risico-analyseconsultant voor Rassers Advocaten.
Je evalueert juridische risico's en mogelijke uitkomsten van zaken.
Je geeft gestructureerde risicoscores en adviseert over risicobeheersing.
Je bent realistisch in je inschatting en neemt diverse scenarios in overweging.`,
    templateVariables: [
      { name: 'caseType', placeholder: 'Type zaak' },
      { name: 'facts', placeholder: 'Relevante feiten' },
      { name: 'jurisdiction', placeholder: 'Bevoegde rechter' },
    ],
  },
}

export default function SkillEditorPage({ params }: SkillEditorPageProps) {
  const skill = skillData[params.id as keyof typeof skillData]
  const [isLoading, setIsLoading] = useState(false)

  if (!skill) {
    return (
      <div className="space-y-6">
        <TopBar />
        <div className="text-center py-8 text-gray-500">Skill niet gevonden</div>
      </div>
    )
  }

  const handleSavePrompt = async (content: string) => {
    setIsLoading(true)
    console.log('Saving prompt:', content)
    await new Promise((resolve) => setTimeout(resolve, 500))
    setIsLoading(false)
  }

  const handleSaveTemplate = async (template: string) => {
    setIsLoading(true)
    console.log('Saving template:', template)
    await new Promise((resolve) => setTimeout(resolve, 500))
    setIsLoading(false)
  }

  return (
    <div className="space-y-6">
      <TopBar
        breadcrumbs={[
          { label: 'Dashboard', href: '/dashboard' },
          { label: 'Skills', href: '/skills' },
          { label: skill.name },
        ]}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SkillEditor
          skillId={params.id}
          name={skill.name}
          systemPrompt={skill.systemPrompt}
          category={skill.category}
          onSave={handleSavePrompt}
          isLoading={isLoading}
        />

        <PromptTemplateEditor
          template={`Analyseer de volgende zaak:\n\nBeschrijving: {{${skill.templateVariables[0].name}}}\nDocumenten: {{${skill.templateVariables[1].name}}}\nVraag: {{${skill.templateVariables[2].name}}}`}
          variables={skill.templateVariables}
          onSave={handleSaveTemplate}
          isLoading={isLoading}
        />
      </div>
    </div>
  )
}
