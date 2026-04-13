'use client';

import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface FAQItem {
  question: string;
  answer: string;
}

const faqs: FAQItem[] = [
  {
    question: 'Hoe maak ik een nieuw dossier aan?',
    answer:
      'Klik op "Nieuw dossier" op uw dashboard en volg het stap-voor-stap formulier. U moet het type advies selecteren, relevante documenten uploaden en uw situatie beschrijven.',
  },
  {
    question: 'Welke documenten moet ik uploaden?',
    answer:
      'Dit hangt af van uw situatie. Doorgaans helpen arbeidsovereenkomsten, VSO\'s, correspondentie en salarisstroken. U hoeft niet alle documenten direct te uploaden; u kunt deze later toevoegen.',
  },
  {
    question: 'Hoe lang duurt het om advies te ontvangen?',
    answer:
      'Dit is afhankelijk van de complexiteit van uw zaak. Doorgaans ontvang je binnen 5-10 werkdagen een eerste reactie van uw advocaat.',
  },
  {
    question: 'Kan ik met mijn advocaat communiceren?',
    answer:
      'Ja, u kunt direct berichten uitwisselen met uw toegewezen advocaat via de "Berichten" tab in uw dossier.',
  },
  {
    question: 'Wat kost het advies?',
    answer:
      'De kosten worden weergegeven in uw dossieroverzicht. U kunt kiezen tussen vast honorarium of uurtarief, afhankelijk van de aard van uw zaak.',
  },
  {
    question: 'Zijn mijn gegevens veilig?',
    answer:
      'Ja, alle gegevens worden versleuteld opgeslagen en we voldoen aan alle GDPR-vereisten. Zie ons privacybeleid voor meer informatie.',
  },
  {
    question: 'Kan ik mijn dossier beëindigen?',
    answer:
      'U kunt uw dossier sluiten via de instellingen in uw dossieroverzicht. Gesloten dossiers kunnen niet meer worden bewerkt, maar blijven toegankelijk voor referentie.',
  },
  {
    question: 'Hoe betaal ik voor het advies?',
    answer:
      'Factureringsgegevens worden gedeeld zodra het advies gereed is. U kunt betalen via bankoverboek of andere methoden die beschikbaar worden gesteld.',
  },
];

const guides = [
  {
    title: 'Aan de slag',
    steps: [
      'Log in met uw account',
      'Klik "Nieuw dossier" op het dashboard',
      'Vul het intakeformulier in',
      'Upload relevante documenten',
      'Wacht op toewijzing aan een advocaat',
    ],
  },
  {
    title: 'Werken met documenten',
    steps: [
      'Ga naar het tabblad "Documenten"',
      'Klik "Upload documenten"',
      'Selecteer bestandstype en uploaden',
      'Documenten zijn onmiddellijk beschikbaar',
      'Download kopieën wanneer nodig',
    ],
  },
  {
    title: 'Communicatie',
    steps: [
      'Open uw dossier',
      'Ga naar het tabblad "Berichten"',
      'Typ uw bericht in het invoerveld',
      'Uw advocaat zal snel antwoorden',
      'Alle gesprekken worden geregistreerd',
    ],
  },
];

export default function HelpPage() {
  const [expandedFAQ, setExpandedFAQ] = useState<number | null>(null);

  return (
    <div className='container py-8'>
      <h1 className='text-4xl font-bold text-sophia-text mb-2'>Help & Handleiding</h1>
      <p className='text-sophia-muted mb-8'>
        Alles wat u moet weten om Sophia Werkt optimaal te gebruiken
      </p>

      <div className='grid gap-8 lg:grid-cols-3 mb-8'>
        {guides.map((guide, index) => (
          <div key={index} className='card p-6'>
            <h3 className='text-lg font-semibold text-sophia-text mb-4'>{guide.title}</h3>
            <ol className='space-y-2'>
              {guide.steps.map((step, stepIndex) => (
                <li key={stepIndex} className='flex gap-3 text-sm'>
                  <span className='h-6 w-6 rounded-full bg-sophia-secondary text-white text-xs flex items-center justify-center flex-shrink-0'>
                    {stepIndex + 1}
                  </span>
                  <span className='text-sophia-text pt-0.5'>{step}</span>
                </li>
              ))}
            </ol>
          </div>
        ))}
      </div>

      <div className='card p-8'>
        <h2 className='text-2xl font-bold text-sophia-text mb-6'>Veelgestelde vragen</h2>

        <div className='space-y-3'>
          {faqs.map((faq, index) => (
            <div
              key={index}
              className='border border-gray-200 rounded-lg overflow-hidden'
            >
              <button
                onClick={() => setExpandedFAQ(expandedFAQ === index ? null : index)}
                className='w-full px-6 py-4 flex items-center justify-between hover:bg-sophia-bg transition-colors'
              >
                <h3 className='font-semibold text-sophia-text text-left'>{faq.question}</h3>
                {expandedFAQ === index ? (
                  <ChevronUp className='h-5 w-5 text-sophia-secondary flex-shrink-0' />
                ) : (
                  <ChevronDown className='h-5 w-5 text-sophia-secondary flex-shrink-0' />
                )}
              </button>

              {expandedFAQ === index && (
                <div className='px-6 py-4 bg-sophia-bg border-t border-gray-200'>
                  <p className='text-sophia-text'>{faq.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className='mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6'>
        <h3 className='font-semibold text-blue-900 mb-3'>Kan ik u niet vinden?</h3>
        <p className='text-sm text-blue-800 mb-4'>
          Als u uw antwoord niet hebt gevonden, neem dan contact met ons op via het contactformulier
          of stuur een e-mail naar support@sophiawerkt.nl
        </p>
        <button className='px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700'>
          Neem contact op
        </button>
      </div>
    </div>
  );
}
