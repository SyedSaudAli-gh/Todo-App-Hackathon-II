'use client';

import { History, Plus, X } from 'lucide-react';

interface ChatHeaderProps {
  onToggleHistory: () => void;
  onNewChat: () => void;
  onClose: () => void;
  showNewChatButton: boolean;
}

/**
 * T072-T082: ChatHeader component
 * Clean, uncluttered header with title and navigation controls
 */
export function ChatHeader({
  onToggleHistory,
  onNewChat,
  onClose,
  showNewChatButton,
}: ChatHeaderProps) {
  return (
    <div className="bg-white border-b shadow-sm flex justify-between items-center
      px-3 py-2
      sm:px-4 sm:py-2.5
      md:px-4 md:py-3">
      {/* T073: Title */}
      <h1 className="text-gray-900 font-semibold
        text-sm
        sm:text-base
        md:text-lg">
        AI Todo Assistant
      </h1>

      {/* T074-T076: Navigation buttons */}
      <div className="flex items-center gap-2">
        {/* T074: History button with icon */}
        <button
          onClick={onToggleHistory}
          className="bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium flex items-center gap-2
            px-2 py-1.5 text-xs
            sm:px-3 sm:py-1.5 sm:text-sm
            md:px-3 md:py-2 md:text-sm"
          aria-label="Toggle conversation history"
        >
          <History className="w-4 h-4 sm:w-4 sm:h-4 md:w-5 md:h-5" />
        </button>

        {/* T075: New Chat button with icon (only show if conversation exists) */}
        {showNewChatButton && (
          <button
            onClick={onNewChat}
            className="bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-medium flex items-center gap-2
              px-2 py-1.5 text-xs
              sm:px-3 sm:py-1.5 sm:text-sm
              md:px-3 md:py-2 md:text-sm"
            aria-label="Start new conversation"
          >
            <Plus className="w-4 h-4 sm:w-4 sm:h-4 md:w-5 md:h-5" />
          </button>
        )}

        {/* T076: Close button with icon */}
        <button
          onClick={onClose}
          className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors
            sm:p-2
            md:p-2"
          aria-label="Close chat"
        >
          <X className="w-5 h-5 sm:w-5 sm:h-5 md:w-6 md:h-6 text-gray-600" />
        </button>
      </div>
    </div>
  );
}
