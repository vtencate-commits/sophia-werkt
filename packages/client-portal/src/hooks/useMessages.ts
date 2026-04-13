'use client';

import { useCallback, useState } from 'react';
import type { MessageInfo, SendMessageRequest } from '@sophia-werkt/shared';
import { fetchApiClient } from '@/lib/api';

export function useMessages(caseId: string) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const listMessages = useCallback(async (): Promise<MessageInfo[]> => {
    setIsLoading(true);
    setError(null);
    try {
      return await fetchApiClient<MessageInfo[]>(`/cases/${caseId}/messages`);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to load messages';
      setError(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [caseId]);

  const sendMessage = useCallback(
    async (data: SendMessageRequest): Promise<MessageInfo> => {
      setIsLoading(true);
      setError(null);
      try {
        return await fetchApiClient<MessageInfo>(`/cases/${caseId}/messages`, {
          method: 'POST',
          body: JSON.stringify(data),
        });
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to send message';
        setError(message);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [caseId]
  );

  const markAsRead = useCallback(
    async (messageId: string): Promise<void> => {
      try {
        await fetchApiClient(`/cases/${caseId}/messages/${messageId}/read`, {
          method: 'PATCH',
        });
      } catch (err) {
        console.error('Failed to mark message as read:', err);
      }
    },
    [caseId]
  );

  return { listMessages, sendMessage, markAsRead, isLoading, error };
}
