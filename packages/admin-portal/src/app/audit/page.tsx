'use client';

import React from 'react';
import { AuditLogViewer } from '@/components/AuditLogViewer';

export default function AuditPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Audit Log</h1>
        <p className="text-gray-600 mt-1">
          Bekijk alle systeemactiviteiten en wijzigingen
        </p>
      </div>

      <AuditLogViewer />
    </div>
  );
}
