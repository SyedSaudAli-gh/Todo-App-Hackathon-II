"use client";

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Sun, Moon, Monitor } from 'lucide-react';

interface ThemeSelectorProps {
  currentTheme: 'light' | 'dark' | 'system';
  onThemeChange: (theme: 'light' | 'dark' | 'system') => void;
}

export function ThemeSelector({ currentTheme, onThemeChange }: ThemeSelectorProps) {
  const themes = [
    {
      value: 'light' as const,
      label: 'Light',
      description: 'Light theme with bright colors',
      icon: Sun,
    },
    {
      value: 'dark' as const,
      label: 'Dark',
      description: 'Dark theme with muted colors',
      icon: Moon,
    },
    {
      value: 'system' as const,
      label: 'System',
      description: 'Follow system preference',
      icon: Monitor,
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Theme</CardTitle>
        <CardDescription>
          Choose your preferred color theme
        </CardDescription>
      </CardHeader>
      <CardContent>
        <RadioGroup value={currentTheme} onValueChange={onThemeChange}>
          <div className="space-y-3">
            {themes.map((theme) => {
              const Icon = theme.icon;
              return (
                <div
                  key={theme.value}
                  className="flex items-center space-x-3 rounded-lg border p-4 hover:bg-muted/50 transition-colors cursor-pointer"
                  onClick={() => onThemeChange(theme.value)}
                >
                  <RadioGroupItem value={theme.value} id={theme.value} />
                  <div className="flex items-center gap-3 flex-1">
                    <Icon className="h-5 w-5 text-muted-foreground" />
                    <div className="flex-1">
                      <Label
                        htmlFor={theme.value}
                        className="text-sm font-medium cursor-pointer"
                      >
                        {theme.label}
                      </Label>
                      <p className="text-xs text-muted-foreground">
                        {theme.description}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </RadioGroup>
      </CardContent>
    </Card>
  );
}
