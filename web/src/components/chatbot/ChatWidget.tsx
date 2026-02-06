/**
 * ChatWidget Component
 * T082-T087: Main chat widget container managing FloatingChatButton and ChatPanel
 */

'use client';

import React from 'react';
import { FloatingChatButton } from './FloatingChatButton';
import { ChatPanel } from './ChatPanel';
import { useChatWidget } from '@/lib/hooks/useChatWidget';

export interface ChatWidgetProps {
  token: string;
  conversationId?: string | null;
}

/**
 * T082-T087: Chat widget with open/close state management
 * T083: Open/close state management
 * T087: Hide FloatingChatButton when widget is open
 */
export function ChatWidget({ token, conversationId = null }: ChatWidgetProps) {
  const { isOpen, open, close } = useChatWidget();

  return (
    <>
      {/* T076-T081: Floating chat button */}
      <FloatingChatButton isOpen={isOpen} onClick={open} />

      {/* T088-T094: Chat panel */}
      <ChatPanel
        isOpen={isOpen}
        onClose={close}
        token={token}
        conversationId={conversationId}
      />
    </>
  );
}
