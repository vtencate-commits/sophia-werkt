'use client';

import React from 'react';
import type { FeeType } from '@sophia-werkt/shared';
import { formatCurrency } from '@/lib/utils';
import { ProgressBar } from '../ui/ProgressBar';

interface FeeProgressProps {
  feeType: FeeType;
  feeAmount: number;
  paidAmount?: number;
  className?: string;
}

export function FeeProgress({
  feeType,
  feeAmount,
  paidAmount = 0,
  className,
}: FeeProgressProps) {
  const percentage = Math.min((paidAmount / feeAmount) * 100, 100);
  const remaining = Math.max(feeAmount - paidAmount, 0);

  return (
    <div className={`card p-6 ${className}`}>
      <div className='flex items-center justify-between mb-4'>
        <div>
          <h3 className='font-semibold text-sophia-text'>
            {feeType === 'FIXED' ? 'Vast honorarium' : 'Uurtarief'}
          </h3>
          <p className='text-sm text-sophia-muted mt-1'>
            Totaal: {formatCurrency(feeAmount)}
          </p>
        </div>
        <div className='text-right'>
          <p className='text-lg font-bold text-sophia-secondary'>
            {formatCurrency(remaining)}
          </p>
          <p className='text-xs text-sophia-muted'>nog te betalen</p>
        </div>
      </div>

      <ProgressBar
        current={paidAmount}
        total={feeAmount}
        label='Betaald'
        showPercentage={true}
      />

      <div className='mt-4 grid grid-cols-2 gap-4'>
        <div>
          <p className='text-xs text-sophia-muted uppercase'>Betaald</p>
          <p className='font-semibold text-sophia-text mt-1'>
            {formatCurrency(paidAmount)}
          </p>
        </div>
        <div>
          <p className='text-xs text-sophia-muted uppercase'>Status</p>
          <p className='font-semibold text-sophia-text mt-1'>
            {percentage === 100 ? 'Voltooid' : 'In behandeling'}
          </p>
        </div>
      </div>
    </div>
  );
}
