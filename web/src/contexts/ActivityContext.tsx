"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { ActivityEvent } from '@/types/storage';
import {
  getActivityEvents,
  addActivityEvent,
  getRecentActivityEvents,
  getUserActivityEvents,
  createActivityDescription
} from '@/lib/storage/activity';
import { useAuth } from '@/hooks/useAuth';

interface ActivityContextType {
  events: ActivityEvent[];
  recentEvents: ActivityEvent[];
  addEvent: (
    eventType: 'created' | 'completed' | 'updated' | 'deleted',
    todoId: string,
    todoTitle: string,
    metadata?: Record<string, any>
  ) => void;
  getUserEvents: (count?: number) => ActivityEvent[];
  isLoading: boolean;
}

const ActivityContext = createContext<ActivityContextType | undefined>(undefined);

export function ActivityProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [events, setEvents] = useState<ActivityEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load events on mount and when user changes
  useEffect(() => {
    setIsLoading(true);
    const allEvents = getActivityEvents();
    setEvents(allEvents);
    setIsLoading(false);
  }, [user?.id]);

  const handleAddEvent = useCallback(
    (
      eventType: 'created' | 'completed' | 'updated' | 'deleted',
      todoId: string,
      todoTitle: string,
      metadata?: Record<string, any>
    ) => {
      if (!user?.id) return;

      const description = createActivityDescription(eventType, todoTitle);
      const newEvent = addActivityEvent(user.id, eventType, todoId, todoTitle, description, metadata);

      // Update local state
      setEvents((prev) => [newEvent, ...prev]);
    },
    [user?.id]
  );

  const handleGetUserEvents = useCallback(
    (count?: number) => {
      if (!user?.id) return [];
      return getUserActivityEvents(user.id, count);
    },
    [user?.id]
  );

  const recentEvents = getRecentActivityEvents(5);

  return (
    <ActivityContext.Provider
      value={{
        events,
        recentEvents,
        addEvent: handleAddEvent,
        getUserEvents: handleGetUserEvents,
        isLoading,
      }}
    >
      {children}
    </ActivityContext.Provider>
  );
}

export function useActivity() {
  const context = useContext(ActivityContext);
  if (context === undefined) {
    throw new Error('useActivity must be used within an ActivityProvider');
  }
  return context;
}
