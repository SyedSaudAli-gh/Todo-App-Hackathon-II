'use client';

import { ConversationSummary } from '@/types/chat';
import { ConversationList } from './ConversationList';
import { X } from 'lucide-react';

interface HistoryPanelProps {
  conversations: ConversationSummary[];
  currentConversationId: string | null;
  isOpen: boolean;
  isLoading: boolean;
  onSelectConversation: (id: string) => void;
  onDeleteConversation: (id: string) => void;
  onClose: () => void;
}

/**
 * T033: HistoryPanel component
 * Displays a slide-in panel with conversation history and delete functionality
 */
export function HistoryPanel({
  conversations,
  currentConversationId,
  isOpen,
  isLoading,
  onSelectConversation,
  onDeleteConversation,
  onClose,
}: HistoryPanelProps) {
  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/20 z-40"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* T038: Slide-in panel with Tailwind transitions */}
      <div
        className={`
          fixed top-0 left-0 h-full w-80 bg-white shadow-xl z-50
          transform transition-transform duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-semibold text-gray-900">
            Conversation History
          </h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
            aria-label="Close history panel"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto h-[calc(100vh-64px)]">
          {/* T040: Loading skeleton */}
          {isLoading && (
            <div className="p-4 space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="animate-pulse">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </div>
              ))}
            </div>
          )}

          {/* T039: Empty state */}
          {!isLoading && conversations.length === 0 && (
            <div className="flex flex-col items-center justify-center h-64 text-center px-4">
              <div className="text-gray-400 mb-2">
                <svg
                  className="w-16 h-16 mx-auto"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                  />
                </svg>
              </div>
              <p className="text-gray-600 font-medium">No conversations yet</p>
              <p className="text-gray-500 text-sm mt-1">
                Start a conversation to see it here
              </p>
            </div>
          )}

          {/* Conversation list */}
          {!isLoading && conversations.length > 0 && (
            <ConversationList
              conversations={conversations}
              currentConversationId={currentConversationId}
              onSelect={onSelectConversation}
              onDelete={onDeleteConversation}
            />
          )}
        </div>
      </div>
    </>
  );
}
