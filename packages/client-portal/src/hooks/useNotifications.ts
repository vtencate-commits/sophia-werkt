'use client';

import { useCallback, useState } from 'react';
import type { NotificationInfo } from '@sophia-werkt/shared';
import { fetchApiClient } from '@/lib/api';

export function useNotifications() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const listNotifications = useCallback(async (unreadOnly: boolean = false): Promise<NotificationInfo[]> => {
    setIsLoading(true);
    setError(null);
    try {
      const endpoint = unreadOnly ? '/notifications?unread=true' : '/notifications';
      return await fetchApiClient<NotificationInfo[]>(endpoint);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to load notifications';
      setError(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const markAsRead = useCallback(async (notificationId: string): Promise<void> => {
    setError(null);
    try {
      await fetchApiClient(`/notifications/${notificationId}/read`, {
        method: 'PATCH',
      });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to mark as read';
      setError(message);
      throw err;
    }
  }, []);

  const markAllAsRead = useCallback(async (): Promise<void> => {
    setError(null);
    try {
      await fetchApiClient('/notifications/read-all', {
        method: 'PATCH',
      });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to mark all as read';
      setError(message);
      throw err;
    }
  }, []);

  return { listNotifications, markAsRead, markAllAsRead, isLoading, error };
}
