'use client';

import { useCallback, useState } from 'react';
import type { CaseSummary, CaseDetail, CreateCaseRequest } from '@sophia-werkt/shared';
import { fetchApiClient } from '@/lib/api';

export function useDossier() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const listDossiers = useCallback(async (filters?: { status?: string; type?: string }): Promise<CaseSummary[]> => {
    setIsLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      if (filters?.status) params.append('status', filters.status);
      if (filters?.type) params.append('type', filters.type);

      const queryString = params.toString();
      const endpoint = `/cases${queryString ? `?${queryString}` : ''}`;
      return await fetchApiClient<CaseSummary[]>(endpoint);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to load dossiers';
      setError(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const getDossier = useCallback(async (id: string): Promise<CaseDetail> => {
    setIsLoading(true);
    setError(null);
    try {
      return await fetchApiClient<CaseDetail>(`/cases/${id}`);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to load dossier';
      setError(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const createDossier = useCallback(async (data: CreateCaseRequest): Promise<CaseDetail> => {
    setIsLoading(true);
    setError(null);
    try {
      return await fetchApiClient<CaseDetail>('/cases', {
        method: 'POST',
        body: JSON.stringify(data),
      });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to create dossier';
      setError(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { listDossiers, getDossier, createDossier, isLoading, error };
}
