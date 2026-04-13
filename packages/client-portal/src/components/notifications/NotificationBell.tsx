'use client';

import React, { useEffect, useState } from 'react';
import { Bell } from 'lucide-react';
import { useNotifications } from '@/hooks/useNotifications';
import { NotificationList } from './NotificationList';

export function NotificationBell() {
  const [isOpen, setIsOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const { listNotifications } = useNotifications();

  useEffect(() => {
    loadNotifications();
    const interval = setInterval(loadNotifications, 30000);
    return () => clearInterval(interval);
  }, []);

  const loadNotifications = async () => {
    try {
      const notifications = await listNotifications();
      const unread = notifications.filter((n) => !n.isRead).length;
      setUnreadCount(unread);
    } catch (error) {
      console.error('Failed to load notifications:', error);
    }
  };

  return (
    <div className='relative'>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className='relative p-2 text-sophia-text hover:bg-sophia-bg rounded-lg'
        aria-label='Notifications'
      >
        <Bell className='h-6 w-6' />
        {unreadCount > 0 && (
          <span className='absolute top-0 right-0 h-5 w-5 rounded-full bg-sophia-danger text-white text-xs flex items-center justify-center font-bold'>
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className='absolute right-0 mt-2 w-80 rounded-lg border border-gray-200 bg-white shadow-lg z-50'>
          <NotificationList onClose={() => setIsOpen(false)} onNotificationsUpdated={loadNotifications} />
        </div>
      )}
    </div>
  );
}
