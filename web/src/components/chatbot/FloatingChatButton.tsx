/**
 * FloatingChatButton Component
 * Fully responsive chatbot button for all screen sizes
 */

'use client';

import React from 'react';
import { MessageCircle } from 'lucide-react';

export interface FloatingChatButtonProps {
  isOpen: boolean;
  onClick: () => void;
  unreadCount?: number;
}

/**
 * Fully responsive floating chat button with text and website theme colors
 * Adapts to mobile, tablet, and desktop screen sizes
 */
export function FloatingChatButton({
  isOpen,
  onClick,
  unreadCount = 0,
}: FloatingChatButtonProps) {
  // Hide button when widget is open
  if (isOpen) {
    return null;
  }

  return (
    <button
      onClick={onClick}
      aria-label="Open chat"
      className="fixed z-[1000] group
        /* Mobile positioning (< 640px) */
        bottom-4 right-4
        /* Tablet positioning (640px+) */
        sm:bottom-5 sm:right-5
        /* Desktop positioning (1024px+) */
        lg:bottom-6 lg:right-6"
      style={{ zIndex: 1000 }}
    >
      {/* Responsive button with text and icon */}
      <div className="relative bg-primary hover:bg-primary/90 text-primary-foreground rounded-full shadow-lg flex items-center gap-2 transition-all duration-300 hover:scale-105 hover:shadow-xl
        /* Mobile (< 640px): Compact size */
        px-3 py-2.5
        /* Small screens (640px+): Slightly larger */
        sm:px-4 sm:py-3
        /* Medium screens (768px+): Standard size */
        md:px-5 md:py-3.5
        /* Large screens (1024px+): Comfortable size */
        lg:px-6 lg:py-4
        /* Extra large screens (1280px+): Maximum size */
        xl:px-7 xl:py-4">

        {/* Chat icon - responsive sizing */}
        <MessageCircle className="
          w-4 h-4
          sm:w-5 sm:h-5
          md:w-5 md:h-5
          lg:w-6 lg:h-6
          xl:w-6 xl:h-6
        " />

        {/* Button text - responsive sizing */}
        <span className="font-medium whitespace-nowrap
          text-xs
          sm:text-sm
          md:text-sm
          lg:text-base
          xl:text-base">
          Chatbot
        </span>

        {/* Unread count badge - responsive positioning */}
        {unreadCount > 0 && (
          <div className="absolute flex items-center justify-center bg-red-500 rounded-full text-white font-bold
            -top-1 -right-1 w-4 h-4 text-[10px]
            sm:-top-1 sm:-right-1 sm:w-5 sm:h-5 sm:text-xs
            md:-top-1.5 md:-right-1.5 md:w-5 md:h-5 md:text-xs
            lg:-top-2 lg:-right-2 lg:w-6 lg:h-6 lg:text-sm">
            {unreadCount > 9 ? '9+' : unreadCount}
          </div>
        )}

        {/* Subtle pulse animation */}
        <div className="absolute inset-0 rounded-full bg-primary animate-ping opacity-10"></div>
      </div>
    </button>
  );
}
