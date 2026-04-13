'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import type { CaseSummary, NotificationInfo } from '@sophia-werkt/shared';
import { useDossier } from '@/hooks/useDossier';
import { useNotifications } from '@/hooks/useNotifications';
import { useAuth } from '@/hooks/useAuth';
import { DossierCard } from '@/components/dossier/DossierCard';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { Plus } from 'lucide-react';

export default function DashboardPage() {
  const { user } = useAuth();
  const { listDossiers, isLoading: casesLoading } = useDossier();
  const { listNotifications, isLoading: notifLoading } = useNotifications();

  const [cases, setCases] = useState<CaseSummary[]>([]);
  const [notifications, setNotifications] = useState<NotificationInfo[]>([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [casesData, notificationsData] = await Promise.all([
        listDossiers({ status: 'INTAKE' }),
        listNotifications(true),
      ]);

      setCases(casesData);
      setNotifications(notificationsData);
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
    }
  };

  const activeCases = cases.filter((c) => !['CLOSED', 'ARCHIVED'].includes(c.status));

  return (
    <div className='container py-8'>
      <div className='grid gap-8'>
        <div className='flex items-center justify-between'>
          <div>
            <h1 className='text-4xl font-bold text-sophia-text'>
              Welkom, {user?.firstName}!
            </h1>
            <p className='mt-2 text-sophia-muted'>
              Hier is een overzicht van uw dossiers en recente updates
            </p>
          </div>

          <Link
            href='/dossier/nieuw'
            className='flex items-center gap-2 px-6 py-3 bg-sophia-secondary text-white rounded-lg hover:bg-opacity-90 transition-colors'
          >
            <Plus className='h-5 w-5' />
            Nieuw dossier
          </Link>
        </div>

        <div className='grid gap-6 md:grid-cols-3'>
          <div className='card p-6 text-center'>
            <div className='text-4xl font-bold text-sophia-secondary'>{cases.length}</div>
            <p className='mt-2 text-sophia-muted'>Totaal dossiers</p>
          </div>

          <div className='card p-6 text-center'>
            <div className='text-4xl font-bold text-sophia-secondary'>{activeCases.length}</div>
            <p className='mt-2 text-sophia-muted'>Actieve zaken</p>
          </div>

          <div className='card p-6 text-center'>
            <div className='text-4xl font-bold text-sophia-secondary'>
              {notifications.length}
            </div>
            <p className='mt-2 text-sophia-muted'>Ongelezen meldingen</p>
          </div>
        </div>

        <div className='grid gap-8 lg:grid-cols-3'>
          <div className='lg:col-span-2'>
            <h2 className='text-2xl font-bold text-sophia-text mb-4'>Actieve dossiers</h2>

            {casesLoading ? (
              <div className='card p-8 text-center'>
                <LoadingSpinner />
              </div>
            ) : activeCases.length > 0 ? (
              <div className='grid gap-4'>
                {activeCases.slice(0, 5).map((caseItem) => (
                  <DossierCard key={caseItem.id} dossier={caseItem} />
                ))}
              </div>
            ) : (
              <div className='card p-8 text-center'>
                <p className='text-sophia-muted'>Geen actieve dossiers</p>
                <Link
                  href='/dossier/nieuw'
                  className='mt-4 inline-block text-sophia-secondary hover:underline'
                >
                  Maak uw eerste dossier aan
                </Link>
              </div>
            )}

            {activeCases.length > 5 && (
              <Link
                href='/dossier'
                className='mt-4 block text-center text-sophia-secondary hover:underline'
              >
                Alle dossiers bekijken
              </Link>
            )}
          </div>

          <div>
            <h2 className='text-2xl font-bold text-sophia-text mb-4'>Recente meldingen</h2>

            {notifLoading ? (
              <div className='card p-8 text-center'>
                <LoadingSpinner size='sm' />
              </div>
            ) : notifications.length > 0 ? (
              <div className='card divide-y divide-gray-200'>
                {notifications.slice(0, 5).map((notification) => (
                  <div key={notification.id} className='p-4 hover:bg-sophia-bg'>
                    <p className='font-medium text-sophia-text text-sm'>{notification.title}</p>
                    <p className='mt-1 text-xs text-sophia-muted'>{notification.body}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className='card p-8 text-center'>
                <p className='text-sophia-muted'>Geen meldingen</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
