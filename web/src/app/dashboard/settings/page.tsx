"use client";

import { useAuth } from "@/hooks/useAuth";
import { usePreferences } from "@/hooks/usePreferences";
import { useThemeContext } from "@/contexts/ThemeContext";
import { SettingsForm } from "@/components/settings/SettingsForm";
import { useToast } from "@/hooks/use-toast";
import { DEFAULT_PREFERENCES } from "@/types/storage";

export default function SettingsPage() {
  const { user } = useAuth();
  const { preferences, updatePreferences, resetPreferences } = usePreferences();
  const { mode, setTheme } = useThemeContext();
  const { toast } = useToast();

  const handleThemeChange = (theme: 'Light' | 'Dark' | 'System') => {
    setTheme(theme.toLowerCase() as 'light' | 'dark' | 'system');
    updatePreferences({ theme });

    toast({
      title: "Theme Updated",
      description: `Theme changed to ${theme}`,
    });
  };

  const handleToggleShowCompleted = (value: boolean) => {
    updatePreferences({ showCompletedTodos: value });

    toast({
      title: "Preference Updated",
      description: value ? "Completed tasks will be shown" : "Completed tasks will be hidden",
    });
  };

  const handleReset = () => {
    resetPreferences();
    setTheme(DEFAULT_PREFERENCES.theme.toLowerCase() as 'light' | 'dark' | 'system');

    toast({
      title: "Settings Reset",
      description: "All settings have been restored to defaults",
    });
  };

  if (!user) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Settings</h1>
          <p className="text-muted-foreground mt-2">
            Please log in to access settings
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-muted-foreground mt-2">
          Customize your experience and preferences
        </p>
      </div>

      <SettingsForm
        preferences={preferences}
        onThemeChange={handleThemeChange}
        onToggleShowCompleted={handleToggleShowCompleted}
        onReset={handleReset}
      />
    </div>
  );
}
