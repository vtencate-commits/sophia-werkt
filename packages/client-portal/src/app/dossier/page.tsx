'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import type { CaseSummary } from '@sophia-werkt/shared';
import { useDossier } from '@/hooks/useDossier';
import { DossierCard } from '@/components/dossier/DossierCard';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { Plus, Search } from 'lucide-react';

export default function DossierListPage() {
  const { listDossiers, isLoading } = useDossier();
  const [cases, setCases] = useState<CaseSummary[]>([]);
  const [filteredCases, setFilteredCases] = useState<CaseSummary[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  useEffect(() => {
    loadDossiers();
  }, []);

  useEffect(() => {
    filterCases();
  }, [cases, searchTerm, statusFilter]);

  const loadDossiers = async () => {
    try {
      const data = await listDossiers();
      setCases(data);
    } catch (error) {
      console.error('Failed to load dossiers:', error);
    }
  };

  const filterCases = () => {
    let filtered = cases;

    if (searchTerm) {
      filtered = filtered.filter(
        (c) =>
          c.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          c.referenceNumber.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter) {
      filtered = filtered.filter((c) => c.status === statusFilter);
    }

    setFilteredCases(filtered);
  };

  const statuses = [
    { value: '', label: 'Alle statussen' },
    { value: 'INTAKE', label: 'Intake' },
    { value: 'DOCUMENTS_RECEIVED', label: 'Documenten ontvangen' },
    { value: 'AI_ANALYSIS_PENDING', label: 'AI-analyse in afwachting' },
    { value: 'LAWYER_REVIEW', label: 'Advocatenbeoordeling' },
    { value: 'ADVICE_FINAL', label: 'Definitief advies' },
    { value: 'DELIVERED', label: 'Afgeleverd' },
  ];

  return (
    <div className='container py-8'>
      <div className='flex flex-col gap-6'>
        <div className='flex items-center justify-between'>
          <div>
            <h1 className='text-3xl font-bold text-sophia-text'>Mijn dossiers</h1>
            <p className='mt-2 text-sophia-muted'>Beheer en volg uw juridische zaken</p>
          </div>

          <Link
            href='/dossier/nieuw'
            className='flex items-center gap-2 px-6 py-3 bg-sophia-secondary text-white rounded-lg hover:bg-opacity-90'
          >
            <Plus className='h-5 w-5' />
            Nieuw dossier
          </Link>
        </div>

        <div className='card p-6'>
          <div className='flex flex-col gap-4 md:flex-row md:items-center md:gap-4'>
            <div className='flex-1 relative'>
              <Search className='absolute left-3 top-3 h-5 w-5 text-sophia-muted' />
              <input
                type='text'
                placeholder='Zoeken op titel of referentienummer...'
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className='pl-10 w-full'
              />
            </div>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className='px-4 py-2'
            >
              {statuses.map((status) => (
                <option key={status.value} value={status.value}>
                  {status.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {isLoading ? (
          <div className='card p-8 text-center'>
            <LoadingSpinner />
          </div>
        ) : filteredCases.length > 0 ? (
          <div className='grid gap-4'>
            {filteredCases.map((caseItem) => (
              <DossierCard key={caseItem.id} dossier={caseItem} />
            ))}
          </div>
        ) : (
          <div className='card p-12 text-center'>
            <p className='text-lg text-sophia-muted'>
              {cases.length === 0
                ? 'U hebt nog geen dossiers aangemaakt'
                : 'Geen dossiers gevonden met uw zoekcriteria'}
            </p>
            {cases.length === 0 && (
              <Link
                href='/dossier/nieuw'
                className='mt-4 inline-block px-6 py-2 bg-sophia-secondary text-white rounded-lg hover:bg-opacity-90'
              >
                Maak uw eerste dossier aan
              </Link>
            )}
          </div>
        )}

        {filteredCases.length > 0 && (
          <p className='text-sm text-sophia-muted text-center'>
            {filteredCases.length} van {cases.length} dossier(s)
          </p>
        )}
      </div>
    </div>
  );
}
