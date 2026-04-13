'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'

export default function LoginPage() {
  const router = useRouter()
  const { login, isLoading, error } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [localError, setLocalError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLocalError(null)

    try {
      await login(email, password)
      router.push('/dashboard')
    } catch (err) {
      setLocalError(
        err instanceof Error ? err.message : 'Login mislukt. Controleer uw gegevens.'
      )
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-[#1a1a2e] to-[#16213e]">
      <div className="w-full max-w-md">
        <div className="bg-white dark:bg-gray-900 rounded-lg shadow-xl p-8 space-y-6">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-[#16a085] mb-2">Sophia</h1>
            <p className="text-gray-600 dark:text-gray-400">Advocaten Portal</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                E-mailadres
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="sophia-input"
                placeholder="naam@rassers.nl"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Wachtwoord
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="sophia-input"
                placeholder="••••••••"
                required
              />
            </div>

            {(error || localError) && (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded p-3 text-sm text-red-700 dark:text-red-400">
                {error || localError}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="sophia-button-primary w-full disabled:opacity-50"
            >
              {isLoading ? 'Bezig met inloggen...' : 'Inloggen'}
            </button>
          </form>

          <div className="text-center text-sm text-gray-600 dark:text-gray-400">
            <p>Testgebruiker: test@rassers.nl / password123</p>
          </div>
        </div>
      </div>
    </div>
  )
}
