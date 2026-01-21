import { UserPreferences, STORAGE_KEYS, DEFAULT_PREFERENCES, isUserPreferences } from '@/types/storage';

/**
 * Get user preferences from localStorage
 */
export function getPreferences(userId: string): UserPreferences {
  if (typeof window === 'undefined') {
    return {
      ...DEFAULT_PREFERENCES,
      userId,
      updatedAt: new Date().toISOString(),
    };
  }

  try {
    const item = window.localStorage.getItem(STORAGE_KEYS.USER_PREFERENCES);
    if (!item) {
      return {
        ...DEFAULT_PREFERENCES,
        userId,
        updatedAt: new Date().toISOString(),
      };
    }

    const preferences = JSON.parse(item);
    if (isUserPreferences(preferences) && preferences.userId === userId) {
      return preferences;
    }

    return {
      ...DEFAULT_PREFERENCES,
      userId,
      updatedAt: new Date().toISOString(),
    };
  } catch (error) {
    console.error('Error reading preferences from localStorage:', error);
    return {
      ...DEFAULT_PREFERENCES,
      userId,
      updatedAt: new Date().toISOString(),
    };
  }
}

/**
 * Save user preferences to localStorage
 */
export function savePreferences(preferences: UserPreferences): void {
  if (typeof window === 'undefined') return;

  try {
    const updatedPreferences = {
      ...preferences,
      updatedAt: new Date().toISOString(),
    };
    window.localStorage.setItem(STORAGE_KEYS.USER_PREFERENCES, JSON.stringify(updatedPreferences));
  } catch (error) {
    console.error('Error saving preferences to localStorage:', error);
  }
}

/**
 * Update specific preference fields
 */
export function updatePreferences(
  userId: string,
  updates: Partial<Omit<UserPreferences, 'userId' | 'updatedAt'>>
): UserPreferences {
  const currentPreferences = getPreferences(userId);
  const updatedPreferences: UserPreferences = {
    ...currentPreferences,
    ...updates,
    userId,
    updatedAt: new Date().toISOString(),
  };

  savePreferences(updatedPreferences);
  return updatedPreferences;
}

/**
 * Reset preferences to defaults
 */
export function resetPreferences(userId: string): UserPreferences {
  const defaultPreferences: UserPreferences = {
    ...DEFAULT_PREFERENCES,
    userId,
    updatedAt: new Date().toISOString(),
  };

  savePreferences(defaultPreferences);
  return defaultPreferences;
}

/**
 * Clear preferences from localStorage
 */
export function clearPreferences(): void {
  if (typeof window === 'undefined') return;

  try {
    window.localStorage.removeItem(STORAGE_KEYS.USER_PREFERENCES);
  } catch (error) {
    console.error('Error clearing preferences from localStorage:', error);
  }
}
