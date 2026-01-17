# Skill: Implement Theme Toggle

## Purpose
Create accessible, user-friendly theme toggle components that allow users to switch between light, dark, and system themes with visual feedback and keyboard support.

## When to Use
- After completing `setup-theme-provider` skill
- When building dashboard header or navigation
- Adding theme controls to settings page
- Implementing user preferences UI
- Before deploying application to production
- When users request theme switching functionality

## Inputs
- Existing ThemeProvider from `setup-theme-provider` skill
- useTheme hook from theme context
- Design specifications for toggle UI (button, dropdown, or icon)
- Placement location (header, sidebar, settings page)
- Icon library (Heroicons, Lucide, or custom SVG)

## Step-by-Step Process

### 1. Create Theme Toggle Button Component
Create `web/src/components/theme/ThemeToggle.tsx`:
```typescript
'use client';

import { useTheme } from '@/lib/theme';
import { useEffect, useState } from 'react';

/**
 * Simple theme toggle button that cycles through light -> dark -> system.
 */
export function ThemeToggle() {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Prevent hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <button
        className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center"
        aria-label="Toggle theme"
        disabled
      >
        <span className="w-5 h-5 bg-muted-foreground/20 rounded" />
      </button>
    );
  }

  const cycleTheme = () => {
    const themes: Array<'light' | 'dark' | 'system'> = ['light', 'dark', 'system'];
    const currentIndex = themes.indexOf(theme);
    const nextIndex = (currentIndex + 1) % themes.length;
    setTheme(themes[nextIndex]);
  };

  return (
    <button
      onClick={cycleTheme}
      className="w-10 h-10 rounded-lg bg-muted hover:bg-muted/80 transition-colors flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
      aria-label={`Current theme: ${theme}. Click to change theme.`}
      title={`Current: ${theme} (${resolvedTheme})`}
    >
      {resolvedTheme === 'light' ? (
        <SunIcon className="w-5 h-5 text-foreground" />
      ) : (
        <MoonIcon className="w-5 h-5 text-foreground" />
      )}
    </button>
  );
}

function SunIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2" />
      <path d="M12 20v2" />
      <path d="m4.93 4.93 1.41 1.41" />
      <path d="m17.66 17.66 1.41 1.41" />
      <path d="M2 12h2" />
      <path d="M20 12h2" />
      <path d="m6.34 17.66-1.41 1.41" />
      <path d="m19.07 4.93-1.41 1.41" />
    </svg>
  );
}

function MoonIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
    </svg>
  );
}
```

### 2. Create Theme Dropdown Component
Create `web/src/components/theme/ThemeDropdown.tsx`:
```typescript
'use client';

import { useTheme } from '@/lib/theme';
import { useEffect, useState, useRef } from 'react';
import type { Theme } from '@/lib/theme';

/**
 * Dropdown menu for selecting theme with all three options visible.
 */
export function ThemeDropdown() {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen]);

  // Close dropdown on Escape key
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      return () => document.removeEventListener('keydown', handleEscape);
    }
  }, [isOpen]);

  if (!mounted) {
    return (
      <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
        <span className="w-5 h-5 bg-muted-foreground/20 rounded" />
      </div>
    );
  }

  const handleThemeSelect = (newTheme: Theme) => {
    setTheme(newTheme);
    setIsOpen(false);
  };

  const themeOptions: Array<{ value: Theme; label: string; icon: JSX.Element }> = [
    {
      value: 'light',
      label: 'Light',
      icon: <SunIcon className="w-4 h-4" />,
    },
    {
      value: 'dark',
      label: 'Dark',
      icon: <MoonIcon className="w-4 h-4" />,
    },
    {
      value: 'system',
      label: 'System',
      icon: <ComputerIcon className="w-4 h-4" />,
    },
  ];

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-10 h-10 rounded-lg bg-muted hover:bg-muted/80 transition-colors flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
        aria-label="Select theme"
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        {resolvedTheme === 'light' ? (
          <SunIcon className="w-5 h-5 text-foreground" />
        ) : (
          <MoonIcon className="w-5 h-5 text-foreground" />
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 rounded-lg bg-card border border-border shadow-lg z-50">
          <div className="p-1">
            {themeOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => handleThemeSelect(option.value)}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors ${
                  theme === option.value
                    ? 'bg-primary text-primary-foreground'
                    : 'hover:bg-muted text-foreground'
                }`}
                role="menuitem"
              >
                {option.icon}
                <span>{option.label}</span>
                {theme === option.value && (
                  <CheckIcon className="w-4 h-4 ml-auto" />
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function SunIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2m-8-10h2m16 0h2M4.93 4.93l1.41 1.41m11.32 11.32l1.41 1.41M4.93 19.07l1.41-1.41m11.32-11.32l1.41-1.41" />
    </svg>
  );
}

function MoonIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
    </svg>
  );
}

function ComputerIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <rect width="14" height="8" x="5" y="2" rx="2" />
      <rect width="20" height="8" x="2" y="14" rx="2" />
      <path d="M6 18h2M12 18h2" />
    </svg>
  );
}

function CheckIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}
```

### 3. Create Theme Settings Card
Create `web/src/components/theme/ThemeSettings.tsx`:
```typescript
'use client';

import { useTheme } from '@/lib/theme';
import { useEffect, useState } from 'react';
import type { Theme } from '@/lib/theme';

/**
 * Theme settings card for settings page with radio buttons.
 */
export function ThemeSettings() {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="bg-card border border-border rounded-lg p-6">
        <div className="h-6 w-32 bg-muted rounded animate-pulse mb-4" />
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-16 bg-muted rounded animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  const themeOptions: Array<{
    value: Theme;
    label: string;
    description: string;
    icon: JSX.Element;
  }> = [
    {
      value: 'light',
      label: 'Light',
      description: 'Use light theme',
      icon: <SunIcon className="w-5 h-5" />,
    },
    {
      value: 'dark',
      label: 'Dark',
      description: 'Use dark theme',
      icon: <MoonIcon className="w-5 h-5" />,
    },
    {
      value: 'system',
      label: 'System',
      description: 'Follow system preference',
      icon: <ComputerIcon className="w-5 h-5" />,
    },
  ];

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <h3 className="text-lg font-semibold text-foreground mb-2">
        Theme Preference
      </h3>
      <p className="text-sm text-muted-foreground mb-6">
        Choose how the app looks. Currently using: <strong>{resolvedTheme}</strong>
      </p>

      <div className="space-y-3">
        {themeOptions.map((option) => (
          <label
            key={option.value}
            className={`flex items-start gap-4 p-4 rounded-lg border-2 cursor-pointer transition-all ${
              theme === option.value
                ? 'border-primary bg-primary/5'
                : 'border-border hover:border-muted-foreground/50'
            }`}
          >
            <input
              type="radio"
              name="theme"
              value={option.value}
              checked={theme === option.value}
              onChange={(e) => setTheme(e.target.value as Theme)}
              className="mt-1 w-4 h-4 text-primary focus:ring-2 focus:ring-ring focus:ring-offset-2"
            />
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                {option.icon}
                <span className="font-medium text-foreground">
                  {option.label}
                </span>
              </div>
              <p className="text-sm text-muted-foreground">
                {option.description}
              </p>
            </div>
          </label>
        ))}
      </div>
    </div>
  );
}

function SunIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2m-8-10h2m16 0h2M4.93 4.93l1.41 1.41m11.32 11.32l1.41 1.41M4.93 19.07l1.41-1.41m11.32-11.32l1.41-1.41" />
    </svg>
  );
}

function MoonIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
    </svg>
  );
}

function ComputerIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <rect width="14" height="8" x="5" y="2" rx="2" />
      <rect width="20" height="8" x="2" y="14" rx="2" />
      <path d="M6 18h2M12 18h2" />
    </svg>
  );
}
```

### 4. Add Theme Toggle to Dashboard Header
Update `web/src/components/dashboard/Header.tsx`:
```typescript
'use client';

import { ThemeToggle } from '@/components/theme/ThemeToggle';
// ... other imports

export function Header({ user, onMenuToggle }: HeaderProps) {
  return (
    <header className="h-16 border-b border-border bg-card px-4 flex items-center justify-between">
      {/* Mobile menu button */}
      <button
        onClick={onMenuToggle}
        className="lg:hidden p-2 rounded-lg hover:bg-muted"
        aria-label="Toggle menu"
      >
        <MenuIcon className="w-6 h-6" />
      </button>

      {/* Logo */}
      <div className="flex items-center gap-2">
        <h1 className="text-xl font-bold text-foreground">Todo App</h1>
      </div>

      {/* Right side actions */}
      <div className="flex items-center gap-3">
        {/* Theme toggle */}
        <ThemeToggle />

        {/* Notifications */}
        <button
          className="w-10 h-10 rounded-lg hover:bg-muted flex items-center justify-center"
          aria-label="Notifications"
        >
          <BellIcon className="w-5 h-5" />
        </button>

        {/* User menu */}
        <UserMenu user={user} />
      </div>
    </header>
  );
}
```

### 5. Create Theme Toggle Export
Create `web/src/components/theme/index.ts`:
```typescript
/**
 * Theme component exports.
 */

export { ThemeToggle } from './ThemeToggle';
export { ThemeDropdown } from './ThemeDropdown';
export { ThemeSettings } from './ThemeSettings';
```

### 6. Add Keyboard Shortcuts (Optional)
Create `web/src/lib/theme/useThemeShortcut.ts`:
```typescript
'use client';

import { useEffect } from 'react';
import { useTheme } from './ThemeProvider';

/**
 * Hook to add keyboard shortcut for theme toggle.
 * Default: Ctrl/Cmd + Shift + T
 */
export function useThemeShortcut(
  key: string = 't',
  modifiers: { ctrl?: boolean; shift?: boolean; alt?: boolean } = {
    ctrl: true,
    shift: true,
  }
) {
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const matchesModifiers =
        (!modifiers.ctrl || event.ctrlKey || event.metaKey) &&
        (!modifiers.shift || event.shiftKey) &&
        (!modifiers.alt || event.altKey);

      if (matchesModifiers && event.key.toLowerCase() === key.toLowerCase()) {
        event.preventDefault();

        // Cycle through themes
        const themes: Array<'light' | 'dark' | 'system'> = [
          'light',
          'dark',
          'system',
        ];
        const currentIndex = themes.indexOf(theme);
        const nextIndex = (currentIndex + 1) % themes.length;
        setTheme(themes[nextIndex]);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [theme, setTheme, key, modifiers]);
}
```

Use in layout:
```typescript
'use client';

import { useThemeShortcut } from '@/lib/theme/useThemeShortcut';

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  useThemeShortcut(); // Enables Ctrl+Shift+T

  return <div>{children}</div>;
}
```

### 7. Create Animated Theme Toggle (Advanced)
Create `web/src/components/theme/AnimatedThemeToggle.tsx`:
```typescript
'use client';

import { useTheme } from '@/lib/theme';
import { useEffect, useState } from 'react';

/**
 * Animated theme toggle with smooth icon transition.
 */
export function AnimatedThemeToggle() {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <button
        className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center"
        disabled
      >
        <span className="w-5 h-5 bg-muted-foreground/20 rounded" />
      </button>
    );
  }

  const toggleTheme = () => {
    setTheme(resolvedTheme === 'light' ? 'dark' : 'light');
  };

  return (
    <button
      onClick={toggleTheme}
      className="relative w-14 h-8 rounded-full bg-muted hover:bg-muted/80 transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
      aria-label={`Switch to ${resolvedTheme === 'light' ? 'dark' : 'light'} theme`}
    >
      {/* Track */}
      <div
        className={`absolute inset-0 rounded-full transition-colors ${
          resolvedTheme === 'dark' ? 'bg-primary' : 'bg-muted'
        }`}
      />

      {/* Thumb */}
      <div
        className={`absolute top-1 w-6 h-6 rounded-full bg-background shadow-md transition-transform duration-200 ease-in-out flex items-center justify-center ${
          resolvedTheme === 'dark' ? 'translate-x-7' : 'translate-x-1'
        }`}
      >
        {resolvedTheme === 'light' ? (
          <SunIcon className="w-4 h-4 text-yellow-500" />
        ) : (
          <MoonIcon className="w-4 h-4 text-blue-500" />
        )}
      </div>
    </button>
  );
}

function SunIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
    >
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2m-8-10h2m16 0h2M4.93 4.93l1.41 1.41m11.32 11.32l1.41 1.41M4.93 19.07l1.41-1.41m11.32-11.32l1.41-1.41" />
    </svg>
  );
}

function MoonIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
    >
      <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
    </svg>
  );
}
```

### 8. Test Theme Toggle Components
1. Add `ThemeToggle` to dashboard header
2. Add `ThemeDropdown` to user menu
3. Add `ThemeSettings` to settings page
4. Test each component:
   - Click to change theme
   - Verify visual feedback
   - Check keyboard navigation (Tab, Enter, Escape)
   - Test with screen reader
   - Verify theme persists after refresh
5. Test keyboard shortcut (Ctrl+Shift+T)
6. Test on mobile devices (touch interactions)

## Output
- ✅ ThemeToggle button component with cycling behavior
- ✅ ThemeDropdown with all three theme options
- ✅ ThemeSettings card for settings page
- ✅ Theme toggle integrated into dashboard header
- ✅ Keyboard shortcut support (optional)
- ✅ Animated toggle variant (optional)
- ✅ Accessible with ARIA labels and keyboard support
- ✅ Visual feedback for current theme
- ✅ Smooth transitions between themes
- ✅ Mobile-friendly touch targets

## Failure Handling

### Error: "Theme toggle doesn't update UI"
**Solution**:
1. Verify `useTheme` hook is called correctly
2. Check that component is wrapped in ThemeProvider
3. Ensure `mounted` state prevents hydration mismatch
4. Check console for React errors

### Error: "Dropdown doesn't close on outside click"
**Solution**:
1. Verify `dropdownRef` is attached to dropdown container
2. Check that event listener is added when dropdown opens
3. Ensure cleanup function removes listener
4. Test with React DevTools to verify ref attachment

### Error: "Keyboard navigation doesn't work"
**Solution**:
1. Add proper ARIA attributes (`aria-label`, `aria-expanded`)
2. Ensure buttons are focusable (not disabled)
3. Test Tab key navigation order
4. Add focus styles with `focus:ring`

### Error: "Theme toggle flashes on page load"
**Solution**:
1. Use `mounted` state to prevent rendering until client-side
2. Show skeleton/placeholder during mount
3. Verify ThemeScript runs before React hydration
4. Check `suppressHydrationWarning` on html tag

### Error: "Icons don't match current theme"
**Solution**:
1. Use `resolvedTheme` instead of `theme` for icon display
2. Verify icon components receive correct props
3. Check that theme changes trigger re-render
4. Test with both light and dark themes

### Error: "Dropdown z-index issues"
**Solution**:
1. Add high z-index to dropdown (`z-50`)
2. Check parent elements don't have `overflow: hidden`
3. Use portal if needed (React Portal)
4. Test in actual dashboard layout

### Error: "Keyboard shortcut conflicts with browser"
**Solution**:
1. Use `event.preventDefault()` to prevent default behavior
2. Choose non-conflicting key combination
3. Document shortcut for users
4. Make shortcut configurable

## Validation Checklist
- [ ] ThemeToggle component created
- [ ] ThemeDropdown component created
- [ ] ThemeSettings component created
- [ ] Components use useTheme hook correctly
- [ ] Mounted state prevents hydration mismatch
- [ ] Visual feedback shows current theme
- [ ] Keyboard navigation works (Tab, Enter, Escape)
- [ ] ARIA labels provide context
- [ ] Focus styles are visible
- [ ] Dropdown closes on outside click
- [ ] Dropdown closes on Escape key
- [ ] Theme changes are smooth (no flash)
- [ ] Components work on mobile devices
- [ ] Touch targets are at least 44x44px
- [ ] Icons match current theme
- [ ] Theme persists after toggle
- [ ] No console errors or warnings
- [ ] TypeScript types are correct

## Best Practices
- Prevent hydration mismatch with mounted state
- Use `resolvedTheme` for displaying current theme icon
- Provide clear ARIA labels for accessibility
- Add keyboard support (Tab, Enter, Escape)
- Close dropdowns on outside click and Escape
- Use proper focus styles for keyboard navigation
- Show visual feedback for current selection
- Make touch targets at least 44x44px for mobile
- Add smooth transitions between theme changes
- Test with screen readers
- Document keyboard shortcuts
- Consider color-blind users (don't rely only on color)
- Provide text labels in addition to icons
- Test on multiple devices and browsers
- Keep toggle UI consistent across app
