'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'
import { apiRequest } from './api'

export interface Lawyer {
  id: string
  email: string
  name: string
  avatar?: string
  role: string
  firm?: string
}

export interface AuthContextType {
  lawyer: Lawyer | null
  isLoading: boolean
  error: string | null
  login: (email: string, password: string) => Promise<void>
  logout: () => Promise<void>
  isAuthenticated: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

const TOKEN_KEY = 'sophia_auth_token'
const LAWYER_KEY = 'sophia_lawyer'

export function getAuthToken(): string | null {
  if (typeof window === 'undefined') return null
  return localStorage.getItem(TOKEN_KEY)
}

export function setAuthToken(token: string): void {
  if (typeof window === 'undefined') return
  localStorage.setItem(TOKEN_KEY, token)
}

export function clearAuthToken(): void {
  if (typeof window === 'undefined') return
  localStorage.removeItem(TOKEN_KEY)
  localStorage.removeItem(LAWYER_KEY)
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [lawyer, setLawyer] = useState<Lawyer | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = getAuthToken()
        const storedLawyer = localStorage.getItem(LAWYER_KEY)

        if (token && storedLawyer) {
          setLawyer(JSON.parse(storedLawyer))
        } else if (token) {
          const profile = await apiRequest<Lawyer>('/lawyers/me')
          setLawyer(profile)
          localStorage.setItem(LAWYER_KEY, JSON.stringify(profile))
        }
      } catch (err) {
        clearAuthToken()
        setError(err instanceof Error ? err.message : 'Authentication failed')
      } finally {
        setIsLoading(false)
      }
    }

    checkAuth()
  }, [])

  const login = async (email: string, password: string) => {
    setIsLoading(true)
    setError(null)
    try {
      const response = await apiRequest<{ accessToken: string; refreshToken: string; user?: Lawyer }>(
        '/auth/login',
        {
          method: 'POST',
          body: JSON.stringify({ email, password }),
        }
      )

      setAuthToken(response.accessToken)
      if (response.user) {
        setLawyer(response.user)
        localStorage.setItem(LAWYER_KEY, JSON.stringify(response.user))
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Login failed'
      setError(message)
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  const logout = async () => {
    setIsLoading(true)
    try {
      await apiRequest('/auth/logout', { method: 'POST' })
    } catch {
      // Continue logout even if API call fails
    } finally {
      clearAuthToken()
      setLawyer(null)
      setIsLoading(false)
    }
  }

  return (
    <AuthContext.Provider
      value={{
        lawyer,
        isLoading,
        error,
        login,
        logout,
        isAuthenticated: !!lawyer,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuthContext(): AuthContextType {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}
