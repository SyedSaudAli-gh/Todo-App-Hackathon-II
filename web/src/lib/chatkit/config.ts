/**
 * ChatKit Configuration
 * T057-T059: Configure ChatKit with custom API adapter and authentication
 */

import { chatKitAdapter } from './adapter';

/**
 * T057: ChatKit configuration object
 * Configures ChatKit to use our custom FastAPI adapter
 */
export interface ChatKitConfig {
  apiAdapter: typeof chatKitAdapter;
  theme?: {
    primaryColor?: string;
    backgroundColor?: string;
    textColor?: string;
  };
  placeholder?: string;
  maxMessageLength?: number;
}

/**
 * T058: Configure ChatKit with custom API adapter
 * Returns configuration object for ChatKit initialization
 */
export function getChatKitConfig(token: string): ChatKitConfig {
  return {
    apiAdapter: chatKitAdapter,
    theme: {
      primaryColor: '#3B82F6', // Blue-500
      backgroundColor: '#F9FAFB', // Gray-50
      textColor: '#111827', // Gray-900
    },
    placeholder: 'Type your message here...',
    maxMessageLength: 5000,
  };
}

/**
 * T059: ChatKit authentication configuration
 * Injects JWT token into ChatKit requests
 */
export interface ChatKitAuthConfig {
  token: string;
  onTokenExpired?: () => void;
}

export function getChatKitAuthConfig(
  token: string,
  onTokenExpired?: () => void
): ChatKitAuthConfig {
  return {
    token,
    onTokenExpired: onTokenExpired || (() => {
      // Default: Redirect to login
      if (typeof window !== 'undefined') {
        window.location.href = '/login';
      }
    }),
  };
}

/**
 * Default ChatKit configuration
 * Used when no custom configuration is provided
 */
export const defaultChatKitConfig: Partial<ChatKitConfig> = {
  theme: {
    primaryColor: '#3B82F6',
    backgroundColor: '#F9FAFB',
    textColor: '#111827',
  },
  placeholder: 'Ask me anything about your todos...',
  maxMessageLength: 5000,
};
