'use client';

import React, { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { getInitials } from '@/lib/utils';

export default function ProfilePage() {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    phone: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement profile update
    setIsEditing(false);
  };

  if (!user) {
    return (
      <div className='container py-8 flex items-center justify-center min-h-96'>
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className='container py-8'>
      <h1 className='text-3xl font-bold text-sophia-text mb-6'>Mijn Profiel</h1>

      <div className='grid gap-6 md:grid-cols-3'>
        <div className='md:col-span-2'>
          <div className='card p-8'>
            <div className='flex items-start justify-between mb-6'>
              <div>
                <h2 className='text-2xl font-bold text-sophia-text'>
                  {user.firstName} {user.lastName}
                </h2>
                <p className='text-sophia-muted mt-1'>{user.email}</p>
              </div>
              <button
                onClick={() => setIsEditing(!isEditing)}
                className='px-4 py-2 border border-gray-300 rounded-lg text-sophia-text hover:bg-sophia-bg'
              >
                {isEditing ? 'Annuleren' : 'Bewerken'}
              </button>
            </div>

            {!isEditing ? (
              <div className='space-y-6'>
                <div className='grid grid-cols-2 gap-4'>
                  <div>
                    <p className='text-sm text-sophia-muted uppercase tracking-wide'>Voornaam</p>
                    <p className='text-sophia-text mt-2'>{user.firstName}</p>
                  </div>
                  <div>
                    <p className='text-sm text-sophia-muted uppercase tracking-wide'>Achternaam</p>
                    <p className='text-sophia-text mt-2'>{user.lastName}</p>
                  </div>
                </div>

                <div>
                  <p className='text-sm text-sophia-muted uppercase tracking-wide'>E-mailadres</p>
                  <p className='text-sophia-text mt-2'>{user.email}</p>
                </div>

                <div>
                  <p className='text-sm text-sophia-muted uppercase tracking-wide'>Rol</p>
                  <p className='text-sophia-text mt-2'>{user.role}</p>
                </div>

                <div>
                  <p className='text-sm text-sophia-muted uppercase tracking-wide'>E-mailadres</p>
                  <p className='text-sophia-text mt-2'>{user.email}</p>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className='space-y-4'>
                <div className='grid grid-cols-2 gap-4'>
                  <div>
                    <label className='block text-sm font-medium text-sophia-text mb-2'>
                      Voornaam
                    </label>
                    <input
                      type='text'
                      name='firstName'
                      value={formData.firstName}
                      onChange={handleChange}
                      className='w-full'
                    />
                  </div>
                  <div>
                    <label className='block text-sm font-medium text-sophia-text mb-2'>
                      Achternaam
                    </label>
                    <input
                      type='text'
                      name='lastName'
                      value={formData.lastName}
                      onChange={handleChange}
                      className='w-full'
                    />
                  </div>
                </div>

                <div>
                  <label className='block text-sm font-medium text-sophia-text mb-2'>
                    E-mailadres
                  </label>
                  <input
                    type='email'
                    name='email'
                    value={formData.email}
                    onChange={handleChange}
                    disabled
                    className='w-full opacity-50'
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

                <div className='flex gap-4 pt-4'>
                  <button
                    type='submit'
                    className='px-6 py-2 bg-sophia-secondary text-white rounded-lg hover:bg-opacity-90'
                  >
                    Opslaan
                  </button>
                  <button
                    type='button'
                    onClick={() => setIsEditing(false)}
                    className='px-6 py-2 border border-gray-300 rounded-lg text-sophia-text hover:bg-sophia-bg'
                  >
                    Annuleren
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>

        <div>
          <div className='card p-6'>
            <div className='flex justify-center mb-4'>
              <div className='h-24 w-24 rounded-full bg-sophia-secondary flex items-center justify-center text-3xl font-bold text-white'>
                {getInitials(user.firstName, user.lastName)}
              </div>
            </div>

            <h3 className='font-semibold text-sophia-text text-center mb-4'>Accountgegevens</h3>

            <div className='space-y-3 text-sm'>
              <button className='w-full px-4 py-2 border border-gray-300 rounded-lg text-sophia-text hover:bg-sophia-bg text-left'>
                Wachtwoord wijzigen
              </button>
              <button className='w-full px-4 py-2 border border-gray-300 rounded-lg text-sophia-text hover:bg-sophia-bg text-left'>
                Twee-factorverificatie
              </button>
              <button className='w-full px-4 py-2 border border-gray-300 rounded-lg text-sophia-text hover:bg-sophia-bg text-left'>
                Privacyinstellingen
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
