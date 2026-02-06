'use client';

import { useChat } from '@/lib/hooks/useChat';
import { useChatHistory } from '@/lib/hooks/useChatHistory';
import { MessageList } from './MessageList';
import { MessageInput } from './MessageInput';
import { LoadingIndicator } from './LoadingIndicator';
import { HistoryPanel } from './HistoryPanel';
import { ChatHeader } from './ChatHeader';

/**
 * Map technical errors to user-friendly messages
 */
function mapErrorToUserFriendly(error: string): string {
  // Map to user-friendly messages
  if (error.toLowerCase().includes('network')) {
    return 'Unable to connect. Please check your internet connection.';
  }
  if (error.includes('500')) {
    return 'Something went wrong. Please try again.';
  }
  if (error.includes('401') || error.toLowerCase().includes('unauthorized')) {
    return 'Your session has expired. Please sign in again.';
  }
  if (error.toLowerCase().includes('timeout')) {
    return 'The request took too long. Please try again.';
  }
  // Generic fallback
  return 'An unexpected error occurred. Please try again.';
}

interface ChatContainerProps {
  token: string;
  conversationId: string | null;
  onClose: () => void;
}

/**
 * ChatContainer Component
 * T043-T048: Main chat interface container
 * T125: Add "New Conversation" button
 * T036-T037: Integrate history panel
 */
export function ChatContainer({ token, conversationId, onClose }: ChatContainerProps) {
  // T043: Integrate useChat hook
  const {
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
    isInitialized,
  } = useChat({ conversationId, token });

  // T037: Integrate useChatHistory hook
  const {
    conversations,
    isLoading: isHistoryLoading,
    fetchConversations,
    deleteConversation: deleteConversationFromHistory,
  } = useChatHistory({ token, autoFetch: false });

  // T045: Implement handleSendMessage callback
  const handleSendMessage = async (message: string) => {
    await sendMessage(message);
  };

  // T037: Handle history panel open - fetch conversations
  const handleToggleHistory = () => {
    if (!isHistoryOpen) {
      fetchConversations();
    }
    toggleHistory();
  };

  // T037: Handle conversation selection
  const handleSelectConversation = async (id: string) => {
    await loadConversation(id);
  };

  // Handle conversation deletion
  const handleDeleteConversation = async (id: string) => {
    await deleteConversationFromHistory(id);

    // If the deleted conversation is the current one, reset to new conversation
    if (id === currentConversationId) {
      resetConversation();
    }
  };

  if (!isInitialized) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading conversation...</p>
        </div>
      </div>
    );
  }

  // T048: Connect MessageList, MessageInput, LoadingIndicator
  return (
    <div className="flex flex-col h-full bg-gray-50">
      {/* T078: Replace existing header with ChatHeader component */}
      <ChatHeader
        onToggleHistory={handleToggleHistory}
        onNewChat={resetConversation}
        onClose={onClose}
        showNewChatButton={!!currentConversationId}
      />

      {/* Error Display - responsive with user-friendly messages */}
      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 mx-2 mt-2
          p-3
          sm:mx-3 sm:mt-3 sm:p-3
          md:mx-4 md:mt-4 md:p-4">
          <div className="flex items-center justify-between gap-2">
            <p className="text-red-700 flex-1
              text-xs
              sm:text-sm
              md:text-sm">{mapErrorToUserFriendly(error)}</p>
            <button
              onClick={clearError}
              className="text-red-500 hover:text-red-700 font-medium whitespace-nowrap
                text-xs
                sm:text-sm
                md:text-sm"
            >
              Dismiss
            </button>
          </div>
        </div>
      )}

      {/* Messages - responsive scrolling */}
      <MessageList messages={messages} />

      {/* Loading Indicator with tool execution status */}
      {isLoading && <LoadingIndicator status={toolExecutionStatus || undefined} />}

      {/* Input - responsive */}
      <MessageInput onSend={handleSendMessage} disabled={isLoading} />

      {/* T037: History Panel */}
      <HistoryPanel
        conversations={conversations}
        currentConversationId={currentConversationId}
        isOpen={isHistoryOpen}
        isLoading={isHistoryLoading}
        onSelectConversation={handleSelectConversation}
        onDeleteConversation={handleDeleteConversation}
        onClose={toggleHistory}
      />
    </div>
  );
}
