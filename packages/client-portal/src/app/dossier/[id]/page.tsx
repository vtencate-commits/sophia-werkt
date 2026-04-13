'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import type { CaseDetail } from '@sophia-werkt/shared';
import { useDossier } from '@/hooks/useDossier';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { StatusIndicator } from '@/components/ui/StatusIndicator';
import { formatDate, formatCurrency } from '@/lib/utils';
import { ArrowLeft, FileText, MessageSquare, DollarSign, HelpCircle } from 'lucide-react';
import { useParams } from 'next/navigation';

export default function DossierDetailPage() {
  const params = useParams();
  const caseId = params.id as string;
  const { getDossier, isLoading } = useDossier();
  const [caseData, setCaseData] = useState<CaseDetail | null>(null);

  useEffect(() => {
    if (caseId) {
      loadDossier();
    }
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

  if (!caseData) {
    return (
      <div className='container py-8'>
        <div className='card p-8 text-center'>
          <p className='text-sophia-muted'>Dossier niet gevonden</p>
          <Link href='/dossier' className='mt-4 inline-block text-sophia-secondary hover:underline'>
            Terug naar dossiers
          </Link>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: 'overzicht', label: 'Overzicht', icon: <FileText className='h-4 w-4' /> },
    { id: 'documenten', label: 'Documenten', icon: <FileText className='h-4 w-4' /> },
    { id: 'berichten', label: 'Berichten', icon: <MessageSquare className='h-4 w-4' /> },
    { id: 'advies', label: 'Advies', icon: <HelpCircle className='h-4 w-4' /> },
    { id: 'facturen', label: 'Facturen', icon: <DollarSign className='h-4 w-4' /> },
  ];

  return (
    <div className='container py-8'>
      <Link
        href='/dossier'
        className='flex items-center gap-2 text-sophia-secondary hover:underline mb-6'
      >
        <ArrowLeft className='h-4 w-4' />
        Terug naar dossiers
      </Link>

      <div className='card p-8 mb-6'>
        <div className='flex items-start justify-between gap-4'>
          <div className='flex-1'>
            <h1 className='text-3xl font-bold text-sophia-text'>{caseData.title}</h1>
            <p className='text-sm text-sophia-muted mt-2'>
              Ref: <span className='font-mono'>{caseData.referenceNumber}</span>
            </p>
          </div>
          <StatusIndicator status={caseData.status} />
        </div>

        <div className='mt-6 grid grid-cols-2 gap-4 md:grid-cols-4'>
          <div>
            <p className='text-xs text-sophia-muted uppercase tracking-wide'>Adviestype</p>
            <p className='text-sm font-medium text-sophia-text mt-1'>{caseData.adviceType}</p>
          </div>

          <div>
            <p className='text-xs text-sophia-muted uppercase tracking-wide'>Advocaat</p>
            <p className='text-sm font-medium text-sophia-text mt-1'>
              {caseData.lawyerName || 'In toewijzing'}
            </p>
          </div>

          <div>
            <p className='text-xs text-sophia-muted uppercase tracking-wide'>Honorarium</p>
            <p className='text-sm font-medium text-sophia-text mt-1'>
              {formatCurrency(caseData.feeAmount)}
            </p>
          </div>

          <div>
            <p className='text-xs text-sophia-muted uppercase tracking-wide'>Aangemaakt</p>
            <p className='text-sm font-medium text-sophia-text mt-1'>
              {formatDate(caseData.createdAt, 'short')}
            </p>
          </div>
        </div>

        {caseData.description && (
          <div className='mt-6 pt-6 border-t border-gray-200'>
            <p className='text-xs text-sophia-muted uppercase tracking-wide'>Omschrijving</p>
            <p className='text-sm text-sophia-text mt-2'>{caseData.description}</p>
          </div>
        )}
      </div>

      <div className='card'>
        <div className='border-b border-gray-200'>
          <div className='flex flex-wrap gap-1 p-4'>
            {tabs.map((tab) => (
              <Link
                key={tab.id}
                href={`/dossier/${caseId}/${tab.id === 'overzicht' ? '' : tab.id}`}
                className='flex items-center gap-2 px-4 py-2 text-sm font-medium text-sophia-text hover:bg-sophia-bg rounded-t-lg'
              >
                {tab.icon}
                {tab.label}
              </Link>
            ))}
          </div>
        </div>

        <div className='p-8'>
          <div className='grid gap-6 md:grid-cols-2'>
            <div className='card p-6 border'>
              <h3 className='font-semibold text-sophia-text mb-4'>Werkgegevers informatie</h3>
              <div className='space-y-3 text-sm'>
                <div>
                  <p className='text-xs text-sophia-muted uppercase'>Naam</p>
                  <p className='text-sophia-text mt-1'>{caseData.employerName || '-'}</p>
                </div>
                <div>
                  <p className='text-xs text-sophia-muted uppercase'>KVK-nummer</p>
                  <p className='text-sophia-text mt-1'>{caseData.employerKvk || '-'}</p>
                </div>
              </div>
            </div>

            <div className='card p-6 border'>
              <h3 className='font-semibold text-sophia-text mb-4'>Casegegevens</h3>
              <div className='space-y-3 text-sm'>
                <div>
                  <p className='text-xs text-sophia-muted uppercase'>Honorariumtype</p>
                  <p className='text-sophia-text mt-1'>
                    {caseData.feeType === 'FIXED' ? 'Vast' : 'Uurtarief'}
                  </p>
                </div>
                <div>
                  <p className='text-xs text-sophia-muted uppercase'>Status</p>
                  <p className='text-sophia-text mt-1'>
                    <StatusIndicator status={caseData.status} variant='dot' />
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
