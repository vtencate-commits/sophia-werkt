'use client';

import React from 'react';
import type { CaseTimelineEntry } from '@sophia-werkt/shared';
import { formatDate } from '@/lib/utils';

interface DossierTimelineProps {
  entries: CaseTimelineEntry[];
}

const statusLabels: Record<string, string> = {
  INTAKE: 'Intake',
  DOCUMENTS_RECEIVED: 'Documenten ontvangen',
  AI_ANALYSIS_PENDING: 'AI-analyse in afwachting',
  AI_ANALYSIS_COMPLETE: 'AI-analyse voltooid',
  LAWYER_REVIEW: 'Advocatenbeoordeling',
  ADVICE_DRAFT: 'Advies concept',
  ADVICE_FINAL: 'Definitief advies',
  DELIVERED: 'Afgeleverd',
  FOLLOW_UP: 'Vervolgstap',
  CLOSED: 'Gesloten',
  ARCHIVED: 'Gearchiveerd',
};

export function DossierTimeline({ entries }: DossierTimelineProps) {
  return (
    <div className='space-y-6'>
      {entries.map((entry, index) => (
        <div key={entry.id} className='relative flex gap-4 pb-6'>
          <div className='relative flex flex-col items-center'>
            <div className='h-4 w-4 rounded-full border-2 border-sophia-secondary bg-white' />
            {index !== entries.length - 1 && (
              <div className='absolute top-4 h-12 w-0.5 bg-gray-200' />
            )}
          </div>

          <div className='flex-1 pt-1'>
            <h4 className='font-semibold text-sophia-text'>
              {entry.toStatus && statusLabels[entry.toStatus]}
            </h4>
            <p className='mt-1 text-sm text-sophia-muted'>
              {formatDate(entry.createdAt, 'long')}
            </p>
            {entry.notes && (
              <p className='mt-2 text-sm text-sophia-text'>{entry.notes}</p>
            )}
            {entry.changedBy && (
              <p className='mt-1 text-xs text-sophia-muted'>Gewijzigd door: {entry.changedBy}</p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
