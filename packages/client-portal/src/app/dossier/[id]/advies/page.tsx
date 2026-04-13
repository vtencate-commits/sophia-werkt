'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import type { CaseDetail } from '@sophia-werkt/shared';
import { useDossier } from '@/hooks/useDossier';
import { AdviesViewer } from '@/components/dossier/AdviesViewer';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { Download } from 'lucide-react';

export default function AdvicePage() {
  const params = useParams();
  const caseId = params.id as string;
  const { getDossier, isLoading } = useDossier();
  const [caseData, setCaseData] = useState<CaseDetail | null>(null);

  useEffect(() => {
    loadDossier();
  }, [caseId]);

  const loadDossier = async () => {
    try {
      const data = await getDossier(caseId);
      setCaseData(data);
    } catch (error) {
      console.error('Failed to load dossier:', error);
    }
  };

  if (isLoading) {
    return (
      <div className='container py-8 flex items-center justify-center min-h-96'>
        <LoadingSpinner />
      </div>
    );
  }

  const hasAdvice = caseData?.adviceFinal || caseData?.adviceDraft;

  return (
    <div className='container py-8'>
      <div className='flex items-center justify-between mb-6'>
        <h1 className='text-3xl font-bold text-sophia-text'>Juridisch Advies</h1>
        {hasAdvice && (
          <button
            onClick={() => window.print()}
            className='flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-sophia-text hover:bg-sophia-bg'
          >
            <Download className='h-4 w-4' />
            Downloaden
          </button>
        )}
      </div>

      {isLoading ? (
        <div className='card p-8 text-center'>
          <LoadingSpinner />
        </div>
      ) : caseData?.adviceFinal ? (
        <AdviesViewer html={caseData.adviceFinal} title='Definitief Advies' />
      ) : caseData?.adviceDraft ? (
        <div className='space-y-6'>
          <div className='bg-yellow-50 border border-yellow-200 rounded-lg p-4'>
            <p className='text-sm text-yellow-800'>
              Dit is een conceptadvies. Het definitieve advies zal spoedig beschikbaar zijn.
            </p>
          </div>
          <AdviesViewer html={caseData.adviceDraft} title='Conceptadvies' />
        </div>
      ) : (
        <div className='card p-12 text-center'>
          <p className='text-lg text-sophia-muted mb-4'>
            Het juridisch advies is nog niet beschikbaar.
          </p>
          <p className='text-sm text-sophia-muted'>
            Uw zaak wordt momenteel door ons juridische team beoordeeld. U ontvangt bericht zodra
            het advies gereed is.
          </p>
        </div>
      )}
    </div>
  );
}
