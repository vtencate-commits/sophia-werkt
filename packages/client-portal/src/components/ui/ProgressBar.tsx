'use client';

import React from 'react';
import { cn } from '@/lib/utils';

interface ProgressBarProps {
  current: number;
  total: number;
  label?: string;
  className?: string;
  showPercentage?: boolean;
}

export function ProgressBar({
  current,
  total,
  label,
  className,
  showPercentage = true,
}: ProgressBarProps) {
  const percentage = Math.round((current / total) * 100);

  return (
    <div className={cn('flex flex-col gap-2', className)}>
      {(label || showPercentage) && (
        <div className='flex items-center justify-between'>
          {label && <span className='text-sm font-medium text-sophia-text'>{label}</span>}
          {showPercentage && <span className='text-sm text-sophia-muted'>{percentage}%</span>}
        </div>
      )}
      <div className='h-2 w-full overflow-hidden rounded-full bg-gray-200'>
        <div
          className='h-full bg-gradient-to-r from-sophia-secondary to-sophia-secondary transition-all duration-300'
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
