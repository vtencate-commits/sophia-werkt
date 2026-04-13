'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { IntakeForm } from '@/components/dossier/IntakeForm';

export default function NewDossierPage() {
  const router = useRouter();

  const handleSuccess = (caseId: string) => {
    router.push(`/dossier/${caseId}`);
  };

  return (
    <div className='container py-8'>
      <div className='mb-8'>
        <h1 className='text-3xl font-bold text-sophia-text'>Nieuw dossier aanmaken</h1>
        <p className='mt-2 text-sophia-muted'>
          Vul onderstaande formulier in om een nieuw juridisch dossier aan te maken
        </p>
      </div>

      <IntakeForm onSuccess={handleSuccess} />
    </div>
  );
}
