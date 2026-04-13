'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { fetchApiClient } from '@/lib/api';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';

export default function ResetPasswordPage() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setIsLoading(true);

    try {
      await fetchApiClient('/auth/forgot-password', {
        method: 'POST',
        body: JSON.stringify({ email }),
        skipAuth: true,
      });

      setMessage('Controleer uw e-mailbox voor een link om uw wachtwoord opnieuw in te stellen.');
      setEmail('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Verzoek mislukt');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className='flex min-h-screen bg-gradient-to-br from-sophia-primary to-sophia-secondary'>
      <div className='flex w-full items-center justify-center px-4'>
        <div className='w-full max-w-md rounded-lg bg-white shadow-2xl p-8'>
          <div className='mb-8 text-center'>
            <div className='flex items-center justify-center gap-2 mb-4'>
              <div className='h-10 w-10 rounded-lg bg-gradient-to-br from-sophia-primary to-sophia-secondary' />
              <span className='text-2xl font-bold text-sophia-primary'>Sophia Werkt</span>
            </div>
            <h1 className='text-3xl font-bold text-sophia-text'>Wachtwoord opnieuw instellen</h1>
            <p className='mt-2 text-sophia-muted'>Voer uw e-mailadres in</p>
          </div>

          {error && (
            <div className='mb-6 rounded-lg bg-red-50 p-4 text-red-800 text-sm'>
              {error}
            </div>
          )}

          {message && (
            <div className='mb-6 rounded-lg bg-green-50 p-4 text-green-800 text-sm'>
              {message}
            </div>
          )}

          <form onSubmit={handleSubmit} className='space-y-4'>
            <div>
              <label className='block text-sm font-medium text-sophia-text mb-2'>
                E-mailadres
              </label>
              <input
                type='email'
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder='naam@voorbeeld.nl'
                className='w-full'
              />
            </div>

            <button
              type='submit'
              disabled={isLoading}
              className='w-full bg-sophia-secondary text-white font-medium py-2 rounded-lg hover:bg-opacity-90 disabled:opacity-50 flex items-center justify-center gap-2'
            >
              {isLoading ? (
                <>
                  <LoadingSpinner size='sm' />
                  Verzenden...
                </>
              ) : (
                'Opstellingslink verzenden'
              )}
            </button>
          </form>

          <p className='mt-6 text-center text-sm text-sophia-muted'>
            <Link href='/login' className='text-sophia-secondary hover:underline'>
              Terug naar inloggen
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
