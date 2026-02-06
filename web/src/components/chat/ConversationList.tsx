'use client';

import { ConversationSummary } from '@/types/chat';
import { ConversationItem } from './ConversationItem';

interface ConversationListProps {
  conversations: ConversationSummary[];
  currentConversationId: string | null;
  onSelect: (id: string) => void;
  onDelete: (id: string) => void;
}

/**
 * T034: ConversationList component
 * Renders a list of conversation items with delete functionality
 */
export function ConversationList({
  conversations,
  currentConversationId,
  onSelect,
  onDelete,
}: ConversationListProps) {
  return (
    <div className="divide-y divide-gray-100">
      {conversations.map((conversation) => (
        <ConversationItem
          key={conversation.conversation_id}
          conversation={conversation}
          isActive={conversation.conversation_id === currentConversationId}
          onClick={() => onSelect(conversation.conversation_id)}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}
