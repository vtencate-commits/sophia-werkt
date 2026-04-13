'use client';

import React from 'react';
import Link from 'next/link';
import type { CaseSummary } from '@sophia-werkt/shared';
import { formatDate } from '@/lib/utils';
import { StatusIndicator } from '../ui/StatusIndicator';
import { MessageCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface DossierCardProps {
  dossier: CaseSummary;
  className?: string;
}

export function DossierCard({ dossier, className }: DossierCardProps) {
  return (
    <Link href={`/dossier/${dossier.id}`}>
      <div
        className={cn(
          'card group hover:shadow-md p-6 cursor-pointer transition-all hover:border-sophia-secondary',
          className
        )}
      >
        <div className='flex items-start justify-between gap-4'>
          <div className='flex-1 min-w-0'>
            <h3 className='font-semibold text-sophia-text group-hover:text-sophia-secondary transition-colors truncate'>
              {dossier.title}
            </h3>
            <p className='text-sm text-sophia-muted mt-1'>
              Ref: <span className='font-mono'>{dossier.referenceNumber}</span>
            </p>
          </div>
          <StatusIndicator status={dossier.status} />
        </div>

        <div className='mt-4 grid grid-cols-2 gap-4'>
          <div>
            <p className='text-xs text-sophia-muted uppercase tracking-wide'>Type</p>
            <p className='text-sm font-medium text-sophia-text mt-1'>{dossier.adviceType}</p>
          </div>
          <div>
            <p className='text-xs text-sophia-muted uppercase tracking-wide'>Advocaat</p>
            <p className='text-sm font-medium text-sophia-text mt-1'>
              {dossier.lawyerName || 'In toewijzing'}
            </p>
          </div>
        </div>

        <div className='mt-4 flex items-center justify-between border-t border-gray-200 pt-4'>
          <span className='text-xs text-sophia-muted'>
            {formatDate(dossier.createdAt, 'short')}
          </span>
          {dossier.unreadMessages > 0 && (
            <div className='flex items-center gap-1 rounded-full bg-sophia-secondary bg-opacity-10 px-2 py-1 text-xs font-medium text-sophia-secondary'>
              <MessageCircle className='h-3 w-3' />
              {dossier.unreadMessages}
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}
