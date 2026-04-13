'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import type { DocumentInfo } from '@sophia-werkt/shared';
import { useDocuments } from '@/hooks/useDocuments';
import { DocumentList } from '@/components/dossier/DocumentList';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { Upload as UploadIcon } from 'lucide-react';

export default function DocumentsPage() {
  const params = useParams();
  const caseId = params.id as string;
  const { listDocuments, uploadDocument, isLoading } = useDocuments(caseId);
  const [documents, setDocuments] = useState<DocumentInfo[]>([]);
  const [uploading, setUploading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('CLIENT_UPLOAD');

  useEffect(() => {
    loadDocuments();
  }, [caseId]);

  const loadDocuments = async () => {
    try {
      const data = await listDocuments();
      setDocuments(data);
    } catch (error) {
      console.error('Failed to load documents:', error);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    setUploading(true);
    try {
      for (const file of files) {
        await uploadDocument(file, selectedCategory);
      }
      await loadDocuments();
    } catch (error) {
      console.error('Failed to upload document:', error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className='container py-8'>
      <h1 className='text-3xl font-bold text-sophia-text mb-6'>Documenten</h1>

      <div className='grid gap-6 md:grid-cols-3 mb-8'>
        <div className='md:col-span-2'>
          <div className='card p-8 text-center border-2 border-dashed border-gray-300 hover:border-sophia-secondary transition-colors'>
            <UploadIcon className='mx-auto h-8 w-8 text-sophia-muted mb-3' />
            <h3 className='font-semibold text-sophia-text mb-1'>Upload documenten</h3>
            <p className='text-sm text-sophia-muted mb-4'>
              Sleep bestanden hier of klik om te selecteren
            </p>

            <div className='flex flex-col gap-3'>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className='px-4 py-2'
              >
                <option value='CLIENT_UPLOAD'>Cliëntupload</option>
                <option value='EMPLOYMENT_CONTRACT'>Arbeidsovereenkomst</option>
                <option value='VSO'>VSO</option>
                <option value='SOCIAL_PLAN'>Maatschappelijk Plan</option>
                <option value='CAO'>CAO</option>
                <option value='PAYSLIP'>Salarisstrook</option>
                <option value='CORRESPONDENCE'>Correspondentie</option>
                <option value='OTHER'>Overig</option>
              </select>

              <label className='cursor-pointer'>
                <input
                  type='file'
                  multiple
                  onChange={handleFileUpload}
                  disabled={uploading}
                  className='hidden'
                />
                <div className='inline-block px-6 py-2 bg-sophia-secondary text-white rounded-lg hover:bg-opacity-90 disabled:opacity-50'>
                  {uploading ? 'Uploading...' : 'Selecteer bestanden'}
                </div>
              </label>
            </div>
          </div>
        </div>

        <div className='card p-6'>
          <h3 className='font-semibold text-sophia-text mb-4'>Informatie</h3>
          <ul className='space-y-2 text-sm text-sophia-muted'>
            <li>Ondersteunde formaten: PDF, DOC, DOCX, XLS, XLSX</li>
            <li>Maximale bestandsgrootte: 10MB per bestand</li>
            <li>Alle bestanden zijn versleuteld opgeslagen</li>
          </ul>
        </div>
      </div>

      <h2 className='text-2xl font-bold text-sophia-text mb-4'>Geüploade documenten</h2>

      {isLoading ? (
        <div className='card p-8 text-center'>
          <LoadingSpinner />
        </div>
      ) : (
        <DocumentList documents={documents} caseId={caseId} />
      )}
    </div>
  );
}
