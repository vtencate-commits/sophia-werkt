'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');
  const { register, isLoading } = useAuth();
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Wachtwoorden komen niet overeen');
      return;
    }

    try {
      await register({
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone || undefined,
        password: formData.password,
      });
      router.push('/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Registration failed');
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
            <h1 className='text-3xl font-bold text-sophia-text'>Registreren</h1>
            <p className='mt-2 text-sophia-muted'>Maak een account aan</p>
          </div>

          {error && (
            <div className='mb-6 rounded-lg bg-red-50 p-4 text-red-800 text-sm'>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className='space-y-4'>
            <div className='grid grid-cols-2 gap-4'>
              <div>
                <label className='block text-sm font-medium text-sophia-text mb-2'>
                  Voornaam *
                </label>
                <input
                  type='text'
                  name='firstName'
                  value={formData.firstName}
                  onChange={handleChange}
                  required
                  placeholder='Jan'
                  className='w-full'
                />
              </div>
              <div>
                <label className='block text-sm font-medium text-sophia-text mb-2'>
                  Achternaam *
                </label>
                <input
                  type='text'
                  name='lastName'
                  value={formData.lastName}
                  onChange={handleChange}
                  required
                  placeholder='Jansen'
                  className='w-full'
                />
              </div>
            </div>

            <div>
              <label className='block text-sm font-medium text-sophia-text mb-2'>
                E-mailadres *
              </label>
              <input
                type='email'
                name='email'
                value={formData.email}
                onChange={handleChange}
                required
                placeholder='naam@voorbeeld.nl'
                className='w-full'
              />
            </div>

            <div>
              <label className='block text-sm font-medium text-sophia-text mb-2'>
                Telefoonnummer
              </label>
              <input
                type='tel'
                name='phone'
                value={formData.phone}
                onChange={handleChange}
                placeholder='+31 6 12345678'
                className='w-full'
              />
            </div>

            <div>
              <label className='block text-sm font-medium text-sophia-text mb-2'>
                Wachtwoord *
              </label>
              <input
                type='password'
                name='password'
                value={formData.password}
                onChange={handleChange}
                required
                placeholder='••••••••'
                className='w-full'
              />
            </div>

            <div>
              <label className='block text-sm font-medium text-sophia-text mb-2'>
                Wachtwoord bevestigen *
              </label>
              <input
                type='password'
                name='confirmPassword'
                value={formData.confirmPassword}
                onChange={handleChange}
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
                  Registreren...
                </>
              ) : (
                'Account aanmaken'
              )}
            </button>
          </form>

          <p className='mt-6 text-center text-sm text-sophia-muted'>
            Al een account?{' '}
            <Link href='/login' className='text-sophia-secondary hover:underline'>
              Inloggen
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
