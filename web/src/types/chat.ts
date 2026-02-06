// Chat-related TypeScript types
// This file will be populated with interfaces during Phase 2 (Foundational)

export interface Message {
  id: string;
  role: 'user' | 'assistant' | 'tool';
  content: string;
  timestamp: Date;
  tool_calls?: ToolCall[];
  action?: string;  // Filter out if present
  tool_call?: any;  // Filter out if present
}

export interface ToolCall {
  tool_name: string;
  arguments: Record<string, any>;
  result: any;
}

export interface SendMessageRequest {
  conversation_id?: string | null;
  message: string;
}

export interface SendMessageResponse {
  conversation_id: string;
  response: string;
  tool_calls: ToolCall[];
  timestamp: string;
}

export interface ApiError {
  status: number;
  message: string;
  details?: any;
}

export interface ConversationMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  tool_calls?: ToolCall[];
}

export interface ConversationHistoryResponse {
  conversation_id: string;
  messages: ConversationMessage[];
  created_at: string;
  updated_at: string;
}

// T025: New types for conversation history feature
export interface ConversationSummary {
  conversation_id: string;
  created_at: string;
  updated_at: string;
  message_count: number;
  preview: string | null;
}

export interface ConversationListResponse {
  conversations: ConversationSummary[];
  total: number;
  limit: number;
  offset: number;
}

export interface MessageResponse {
  message_id: string;
  role: 'user' | 'assistant';
  message_text: string;
  timestamp: string;
}

export interface MessageListResponse {
  conversation_id: string;
  messages: MessageResponse[];
  total: number;
  limit: number;
  offset: number;
}
