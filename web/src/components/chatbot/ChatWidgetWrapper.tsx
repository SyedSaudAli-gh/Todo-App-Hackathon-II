/**
 * ChatWidgetWrapper Component
 * T099-T105: Global chat widget integration with authentication
 */

'use client';

import React, { useEffect, useState } from 'react';
import { ChatWidget } from '@/components/chatbot/ChatWidget';
import { getJwtToken } from '@/lib/auth/jwt-manager';

/**
 * T099: Wrapper component to handle authentication for ChatWidget
 * Only renders ChatWidget when user is authenticated
 */
export function ChatWidgetWrapper() {
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadToken = async () => {
      try {
        const jwtToken = await getJwtToken();
        if (!jwtToken) {
          setError('Please log in to use the chat assistant');
        }
        setToken(jwtToken);
      } catch (error) {
        console.error('Failed to load JWT token for chat widget:', error);
        setError('Unable to initialize chat. Please refresh the page.');
        setToken(null);
      } finally {
        setIsLoading(false);
      }
    };

    loadToken();
  }, []);

  // Display error message if token loading failed
  if (error) {
    return (
      <div className="fixed bottom-4 right-4 bg-red-50 border border-red-200 rounded-lg p-4 max-w-sm shadow-lg z-50">
        <p className="text-sm text-red-800">{error}</p>
      </div>
    );
  }

  // Don't render anything while loading or if no token
  if (isLoading || !token) {
    return null;
  }

  // T100: Render chat widget on all pages when authenticated
  return <ChatWidget token={token} />;
}
