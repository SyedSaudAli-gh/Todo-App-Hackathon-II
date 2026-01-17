export type ThemeMode = "light" | "dark" | "system";

export interface ThemeState {
  mode: ThemeMode;
  resolvedTheme: "light" | "dark";
  systemTheme: "light" | "dark";
}

export interface ThemeContextValue extends ThemeState {
  setTheme: (mode: ThemeMode) => void;
  toggleTheme: () => void;
}

export interface ThemeConfig {
  defaultTheme: ThemeMode;
  storageKey: string;
  enableSystem: boolean;
  enableTransitions: boolean;
}
