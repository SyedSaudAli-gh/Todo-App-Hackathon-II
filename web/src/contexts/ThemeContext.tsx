"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import type { ThemeMode, ThemeContextValue } from "@/types/theme";

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

const STORAGE_KEY = "theme-preference";

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [mode, setMode] = useState<ThemeMode>("system");
  const [systemTheme, setSystemTheme] = useState<"light" | "dark">("light");
  const [mounted, setMounted] = useState(false);

  // Detect system theme preference
  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    setSystemTheme(mediaQuery.matches ? "dark" : "light");

    const handleChange = (e: MediaQueryListEvent) => {
      setSystemTheme(e.matches ? "dark" : "light");
    };

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  // Load theme preference from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored && (stored === "light" || stored === "dark" || stored === "system")) {
        setMode(stored as ThemeMode);
      }
    } catch (error) {
      console.error("Failed to load theme preference:", error);
    }
    setMounted(true);
  }, []);

  // Apply theme to document
  useEffect(() => {
    if (!mounted) return;

    const resolvedTheme = mode === "system" ? systemTheme : mode;
    const root = document.documentElement;

    // Remove both classes first
    root.classList.remove("light", "dark");

    // Add the resolved theme class
    root.classList.add(resolvedTheme);

    // Save to localStorage
    try {
      localStorage.setItem(STORAGE_KEY, mode);
    } catch (error) {
      console.error("Failed to save theme preference:", error);
    }
  }, [mode, systemTheme, mounted]);

  const resolvedTheme = mode === "system" ? systemTheme : mode;

  const setTheme = (newMode: ThemeMode) => {
    setMode(newMode);
  };

  const toggleTheme = () => {
    setMode((current) => {
      if (current === "system") {
        return systemTheme === "dark" ? "light" : "dark";
      }
      return current === "light" ? "dark" : "light";
    });
  };

  const value: ThemeContextValue = {
    mode,
    resolvedTheme,
    systemTheme,
    setTheme,
    toggleTheme,
  };

  // Prevent flash of unstyled content
  if (!mounted) {
    return null;
  }

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useThemeContext() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useThemeContext must be used within a ThemeProvider");
  }
  return context;
}
