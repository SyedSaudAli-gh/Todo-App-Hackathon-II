/**
 * ChatKit API Adapter for FastAPI Backend
 * T053-T056: Custom adapter to connect ChatKit to our FastAPI backend
 *
 * This adapter translates between ChatKit's expected API format and our FastAPI backend.
 */

import { sendMessage as apiSendMessage, getConversationHistory } from '@/lib/api/chat';
import { ApiError } from '@/types/chat';

export interface ChatKitMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export interface ChatKitSendMessageOptions {
  message: string;
  conversationId?: string | null;
  token: string;
}

export interface ChatKitSendMessageResponse {
  id: string;
  role: 'assistant';
  content: string;
  conversationId: string;
  timestamp: Date;
}

/**
 * T054: Send message function for ChatKit adapter
 * Translates ChatKit message format to FastAPI format
 */
export async function sendMessage(
  options: ChatKitSendMessageOptions
): Promise<ChatKitSendMessageResponse> {
  try {
    const response = await apiSendMessage(
      options.message,
      options.token,
      options.conversationId
    );

    // Transform FastAPI response to ChatKit format
    return {
      id: `${Date.now()}`, // Generate temporary ID
      role: 'assistant',
      content: response.response,
      conversationId: response.conversation_id,
      timestamp: new Date(response.timestamp),
    };
  } catch (error) {
    throw error;
  }
}

/**
 * T055: Get conversation history function for ChatKit adapter
 * Retrieves and formats conversation history for ChatKit
 */
export async function getHistory(
  conversationId: string,
  token: string
): Promise<ChatKitMessage[]> {
  try {
    const history = await getConversationHistory(conversationId, token);

    // Transform FastAPI message format to ChatKit format
    return history.messages.map(msg => ({
      id: msg.id,
      role: msg.role as 'user' | 'assistant',
      content: msg.content,
      timestamp: new Date(msg.timestamp),
    }));
  } catch (error) {
    throw error;
  }
}

/**
 * T056: Error handling for ChatKit adapter
 * Provides user-friendly error messages for ChatKit
 */
export function handleChatKitError(error: unknown): string {
  if ((error as ApiError).status !== undefined) {
    const apiError = error as ApiError;

    switch (apiError.status) {
      case 0:
        return 'Unable to connect to the chat service. Please check your internet connection.';
      case 401:
        return 'Your session has expired. Please refresh the page and log in again.';
      case 403:
        return 'You do not have permission to access this conversation.';
      case 404:
        return 'Conversation not found. Starting a new conversation.';
      case 500:
        return 'The chat service is temporarily unavailable. Please try again in a moment.';
      default:
        return apiError.message || 'An error occurred while processing your message.';
    }
  }

  if (error instanceof Error) {
    return error.message;
  }

  return 'An unexpected error occurred. Please try again.';
}

/**
 * ChatKit Adapter Configuration
 * Exports adapter functions for use with ChatKit components
 */
export const chatKitAdapter = {
  sendMessage,
  getHistory,
  handleError: handleChatKitError,
};
