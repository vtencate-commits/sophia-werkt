'use client';

import React from 'react';
import type { CaseStatus } from '@sophia-werkt/shared';
import { cn } from '@/lib/utils';

interface StatusIndicatorProps {
  status: CaseStatus;
  variant?: 'badge' | 'dot';
  className?: string;
}

const statusConfig: Record<CaseStatus, { label: string; color: string; bgColor: string }> = {
  INTAKE: { label: 'Intake', color: 'text-blue-800', bgColor: 'bg-blue-100' },
  DOCUMENTS_RECEIVED: { label: 'Documenten ontvangen', color: 'text-indigo-800', bgColor: 'bg-indigo-100' },
  AI_ANALYSIS_PENDING: { label: 'AI-analyse in afwachting', color: 'text-yellow-800', bgColor: 'bg-yellow-100' },
  AI_ANALYSIS_COMPLETE: { label: 'AI-analyse voltooid', color: 'text-green-800', bgColor: 'bg-green-100' },
  LAWYER_REVIEW: { label: 'Advocatenbeoordeling', color: 'text-purple-800', bgColor: 'bg-purple-100' },
  ADVICE_DRAFT: { label: 'Advies concept', color: 'text-purple-800', bgColor: 'bg-purple-100' },
  ADVICE_FINAL: { label: 'Definitief advies', color: 'text-green-800', bgColor: 'bg-green-100' },
  DELIVERED: { label: 'Afgeleverd', color: 'text-green-800', bgColor: 'bg-green-100' },
  FOLLOW_UP: { label: 'Vervolgstap', color: 'text-blue-800', bgColor: 'bg-blue-100' },
  CLOSED: { label: 'Gesloten', color: 'text-gray-800', bgColor: 'bg-gray-100' },
  ARCHIVED: { label: 'Gearchiveerd', color: 'text-gray-600', bgColor: 'bg-gray-100' },
};

export function StatusIndicator({ status, variant = 'badge', className }: StatusIndicatorProps) {
  const config = statusConfig[status];

  if (variant === 'dot') {
    return (
      <div className={cn('inline-flex items-center gap-2', className)}>
        <div className={cn('h-3 w-3 rounded-full', config.bgColor)} />
        <span className='text-sm text-sophia-text'>{config.label}</span>
      </div>
    );
  }

  return (
    <span className={cn('inline-block rounded-full px-3 py-1 text-sm font-medium', config.bgColor, config.color, className)}>
      {config.label}
    </span>
  );
}
