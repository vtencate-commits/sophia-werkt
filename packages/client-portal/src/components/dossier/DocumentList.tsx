'use client';

import React from 'react';
import type { DocumentInfo } from '@sophia-werkt/shared';
import { formatDate } from '@/lib/utils';
import { FileText, Download, Loader } from 'lucide-react';
import { useState } from 'react';
import { useDocuments } from '@/hooks/useDocuments';

interface DocumentListProps {
  documents: DocumentInfo[];
  caseId: string;
}

const categoryLabels: Record<string, string> = {
  EMPLOYMENT_CONTRACT: 'Arbeidsovereenkomst',
  VSO: 'VSO',
  SOCIAL_PLAN: 'Maatschappelijk Plan',
  CAO: 'CAO',
  PAYSLIP: 'Salarisstrook',
  CORRESPONDENCE: 'Correspondentie',
  AI_ANALYSIS: 'AI-analyse',
  LEGAL_ADVICE: 'Juridisch advies',
  INVOICE: 'Factuur',
  CLIENT_UPLOAD: 'Cliëntupload',
  LAWYER_UPLOAD: 'Advocaatupload',
  OTHER: 'Overig',
};

export function DocumentList({ documents, caseId }: DocumentListProps) {
  const [downloadingId, setDownloadingId] = useState<string | null>(null);
  const { downloadDocument } = useDocuments(caseId);

  const handleDownload = async (documentId: string, filename: string) => {
    try {
      setDownloadingId(documentId);
      const downloadUrl = await downloadDocument(documentId);

      const link = document.createElement('a');
      link.href = downloadUrl.url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Failed to download document:', error);
    } finally {
      setDownloadingId(null);
    }
  };

  if (documents.length === 0) {
    return (
      <div className='card p-8 text-center'>
        <FileText className='mx-auto h-12 w-12 text-sophia-muted' />
        <h3 className='mt-2 font-medium text-sophia-text'>Geen documenten</h3>
        <p className='mt-1 text-sm text-sophia-muted'>
          Er zijn nog geen documenten geüpload voor dit dossier.
        </p>
      </div>
    );
  }

  return (
    <div className='space-y-2'>
      {documents.map((doc) => (
        <div
          key={doc.id}
          className='card flex items-center justify-between p-4 hover:border-sophia-secondary'
        >
          <div className='flex-1 min-w-0'>
            <div className='flex items-center gap-3'>
              <FileText className='h-5 w-5 flex-shrink-0 text-sophia-muted' />
              <div className='flex-1 min-w-0'>
                <p className='truncate font-medium text-sophia-text'>{doc.originalFilename}</p>
                <div className='flex flex-wrap gap-2 mt-1'>
                  <span className='badge badge-info text-xs'>
                    {categoryLabels[doc.category] || doc.category}
                  </span>
                  <span className='text-xs text-sophia-muted'>
                    {formatDate(doc.createdAt, 'short')}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <button
            onClick={() => handleDownload(doc.id, doc.originalFilename)}
            disabled={downloadingId === doc.id}
            className='ml-4 rounded-lg p-2 text-sophia-secondary hover:bg-sophia-bg disabled:opacity-50'
            aria-label='Download document'
          >
            {downloadingId === doc.id ? (
              <Loader className='h-5 w-5 animate-spin' />
            ) : (
              <Download className='h-5 w-5' />
            )}
          </button>
        </div>
      ))}
    </div>
  );
}
