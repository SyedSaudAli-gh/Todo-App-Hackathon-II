# Skill: Build Dashboard Shell

## Purpose
Create the foundational dashboard layout structure with sidebar navigation, header bar, and main content area, establishing the visual framework for all dashboard pages.

## When to Use
- After completing `map-figma-layout-to-react` skill
- Ready to implement the dashboard layout structure
- Need to create navigation and page structure
- Before integrating specific page content (todos, profile, etc.)
- Starting dashboard UI development

## Inputs
- Component hierarchy from mapping phase
- Design tokens and styling specifications
- Navigation menu items and routes
- User authentication context
- Existing UI components (Button, LoadingSpinner, etc.)

## Step-by-Step Process

### 1. Create Dashboard Layout Component
Create `web/src/components/dashboard/layout/DashboardLayout.tsx`:
```typescript
'use client';

import { useState } from 'react';
import { Header } from './Header';
import { Sidebar } from './Sidebar';
import { usePathname } from 'next/navigation';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <Header onMenuToggle={() => setSidebarOpen(!sidebarOpen)} />

      <div className="flex h-[calc(100vh-64px)]">
        {/* Sidebar */}
        <Sidebar
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          currentPath={pathname}
        />

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto">
          <div className="container mx-auto px-4 py-6 max-w-7xl">
            {children}
          </div>
        </main>
      </div>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
}
```

### 2. Create Header Component
Create `web/src/components/dashboard/layout/Header.tsx`:
```typescript
'use client';

import Link from 'next/link';
import { useAuth } from '@/lib/auth/AuthProvider';
import { UserMenu } from '../widgets/UserMenu';

interface HeaderProps {
  onMenuToggle: () => void;
}

export function Header({ onMenuToggle }: HeaderProps) {
  const { user, isLoading } = useAuth();

  return (
    <header className="bg-white border-b border-gray-200 h-16 fixed top-0 left-0 right-0 z-50">
      <div className="h-full px-4 flex items-center justify-between">
        {/* Left Section */}
        <div className="flex items-center space-x-4">
          {/* Mobile Menu Button */}
          <button
            onClick={onMenuToggle}
            className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
            aria-label="Toggle menu"
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

          {/* Logo */}
          <Link href="/dashboard" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">T</span>
            </div>
            <span className="text-xl font-bold text-gray-900 hidden sm:block">
              Todo App
            </span>
          </Link>
        </div>

        {/* Right Section */}
        <div className="flex items-center space-x-4">
          {/* Search Bar (Optional) */}
          <div className="hidden md:block">
            <input
              type="search"
              placeholder="Search..."
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-64"
            />
          </div>

          {/* Notifications (Optional) */}
          <button className="p-2 rounded-lg hover:bg-gray-100 transition-colors relative">
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
                d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
              />
            </svg>
            {/* Notification Badge */}
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
          </button>

          {/* User Menu */}
          {isLoading ? (
            <div className="w-8 h-8 bg-gray-200 rounded-full animate-pulse" />
          ) : (
            user && <UserMenu user={user} />
          )}
        </div>
      </div>
    </header>
  );
}
```

### 3. Create Sidebar Component
Create `web/src/components/dashboard/layout/Sidebar.tsx`:
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
}

export function Sidebar({ isOpen, onClose, currentPath }: SidebarProps) {
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
      badge: 5, // Dynamic count
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
    <>
      {/* Sidebar */}
      <aside
        className={`
          fixed lg:static inset-y-0 left-0 z-50
          w-64 bg-white border-r border-gray-200
          transform transition-transform duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          mt-16 lg:mt-0
        `}
      >
        <div className="h-full flex flex-col">
          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
            {navigationItems.map((item) => (
              <NavItem
                key={item.href}
                href={item.href}
                icon={item.icon}
                label={item.label}
                badge={item.badge}
                isActive={currentPath === item.href}
                onClick={onClose}
              />
            ))}
          </nav>

          {/* User Section */}
          <div className="p-4 border-t border-gray-200">
            {user && (
              <div className="mb-4">
                <div className="flex items-center space-x-3 mb-3">
                  {user.image ? (
                    <img
                      src={user.image}
                      alt={user.name || 'User'}
                      className="w-10 h-10 rounded-full"
                    />
                  ) : (
                    <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold">
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
                <LogoutButton variant="secondary" size="sm" className="w-full" />
              </div>
            )}
          </div>
        </div>
      </aside>
    </>
  );
}
```

### 4. Create Navigation Item Component
Create `web/src/components/dashboard/navigation/NavItem.tsx`:
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
}

export function NavItem({
  href,
  icon,
  label,
  badge,
  isActive = false,
  onClick,
}: NavItemProps) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className={`
        flex items-center justify-between px-4 py-3 rounded-lg
        transition-colors duration-200
        ${
          isActive
            ? 'bg-blue-50 text-blue-600'
            : 'text-gray-700 hover:bg-gray-100'
        }
      `}
    >
      <div className="flex items-center space-x-3">
        <span className={isActive ? 'text-blue-600' : 'text-gray-500'}>
          {icon}
        </span>
        <span className="font-medium">{label}</span>
      </div>
      {badge !== undefined && badge > 0 && (
        <span className="px-2 py-1 text-xs font-semibold text-white bg-blue-600 rounded-full">
          {badge}
        </span>
      )}
    </Link>
  );
}
```

### 5. Create User Menu Widget
Create `web/src/components/dashboard/widgets/UserMenu.tsx`:
```typescript
'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { LogoutButton } from '@/components/auth/LogoutButton';

interface User {
  name: string | null;
  email: string;
  image?: string | null;
}

interface UserMenuProps {
  user: User;
}

export function UserMenu({ user }: UserMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={menuRef}>
      {/* User Avatar Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 p-1 rounded-lg hover:bg-gray-100 transition-colors"
      >
        {user.image ? (
          <img
            src={user.image}
            alt={user.name || 'User'}
            className="w-8 h-8 rounded-full"
          />
        ) : (
          <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
            {user.name?.[0]?.toUpperCase() || user.email[0].toUpperCase()}
          </div>
        )}
        <svg
          className={`w-4 h-4 text-gray-600 transition-transform ${
            isOpen ? 'rotate-180' : ''
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
          {/* User Info */}
          <div className="px-4 py-3 border-b border-gray-200">
            <p className="text-sm font-medium text-gray-900">
              {user.name || 'User'}
            </p>
            <p className="text-xs text-gray-500 truncate">{user.email}</p>
          </div>

          {/* Menu Items */}
          <div className="py-2">
            <Link
              href="/profile"
              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              onClick={() => setIsOpen(false)}
            >
              <div className="flex items-center space-x-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                <span>Profile</span>
              </div>
            </Link>
            <Link
              href="/settings"
              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              onClick={() => setIsOpen(false)}
            >
              <div className="flex items-center space-x-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span>Settings</span>
              </div>
            </Link>
          </div>

          {/* Logout */}
          <div className="px-4 py-2 border-t border-gray-200">
            <LogoutButton variant="secondary" size="sm" className="w-full" />
          </div>
        </div>
      )}
    </div>
  );
}
```

### 6. Create Main Content Wrapper
Create `web/src/components/dashboard/layout/MainContent.tsx`:
```typescript
import { ReactNode } from 'react';

interface MainContentProps {
  children: ReactNode;
  title?: string;
  subtitle?: string;
  actions?: ReactNode;
}

export function MainContent({
  children,
  title,
  subtitle,
  actions,
}: MainContentProps) {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      {(title || actions) && (
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            {title && (
              <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
            )}
            {subtitle && (
              <p className="mt-1 text-sm text-gray-600">{subtitle}</p>
            )}
          </div>
          {actions && <div className="flex items-center space-x-3">{actions}</div>}
        </div>
      )}

      {/* Page Content */}
      <div>{children}</div>
    </div>
  );
}
```

### 7. Update Dashboard Page to Use Layout
Update `web/src/app/dashboard/page.tsx`:
```typescript
'use client';

import { DashboardLayout } from '@/components/dashboard/layout/DashboardLayout';
import { MainContent } from '@/components/dashboard/layout/MainContent';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';

function DashboardContent() {
  return (
    <MainContent
      title="Dashboard"
      subtitle="Welcome back! Here's an overview of your todos."
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Stat Cards */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-sm font-medium text-gray-500">Total Todos</h3>
          <p className="mt-2 text-3xl font-bold text-gray-900">12</p>
          <p className="mt-2 text-sm text-gray-600">
            <span className="text-green-600">↑ 2</span> from last week
          </p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-sm font-medium text-gray-500">Completed</h3>
          <p className="mt-2 text-3xl font-bold text-green-600">8</p>
          <p className="mt-2 text-sm text-gray-600">67% completion rate</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-sm font-medium text-gray-500">Pending</h3>
          <p className="mt-2 text-3xl font-bold text-orange-600">4</p>
          <p className="mt-2 text-sm text-gray-600">Due this week</p>
        </div>
      </div>
    </MainContent>
  );
}

export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <DashboardLayout>
        <DashboardContent />
      </DashboardLayout>
    </ProtectedRoute>
  );
}
```

### 8. Test Dashboard Shell
1. Start dev server: `npm run dev`
2. Navigate to `/dashboard`
3. Verify header displays with logo and user menu
4. Verify sidebar shows navigation items
5. Verify active nav item is highlighted
6. Test mobile menu toggle (resize browser)
7. Test user menu dropdown
8. Test navigation between pages
9. Verify responsive behavior

## Output
- ✅ Complete dashboard layout structure
- ✅ Fixed header with logo and user menu
- ✅ Collapsible sidebar with navigation
- ✅ Main content area with page wrapper
- ✅ Mobile-responsive menu
- ✅ Active navigation highlighting
- ✅ User profile display
- ✅ Logout functionality integrated
- ✅ Ready for content integration

## Failure Handling

### Error: "Layout not rendering"
**Solution**:
1. Verify all components are exported correctly
2. Check import paths are correct
3. Ensure 'use client' directive is present
4. Check for TypeScript errors

### Error: "Sidebar not showing on mobile"
**Solution**:
1. Verify z-index values are correct
2. Check transform classes are applied
3. Ensure overlay is rendering
4. Test with browser DevTools mobile view

### Error: "Navigation not highlighting active page"
**Solution**:
1. Verify `usePathname()` is working
2. Check `currentPath` prop is passed correctly
3. Ensure `isActive` logic matches routes
4. Test with exact path matching

### Error: "User menu not closing"
**Solution**:
1. Verify click outside handler is attached
2. Check ref is assigned to menu container
3. Ensure event listener cleanup in useEffect
4. Test with React DevTools

### Error: "Header overlapping content"
**Solution**:
1. Add `mt-16` to main content (header height)
2. Verify fixed positioning on header
3. Check z-index values
4. Adjust padding/margin as needed

## Validation Checklist
- [ ] DashboardLayout component created
- [ ] Header component with logo and user menu
- [ ] Sidebar component with navigation
- [ ] NavItem component with active state
- [ ] UserMenu dropdown working
- [ ] Mobile menu toggle functional
- [ ] Sidebar overlay on mobile
- [ ] Active navigation highlighting
- [ ] Responsive layout (mobile, tablet, desktop)
- [ ] User profile displays correctly
- [ ] Logout button works
- [ ] No layout shift on page load
- [ ] Smooth transitions and animations
- [ ] Accessibility (keyboard navigation, ARIA labels)

## Best Practices
- Use semantic HTML (header, nav, main, aside)
- Implement keyboard navigation
- Add ARIA labels for accessibility
- Use CSS transitions for smooth animations
- Keep sidebar width consistent
- Implement proper z-index layering
- Test on multiple screen sizes
- Use Tailwind responsive classes
- Optimize for performance (avoid unnecessary re-renders)
- Document component props and usage
- Follow Next.js App Router conventions
- Use TypeScript for type safety
