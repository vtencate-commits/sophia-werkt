'use client';

import React from 'react';
import { UserManagement } from '@/components/UserManagement';

export default function GebruikersPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Gebruikersbeheer</h1>
        <p className="text-gray-600 mt-1">
          Beheer advocaten, admins en hun instellingen
        </p>
      </div>

      <UserManagement />
    </div>
  );
}
