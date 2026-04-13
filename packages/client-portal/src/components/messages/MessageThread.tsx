'use client';

import React, { useEffect } from 'react';
import type { MessageInfo } from '@sophia-werkt/shared';
import { formatDate, getInitials } from '@/lib/utils';
import { useMessages } from '@/hooks/useMessages';
import { useAuth } from '@/hooks/useAuth';

interface MessageThreadProps {
  caseId: string;
  messages: MessageInfo[];
  onMessagesUpdate?: (messages: MessageInfo[]) => void;
}

export function MessageThread({ caseId, messages, onMessagesUpdate: _onMessagesUpdate }: MessageThreadProps) {
  const { user } = useAuth();
  const { markAsRead } = useMessages(caseId);

  useEffect(() => {
    messages.forEach((msg) => {
      if (!msg.isRead && msg.senderId !== user?.id) {
        markAsRead(msg.id);
      }
    });
  }, [messages, user?.id, markAsRead]);

  return (
    <div className='space-y-4 max-h-96 overflow-y-auto'>
      {messages.length === 0 ? (
        <div className='card p-8 text-center'>
          <p className='text-sophia-muted'>Geen berichten</p>
        </div>
      ) : (
        messages.map((message) => {
          const isCurrentUser = message.senderId === user?.id;

          return (
            <div
              key={message.id}
              className={`flex gap-3 ${isCurrentUser ? 'flex-row-reverse' : ''}`}
            >
              <div className='flex-shrink-0'>
                <div className='flex h-10 w-10 items-center justify-center rounded-full bg-sophia-secondary text-sm font-semibold text-white'>
                  {getInitials(
                    message.senderName.split(' ')[0],
                    message.senderName.split(' ')[1] || ''
                  )}
                </div>
              </div>

              <div className={`flex-1 ${isCurrentUser ? 'text-right' : ''}`}>
                <div className='flex items-center gap-2 mb-1'>
                  <span className='font-medium text-sophia-text'>{message.senderName}</span>
                  <span className='text-xs text-sophia-muted'>{message.senderRole}</span>
                </div>

                <div
                  className={`inline-block rounded-lg p-3 ${
                    isCurrentUser
                      ? 'bg-sophia-secondary text-white'
                      : 'bg-sophia-bg text-sophia-text'
                  }`}
                >
                  <p className='text-sm'>{message.body}</p>
                </div>

                <p className='mt-1 text-xs text-sophia-muted'>
                  {formatDate(message.createdAt, 'long')}
                </p>
              </div>
            </div>
          );
        })
      )}
    </div>
  );
}
