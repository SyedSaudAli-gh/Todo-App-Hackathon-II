import { ActivityEvent, STORAGE_KEYS, isActivityEvent } from '@/types/storage';
import { v4 as uuidv4 } from 'uuid';

const MAX_ACTIVITY_EVENTS = 100;

/**
 * Get all activity events from localStorage
 */
export function getActivityEvents(): ActivityEvent[] {
  if (typeof window === 'undefined') return [];

  try {
    const item = window.localStorage.getItem(STORAGE_KEYS.ACTIVITY_EVENTS);
    if (!item) return [];

    const events = JSON.parse(item);
    return Array.isArray(events) ? events.filter(isActivityEvent) : [];
  } catch (error) {
    console.error('Error reading activity events from localStorage:', error);
    return [];
  }
}

/**
 * Save activity events to localStorage
 */
export function saveActivityEvents(events: ActivityEvent[]): void {
  if (typeof window === 'undefined') return;

  try {
    // Keep only the most recent MAX_ACTIVITY_EVENTS
    const limitedEvents = events.slice(0, MAX_ACTIVITY_EVENTS);
    window.localStorage.setItem(STORAGE_KEYS.ACTIVITY_EVENTS, JSON.stringify(limitedEvents));
  } catch (error) {
    console.error('Error saving activity events to localStorage:', error);
  }
}

/**
 * Add a new activity event
 */
export function addActivityEvent(
  userId: string,
  eventType: 'created' | 'completed' | 'updated' | 'deleted',
  todoId: string,
  todoTitle: string,
  description: string,
  metadata?: Record<string, any>
): ActivityEvent {
  const event: ActivityEvent = {
    id: uuidv4(),
    userId,
    eventType,
    todoId,
    todoTitle,
    description,
    timestamp: new Date().toISOString(),
    metadata,
  };

  const events = getActivityEvents();
  // Add new event at the beginning (most recent first)
  events.unshift(event);
  saveActivityEvents(events);

  return event;
}

/**
 * Get recent activity events (limited count)
 */
export function getRecentActivityEvents(count: number = 5): ActivityEvent[] {
  const events = getActivityEvents();
  return events.slice(0, count);
}

/**
 * Get activity events for a specific user
 */
export function getUserActivityEvents(userId: string, count?: number): ActivityEvent[] {
  const events = getActivityEvents();
  const userEvents = events.filter((e) => e.userId === userId);
  return count ? userEvents.slice(0, count) : userEvents;
}

/**
 * Clear all activity events (for testing/reset)
 */
export function clearActivityEvents(): void {
  if (typeof window === 'undefined') return;

  try {
    window.localStorage.removeItem(STORAGE_KEYS.ACTIVITY_EVENTS);
  } catch (error) {
    console.error('Error clearing activity events from localStorage:', error);
  }
}

/**
 * Helper function to create activity event description
 */
export function createActivityDescription(
  eventType: 'created' | 'completed' | 'updated' | 'deleted',
  todoTitle: string
): string {
  switch (eventType) {
    case 'created':
      return `Created task "${todoTitle}"`;
    case 'completed':
      return `Completed task "${todoTitle}"`;
    case 'updated':
      return `Updated task "${todoTitle}"`;
    case 'deleted':
      return `Deleted task "${todoTitle}"`;
    default:
      return `Modified task "${todoTitle}"`;
  }
}
