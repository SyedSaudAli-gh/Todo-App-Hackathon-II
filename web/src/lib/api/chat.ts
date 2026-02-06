import {
  SendMessageRequest,
  SendMessageResponse,
  ApiError,
  ConversationHistoryResponse,
  ConversationListResponse,
  MessageListResponse,
} from '@/types/chat';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8001';

/**
 * Utility: Check if error is an authentication error
 */
export function isAuthError(error: ApiError): boolean {
  return error.status === 401;
}

/**
 * Utility: Format API errors into user-friendly messages
 * T048: Enhanced error handling with user-friendly messages
 */
export function handleApiError(error: ApiError): string {
  switch (error.status) {
    case 400:
      return error.message || 'Invalid request. Please check your message and try again.';
    case 401:
      return 'Authentication error. Please refresh the page and try again.';
    case 403:
      return 'You do not have permission to access this conversation.';
    case 404:
      return 'Conversation not found. Starting a new conversation.';
    case 422:
      return error.message || 'Invalid input. Please check your message format.';
    case 500:
      return error.message || 'Server error occurred. Please try again.';
    case 503:
      return 'Service temporarily unavailable. Please try again shortly.';
    case 0:
      return 'Unable to connect to the server. Please check your internet connection and try again.';
    default:
      return error.message || 'An unexpected error occurred. Please try again.';
  }
}

/**
 * Send a message to the AI assistant
 */
export async function sendMessage(
  message: string,
  token: string,
  conversationId?: string | null
): Promise<SendMessageResponse> {
  // T021: Request validation
  if (!message || message.trim().length === 0) {
    throw new Error('Message cannot be empty');
  }
  if (message.length > 5000) {
    throw new Error('Message too long (max 5000 characters)');
  }

  console.log('📤 SENDING MESSAGE:', message);
  console.log('📤 Conversation ID:', conversationId);
  console.log('📤 Token present:', !!token);

  // Build request body
  const requestBody: SendMessageRequest = {
    message: message.trim(),
  };

  if (conversationId) {
    requestBody.conversation_id = conversationId;
  }

  console.log('📤 Request body:', JSON.stringify(requestBody));

  try {
    console.log('📤 Calling API:', `${API_BASE_URL}/api/v1/chat`);
    const response = await fetch(`${API_BASE_URL}/api/v1/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(requestBody),
    });

    // Handle HTTP errors
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw {
        status: response.status,
        message: errorData.detail || `HTTP ${response.status}`,
        details: errorData,
      } as ApiError;
    }

    // Parse and return response
    const data: SendMessageResponse = await response.json();
    return data;
  } catch (error) {
    // T022: Error handling for network failures
    if ((error as ApiError).status) {
      throw error; // Re-throw ApiError
    }
    throw {
      status: 0,
      message: 'Network error: Unable to reach server',
      details: error,
    } as ApiError;
  }
}

/**
 * Get conversation history by ID
 */
export async function getConversationHistory(
  conversationId: string,
  token: string
): Promise<ConversationHistoryResponse> {
  // Validation
  if (!conversationId) {
    throw new Error('Conversation ID required');
  }
  if (!token) {
    throw new Error('Authentication token required');
  }

  try {
    const response = await fetch(
      `${API_BASE_URL}/api/v1/conversations/${conversationId}`,
      {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      }
    );

    // Handle HTTP errors
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw {
        status: response.status,
        message: errorData.detail || `HTTP ${response.status}`,
        details: errorData,
      } as ApiError;
    }

    // Parse and return response
    const data: ConversationHistoryResponse = await response.json();
    return data;
  } catch (error) {
    if ((error as ApiError).status) {
      throw error;
    }
    throw {
      status: 0,
      message: 'Network error: Unable to reach server',
      details: error,
    } as ApiError;
  }
}

/**
 * T023: Get all conversations for the authenticated user
 */
export async function getConversations(
  token: string,
  limit: number = 50,
  offset: number = 0
): Promise<ConversationListResponse> {
  // Validation
  if (!token) {
    throw new Error('Authentication token required');
  }

  try {
    const url = new URL(`${API_BASE_URL}/api/v1/conversations`);
    url.searchParams.append('limit', limit.toString());
    url.searchParams.append('offset', offset.toString());

    const response = await fetch(url.toString(), {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    // Handle HTTP errors
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw {
        status: response.status,
        message: errorData.detail || `HTTP ${response.status}`,
        details: errorData,
      } as ApiError;
    }

    // Parse and return response
    const data: ConversationListResponse = await response.json();
    return data;
  } catch (error) {
    if ((error as ApiError).status) {
      throw error;
    }
    throw {
      status: 0,
      message: 'Network error: Unable to reach server',
      details: error,
    } as ApiError;
  }
}

/**
 * T024: Get messages for a specific conversation
 */
export async function getConversationMessages(
  conversationId: string,
  token: string,
  limit: number = 100,
  offset: number = 0
): Promise<MessageListResponse> {
  // Validation
  if (!conversationId) {
    throw new Error('Conversation ID required');
  }
  if (!token) {
    throw new Error('Authentication token required');
  }

  try {
    const url = new URL(`${API_BASE_URL}/api/v1/conversations/${conversationId}/messages`);
    url.searchParams.append('limit', limit.toString());
    url.searchParams.append('offset', offset.toString());

    const response = await fetch(url.toString(), {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    // Handle HTTP errors
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw {
        status: response.status,
        message: errorData.detail || `HTTP ${response.status}`,
        details: errorData,
      } as ApiError;
    }

    // Parse and return response
    const data: MessageListResponse = await response.json();
    return data;
  } catch (error) {
    if ((error as ApiError).status) {
      throw error;
    }
    throw {
      status: 0,
      message: 'Network error: Unable to reach server',
      details: error,
    } as ApiError;
  }
}

/**
 * T052: Create a new conversation
 */
export async function createConversation(
  token: string
): Promise<{ conversation_id: string; created_at: string; updated_at: string }> {
  // Validation
  if (!token) {
    throw new Error('Authentication token required');
  }

  try {
    const response = await fetch(`${API_BASE_URL}/api/v1/conversations`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    // Handle HTTP errors
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw {
        status: response.status,
        message: errorData.detail || `HTTP ${response.status}`,
        details: errorData,
      } as ApiError;
    }

    // Parse and return response
    const data = await response.json();
    return data;
  } catch (error) {
    if ((error as ApiError).status) {
      throw error;
    }
    throw {
      status: 0,
      message: 'Network error: Unable to reach server',
      details: error,
    } as ApiError;
  }
}

/**
 * Delete a conversation
 */
export async function deleteConversation(
  conversationId: string,
  token: string
): Promise<void> {
  // Validation
  if (!conversationId) {
    throw new Error('Conversation ID required');
  }
  if (!token) {
    throw new Error('Authentication token required');
  }

  try {
    const response = await fetch(`${API_BASE_URL}/api/v1/conversations/${conversationId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    // Handle HTTP errors
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw {
        status: response.status,
        message: errorData.detail || `HTTP ${response.status}`,
        details: errorData,
      } as ApiError;
    }

    // 204 No Content - successful deletion
    return;
  } catch (error) {
    if ((error as ApiError).status) {
      throw error;
    }
    throw {
      status: 0,
      message: 'Network error: Unable to reach server',
      details: error,
    } as ApiError;
  }
}
