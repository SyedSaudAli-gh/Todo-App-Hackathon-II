'use client';

import { ConversationSummary } from '@/types/chat';
import { formatDistanceToNow } from 'date-fns';
import { Trash2 } from 'lucide-react';
import { useState } from 'react';

interface ConversationItemProps {
  conversation: ConversationSummary;
  isActive: boolean;
  onClick: () => void;
  onDelete: (conversationId: string) => void;
}

/**
 * T035: ConversationItem component
 * Displays a single conversation in the history list with delete functionality
 */
export function ConversationItem({
  conversation,
  isActive,
  onClick,
  onDelete,
}: ConversationItemProps) {
  const [showConfirm, setShowConfirm] = useState(false);

  // T043: Format timestamp as relative time
  const relativeTime = formatDistanceToNow(new Date(conversation.updated_at), {
    addSuffix: true,
  });

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent triggering onClick
    if (showConfirm) {
      onDelete(conversation.conversation_id);
      setShowConfirm(false);
    } else {
      setShowConfirm(true);
    }
  };

  const handleCancel = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowConfirm(false);
  };

  return (
    <div
      className={`
        relative w-full text-left p-4 hover:bg-gray-50 transition-colors group
        ${isActive ? 'bg-blue-50 border-l-4 border-blue-500' : ''}
      `}
    >
      <button
        onClick={onClick}
        className="w-full text-left"
        aria-label={`Load conversation from ${relativeTime}`}
      >
        {/* T042: Preview text (first 100 chars) */}
        <div className="mb-1 pr-8">
          <p className={`text-sm line-clamp-2 ${isActive ? 'text-blue-900 font-medium' : 'text-gray-900'}`}>
            {conversation.preview || 'New conversation'}
          </p>
        </div>

        {/* T043: Timestamp and message count */}
        <div className="flex items-center justify-between text-xs text-gray-500">
          <span>{relativeTime}</span>
          <span>{conversation.message_count} messages</span>
        </div>
      </button>

      {/* Delete button - shows on hover */}
      {!showConfirm && (
        <button
          onClick={handleDelete}
          className="absolute top-4 right-4 p-1.5 rounded-lg opacity-0 group-hover:opacity-100 hover:bg-red-100 transition-all"
          aria-label="Delete conversation"
        >
          <Trash2 className="w-4 h-4 text-red-600" />
        </button>
      )}

      {/* Confirmation buttons */}
      {showConfirm && (
        <div className="absolute top-4 right-4 flex gap-1">
          <button
            onClick={handleDelete}
            className="px-2 py-1 text-xs bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
          >
            Delete
          </button>
          <button
            onClick={handleCancel}
            className="px-2 py-1 text-xs bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition-colors"
          >
            Cancel
          </button>
        </div>
      )}
    </div>
  );
}
