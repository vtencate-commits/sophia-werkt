'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import type { MessageInfo } from '@sophia-werkt/shared';
import { useMessages } from '@/hooks/useMessages';
import { MessageThread } from '@/components/messages/MessageThread';
import { MessageInput } from '@/components/messages/MessageInput';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';

export default function MessagesPage() {
  const params = useParams();
  const caseId = params.id as string;
  const { listMessages, isLoading } = useMessages(caseId);
  const [messages, setMessages] = useState<MessageInfo[]>([]);

  useEffect(() => {
    loadMessages();
    const interval = setInterval(loadMessages, 10000);
    return () => clearInterval(interval);
  }, [caseId]);

  const loadMessages = async () => {
    try {
      const data = await listMessages();
      setMessages(data);
    } catch (error) {
      console.error('Failed to load messages:', error);
    }
  };

  const handleMessageSent = () => {
    loadMessages();
  };

  return (
    <div className='container py-8'>
      <h1 className='text-3xl font-bold text-sophia-text mb-6'>Correspondentie</h1>

      <div className='card p-6'>
        {isLoading ? (
          <div className='flex items-center justify-center min-h-96'>
            <LoadingSpinner />
          </div>
        ) : (
          <div className='space-y-6'>
            <MessageThread
              caseId={caseId}
              messages={messages}
              onMessagesUpdate={() => loadMessages()}
            />

            <div className='border-t border-gray-200 pt-6'>
              <MessageInput
                caseId={caseId}
                onMessageSent={handleMessageSent}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
