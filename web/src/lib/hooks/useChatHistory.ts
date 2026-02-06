import { useState, useEffect, useCallback } from 'react';
import { getConversations, deleteConversation } from '@/lib/api/chat';
import { ConversationSummary, ApiError } from '@/types/chat';

interface UseChatHistoryProps {
  token: string;
  autoFetch?: boolean;
}

interface UseChatHistoryReturn {
  conversations: ConversationSummary[];
  isLoading: boolean;
  error: string | null;
  fetchConversations: () => Promise<void>;
  refreshConversations: () => Promise<void>;
  deleteConversation: (conversationId: string) => Promise<void>;
}

/**
 * T026-T029: Hook for managing conversation history state
 *
 * Provides state and methods for fetching and managing conversation list
 */
export function useChatHistory({
  token,
  autoFetch = true,
}: UseChatHistoryProps): UseChatHistoryReturn {
  // T027: State management
  const [conversations, setConversations] = useState<ConversationSummary[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // T028: Fetch conversations method
  const fetchConversations = useCallback(async () => {
    if (!token) {
      setError('Authentication token required');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await getConversations(token, 50, 0);
      setConversations(response.conversations);
    } catch (err) {
      const apiError = err as ApiError;
      setError(apiError.message || 'Failed to load conversations');
      console.error('Error fetching conversations:', err);
    } finally {
      setIsLoading(false);
    }
  }, [token]);

  // T029: Refresh conversations method
  const refreshConversations = useCallback(async () => {
    await fetchConversations();
  }, [fetchConversations]);

  // Delete conversation method
  const handleDeleteConversation = useCallback(async (conversationId: string) => {
    if (!token) {
      setError('Authentication token required');
      return;
    }

    try {
      await deleteConversation(conversationId, token);
      // Remove from local state immediately (optimistic update)
      setConversations(prev => prev.filter(c => c.conversation_id !== conversationId));
    } catch (err) {
      const apiError = err as ApiError;
      setError(apiError.message || 'Failed to delete conversation');
      // Refresh to get accurate state
      await fetchConversations();
    }
  }, [token, fetchConversations]);

  // Auto-fetch on mount if enabled
  useEffect(() => {
    if (autoFetch && token) {
      fetchConversations();
    }
  }, [autoFetch, token, fetchConversations]);

  return {
    conversations,
    isLoading,
    error,
    fetchConversations,
    refreshConversations,
    deleteConversation: handleDeleteConversation,
  };
}
