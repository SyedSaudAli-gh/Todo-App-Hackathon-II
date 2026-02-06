'use client';

import React, { useState } from 'react';
import { Message as MessageType } from '@/types/chat';
import { ToolCallDisplay } from './ToolCallDisplay';
import { CheckCircle2, XCircle, AlertCircle, List, Trash2, Edit3 } from 'lucide-react';

interface MessageProps {
  message: MessageType;
}

function parseAssistantMessage(content: string): {
  type: string;
  icon: React.ReactElement;
  message: string;
} {
  const lower = content.toLowerCase();

  if (lower.includes('✅') || lower.includes('created') || lower.includes('updated') || lower.includes('deleted')) {
    let icon = <CheckCircle2 className="h-4.5 w-4.5 text-green-600" />;
    if (lower.includes('created')) icon = <CheckCircle2 className="h-4.5 w-4.5 text-green-600" />;
    else if (lower.includes('updated')) icon = <Edit3 className="h-4.5 w-4.5 text-blue-600" />;
    else if (lower.includes('deleted')) icon = <Trash2 className="h-4.5 w-4.5 text-red-600" />;

    return { type: 'success', icon, message: content.replace(/✅/g, '').trim() };
  }

  if (content.includes('📋') || lower.includes('your tasks') || lower.includes('list')) {
    return {
      type: 'list',
      icon: <List className="h-4.5 w-4.5 text-blue-600" />,
      message: content.replace(/📋/g, '').trim(),
    };
  }

  if (content.includes('❌') || lower.includes('error') || lower.includes('failed')) {
    return {
      type: 'error',
      icon: <XCircle className="h-4.5 w-4.5 text-red-600" />,
      message: content.replace(/❌/g, '').trim(),
    };
  }

  return {
    type: 'default',
    icon: <AlertCircle className="h-4.5 w-4.5 text-gray-500" />,
    message: content,
  };
}

export function Message({ message }: MessageProps) {
  const [showToolCalls, setShowToolCalls] = useState(false);
  const [showFullMessage, setShowFullMessage] = useState(false);

  const isUser = message.role === 'user';
  const timestamp = message.timestamp.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });

  const MAX_LENGTH = 1200;
  const isLong = message.content.length > MAX_LENGTH;
  const displayText = showFullMessage || !isLong
    ? message.content
    : message.content.slice(0, MAX_LENGTH) + '…';

  const parsed = !isUser ? parseAssistantMessage(displayText) : null;

  return (
    <div
      className={`
        flex w-full animate-in fade-in duration-300 slide-in-from-bottom-2
        ${isUser ? 'justify-end' : 'justify-start'}
      `}
    >
      <div
        className={`
          group relative max-w-[86%] sm:max-w-[78%] md:max-w-[68%] lg:max-w-[62%]
          rounded-2xl px-4 py-3
          transition-all duration-200
          ${isUser
            ? 'bg-blue-600 text-white shadow-md shadow-blue-200/30'
            : 'bg-white shadow-sm border border-gray-200/70 text-gray-900'
          }
        `}
      >
        {/* Message content */}
        {isUser ? (
          <div className="whitespace-pre-wrap break-words text-[15px] leading-relaxed">
            {displayText}
          </div>
        ) : (
          <div className="flex items-start gap-2.5">
            {parsed && (
              <div className="mt-1 shrink-0">{parsed.icon}</div>
            )}
            <div className="min-w-0 flex-1 whitespace-pre-wrap break-words text-[15px] leading-relaxed">
              {parsed ? parsed.message : displayText}
            </div>
          </div>
        )}

        {/* Show more / less */}
        {isLong && (
          <button
            onClick={() => setShowFullMessage(!showFullMessage)}
            className={`
              mt-1.5 text-xs font-medium
              ${isUser
                ? 'text-blue-100 hover:text-white'
                : 'text-blue-600 hover:text-blue-800'
              }
              transition-colors
            `}
          >
            {showFullMessage ? 'Show less' : 'Show more'}
          </button>
        )}

        {/* Timestamp + tool calls toggle */}
        <div className="mt-1.5 flex items-center justify-between gap-3 text-xs">
          <span className={isUser ? 'text-blue-100/80' : 'text-gray-500'}>
            {timestamp}
          </span>

          {message.tool_calls && message.tool_calls.length > 0 && (
            <button
              onClick={() => setShowToolCalls(!showToolCalls)}
              className={`
                flex items-center gap-1 text-xs font-medium
                ${isUser
                  ? 'text-blue-100 hover:text-white'
                  : 'text-gray-600 hover:text-gray-900'
                }
                transition-colors
              `}
            >
              <span>{showToolCalls ? 'Hide' : 'Show'} tools</span>
              <span className="text-[10px] opacity-70">
                {showToolCalls ? '▲' : '▼'}
              </span>
            </button>
          )}
        </div>

        {/* Tool calls panel */}
        {message.tool_calls && message.tool_calls.length > 0 && showToolCalls && (
          <div className="mt-3 pt-3 border-t border-gray-200/50">
            <ToolCallDisplay
              toolCalls={message.tool_calls}
              isExpanded={true}
              onToggle={() => setShowToolCalls(false)}
            />
          </div>
        )}

        {/* Optional subtle tail for user messages (like iMessage) */}
        {isUser && (
          <div className="absolute -right-1.5 bottom-3 h-3 w-4 overflow-hidden">
            <div className="h-full w-full rotate-45 transform bg-blue-600 shadow-md" />
          </div>
        )}
      </div>
    </div>
  );
}