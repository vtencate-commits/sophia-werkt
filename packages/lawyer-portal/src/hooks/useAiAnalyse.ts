'use client'

import { useState, useCallback } from 'react'
import { apiPost, apiGet, apiPatch } from '@/lib/api'

export interface AnalysisJob {
  id: string
  dossierId: string
  type: string
  status: 'pending' | 'running' | 'completed' | 'failed'
  result?: string
  error?: string
  progress?: number
  createdAt: string
  completedAt?: string
  updatedAt: string
}

export function useAiAnalyse() {
  const [job, setJob] = useState<AnalysisJob | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const startAnalysis = useCallback(
    async (dossierId: string, analysisType: string): Promise<AnalysisJob | null> => {
      setIsLoading(true)
      setError(null)
      try {
        const result = await apiPost<AnalysisJob>(
          `/dossiers/${dossierId}/analyse`,
          { type: analysisType }
        )
        setJob(result)
        return result
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to start analysis'
        setError(message)
        return null
      } finally {
        setIsLoading(false)
      }
    },
    []
  )

  const getAnalysis = useCallback(
    async (jobId: string): Promise<AnalysisJob | null> => {
      try {
        const result = await apiGet<AnalysisJob>(`/analyse/${jobId}`)
        setJob(result)
        return result
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to fetch analysis'
        setError(message)
        return null
      }
    },
    []
  )

  const updateAnalysis = useCallback(
    async (
      jobId: string,
      data: Partial<AnalysisJob>
    ): Promise<AnalysisJob | null> => {
      try {
        const result = await apiPatch<AnalysisJob>(`/analyse/${jobId}`, data)
        setJob(result)
        return result
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to update analysis'
        setError(message)
        return null
      }
    },
    []
  )

  const pollAnalysis = useCallback(
    async (jobId: string, maxAttempts = 120): Promise<AnalysisJob | null> => {
      let attempts = 0
      const pollInterval = 2000 // 2 seconds

      return new Promise((resolve) => {
        const interval = setInterval(async () => {
          attempts++
          const result = await getAnalysis(jobId)

          if (!result) {
            clearInterval(interval)
            resolve(null)
            return
          }

          if (result.status === 'completed' || result.status === 'failed') {
            clearInterval(interval)
            resolve(result)
            return
          }

          if (attempts >= maxAttempts) {
            clearInterval(interval)
            resolve(result)
          }
        }, pollInterval)
      })
    },
    [getAnalysis]
  )

  return {
    job,
    isLoading,
    error,
    startAnalysis,
    getAnalysis,
    updateAnalysis,
    pollAnalysis,
  }
}
