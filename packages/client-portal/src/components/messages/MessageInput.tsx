'use client';

import React, { useState } from 'react';
import { SendIcon, Loader } from 'lucide-react';
import { useMessages } from '@/hooks/useMessages';

interface MessageInputProps {
  caseId: string;
  onMessageSent?: () => void;
  disabled?: boolean;
}

export function MessageInput({ caseId, onMessageSent, disabled }: MessageInputProps) {
  const [message, setMessage] = useState('');
  const { sendMessage, isLoading } = useMessages(caseId);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!message.trim() || isLoading) return;

    try {
      await sendMessage({ body: message.trim() });
      setMessage('');
      onMessageSent?.();
    } catch (error) {
      console.error('Failed to send message:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className='flex gap-2'>
      <input
        type='text'
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder='Typ uw bericht...'
        disabled={disabled || isLoading}
        className='flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sophia-secondary'
      />
      <button
        type='submit'
        disabled={!message.trim() || disabled || isLoading}
        className='flex items-center gap-2 px-4 py-2 bg-sophia-secondary text-white rounded-lg hover:bg-opacity-90 disabled:opacity-50'
      >
        {isLoading ? (
          <Loader className='h-4 w-4 animate-spin' />
        ) : (
          <SendIcon className='h-4 w-4' />
        )}
      </button>
    </form>
  );
}
