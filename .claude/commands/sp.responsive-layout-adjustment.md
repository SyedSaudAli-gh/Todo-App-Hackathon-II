# Skill: Responsive Layout Adjustment

## Purpose
Optimize the dashboard layout for all screen sizes (mobile, tablet, desktop) by implementing responsive design patterns, touch-friendly interactions, and adaptive UI components that provide an excellent user experience across all devices.

## When to Use
- After completing `integrate-todo-components` skill
- Dashboard layout and components are functional
- Need to optimize for mobile and tablet devices
- Want to improve touch interactions
- Before production deployment
- User testing reveals responsive issues

## Inputs
- Existing dashboard layout and components
- Target breakpoints (mobile: <768px, tablet: 768-1023px, desktop: ≥1024px)
- Touch interaction requirements
- Performance optimization goals
- Accessibility standards (WCAG 2.1)

## Step-by-Step Process

### 1. Define Responsive Breakpoints
Create `web/src/styles/breakpoints.ts`:
```typescript
/**
 * Responsive breakpoints matching Tailwind CSS defaults
 */
export const breakpoints = {
  sm: '640px',   // Small devices (landscape phones)
  md: '768px',   // Medium devices (tablets)
  lg: '1024px',  // Large devices (desktops)
  xl: '1280px',  // Extra large devices (large desktops)
  '2xl': '1536px', // 2X large devices (larger desktops)
} as const;

export const mediaQueries = {
  mobile: `(max-width: ${breakpoints.md})`,
  tablet: `(min-width: ${breakpoints.md}) and (max-width: ${breakpoints.lg})`,
  desktop: `(min-width: ${breakpoints.lg})`,
} as const;
```

### 2. Update DashboardLayout for Responsive Behavior
Update `web/src/components/dashboard/layout/DashboardLayout.tsx`:
```typescript
'use client';

import { useState, useEffect } from 'react';
import { Header } from './Header';
import { Sidebar } from './Sidebar';
import { usePathname } from 'next/navigation';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const pathname = usePathname();

  // Detect screen size
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Close sidebar on route change (mobile only)
  useEffect(() => {
    if (isMobile) {
      setSidebarOpen(false);
    }
  }, [pathname, isMobile]);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isMobile && sidebarOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMobile, sidebarOpen]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header - Fixed on all devices */}
      <Header
        onMenuToggle={() => setSidebarOpen(!sidebarOpen)}
        isMobile={isMobile}
      />

      <div className="flex h-[calc(100vh-64px)] pt-16">
        {/* Sidebar - Responsive behavior */}
        <Sidebar
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          currentPath={pathname}
          isMobile={isMobile}
        />

        {/* Main Content - Responsive padding */}
        <main className="flex-1 overflow-y-auto">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 max-w-7xl">
            {children}
          </div>
        </main>
      </div>

      {/* Mobile Sidebar Overlay */}
      {isMobile && sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity"
          onClick={() => setSidebarOpen(false)}
          aria-hidden="true"
        />
      )}
    </div>
  );
}
```

### 3. Make Header Responsive
Update `web/src/components/dashboard/layout/Header.tsx`:
```typescript
'use client';

import Link from 'next/link';
import { useAuth } from '@/lib/auth/AuthProvider';
import { UserMenu } from '../widgets/UserMenu';

interface HeaderProps {
  onMenuToggle: () => void;
  isMobile: boolean;
}

export function Header({ onMenuToggle, isMobile }: HeaderProps) {
  const { user, isLoading } = useAuth();

  return (
    <header className="bg-white border-b border-gray-200 h-16 fixed top-0 left-0 right-0 z-50">
      <div className="h-full px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Left Section */}
        <div className="flex items-center space-x-2 sm:space-x-4">
          {/* Mobile Menu Button */}
          <button
            onClick={onMenuToggle}
            className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors touch-manipulation"
            aria-label="Toggle menu"
            aria-expanded={false}
          >
            <svg
              className="w-6 h-6 text-gray-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>

          {/* Logo - Responsive sizing */}
          <Link href="/dashboard" className="flex items-center space-x-2">
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-base sm:text-lg">T</span>
            </div>
            <span className="text-lg sm:text-xl font-bold text-gray-900 hidden xs:block">
              Todo App
            </span>
          </Link>
        </div>

        {/* Right Section */}
        <div className="flex items-center space-x-2 sm:space-x-4">
          {/* Search Bar - Hidden on mobile */}
          {!isMobile && (
            <div className="hidden md:block">
              <input
                type="search"
                placeholder="Search..."
                className="px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-48 lg:w-64"
              />
            </div>
          )}

          {/* Notifications - Touch-friendly */}
          <button
            className="p-2 sm:p-2.5 rounded-lg hover:bg-gray-100 transition-colors relative touch-manipulation"
            aria-label="Notifications"
          >
            <svg
              className="w-5 h-5 sm:w-6 sm:h-6 text-gray-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
              />
            </svg>
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
          </button>

          {/* User Menu - Responsive */}
          {isLoading ? (
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gray-200 rounded-full animate-pulse" />
          ) : (
            user && <UserMenu user={user} isMobile={isMobile} />
          )}
        </div>
      </div>
    </header>
  );
}
```

### 4. Make Sidebar Responsive
Update `web/src/components/dashboard/layout/Sidebar.tsx`:
```typescript
'use client';

import Link from 'next/link';
import { NavItem } from '../navigation/NavItem';
import { useAuth } from '@/lib/auth/AuthProvider';
import { LogoutButton } from '@/components/auth/LogoutButton';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  currentPath: string;
  isMobile: boolean;
}

export function Sidebar({ isOpen, onClose, currentPath, isMobile }: SidebarProps) {
  const { user } = useAuth();

  const navigationItems = [
    {
      href: '/dashboard',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
      ),
      label: 'Dashboard',
    },
    {
      href: '/todos',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
        </svg>
      ),
      label: 'Todos',
    },
    {
      href: '/profile',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      ),
      label: 'Profile',
    },
    {
      href: '/settings',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
      label: 'Settings',
    },
  ];

  return (
    <aside
      className={`
        fixed lg:static inset-y-0 left-0 z-50
        w-64 sm:w-72 lg:w-64 bg-white border-r border-gray-200
        transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        ${isMobile ? 'top-16' : 'top-0'}
        overflow-y-auto
      `}
    >
      <div className="h-full flex flex-col">
        {/* Close button - Mobile only */}
        {isMobile && isOpen && (
          <div className="flex justify-end p-4 lg:hidden">
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors touch-manipulation"
              aria-label="Close menu"
            >
              <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        )}

        {/* Navigation - Touch-friendly spacing */}
        <nav className="flex-1 px-3 sm:px-4 py-4 sm:py-6 space-y-1 overflow-y-auto">
          {navigationItems.map((item) => (
            <NavItem
              key={item.href}
              href={item.href}
              icon={item.icon}
              label={item.label}
              isActive={currentPath === item.href}
              onClick={onClose}
              isMobile={isMobile}
            />
          ))}
        </nav>

        {/* User Section - Responsive */}
        <div className="p-3 sm:p-4 border-t border-gray-200">
          {user && (
            <div className="mb-3 sm:mb-4">
              <div className="flex items-center space-x-3 mb-3">
                {user.image ? (
                  <img
                    src={user.image}
                    alt={user.name || 'User'}
                    className="w-10 h-10 sm:w-12 sm:h-12 rounded-full"
                  />
                ) : (
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold text-sm sm:text-base">
                    {user.name?.[0]?.toUpperCase() || user.email[0].toUpperCase()}
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {user.name || 'User'}
                  </p>
                  <p className="text-xs text-gray-500 truncate">
                    {user.email}
                  </p>
                </div>
              </div>
              <LogoutButton
                variant="secondary"
                size="sm"
                className="w-full touch-manipulation"
              />
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}
```

### 5. Make NavItem Touch-Friendly
Update `web/src/components/dashboard/navigation/NavItem.tsx`:
```typescript
'use client';

import Link from 'next/link';
import { ReactNode } from 'react';

interface NavItemProps {
  href: string;
  icon: ReactNode;
  label: string;
  badge?: number;
  isActive?: boolean;
  onClick?: () => void;
  isMobile?: boolean;
}

export function NavItem({
  href,
  icon,
  label,
  badge,
  isActive = false,
  onClick,
  isMobile = false,
}: NavItemProps) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className={`
        flex items-center justify-between
        px-3 sm:px-4 py-3 sm:py-3.5 rounded-lg
        transition-colors duration-200
        touch-manipulation
        ${isMobile ? 'min-h-[48px]' : 'min-h-[44px]'}
        ${
          isActive
            ? 'bg-blue-50 text-blue-600'
            : 'text-gray-700 hover:bg-gray-100 active:bg-gray-200'
        }
      `}
    >
      <div className="flex items-center space-x-3">
        <span className={isActive ? 'text-blue-600' : 'text-gray-500'}>
          {icon}
        </span>
        <span className="font-medium text-sm sm:text-base">{label}</span>
      </div>
      {badge !== undefined && badge > 0 && (
        <span className="px-2 py-0.5 sm:py-1 text-xs font-semibold text-white bg-blue-600 rounded-full min-w-[20px] text-center">
          {badge}
        </span>
      )}
    </Link>
  );
}
```

### 6. Make Todo Components Responsive
Update `web/src/components/todos/TodoItem.tsx` for touch interactions:
```typescript
// Add touch-friendly button sizes
<button
  onClick={handleToggle}
  disabled={isUpdating}
  className="mt-1 flex-shrink-0 touch-manipulation min-w-[44px] min-h-[44px] flex items-center justify-center"
>
  {/* ... checkbox content ... */}
</button>

// Make action buttons larger on mobile
<div className="flex items-center space-x-1 sm:space-x-2">
  <button
    onClick={() => setIsEditing(true)}
    className="p-2 sm:p-2.5 text-gray-400 hover:text-blue-600 transition-colors touch-manipulation min-w-[44px] min-h-[44px] flex items-center justify-center"
    title="Edit"
  >
    {/* ... icon ... */}
  </button>
  <button
    onClick={() => onDelete(todo.id)}
    className="p-2 sm:p-2.5 text-gray-400 hover:text-red-600 transition-colors touch-manipulation min-w-[44px] min-h-[44px] flex items-center justify-center"
    title="Delete"
  >
    {/* ... icon ... */}
  </button>
</div>
```

### 7. Make Dashboard Stats Responsive
Update `web/src/app/dashboard/page.tsx`:
```typescript
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
  {/* Stat Cards with responsive sizing */}
  <Link href="/todos" className="block">
    <div className="bg-white p-4 sm:p-6 rounded-lg shadow hover:shadow-md transition-shadow cursor-pointer touch-manipulation">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xs sm:text-sm font-medium text-gray-500">Total Todos</h3>
          <p className="mt-1 sm:mt-2 text-2xl sm:text-3xl font-bold text-gray-900">{stats.total}</p>
        </div>
        <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-100 rounded-lg flex items-center justify-center">
          <svg className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {/* ... icon ... */}
          </svg>
        </div>
      </div>
    </div>
  </Link>
  {/* ... other stat cards ... */}
</div>
```

### 8. Add Responsive Utility Hook
Create `web/src/hooks/useResponsive.ts`:
```typescript
'use client';

import { useState, useEffect } from 'react';

export function useResponsive() {
  const [windowSize, setWindowSize] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 0,
    height: typeof window !== 'undefined' ? window.innerHeight : 0,
  });

  useEffect(() => {
    function handleResize() {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    }

    window.addEventListener('resize', handleResize);
    handleResize();

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return {
    width: windowSize.width,
    height: windowSize.height,
    isMobile: windowSize.width < 768,
    isTablet: windowSize.width >= 768 && windowSize.width < 1024,
    isDesktop: windowSize.width >= 1024,
  };
}
```

### 9. Optimize for Touch Interactions
Add to `web/src/styles/globals.css`:
```css
/* Touch-friendly interactions */
@layer utilities {
  .touch-manipulation {
    touch-action: manipulation;
    -webkit-tap-highlight-color: transparent;
  }

  /* Minimum touch target size (44x44px) */
  .touch-target {
    min-width: 44px;
    min-height: 44px;
  }

  /* Smooth scrolling on mobile */
  @media (max-width: 768px) {
    * {
      -webkit-overflow-scrolling: touch;
    }
  }

  /* Prevent text selection on buttons */
  button,
  a {
    -webkit-user-select: none;
    user-select: none;
  }

  /* Improve tap response */
  button:active,
  a:active {
    opacity: 0.7;
  }
}

/* Responsive font sizes */
@layer base {
  html {
    font-size: 16px;
  }

  @media (max-width: 640px) {
    html {
      font-size: 14px;
    }
  }
}
```

### 10. Test Responsive Behavior
**Desktop Testing (≥1024px):**
1. Sidebar always visible
2. Full navigation menu
3. Search bar visible
4. 3-column grid for stats
5. Hover states work

**Tablet Testing (768-1023px):**
1. Sidebar collapsible
2. 2-column grid for stats
3. Touch-friendly buttons
4. Adequate spacing

**Mobile Testing (<768px):**
1. Hamburger menu works
2. Sidebar slides in from left
3. Overlay closes sidebar
4. 1-column layout
5. Touch targets ≥44px
6. No horizontal scroll
7. Text readable without zoom

**Test on Real Devices:**
- iPhone (Safari)
- Android phone (Chrome)
- iPad (Safari)
- Android tablet (Chrome)

**Test Orientations:**
- Portrait mode
- Landscape mode
- Rotation transitions

## Output
- ✅ Fully responsive dashboard layout
- ✅ Mobile-first design approach
- ✅ Touch-friendly interactions (≥44px targets)
- ✅ Collapsible sidebar on mobile
- ✅ Responsive grid layouts
- ✅ Optimized typography for all screens
- ✅ Smooth transitions and animations
- ✅ No horizontal scroll on mobile
- ✅ Tested on multiple devices

## Failure Handling

### Error: "Horizontal scroll on mobile"
**Solution**:
1. Check for fixed widths without max-width
2. Verify all containers use responsive units
3. Add `overflow-x-hidden` to body if needed
4. Test with browser DevTools mobile view

### Error: "Sidebar not closing on mobile"
**Solution**:
1. Verify overlay click handler is attached
2. Check z-index values are correct
3. Ensure state updates properly
4. Test touch events vs click events

### Error: "Touch targets too small"
**Solution**:
1. Add `min-w-[44px] min-h-[44px]` to buttons
2. Increase padding on interactive elements
3. Use `touch-manipulation` class
4. Test with accessibility tools

### Error: "Layout shifts on resize"
**Solution**:
1. Use CSS transitions for smooth changes
2. Avoid changing layout in resize handler
3. Debounce resize events
4. Use CSS media queries instead of JS

### Error: "Text too small on mobile"
**Solution**:
1. Use responsive font sizes (rem units)
2. Set minimum font size in CSS
3. Test readability without zoom
4. Follow WCAG guidelines (16px minimum)

### Error: "Performance issues on mobile"
**Solution**:
1. Optimize images (use WebP, lazy loading)
2. Reduce JavaScript bundle size
3. Use CSS transforms for animations
4. Minimize re-renders
5. Use React.memo for expensive components

## Validation Checklist
- [ ] Mobile menu opens/closes smoothly
- [ ] Sidebar overlay works on mobile
- [ ] Touch targets are ≥44px
- [ ] No horizontal scroll on any screen size
- [ ] Text readable without zoom
- [ ] Grid layouts adapt to screen size
- [ ] Images scale properly
- [ ] Forms usable on mobile
- [ ] Navigation accessible on all devices
- [ ] Tested on iPhone Safari
- [ ] Tested on Android Chrome
- [ ] Tested on iPad
- [ ] Tested in portrait and landscape
- [ ] Performance acceptable on mobile
- [ ] Accessibility standards met

## Best Practices
- Use mobile-first approach (start with mobile styles)
- Follow 44px minimum touch target size
- Use relative units (rem, em, %) over fixed pixels
- Implement smooth transitions for better UX
- Test on real devices, not just emulators
- Optimize images for mobile bandwidth
- Use CSS Grid and Flexbox for layouts
- Implement proper viewport meta tag
- Avoid fixed positioning on mobile when possible
- Use system fonts for better performance
- Implement proper focus states for keyboard navigation
- Test with slow 3G network throttling
- Consider offline functionality
- Implement proper error boundaries
- Use semantic HTML for better accessibility
