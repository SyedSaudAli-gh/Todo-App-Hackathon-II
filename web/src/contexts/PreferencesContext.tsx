"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { UserPreferences, DEFAULT_PREFERENCES } from '@/types/storage';
import { getPreferences, savePreferences, updatePreferences as updatePrefsStorage, resetPreferences as resetPrefsStorage } from '@/lib/storage/preferences';
import { useAuth } from '@/hooks/useAuth';

interface PreferencesContextType {
  preferences: UserPreferences;
  updatePreferences: (updates: Partial<Omit<UserPreferences, 'userId' | 'updatedAt'>>) => void;
  resetPreferences: () => void;
  isLoading: boolean;
}

const PreferencesContext = createContext<PreferencesContextType | undefined>(undefined);

export function PreferencesProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [preferences, setPreferences] = useState<UserPreferences>(() => {
    if (!user?.id) {
      return {
        ...DEFAULT_PREFERENCES,
        userId: '',
        updatedAt: new Date().toISOString(),
      };
    }
    return getPreferences(user.id);
  });
  const [isLoading, setIsLoading] = useState(true);

  // Load preferences when user changes
  useEffect(() => {
    if (user?.id) {
      setIsLoading(true);
      const userPrefs = getPreferences(user.id);
      setPreferences(userPrefs);
      setIsLoading(false);
    }
  }, [user?.id]);

  const handleUpdatePreferences = (updates: Partial<Omit<UserPreferences, 'userId' | 'updatedAt'>>) => {
    if (!user?.id) return;

    const updatedPrefs = updatePrefsStorage(user.id, updates);
    setPreferences(updatedPrefs);
  };

  const handleResetPreferences = () => {
    if (!user?.id) return;

    const defaultPrefs = resetPrefsStorage(user.id);
    setPreferences(defaultPrefs);
  };

  return (
    <PreferencesContext.Provider
      value={{
        preferences,
        updatePreferences: handleUpdatePreferences,
        resetPreferences: handleResetPreferences,
        isLoading,
      }}
    >
      {children}
    </PreferencesContext.Provider>
  );
}

export function usePreferences() {
  const context = useContext(PreferencesContext);
  if (context === undefined) {
    throw new Error('usePreferences must be used within a PreferencesProvider');
  }
  return context;
}
