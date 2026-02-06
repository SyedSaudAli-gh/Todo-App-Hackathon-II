'use client';

import React from 'react';
import { format } from 'date-fns';

export interface MessageBubbleProps {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  toolCalls?: Array<{ function?: { name: string } }>;
}

/**
 * Modern Message Bubble – user & assistant styling
 */
export function MessageBubble({
  id,
  role,
  content,
  timestamp,
  toolCalls,
}: MessageBubbleProps) {
  const isUser = role === 'user';

  return (
    <div
      className={`
        flex items-end gap-2.5 mb-5 animate-in fade-in duration-300 slide-in-from-bottom-3
        ${isUser ? 'flex-row-reverse' : 'flex-row'}
      `}
    >
      {/* Avatar */}
      <div
        className={`
          flex-shrink-0 w-9 h-9 rounded-full flex items-center justify-center text-sm font-semibold shadow-sm
          ${isUser
            ? 'bg-blue-600 text-white'
            : 'bg-gradient-to-br from-indigo-500 to-purple-600 text-white'}
        `}
      >
        {isUser ? 'You' : 'AI'}
      </div>

      {/* Message content container */}
      <div className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} max-w-[78%]`}>
        {/* Bubble */}
        <div
          className={`
            relative group px-4 py-3 rounded-2xl shadow-sm transition-all duration-200
            ${isUser
              ? 'bg-blue-600 text-white rounded-br-none'
              : 'bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-bl-none border border-gray-200 dark:border-gray-700'}
          `}
        >
          {/* Message text */}
          <p className="text-[15px] leading-relaxed whitespace-pre-wrap break-words">
            {content}
          </p>

          {/* Tool calls section */}
          {toolCalls && toolCalls.length > 0 && (
            <div className="mt-3 pt-2 border-t border-white/20 dark:border-gray-700/50">
              <p className="text-xs opacity-80 mb-1.5 font-medium">
                {isUser ? 'Requested actions' : 'Actions performed'}
              </p>
              <ul className="space-y-1 text-xs opacity-90">
                {toolCalls.map((tool, idx) => (
                  <li key={idx} className="flex items-center gap-1.5">
                    <span className="text-blue-300 dark:text-blue-400">→</span>
                    {tool.function?.name || 'Unknown tool'}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Timestamp */}
        <span className="text-xs text-gray-500 dark:text-gray-400 mt-1.5 px-1 opacity-80">
          {format(timestamp, 'h:mm a')}
        </span>
      </div>
    </div>
  );
}

/**
 * Modern Typing Indicator – pulsing dots with AI avatar
 */
export function TypingIndicator() {
  return (
    <div className="flex items-end gap-2.5 mb-5 animate-in fade-in duration-400">
      {/* AI Avatar */}
      <div
        className="
          flex-shrink-0 w-9 h-9 rounded-full flex items-center justify-center text-sm font-semibold
          bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-sm
        "
      >
        AI
      </div>

      {/* Bubble with pulsing dots */}
      <div
        className="
          relative bg-white dark:bg-gray-800
          rounded-2xl rounded-bl-none px-5 py-3.5 shadow-sm
          border border-gray-200 dark:border-gray-700
        "
      >
        <div className="flex items-center gap-2">
          <div className="flex gap-1.5">
            <div className="h-2.5 w-2.5 rounded-full bg-indigo-400 animate-pulse [animation-delay:0ms]" />
            <div className="h-2.5 w-2.5 rounded-full bg-indigo-500 animate-pulse [animation-delay:180ms]" />
            <div className="h-2.5 w-2.5 rounded-full bg-indigo-600 animate-pulse [animation-delay:360ms]" />
          </div>

          <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
            Thinking...
          </span>
        </div>
      </div>
    </div>
  );
}