/**
 * ChatPanel Component
 * T088-T094: Slide-out chat panel with responsive design and animations
 */

'use client';

import React, { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
// import { X, Minimize2 } from 'lucide-react';
import { ChatContainer } from '@/components/chat/ChatContainer';

export interface ChatPanelProps {
  isOpen: boolean;
  onClose: () => void;
  token: string;
  conversationId: string | null;
}

/**
 * T088-T094: Chat panel with responsive design and animations
 * T090: Desktop/tablet slide-out panel (400px width, 600px height)
 * T091: Mobile full-screen modal (100vw width, 100vh height)
 * T092: Slide-in animation (300ms ease-out)
 * T093: Slide-out animation (300ms ease-out)
 */
export function ChatPanel({
  isOpen,
  onClose,
  token,
  conversationId,
}: ChatPanelProps) {
  const panelRef = useRef<HTMLDivElement>(null);

  // T095: Focus trap - focus panel when opened
  useEffect(() => {
    if (isOpen && panelRef.current) {
      panelRef.current.focus();

      // T095: Implement focus trap for accessibility
      const focusableElements = panelRef.current.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      const firstElement = focusableElements[0] as HTMLElement;
      const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

      const handleTabKey = (e: KeyboardEvent) => {
        if (e.key !== 'Tab') return;

        if (e.shiftKey) {
          // Shift + Tab
          if (document.activeElement === firstElement) {
            e.preventDefault();
            lastElement?.focus();
          }
        } else {
          // Tab
          if (document.activeElement === lastElement) {
            e.preventDefault();
            firstElement?.focus();
          }
        }
      };

      document.addEventListener('keydown', handleTabKey);
      return () => document.removeEventListener('keydown', handleTabKey);
    }
  }, [isOpen]);

  // Escape key handler to close chatbot
  useEffect(() => {
    const handleEscapeKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscapeKey);
    }

    return () => {
      document.removeEventListener('keydown', handleEscapeKey);
    };
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop for mobile - no click to close */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/50 z-[999] md:hidden"
            aria-hidden="true"
          />

          {/* Responsive chat panel with moderate sizing */}
          <motion.div
            ref={panelRef}
            initial={{
              x: '100%', // Start off-screen right
              y: 0,
            }}
            animate={{
              x: 0, // Slide in
              y: 0,
            }}
            exit={{
              x: '100%', // Slide out right
              y: 0,
            }}
            transition={{
              type: 'spring',
              damping: 30,
              stiffness: 300,
            }}
            className="fixed z-[1000] bg-white shadow-2xl flex flex-col overflow-hidden
              /* Mobile (< 768px): Full screen */
              bottom-0 right-0 w-full h-full
              /* Tablet (768px - 1024px): Moderate slide-out panel */
              md:bottom-6 md:right-6 md:w-[340px] md:h-[500px] md:rounded-2xl
              /* Desktop (1024px+): Standard size */
              lg:w-[360px] lg:h-[550px]
              /* Large desktop (1280px+): Comfortable size */
              xl:w-[380px] xl:h-[600px]"
            role="dialog"
            aria-modal="true"
            aria-label="Chat panel"
            tabIndex={-1}
          >
            {/* Chat content - fully responsive */}
            <div className="flex-1 overflow-hidden min-h-0">
              <ChatContainer token={token} conversationId={conversationId} onClose={onClose} />
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
