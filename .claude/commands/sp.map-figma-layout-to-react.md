# Skill: Map Figma Layout to React

## Purpose
Analyze Figma design specifications and create a structured React component hierarchy that accurately represents the dashboard layout, identifying reusable components, layout patterns, and data flow requirements.

## When to Use
- Starting dashboard UI implementation from Figma designs
- Need to plan component structure before coding
- Want to ensure design fidelity and maintainability
- Before creating any dashboard components
- When transitioning from design to development phase

## Inputs
- Figma design URL or exported design specifications
- Design system documentation (colors, typography, spacing)
- List of required dashboard features (todos, profile, settings)
- Existing component library (Button, Input, LoadingSpinner, etc.)

## Step-by-Step Process

### 1. Access and Analyze Figma Design
**If Figma URL provided:**
1. Open Figma file in browser
2. Enable "Dev Mode" (right sidebar)
3. Inspect layout structure and spacing
4. Note component variants and states
5. Export design tokens (colors, fonts, spacing)

**If design specifications provided:**
1. Review layout mockups
2. Identify common patterns
3. Note responsive breakpoints
4. Document component states

### 2. Identify Layout Structure
Create `web/docs/dashboard-layout-analysis.md`:
```markdown
# Dashboard Layout Analysis

## Overall Structure
```
┌─────────────────────────────────────────┐
│ Header (fixed, 64px height)             │
├──────────┬──────────────────────────────┤
│          │                              │
│ Sidebar  │  Main Content Area           │
│ (256px)  │  (flex-1)                    │
│          │                              │
│ - Nav    │  - Page Header               │
│ - Links  │  - Content Cards             │
│ - User   │  - Data Tables               │
│          │  - Forms                     │
│          │                              │
└──────────┴──────────────────────────────┘
```

## Component Hierarchy
- DashboardLayout
  - Header
    - Logo
    - SearchBar (optional)
    - NotificationBell
    - UserMenu
  - Sidebar
    - Navigation
      - NavItem (Dashboard)
      - NavItem (Todos)
      - NavItem (Profile)
      - NavItem (Settings)
    - UserProfile
    - LogoutButton
  - MainContent
    - PageHeader
    - ContentArea
      - [Dynamic page content]

## Responsive Behavior
- Desktop (≥1024px): Sidebar visible, full layout
- Tablet (768px-1023px): Collapsible sidebar
- Mobile (<768px): Hidden sidebar, hamburger menu
```

### 3. Map Design Elements to React Components
Create component mapping document `web/docs/component-mapping.md`:
```markdown
# Figma to React Component Mapping

## Layout Components

### Header Component
**Figma Frame**: "Header / Desktop"
**React Component**: `web/src/components/dashboard/Header.tsx`
**Props**:
- `user`: User object
- `onMenuToggle`: () => void (for mobile)

**Children**:
- Logo (link to dashboard)
- Search bar (optional)
- Notification icon
- User dropdown menu

### Sidebar Component
**Figma Frame**: "Sidebar / Navigation"
**React Component**: `web/src/components/dashboard/Sidebar.tsx`
**Props**:
- `isOpen`: boolean (for mobile)
- `onClose`: () => void
- `currentPath`: string

**Children**:
- Navigation links
- User profile section
- Logout button

### MainContent Component
**Figma Frame**: "Content Area"
**React Component**: `web/src/components/dashboard/MainContent.tsx`
**Props**:
- `children`: ReactNode
- `title`: string (page title)
- `actions`: ReactNode (optional header actions)

## Reusable Components

### NavItem
**Figma Component**: "Nav Item / Default"
**React Component**: `web/src/components/dashboard/NavItem.tsx`
**States**: default, hover, active
**Props**:
- `href`: string
- `icon`: ReactNode
- `label`: string
- `isActive`: boolean

### StatCard
**Figma Component**: "Stat Card"
**React Component**: `web/src/components/dashboard/StatCard.tsx`
**Props**:
- `title`: string
- `value`: string | number
- `icon`: ReactNode
- `trend`: 'up' | 'down' | 'neutral'
- `trendValue`: string

### DataTable
**Figma Component**: "Table / Default"
**React Component**: `web/src/components/dashboard/DataTable.tsx`
**Props**:
- `columns`: Column[]
- `data`: any[]
- `onRowClick`: (row: any) => void
```

### 4. Extract Design Tokens
Create `web/src/styles/design-tokens.ts`:
```typescript
/**
 * Design tokens extracted from Figma
 * Auto-generated from Figma design system
 */

export const colors = {
  // Primary colors
  primary: {
    50: '#eff6ff',
    100: '#dbeafe',
    500: '#3b82f6',
    600: '#2563eb',
    700: '#1d4ed8',
  },
  // Neutral colors
  gray: {
    50: '#f9fafb',
    100: '#f3f4f6',
    200: '#e5e7eb',
    500: '#6b7280',
    900: '#111827',
  },
  // Semantic colors
  success: '#10b981',
  warning: '#f59e0b',
  error: '#ef4444',
  info: '#3b82f6',
};

export const spacing = {
  xs: '0.25rem',   // 4px
  sm: '0.5rem',    // 8px
  md: '1rem',      // 16px
  lg: '1.5rem',    // 24px
  xl: '2rem',      // 32px
  '2xl': '3rem',   // 48px
};

export const typography = {
  fontFamily: {
    sans: 'Inter, system-ui, sans-serif',
    mono: 'Fira Code, monospace',
  },
  fontSize: {
    xs: '0.75rem',   // 12px
    sm: '0.875rem',  // 14px
    base: '1rem',    // 16px
    lg: '1.125rem',  // 18px
    xl: '1.25rem',   // 20px
    '2xl': '1.5rem', // 24px
    '3xl': '1.875rem', // 30px
  },
  fontWeight: {
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
  },
};

export const borderRadius = {
  sm: '0.25rem',   // 4px
  md: '0.375rem',  // 6px
  lg: '0.5rem',    // 8px
  xl: '0.75rem',   // 12px
  full: '9999px',
};

export const shadows = {
  sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
  md: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
  lg: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
  xl: '0 20px 25px -5px rgb(0 0 0 / 0.1)',
};
```

### 5. Create Component File Structure
Generate file structure plan:
```bash
web/src/components/dashboard/
├── layout/
│   ├── DashboardLayout.tsx      # Main layout wrapper
│   ├── Header.tsx                # Top header bar
│   ├── Sidebar.tsx               # Left sidebar navigation
│   └── MainContent.tsx           # Content area wrapper
├── navigation/
│   ├── NavItem.tsx               # Single navigation item
│   ├── NavGroup.tsx              # Grouped navigation items
│   └── MobileMenu.tsx            # Mobile hamburger menu
├── cards/
│   ├── StatCard.tsx              # Statistics card
│   ├── TodoCard.tsx              # Todo summary card
│   └── ActivityCard.tsx          # Recent activity card
└── widgets/
    ├── UserMenu.tsx              # User dropdown menu
    ├── NotificationBell.tsx      # Notifications
    └── SearchBar.tsx             # Global search
```

### 6. Define Component Props and Types
Create `web/src/types/dashboard.ts`:
```typescript
import { ReactNode } from 'react';

export interface DashboardLayoutProps {
  children: ReactNode;
}

export interface HeaderProps {
  user: {
    name: string;
    email: string;
    image?: string;
  };
  onMenuToggle: () => void;
}

export interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  currentPath: string;
}

export interface NavItemProps {
  href: string;
  icon: ReactNode;
  label: string;
  isActive?: boolean;
  badge?: number;
}

export interface StatCardProps {
  title: string;
  value: string | number;
  icon: ReactNode;
  trend?: {
    direction: 'up' | 'down' | 'neutral';
    value: string;
  };
  color?: 'blue' | 'green' | 'orange' | 'red';
}

export interface MainContentProps {
  children: ReactNode;
  title?: string;
  subtitle?: string;
  actions?: ReactNode;
}
```

### 7. Create Component Implementation Checklist
Create `web/docs/dashboard-implementation-checklist.md`:
```markdown
# Dashboard Implementation Checklist

## Phase 1: Layout Components
- [ ] DashboardLayout.tsx - Main wrapper
- [ ] Header.tsx - Top navigation
- [ ] Sidebar.tsx - Side navigation
- [ ] MainContent.tsx - Content wrapper

## Phase 2: Navigation Components
- [ ] NavItem.tsx - Navigation link
- [ ] NavGroup.tsx - Grouped links
- [ ] MobileMenu.tsx - Mobile navigation

## Phase 3: UI Components
- [ ] StatCard.tsx - Statistics display
- [ ] UserMenu.tsx - User dropdown
- [ ] NotificationBell.tsx - Notifications

## Phase 4: Integration
- [ ] Integrate existing Todo components
- [ ] Connect to auth context
- [ ] Add routing
- [ ] Implement responsive behavior

## Phase 5: Polish
- [ ] Add loading states
- [ ] Add error boundaries
- [ ] Add animations
- [ ] Test accessibility
```

### 8. Document Data Flow
Create data flow diagram in `web/docs/dashboard-data-flow.md`:
```markdown
# Dashboard Data Flow

## Authentication Flow
```
User Login → Auth Context → Dashboard Layout → Protected Routes
```

## Todo Data Flow
```
Dashboard → TodoList Component → API Client → Backend API
                ↓
         Todo State (React Query/SWR)
                ↓
         TodoItem Components
```

## Navigation Flow
```
User Click → Next.js Router → Route Change → Component Mount
                                    ↓
                            Update Active Nav Item
```

## User Profile Flow
```
Auth Context → Header Component → UserMenu → Profile/Logout Actions
```
```

## Output
- ✅ Complete component hierarchy documented
- ✅ Figma-to-React mapping created
- ✅ Design tokens extracted and typed
- ✅ File structure planned
- ✅ Component props and types defined
- ✅ Implementation checklist created
- ✅ Data flow documented
- ✅ Ready for component implementation

## Failure Handling

### Error: "Cannot access Figma file"
**Solution**:
1. Request view/edit access from design team
2. Ask for exported PNG/PDF mockups
3. Use design specifications document
4. Create layout based on common dashboard patterns

### Error: "Design tokens don't match Tailwind"
**Solution**:
1. Map Figma tokens to Tailwind classes
2. Extend Tailwind config with custom values
3. Use CSS variables for custom tokens
4. Document mapping in `tailwind.config.js`

### Error: "Component hierarchy too complex"
**Solution**:
1. Break down into smaller components
2. Identify reusable patterns
3. Create composition over inheritance
4. Use compound component pattern

### Error: "Missing design specifications"
**Solution**:
1. Use existing Todo app components as reference
2. Follow Material Design or Ant Design patterns
3. Create minimal viable layout first
4. Iterate based on feedback

### Error: "Responsive breakpoints unclear"
**Solution**:
1. Use standard Tailwind breakpoints (sm, md, lg, xl)
2. Test on common device sizes
3. Follow mobile-first approach
4. Document responsive behavior

## Validation Checklist
- [ ] All Figma frames mapped to React components
- [ ] Component hierarchy documented
- [ ] Design tokens extracted
- [ ] File structure created
- [ ] Component types defined
- [ ] Props interfaces documented
- [ ] Data flow mapped
- [ ] Implementation checklist created
- [ ] Responsive behavior documented
- [ ] Reusable components identified
- [ ] No duplicate components
- [ ] Naming conventions consistent

## Best Practices
- Use semantic HTML elements (nav, header, main, aside)
- Follow atomic design principles (atoms, molecules, organisms)
- Keep components small and focused
- Use composition over prop drilling
- Document component variants and states
- Plan for loading and error states
- Consider accessibility from the start
- Use TypeScript for type safety
- Follow Next.js App Router conventions
- Leverage existing UI components
- Plan for internationalization if needed
- Document component dependencies
