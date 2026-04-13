'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login, isLoading } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      await login({ email, password });
      router.push('/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
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
            <h1 className='text-3xl font-bold text-sophia-text'>Inloggen</h1>
            <p className='mt-2 text-sophia-muted'>Arbeidsrecht adviesplatform</p>
          </div>

          {error && (
            <div className='mb-6 rounded-lg bg-red-50 p-4 text-red-800 text-sm'>
              {error}
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

            <div>
              <label className='block text-sm font-medium text-sophia-text mb-2'>
                Wachtwoord
              </label>
              <input
                type='password'
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder='••••••••'
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
                  Inloggen...
                </>
              ) : (
                'Inloggen'
              )}
            </button>
          </form>

          <div className='mt-6 space-y-2 text-center text-sm'>
            <Link
              href='/reset-password'
              className='block text-sophia-secondary hover:underline'
            >
              Wachtwoord vergeten?
            </Link>
            <p className='text-sophia-muted'>
              Nog geen account?{' '}
              <Link href='/register' className='text-sophia-secondary hover:underline'>
                Registreer hier
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
