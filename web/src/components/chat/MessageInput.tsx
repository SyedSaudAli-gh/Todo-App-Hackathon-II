'use client';

import { useState, useRef, useEffect } from 'react';

interface MessageInputProps {
  onSend: (message: string) => void;
  disabled: boolean;
}

export function MessageInput({ onSend, disabled }: MessageInputProps) {
  const [inputValue, setInputValue] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-resize textarea
  useEffect(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const adjustHeight = () => {
      textarea.style.height = 'auto';
      const scrollHeight = textarea.scrollHeight;
      textarea.style.height = `${Math.min(scrollHeight, 160)}px`;
    };

    adjustHeight();
    window.addEventListener('resize', adjustHeight);
    return () => window.removeEventListener('resize', adjustHeight);
  }, [inputValue]);

  const handleSend = () => {
    const trimmed = inputValue.trim();
    if (trimmed && !disabled) {
      onSend(trimmed);
      setInputValue('');
      // Optional: reset height after send
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-950/70 backdrop-blur-md">
      <div className="mx-auto w-full max-w-4xl px-3 py-3 sm:px-4 sm:py-4">
        <div className="relative flex items-end gap-2">
          {/* Textarea */}
          <textarea
            ref={textareaRef}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={disabled}
            placeholder="Ask your task..."
            aria-label="Ask your task"
            rows={1}
            className={`
              w-full min-h-[52px] max-h-[160px] resize-none
              rounded-2xl border px-5 py-3.5 pr-16
              text-[15px] leading-relaxed
              transition-all duration-200
              focus:outline-none focus:ring-2 focus:ring-offset-2
              disabled:cursor-not-allowed disabled:opacity-60

              /* Light mode */
              bg-white border-gray-300 text-gray-900
              placeholder:text-gray-400/80
              focus:border-blue-500 focus:ring-blue-500/30 focus:ring-offset-white
              shadow-sm

              /* Dark mode */
              dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100
              dark:placeholder:text-gray-500/70
              dark:focus:border-blue-400 dark:focus:ring-blue-500/20 dark:focus:ring-offset-gray-950
            `}
          />

          {/* Icon-only Send Button */}
          <button
            onClick={handleSend}
            disabled={disabled || !inputValue.trim()}
            aria-label="Send message"
            title="Send message (Enter)"
            className={`
              absolute bottom-3.5 right-3 sm:static
              flex h-10 w-10 items-center justify-center
              rounded-full
              transition-all duration-200
              disabled:opacity-40 disabled:pointer-events-none
              hover:scale-105 active:scale-95

              /* Light mode */
              bg-blue-600 text-white hover:bg-blue-700 active:bg-blue-800
              shadow-md hover:shadow-lg

              /* Dark mode */
              dark:bg-blue-500 dark:hover:bg-blue-600 dark:active:bg-blue-700
            `}
          >
            <svg
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              strokeWidth={2.4}
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M22 2 11 13" />
              <path d="M22 2l-7 20-4-9-9-4Z" />
            </svg>
          </button>
        </div>

        {/* Optional small hint – you can remove if you want cleaner UI */}
        <p className="mt-2 text-xs text-gray-500 dark:text-gray-400 opacity-75 text-center sm:text-left pointer-events-none">
          Press Enter to send • Shift + Enter for new line
        </p>
      </div>
    </div>
  );
}