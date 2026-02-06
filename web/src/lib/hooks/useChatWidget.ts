/**
 * useChatWidget Hook
 * T084: State management for chat widget open/close
 */

'use client';

import { useState, useEffect, useCallback } from 'react';

export interface UseChatWidgetReturn {
  isOpen: boolean;
  open: () => void;
  close: () => void;
  toggle: () => void;
}

/**
 * T084: Custom hook for managing chat widget state
 * T085: Click-outside-to-close functionality
 * T086: Escape key handler to close widget
 */
export function useChatWidget(): UseChatWidgetReturn {
  const [isOpen, setIsOpen] = useState(false);

  // T081: Open chat widget
  const open = useCallback(() => {
    setIsOpen(true);
  }, []);

  // T086: Close chat widget
  const close = useCallback(() => {
    setIsOpen(false);
  }, []);

  // Toggle chat widget
  const toggle = useCallback(() => {
    setIsOpen(prev => !prev);
  }, []);

  // T086: Escape key handler
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isOpen) {
        close();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      // Prevent body scroll when chat is open
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, close]);

  return {
    isOpen,
    open,
    close,
    toggle,
  };
}
