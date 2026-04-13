'use client'

import { useState, useCallback, useEffect } from 'react'
import { apiGet, apiPost, apiPut, apiPatch } from '@/lib/api'

export interface Dossier {
  id: string
  referentie: string
  clientNaam: string
  clientId: string
  type: string
  status: 'open' | 'inprogress' | 'pending' | 'completed' | 'closed' | 'archived'
  advocaatId: string
  advocaatNaam: string
  datumCreated: string
  datumDeadline?: string
  beschrijving?: string
  werkgeverNaam?: string
  werkgeverContactperson?: string
  conflict_check_status?: 'pending' | 'passed' | 'failed'
}

export interface DossierDetail extends Dossier {
  documenten: Document[]
  analyses: AIAnalysis[]
  timeEntries: TimeEntry[]
  advies?: string
  metadata?: Record<string, unknown>
}

export interface Document {
  id: string
  name: string
  url: string
  category: string
  uploadDate: string
  visibleToClient: boolean
}

export interface AIAnalysis {
  id: string
  type: string
  status: 'pending' | 'running' | 'completed' | 'failed'
  result?: string
  createdAt: string
  completedAt?: string
}

export interface TimeEntry {
  id: string
  date: string
  duration: number
  activityType: 'analyse' | 'advies' | 'communicatie' | 'onderhandeling'
  description: string
  billable: boolean
}

export function useDossiers() {
  const [dossiers, setDossiers] = useState<Dossier[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchDossiers = useCallback(async (filters?: Record<string, unknown>) => {
    setIsLoading(true)
    setError(null)
    try {
      const params = new URLSearchParams()
      if (filters) {
        Object.entries(filters).forEach(([key, value]) => {
          if (value) params.append(key, String(value))
        })
      }
      const query = params.toString()
      const endpoint = query ? `/dossiers?${query}` : '/dossiers'
      const data = await apiGet<Dossier[]>(endpoint)
      setDossiers(data)
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch dossiers'
      setError(message)
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchDossiers()
  }, [fetchDossiers])

  const getDossier = useCallback(async (id: string): Promise<DossierDetail | null> => {
    try {
      return await apiGet<DossierDetail>(`/dossiers/${id}`)
    } catch (err) {
      console.error('Failed to fetch dossier:', err)
      return null
    }
  }, [])

  const createDossier = useCallback(
    async (data: Partial<Dossier>): Promise<Dossier | null> => {
      try {
        const result = await apiPost<Dossier>('/dossiers', data)
        await fetchDossiers()
        return result
      } catch (err) {
        console.error('Failed to create dossier:', err)
        return null
      }
    },
    [fetchDossiers]
  )

  const updateDossier = useCallback(
    async (id: string, data: Partial<Dossier>): Promise<Dossier | null> => {
      try {
        const result = await apiPut<Dossier>(`/dossiers/${id}`, data)
        await fetchDossiers()
        return result
      } catch (err) {
        console.error('Failed to update dossier:', err)
        return null
      }
    },
    [fetchDossiers]
  )

  const assignDossier = useCallback(
    async (id: string, advocaatId: string): Promise<Dossier | null> => {
      try {
        const result = await apiPatch<Dossier>(`/dossiers/${id}/assign`, {
          advocaatId,
        })
        await fetchDossiers()
        return result
      } catch (err) {
        console.error('Failed to assign dossier:', err)
        return null
      }
    },
    [fetchDossiers]
  )

  const updateStatus = useCallback(
    async (
      id: string,
      status: Dossier['status']
    ): Promise<Dossier | null> => {
      try {
        const result = await apiPatch<Dossier>(`/dossiers/${id}/status`, {
          status,
        })
        await fetchDossiers()
        return result
      } catch (err) {
        console.error('Failed to update status:', err)
        return null
      }
    },
    [fetchDossiers]
  )

  return {
    dossiers,
    isLoading,
    error,
    fetchDossiers,
    getDossier,
    createDossier,
    updateDossier,
    assignDossier,
    updateStatus,
  }
}
