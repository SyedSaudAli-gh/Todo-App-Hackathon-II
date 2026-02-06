import { useState, useEffect, useCallback } from 'react';
import {
  sendMessage as apiSendMessage,
  getConversationHistory,
  getConversationMessages,
  createConversation as apiCreateConversation,
  handleApiError,
  isAuthError,
} from '@/lib/api/chat';
import { Message, ApiError, ToolCall } from '@/types/chat';
import { useTodoRefresh } from '@/contexts/TodoRefreshContext';

export interface UseChatOptions {
  conversationId: string | null;
  token: string;
}

export interface UseChatReturn {
  // State
  messages: Message[];
  isLoading: boolean;
  error: string | null;
  conversationId: string | null;
  toolExecutionStatus: string | null;
  isHistoryOpen: boolean;

  // Actions
  sendMessage: (message: string) => Promise<void>;
  clearError: () => void;
  resetConversation: () => void;
  toggleHistory: () => void;
  loadConversation: (id: string) => Promise<void>;
  createNewConversation: () => Promise<void>;

  // Status
  isInitialized: boolean;
}

/**
 * Helper function to check if tool calls contain todo-related operations
 */
function hasTodoToolCalls(toolCalls?: ToolCall[]): boolean {
  if (!toolCalls || toolCalls.length === 0) return false;

  const todoToolNames = ['create_task', 'update_task', 'delete_task', 'get_task', 'list_tasks'];
  return toolCalls.some(call => todoToolNames.includes(call.tool_name));
}

/**
 * Helper function to parse tool execution status from tool calls
 */
function parseToolStatus(toolCalls?: ToolCall[]): string | null {
  if (!toolCalls || toolCalls.length === 0) return null;

  const toolCall = toolCalls[0];
  const toolName = toolCall.tool_name;

  if (toolName.includes('create')) return 'Creating task...';
  if (toolName.includes('update')) return 'Updating task...';
  if (toolName.includes('delete')) return 'Deleting task...';
  if (toolName.includes('list')) return 'Loading tasks...';
  if (toolName.includes('get')) return 'Fetching task...';

  return 'Processing...';
}

/**
 * Custom hook for managing chat conversation state
 * T024-T030: Complete state management implementation
 */
export function useChat({ conversationId, token }: UseChatOptions): UseChatReturn {
  // T025: Conversation state management
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentConversationId, setCurrentConversationId] = useState<string | null>(conversationId);
  const [isInitialized, setIsInitialized] = useState(false);
  const [toolExecutionStatus, setToolExecutionStatus] = useState<string | null>(null);

  // T030: History panel state
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);

  // Get todo refresh trigger from context
  const { triggerRefresh } = useTodoRefresh();

  // T027: Load conversation history on mount
  useEffect(() => {
    if (conversationId && token) {
      loadConversationHistory(conversationId, token);
    } else {
      setIsInitialized(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [conversationId, token]);

  // Load conversation history from backend
  const loadConversationHistory = async (id: string, authToken: string) => {
    try {
      setIsLoading(true);
      const history = await getConversationHistory(id, authToken);

      // T069: Convert backend message format to frontend Message type
      const formattedMessages: Message[] = history.messages.map(msg => ({
        id: msg.id,
        role: msg.role,
        content: msg.content,
        timestamp: new Date(msg.timestamp),
        tool_calls: msg.tool_calls,
      }));

      setMessages(formattedMessages);
      setCurrentConversationId(id);
      setIsInitialized(true);
    } catch (err) {
      const apiError = err as ApiError;

      // T110: Handle auth errors - Note: Auth redirect handled by auth middleware
      if (isAuthError(apiError)) {
        // Auth errors will be handled by the authentication system
        setError('Authentication error. Please log in again.');
        setIsInitialized(true);
        return;
      }

      // T111: Handle 404 errors by starting new conversation
      if (apiError.status === 404) {
        setMessages([]);
        setCurrentConversationId(null);
        setIsInitialized(true);
        return;
      }

      // T029: Error state management
      setError(handleApiError(apiError));
      setIsInitialized(true);
    } finally {
      setIsLoading(false);
    }
  };

  // T026: Send message action
  const sendMessage = useCallback(async (message: string) => {
    try {
      // T030: Loading state management
      setIsLoading(true);
      setError(null);
      setToolExecutionStatus(null);

      // T028: Optimistic UI updates - Add user message immediately
      const userMessage: Message = {
        id: `temp-${Date.now()}`,
        role: 'user',
        content: message,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, userMessage]);

      console.log('🚀 useChat: Sending message:', message);

      // Call API with proper token
      const response = await apiSendMessage(message, token, currentConversationId);

      console.log('✅ useChat: Got response:', response);

      // Update conversation ID if new conversation
      if (!currentConversationId) {
        setCurrentConversationId(response.conversation_id);
      }

      // Parse tool execution status from response
      const status = parseToolStatus(response.tool_calls);
      if (status) {
        setToolExecutionStatus(status);
        // Clear status after 2 seconds
        setTimeout(() => setToolExecutionStatus(null), 2000);
      }

      // T092: Generate temporary message ID for optimistic message
      // Add assistant response
      const assistantMessage: Message = {
        id: `${Date.now()}`,
        role: 'assistant',
        content: response.response,
        timestamp: new Date(response.timestamp),
        tool_calls: response.tool_calls,
      };
      setMessages(prev => [...prev, assistantMessage]);

      // Check if response contains todo-related tool calls and trigger refresh
      if (hasTodoToolCalls(response.tool_calls)) {
        console.log('🔄 useChat: Todo tool calls detected, triggering refresh');
        triggerRefresh();
      }
    } catch (err) {
      const apiError = err as ApiError;

      // T093: Remove optimistic message on error
      // T112: Remove optimistic message on error
      setMessages(prev => prev.slice(0, -1));
      setError(handleApiError(apiError));
      setToolExecutionStatus(null);
    } finally {
      setIsLoading(false);
    }
  }, [currentConversationId, triggerRefresh, token]);

  // T109: Clear error action
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Reset conversation (start new)
  const resetConversation = useCallback(() => {
    setMessages([]);
    setCurrentConversationId(null);
    setError(null);
  }, []);

  // T031: Toggle history panel
  const toggleHistory = useCallback(() => {
    setIsHistoryOpen(prev => !prev);
  }, []);

  // T032: Load a specific conversation
  const loadConversation = useCallback(async (id: string) => {
    if (!token) {
      setError('Authentication token required');
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      // Fetch messages for the conversation
      const response = await getConversationMessages(id, token, 100, 0);

      // Convert to Message format
      const formattedMessages: Message[] = response.messages.map(msg => ({
        id: msg.message_id,
        role: msg.role,
        content: msg.message_text,
        timestamp: new Date(msg.timestamp),
      }));

      setMessages(formattedMessages);
      setCurrentConversationId(id);
      setIsHistoryOpen(false); // Close history panel after loading
    } catch (err) {
      const apiError = err as ApiError;
      setError(handleApiError(apiError));
    } finally {
      setIsLoading(false);
    }
  }, [token]);

  // T053: Create new conversation explicitly
  const createNewConversation = useCallback(async () => {
    if (!token) {
      setError('Authentication token required');
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      // Create new conversation via API
      const response = await apiCreateConversation(token);

      // Clear messages and set new conversation ID
      setMessages([]);
      setCurrentConversationId(response.conversation_id);
    } catch (err) {
      const apiError = err as ApiError;
      setError(handleApiError(apiError));
    } finally {
      setIsLoading(false);
    }
  }, [token]);

  return {
    messages,
    isLoading,
    error,
    conversationId: currentConversationId,
    toolExecutionStatus,
    isHistoryOpen,
    sendMessage,
    clearError,
    resetConversation,
    toggleHistory,
    loadConversation,
    createNewConversation,
    isInitialized,
  };
}
