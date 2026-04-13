'use client';

import React from 'react';

interface AdviesViewerProps {
  html: string;
  title?: string;
}

export function AdviesViewer({ html, title }: AdviesViewerProps) {
  return (
    <div className='card p-8'>
      {title && <h2 className='text-2xl font-bold text-sophia-text mb-6'>{title}</h2>}

      <div
        className='prose prose-sm max-w-none text-sophia-text'
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </div>
  );
}
