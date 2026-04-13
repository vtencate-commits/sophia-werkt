'use client';

import React, { useState } from 'react';
import { PlatformStats } from '@/components/PlatformStats';
import { apiGet } from '@/lib/api';
import { formatDateTime } from '@/lib/utils';

interface Activity {
  id: string;
  timestamp: string;
  user: string;
  action: string;
  description: string;
}

export default function DashboardPage() {
  const [recentActivity, setRecentActivity] = useState<Activity[]>([]);
  const [isLoadingActivity, setIsLoadingActivity] = useState(true);
  const [refreshTrigger, setRefreshTrigger] = React.useState(0);

  React.useEffect(() => {
    loadRecentActivity();
  }, []);

  const loadRecentActivity = async () => {
    try {
      setIsLoadingActivity(true);
      const data = await apiGet<{ activities: Activity[] }>(
        '/admin/activities?limit=10'
      );
      setRecentActivity(data.activities);
    } catch (err) {
      console.error('Failed to load recent activity:', err);
    } finally {
      setIsLoadingActivity(false);
    }
  };

  const handleRefresh = () => {
    setRefreshTrigger((prev) => prev + 1);
    loadRecentActivity();
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-1">
            Welkom terug op het Sophia Werkt Admin Portal
          </p>
        </div>
        <button
          onClick={handleRefresh}
          className="sophia-btn-primary"
        >
          Vernieuwen
        </button>
      </div>

      {/* Stats */}
      <section>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          Platform Statistieken
        </h2>
        <PlatformStats refreshTrigger={refreshTrigger} />
      </section>

      {/* Recent Activity */}
      <section className="sophia-card p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900">
            Recente activiteit
          </h2>
          <button
            onClick={loadRecentActivity}
            className="sophia-btn sophia-btn-secondary text-sm"
          >
            Vernieuwen
          </button>
        </div>

        {isLoadingActivity ? (
          <div className="flex items-center justify-center py-8">
            Laden...
          </div>
        ) : recentActivity.length > 0 ? (
          <div className="space-y-4">
            {recentActivity.map((activity) => (
              <div
                key={activity.id}
                className="flex items-start space-x-4 pb-4 border-b border-gray-200 last:border-0"
              >
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                  <span className="text-lg">📝</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-900">
                    {activity.action}
                  </p>
                  <p className="text-sm text-gray-600">
                    {activity.description}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    door {activity.user} op{' '}
                    {formatDateTime(activity.timestamp)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            Geen recente activiteit
          </div>
        )}
      </section>

      {/* Quick Links */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <a
          href="/gebruikers"
          className="sophia-card p-6 hover:shadow-md transition-shadow cursor-pointer"
        >
          <div className="text-3xl mb-3">👥</div>
          <h3 className="font-semibold text-gray-900 mb-1">Gebruikers</h3>
          <p className="text-sm text-gray-600">
            Beheer advocaten en admins
          </p>
        </a>
        <a
          href="/tarieven"
          className="sophia-card p-6 hover:shadow-md transition-shadow cursor-pointer"
        >
          <div className="text-3xl mb-3">💰</div>
          <h3 className="font-semibold text-gray-900 mb-1">Tarieven</h3>
          <p className="text-sm text-gray-600">
            Configureer prijzen
          </p>
        </a>
        <a
          href="/facturatie"
          className="sophia-card p-6 hover:shadow-md transition-shadow cursor-pointer"
        >
          <div className="text-3xl mb-3">📄</div>
          <h3 className="font-semibold text-gray-900 mb-1">Facturatie</h3>
          <p className="text-sm text-gray-600">
            Bekijk alle facturen
          </p>
        </a>
        <a
          href="/audit"
          className="sophia-card p-6 hover:shadow-md transition-shadow cursor-pointer"
        >
          <div className="text-3xl mb-3">🔍</div>
          <h3 className="font-semibold text-gray-900 mb-1">Audit Log</h3>
          <p className="text-sm text-gray-600">
            Bekijk activiteitenlog
          </p>
        </a>
      </section>
    </div>
  );
}
