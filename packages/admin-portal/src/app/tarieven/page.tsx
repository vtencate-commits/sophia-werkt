'use client';

import React from 'react';
import { PricingManager } from '@/components/PricingManager';

export default function TarievenPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Tarifering</h1>
        <p className="text-gray-600 mt-1">
          Beheer de prijzen van juridische diensten
        </p>
      </div>

      <PricingManager />
    </div>
  );
}
