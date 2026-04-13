'use client';

import { useCallback, useState } from 'react';
import type { DocumentInfo, DocumentDownloadUrl } from '@sophia-werkt/shared';
import { fetchApiClient } from '@/lib/api';

export function useDocuments(caseId: string) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const listDocuments = useCallback(async (): Promise<DocumentInfo[]> => {
    setIsLoading(true);
    setError(null);
    try {
      return await fetchApiClient<DocumentInfo[]>(`/cases/${caseId}/documents`);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to load documents';
      setError(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [caseId]);

  const uploadDocument = useCallback(
    async (file: File, category: string): Promise<DocumentInfo> => {
      setIsLoading(true);
      setError(null);
      try {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('category', category);

        const token = localStorage.getItem('accessToken');
        const headers: HeadersInit = {};
        if (token) {
          headers['Authorization'] = `Bearer ${token}`;
        }

        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}/cases/${caseId}/documents`,
          {
            method: 'POST',
            body: formData,
            headers,
          }
        );

        if (!response.ok) {
          throw new Error('Failed to upload document');
        }

        return await response.json();
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to upload document';
        setError(message);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [caseId]
  );

  const downloadDocument = useCallback(
    async (documentId: string): Promise<DocumentDownloadUrl> => {
      setIsLoading(true);
      setError(null);
      try {
        return await fetchApiClient<DocumentDownloadUrl>(`/cases/${caseId}/documents/${documentId}/download`);
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to download document';
        setError(message);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [caseId]
  );

  return { listDocuments, uploadDocument, downloadDocument, isLoading, error };
}
