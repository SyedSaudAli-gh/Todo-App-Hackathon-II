"use client";

import React from 'react';
import { ThemeSelector } from './ThemeSelector';
import { PreferenceToggles } from './PreferenceToggles';
import { ResetButton } from './ResetButton';
import { Preferences } from '@/hooks/usePreferences';

interface SettingsFormProps {
  preferences: Preferences;
  onThemeChange: (theme: 'Light' | 'Dark' | 'System') => void;
  onToggleShowCompleted: (value: boolean) => void;
  onReset: () => void;
}

export function SettingsForm({
  preferences,
  onThemeChange,
  onToggleShowCompleted,
  onReset,
}: SettingsFormProps) {
  // Convert lowercase theme to capitalized format for the handler
  const handleThemeChange = (theme: 'light' | 'dark' | 'system') => {
    const capitalizedTheme = theme.charAt(0).toUpperCase() + theme.slice(1) as 'Light' | 'Dark' | 'System';
    onThemeChange(capitalizedTheme);
  };

  return (
    <div className="space-y-6">
      {/* Theme Selection */}
      <ThemeSelector
        currentTheme={preferences.theme.toLowerCase() as 'light' | 'dark' | 'system'}
        onThemeChange={handleThemeChange}
      />

      {/* Display Preferences */}
      <PreferenceToggles
        showCompletedTodos={preferences.showCompletedTodos}
        onToggleShowCompleted={onToggleShowCompleted}
      />

      {/* Reset Button */}
      <ResetButton onReset={onReset} />
    </div>
  );
}
