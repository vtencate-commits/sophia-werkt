'use client';

import React, { useEffect, useState } from 'react';
import type { NotificationInfo } from '@sophia-werkt/shared';
import { useNotifications } from '@/hooks/useNotifications';
import { formatDate } from '@/lib/utils';
import { LoadingSpinner } from '../ui/LoadingSpinner';

interface NotificationListProps {
  onClose?: () => void;
  onNotificationsUpdated?: () => void;
}

const notificationIcons: Record<string, string> = {
  new_message: '💬',
  status_change: '🔄',
  advice_ready: '📄',
  document_uploaded: '📎',
  invoice_sent: '💳',
  case_assigned: '👤',
};

export function NotificationList({ onClose, onNotificationsUpdated }: NotificationListProps) {
  const [notifications, setNotifications] = useState<NotificationInfo[]>([]);
  const { listNotifications, markAsRead, markAllAsRead, isLoading } = useNotifications();

  useEffect(() => {
    loadNotifications();
  }, []);

  const loadNotifications = async () => {
    try {
      const data = await listNotifications();
      setNotifications(data);
    } catch (error) {
      console.error('Failed to load notifications:', error);
    }
  };

  const handleMarkAsRead = async (notificationId: string) => {
    try {
      await markAsRead(notificationId);
      setNotifications((prev) =>
        prev.map((n) => (n.id === notificationId ? { ...n, isRead: true } : n))
      );
      onNotificationsUpdated?.();
    } catch (error) {
      console.error('Failed to mark as read:', error);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await markAllAsRead();
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
      onNotificationsUpdated?.();
    } catch (error) {
      console.error('Failed to mark all as read:', error);
    }
  };

  if (isLoading) {
    return (
      <div className='p-8'>
        <LoadingSpinner />
      </div>
    );
  }

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <div className='max-h-96 flex flex-col'>
      <div className='flex items-center justify-between border-b border-gray-200 p-4'>
        <h3 className='font-semibold text-sophia-text'>Meldingen</h3>
        {unreadCount > 0 && (
          <button
            onClick={handleMarkAllAsRead}
            className='text-xs text-sophia-secondary hover:underline'
          >
            Alles gelezen
          </button>
        )}
      </div>

      <div className='flex-1 overflow-y-auto'>
        {notifications.length === 0 ? (
          <div className='p-8 text-center'>
            <p className='text-sophia-muted'>Geen meldingen</p>
          </div>
        ) : (
          <div className='divide-y divide-gray-200'>
            {notifications.map((notification) => (
              <div
                key={notification.id}
                className={`p-4 hover:bg-sophia-bg cursor-pointer transition-colors ${
                  !notification.isRead ? 'bg-blue-50' : ''
                }`}
                onClick={() => !notification.isRead && handleMarkAsRead(notification.id)}
              >
                <div className='flex items-start gap-3'>
                  <span className='text-lg'>
                    {notificationIcons[notification.type] || '🔔'}
                  </span>
                  <div className='flex-1 min-w-0'>
                    <p className='font-medium text-sophia-text'>{notification.title}</p>
                    <p className='text-sm text-sophia-muted mt-1'>{notification.body}</p>
                    <p className='text-xs text-sophia-muted mt-2'>
                      {formatDate(notification.createdAt, 'long')}
                    </p>
                  </div>
                  {!notification.isRead && (
                    <div className='h-2 w-2 rounded-full bg-sophia-secondary flex-shrink-0 mt-2' />
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className='border-t border-gray-200 p-4'>
        <button
          onClick={onClose}
          className='text-sm text-sophia-secondary hover:underline'
        >
          Alles sluiten
        </button>
      </div>
    </div>
  );
}
