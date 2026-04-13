'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import type { CaseDetail } from '@sophia-werkt/shared';
import { useDossier } from '@/hooks/useDossier';
import { FeeProgress } from '@/components/dossier/FeeProgress';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { formatCurrency } from '@/lib/utils';

export default function InvoicesPage() {
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

  if (!caseData) {
    return (
      <div className='container py-8'>
        <div className='card p-8 text-center'>
          <p className='text-sophia-muted'>Dossier niet gevonden</p>
        </div>
      </div>
    );
  }

  return (
    <div className='container py-8'>
      <h1 className='text-3xl font-bold text-sophia-text mb-6'>Facturen & Kosten</h1>

      <div className='grid gap-6 mb-8'>
        <FeeProgress
          feeType={caseData.feeType}
          feeAmount={caseData.feeAmount}
          paidAmount={0}
        />
      </div>

      <h2 className='text-2xl font-bold text-sophia-text mb-4'>Facturenhistorie</h2>

      <div className='card'>
        <div className='overflow-x-auto'>
          <table className='w-full'>
            <thead>
              <tr className='border-b border-gray-200'>
                <th className='text-left px-6 py-3 font-semibold text-sophia-text'>Factuurnr.</th>
                <th className='text-left px-6 py-3 font-semibold text-sophia-text'>Datum</th>
                <th className='text-left px-6 py-3 font-semibold text-sophia-text'>Bedrag</th>
                <th className='text-left px-6 py-3 font-semibold text-sophia-text'>Status</th>
              </tr>
            </thead>
            <tbody>
              <tr className='border-b border-gray-200 hover:bg-sophia-bg'>
                <td colSpan={4} className='px-6 py-8 text-center text-sophia-muted'>
                  Nog geen facturen gegenereerd
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div className='mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6'>
        <h3 className='font-semibold text-blue-900 mb-2'>Over uw honorarium</h3>
        <p className='text-sm text-blue-800 mb-3'>
          {caseData.feeType === 'FIXED'
            ? 'U betaalt een vast honorarium voor deze zaak.'
            : 'U betaalt per uur voor deze zaak.'}
        </p>
        <ul className='text-sm text-blue-800 space-y-1'>
          <li>Totaal honorarium: {formatCurrency(caseData.feeAmount)}</li>
          <li>Betaald: {formatCurrency(0)}</li>
          <li>Nog verschuldigd: {formatCurrency(caseData.feeAmount)}</li>
        </ul>
      </div>
    </div>
  );
}
