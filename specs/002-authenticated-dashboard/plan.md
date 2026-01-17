# Implementation Plan: Authenticated Dashboard Upgrade

**Branch**: `002-authenticated-dashboard` | **Date**: 2026-01-07 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/002-authenticated-dashboard/spec.md`

**Note**: This template is filled in by the `/sp.plan` command. See `.specify/templates/commands/plan.md` for the execution workflow.

## Summary

Transform the Phase II Todo App frontend into a modern, authenticated dashboard experience with Better Auth integration (Email/Password + OAuth), Figma-based layout, light/dark theme system, and shadcn/ui components with animations. This is a **frontend-only upgrade** that preserves all existing backend APIs and database schema while adding authentication, dashboard layout, theme management, and UI polish.

## Technical Context

**Project Type**: Phase II Full-Stack Web Application (Frontend-Only Upgrade)

### Phase II Full-Stack Web Application

**Frontend** (Upgrade Target):
- Framework: Next.js 15+ with App Router (existing)
- UI Library: React 19+ with hooks (existing)
- Language: TypeScript 5+ (strict mode) (existing)
- Styling: Tailwind CSS 3+ (existing)
- **NEW**: Authentication: Better Auth (email/password + OAuth)
- **NEW**: Component Library: shadcn/ui
- **NEW**: Theme Management: React Context + localStorage
- State Management: React hooks, Context API (existing + theme context)
- HTTP Client: fetch API (existing)
- Deployment: Vercel (recommended)

**Backend** (No Changes):
- Framework: FastAPI 0.100+ (existing, unchanged)
- Language: Python 3.13+ (existing, unchanged)
- Validation: Pydantic v2 (existing, unchanged)
- ORM: SQLModel (existing, unchanged)
- Migrations: Alembic (existing, unchanged)
- Documentation: OpenAPI/Swagger (existing, unchanged)
- API Endpoints: `/api/v1/todos` (existing, unchanged)

**Database** (No Changes):
- Database: Neon PostgreSQL (existing, unchanged)
- ORM: SQLModel (existing, unchanged)
- Schema: Todo table (existing, unchanged - no user_id field)
- Note: Todos remain shared across all users (backend constraint)

**Authentication** (New):
- Library: Better Auth (Next.js authentication library)
- Providers: Email/Password, Google OAuth, Facebook OAuth, LinkedIn OAuth
- Session Management: Better Auth built-in (cookies/localStorage)
- User Storage: Better Auth managed (no custom user table needed)

**UI Components** (New):
- Component Library: shadcn/ui (Radix UI + Tailwind CSS)
- Components: Button, Input, Card, Dialog, Toast, Skeleton
- Animations: Framer Motion or CSS transitions
- Icons: Lucide React or Heroicons

**Testing**:
- Frontend: Jest, React Testing Library (existing)
- E2E: Playwright or Cypress (existing)
- **NEW**: Auth flow tests (login, signup, OAuth, session persistence)
- **NEW**: Theme toggle tests (light/dark mode switching)
- **NEW**: Todo CRUD regression tests (ensure no breaking changes)

### Performance Goals
- Authentication completion: < 30 seconds (SC-001)
- Redirect time (unauthenticated): < 100ms (SC-002)
- Dashboard render time: < 2 seconds on 10 Mbps connection (SC-003)
- Theme toggle: < 300ms with smooth transition (SC-004)
- API response time: < 500ms p95 (existing backend standard)

### Constraints
- **CRITICAL**: No backend API modifications allowed
- **CRITICAL**: No database schema changes allowed
- **CRITICAL**: Existing todo CRUD must work without regression
- OAuth credentials via environment variables only
- Theme colors must meet WCAG AA contrast ratios (4.5:1)
- Mobile-first responsive design (< 768px, 768-1023px, ≥ 1024px)
- Zero console errors in production build (SC-006)

### Scale/Scope
- User Scale: Small to medium (100-1000 users initially)
- UI Scope: 4 main pages (Login, Signup, Dashboard, Todos)
- Component Count: ~15-20 components (layout, auth, todo, theme)
- OAuth Providers: 3 (Google, Facebook, LinkedIn)
- Theme Modes: 2 (light, dark) + system preference detection

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

### Phase II Requirements Compliance

**✅ Uses approved technology stack (Next.js, FastAPI, Neon)**
- Frontend: Next.js 15+ with React 19+, TypeScript 5+, Tailwind CSS 3+ (existing)
- Backend: FastAPI 0.100+ with Python 3.13+ (existing, unchanged)
- Database: Neon PostgreSQL (existing, unchanged)
- **NEW**: Better Auth (approved authentication library for Next.js)
- **NEW**: shadcn/ui (approved component library built on Radix UI + Tailwind)

**✅ API-first architecture (Frontend → API → Database)**
- All todo operations go through existing `/api/v1/todos` endpoints
- No direct database access from frontend
- Better Auth manages user sessions client-side (no backend user API needed)
- Frontend communicates with backend exclusively via REST API

**✅ Frontend-backend separation (no direct DB access from frontend)**
- Frontend: Authentication UI, dashboard layout, theme management, todo UI
- Backend: Todo CRUD business logic (existing, unchanged)
- Database: Todo persistence (existing, unchanged)
- Clear separation maintained: web/ (frontend) and api/ (backend)

**✅ Persistent storage (Neon PostgreSQL, not in-memory)**
- Todos persist in Neon PostgreSQL via existing SQLModel schema
- User sessions managed by Better Auth (cookies/localStorage)
- Theme preferences stored in localStorage (client-side only)
- No in-memory storage for application data

**✅ No Phase I patterns (in-memory, CLI, positional indexes)**
- No in-memory lists or dictionaries for todos
- No CLI interfaces (web UI only)
- No positional indexing (use database primary keys)
- Phase I code remains in `src/` for reference only

**✅ Database migrations with Alembic**
- Existing Alembic setup unchanged
- No new migrations needed (no schema changes)
- Todo table schema remains unchanged

**✅ OpenAPI/Swagger documentation**
- Existing FastAPI OpenAPI docs at `/api/v1/docs` unchanged
- No new API endpoints needed
- Better Auth handles authentication endpoints internally

**✅ Proper error handling and validation**
- Frontend: Loading, error, success states for all async operations
- Backend: Existing Pydantic validation unchanged
- Better Auth: Built-in error handling for authentication flows
- User-friendly error messages (no stack traces to users)

### Additional Phase II Compliance

**✅ Security Standards**
- OAuth credentials in environment variables (.env.local)
- No hardcoded secrets or API keys
- CORS properly configured (existing backend)
- Input validation on frontend (Better Auth + form validation)
- XSS prevention through React auto-escaping
- HTTPS in production (Vercel default)

**✅ Accessibility Standards**
- WCAG AA contrast ratios (4.5:1 for normal text)
- Keyboard navigation support
- Screen reader compatibility
- Focus states on interactive elements
- Responsive design (mobile-first)

**✅ Testing Standards**
- Unit tests for components (Jest + React Testing Library)
- Integration tests for auth flows
- E2E tests for critical user journeys
- Regression tests for existing todo CRUD

### Constitution Check Result: ✅ PASS

All Phase II requirements met. No violations. No complexity justification needed.

## Project Structure

### Documentation (this feature)

```text
specs/002-authenticated-dashboard/
├── spec.md              # Feature specification (completed)
├── plan.md              # This file (implementation plan)
├── research.md          # Phase 0 output (Better Auth, shadcn/ui, theme patterns)
├── quickstart.md        # Phase 1 output (setup guide for auth + theme)
├── contracts/           # Phase 1 output (auth flow diagrams, theme API)
│   ├── auth-flows.md    # Authentication flow diagrams
│   └── theme-api.md     # Theme context API contract
├── checklists/
│   └── requirements.md  # Quality checklist (completed)
└── tasks.md             # Phase 2 output (/sp.tasks command - NOT created by /sp.plan)
```

### Source Code (repository root)

**Structure Decision**: Phase II Web Application (Frontend-Only Upgrade)

This feature modifies only the `web/` directory. Backend (`api/`) and database remain unchanged.

```text
web/                                    # Next.js frontend (MODIFICATION TARGET)
├── src/
│   ├── app/                           # Next.js App Router pages
│   │   ├── (auth)/                    # NEW: Auth route group (unauthenticated)
│   │   │   ├── login/                 # NEW: Login page
│   │   │   │   └── page.tsx
│   │   │   └── signup/                # NEW: Signup page
│   │   │       └── page.tsx
│   │   ├── (dashboard)/               # NEW: Dashboard route group (authenticated)
│   │   │   ├── layout.tsx             # NEW: Dashboard layout wrapper
│   │   │   ├── dashboard/             # NEW: Dashboard home page
│   │   │   │   └── page.tsx
│   │   │   └── todos/                 # MODIFIED: Todos page (integrate into dashboard)
│   │   │       └── page.tsx
│   │   ├── layout.tsx                 # MODIFIED: Root layout (add theme provider)
│   │   ├── page.tsx                   # MODIFIED: Root page (redirect logic)
│   │   └── globals.css                # MODIFIED: Add theme CSS variables
│   ├── components/
│   │   ├── auth/                      # NEW: Authentication components
│   │   │   ├── LoginForm.tsx          # NEW: Email/password login form
│   │   │   ├── SignupForm.tsx         # NEW: Email/password signup form
│   │   │   ├── OAuthButtons.tsx       # NEW: Google/Facebook/LinkedIn OAuth buttons
│   │   │   └── ProtectedRoute.tsx     # NEW: Route protection wrapper
│   │   ├── dashboard/                 # NEW: Dashboard layout components
│   │   │   ├── DashboardLayout.tsx    # NEW: Sidebar + header + content wrapper
│   │   │   ├── Sidebar.tsx            # NEW: Navigation sidebar
│   │   │   ├── Header.tsx             # NEW: Top header with user info
│   │   │   └── MobileMenu.tsx         # NEW: Mobile hamburger menu
│   │   ├── theme/                     # NEW: Theme system components
│   │   │   ├── ThemeProvider.tsx      # NEW: Theme context provider
│   │   │   └── ThemeToggle.tsx        # NEW: Light/dark mode toggle button
│   │   ├── todos/                     # MODIFIED: Existing todo components
│   │   │   ├── TodoList.tsx           # MODIFIED: Upgrade to shadcn/ui
│   │   │   ├── TodoForm.tsx           # MODIFIED: Upgrade to shadcn/ui
│   │   │   ├── TodoItem.tsx           # MODIFIED: Upgrade to shadcn/ui
│   │   │   └── EmptyState.tsx         # MODIFIED: Upgrade to shadcn/ui
│   │   └── ui/                        # NEW: shadcn/ui components
│   │       ├── button.tsx             # NEW: shadcn/ui Button
│   │       ├── input.tsx              # NEW: shadcn/ui Input
│   │       ├── card.tsx               # NEW: shadcn/ui Card
│   │       ├── dialog.tsx             # NEW: shadcn/ui Dialog
│   │       ├── toast.tsx              # NEW: shadcn/ui Toast
│   │       ├── skeleton.tsx           # NEW: shadcn/ui Skeleton
│   │       └── ...                    # NEW: Other shadcn/ui components as needed
│   ├── lib/
│   │   ├── api/
│   │   │   ├── client.ts              # EXISTING: API client (unchanged)
│   │   │   └── todos.ts               # EXISTING: Todo API calls (unchanged)
│   │   ├── auth/                      # NEW: Better Auth configuration
│   │   │   ├── auth.ts                # NEW: Better Auth setup
│   │   │   ├── auth-client.ts         # NEW: Client-side auth utilities
│   │   │   └── providers.ts           # NEW: OAuth provider configs
│   │   └── utils.ts                   # EXISTING: Utilities (unchanged)
│   ├── contexts/                      # NEW: React contexts
│   │   ├── ThemeContext.tsx           # NEW: Theme state management
│   │   └── AuthContext.tsx            # NEW: Auth state management (Better Auth wrapper)
│   ├── hooks/                         # NEW: Custom React hooks
│   │   ├── useAuth.ts                 # NEW: Authentication hook
│   │   ├── useTheme.ts                # NEW: Theme management hook
│   │   └── useTodos.ts                # EXISTING: Todo operations (unchanged)
│   └── types/
│       ├── auth.ts                    # NEW: Authentication types
│       ├── theme.ts                   # NEW: Theme types
│       └── todo.ts                    # EXISTING: Todo types (unchanged)
├── public/                            # Static assets
│   └── ...                            # EXISTING: Unchanged
├── tests/
│   ├── unit/                          # Component tests
│   │   ├── auth/                      # NEW: Auth component tests
│   │   ├── dashboard/                 # NEW: Dashboard component tests
│   │   ├── theme/                     # NEW: Theme component tests
│   │   └── todos/                     # MODIFIED: Updated todo component tests
│   └── e2e/                           # End-to-end tests
│       ├── auth.spec.ts               # NEW: Auth flow E2E tests
│       ├── dashboard.spec.ts          # NEW: Dashboard navigation E2E tests
│       ├── theme.spec.ts              # NEW: Theme toggle E2E tests
│       └── todos.spec.ts              # MODIFIED: Todo CRUD regression tests
├── .env.local.example                 # NEW: Environment variables template
├── package.json                       # MODIFIED: Add Better Auth, shadcn/ui deps
├── tailwind.config.ts                 # MODIFIED: Add theme color variables
└── tsconfig.json                      # EXISTING: Unchanged

api/                                    # FastAPI backend (NO CHANGES)
└── [existing structure unchanged]

database/                               # Neon PostgreSQL (NO CHANGES)
└── [existing schema unchanged]
```

**Key Structure Notes**:
- **Frontend-Only Changes**: All modifications in `web/` directory
- **Backend Unchanged**: `api/` directory remains untouched
- **Database Unchanged**: No schema migrations needed
- **Route Groups**: Using Next.js route groups for auth vs dashboard layouts
- **Component Organization**: Clear separation (auth, dashboard, theme, todos, ui)
- **Better Auth Integration**: Configured in `lib/auth/` directory
- **Theme System**: Context-based with localStorage persistence

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

**N/A** - No constitution violations. All Phase II requirements met without exceptions.

## Phase 0: Research & Discovery

### Research Tasks

**1. Better Auth Integration Patterns**
- **Question**: How to configure Better Auth with Next.js 15 App Router?
- **Research**: Better Auth documentation, Next.js 15 authentication patterns
- **Output**: Configuration guide for email/password + OAuth providers
- **Deliverable**: `research.md` section on Better Auth setup

**2. OAuth Provider Configuration**
- **Question**: How to configure Google, Facebook, LinkedIn OAuth with Better Auth?
- **Research**: OAuth 2.0 provider documentation, Better Auth provider configs
- **Output**: Step-by-step OAuth setup for each provider
- **Deliverable**: `research.md` section on OAuth configuration

**3. shadcn/ui Component Integration**
- **Question**: How to integrate shadcn/ui with existing Next.js + Tailwind setup?
- **Research**: shadcn/ui documentation, component installation patterns
- **Output**: Component installation and usage guide
- **Deliverable**: `research.md` section on shadcn/ui setup

**4. Theme System Architecture**
- **Question**: Best practices for light/dark theme with Next.js + Tailwind?
- **Research**: Next.js theme patterns, Tailwind dark mode, localStorage persistence
- **Output**: Theme provider architecture with CSS variables
- **Deliverable**: `research.md` section on theme implementation

**5. Route Protection Patterns**
- **Question**: How to protect routes with Better Auth in Next.js App Router?
- **Research**: Next.js middleware, Better Auth session management
- **Output**: Route protection strategy (middleware vs component-level)
- **Deliverable**: `research.md` section on route protection

**6. Animation Performance**
- **Question**: Best animation library for React (Framer Motion vs CSS transitions)?
- **Research**: Performance benchmarks, bundle size, developer experience
- **Output**: Animation strategy recommendation
- **Deliverable**: `research.md` section on animation approach

**7. Figma Design Translation**
- **Question**: How to extract layout structure from Figma template?
- **Research**: Figma inspection, responsive breakpoints, component hierarchy
- **Output**: Dashboard layout specification (sidebar, header, content dimensions)
- **Deliverable**: `research.md` section on Figma layout analysis

### Research Deliverable

**File**: `specs/002-authenticated-dashboard/research.md`

**Sections**:
1. Better Auth Configuration (email/password + OAuth)
2. OAuth Provider Setup (Google, Facebook, LinkedIn)
3. shadcn/ui Integration (installation, component usage)
4. Theme System Architecture (context, CSS variables, persistence)
5. Route Protection Strategy (middleware vs component-level)
6. Animation Approach (library selection, performance)
7. Figma Layout Analysis (dashboard structure, responsive breakpoints)

## Phase 1: Design & Contracts

### Data Model

**File**: `specs/002-authenticated-dashboard/data-model.md`

**Note**: This feature does not introduce new database entities. All data models are client-side or managed by Better Auth.

**Client-Side Data Models**:

1. **User** (Better Auth managed)
   - Managed by Better Auth library
   - No custom database table needed
   - Session stored in cookies/localStorage

2. **Theme Preference** (localStorage)
   - Key: `theme-preference`
   - Value: `"light" | "dark" | "system"`
   - Persistence: localStorage only (not in database)

3. **Todo** (existing, unchanged)
   - Database: Neon PostgreSQL
   - Table: `todos`
   - Fields: id, title, description, completed, created_at, updated_at
   - Note: No user_id field (shared across all users)

### API Contracts

**Directory**: `specs/002-authenticated-dashboard/contracts/`

**1. Authentication Flows** (`auth-flows.md`)

**Login Flow**:
```
User → LoginForm → Better Auth → Session Created → Redirect to /dashboard
```

**Signup Flow**:
```
User → SignupForm → Better Auth → Account Created → Session Created → Redirect to /dashboard
```

**OAuth Flow**:
```
User → OAuthButton → OAuth Provider → Callback → Better Auth → Session Created → Redirect to /dashboard
```

**Logout Flow**:
```
User → Logout Button → Better Auth → Session Cleared → Redirect to /login
```

**Route Protection Flow**:
```
User → Protected Route → Check Session → If Valid: Render Page | If Invalid: Redirect to /login
```

**2. Theme Context API** (`theme-api.md`)

**ThemeContext Interface**:
```typescript
interface ThemeContextValue {
  theme: "light" | "dark" | "system"
  setTheme: (theme: "light" | "dark" | "system") => void
  resolvedTheme: "light" | "dark" // Computed from system preference if theme is "system"
}
```

**ThemeProvider Props**:
```typescript
interface ThemeProviderProps {
  children: React.ReactNode
  defaultTheme?: "light" | "dark" | "system"
  storageKey?: string
}
```

**useTheme Hook**:
```typescript
function useTheme(): ThemeContextValue
```

**3. Auth Context API** (`auth-context.md`)

**AuthContext Interface**:
```typescript
interface AuthContextValue {
  user: User | null
  isLoading: boolean
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<void>
  signup: (email: string, password: string) => Promise<void>
  logout: () => Promise<void>
  loginWithOAuth: (provider: "google" | "facebook" | "linkedin") => Promise<void>
}
```

### Quickstart Guide

**File**: `specs/002-authenticated-dashboard/quickstart.md`

**Sections**:
1. **Prerequisites**: Node.js 18+, npm/yarn, existing Next.js project
2. **Install Dependencies**: Better Auth, shadcn/ui, animation library
3. **Configure Better Auth**: Setup auth.ts, providers.ts
4. **Setup OAuth Providers**: Google, Facebook, LinkedIn credentials
5. **Install shadcn/ui Components**: Button, Input, Card, Dialog, Toast, Skeleton
6. **Configure Theme System**: ThemeProvider, CSS variables, Tailwind config
7. **Environment Variables**: .env.local setup guide
8. **Run Development Server**: npm run dev
9. **Test Authentication**: Login, signup, OAuth flows
10. **Test Theme Toggle**: Light/dark mode switching

### Agent Context Update

**Script**: `.specify/scripts/powershell/update-agent-context.ps1 -AgentType claude`

**New Technologies to Add**:
- Better Auth (authentication library)
- shadcn/ui (component library)
- Framer Motion or CSS transitions (animations)
- React Context API (theme + auth state)

## Phase 2: Implementation Strategy

### Execution Phases (from user input)

**Phase 1: Authentication** (Priority: P1)
- Install and configure Better Auth
- Setup email/password authentication
- Configure OAuth providers (Google, Facebook, LinkedIn)
- Implement auth context and hooks
- Create login and signup pages
- Implement route protection (middleware or component-level)
- Test all authentication flows

**Phase 2: Dashboard Layout** (Priority: P2)
- Create dashboard route group `(dashboard)/`
- Implement DashboardLayout component (sidebar + header + content)
- Build Sidebar component with navigation links
- Build Header component with user info and logout
- Build MobileMenu component for responsive design
- Create dashboard home page
- Move existing todos page into dashboard route group
- Test responsive layout (mobile, tablet, desktop)

**Phase 3: Theme System** (Priority: P3)
- Create ThemeContext and ThemeProvider
- Implement useTheme hook
- Add theme CSS variables to globals.css
- Configure Tailwind for dark mode
- Build ThemeToggle component
- Add theme toggle to dashboard header
- Implement localStorage persistence
- Test theme switching and persistence

**Phase 4: UI Upgrade** (Priority: P4)
- Install shadcn/ui components (Button, Input, Card, Dialog, Toast, Skeleton)
- Replace custom UI components with shadcn/ui
- Upgrade TodoList, TodoForm, TodoItem, EmptyState components
- Add loading states with skeleton loaders
- Add success/error feedback with toast notifications
- Add confirmation dialogs for destructive actions
- Test all UI components in both themes

**Phase 5: Animation & Polish** (Priority: P5)
- Add subtle animations to UI interactions (hover, focus, transitions)
- Implement page transition animations
- Add loading animations for async operations
- Verify responsive design across all breakpoints
- Run accessibility audit (WCAG AA compliance)
- Test contrast ratios in both themes
- Final UX validation and polish

### Implementation Order

1. **Authentication First**: Foundation for all protected features
2. **Dashboard Layout Second**: Container for all authenticated UI
3. **Theme System Third**: Visual enhancement, not blocking
4. **UI Upgrade Fourth**: Polish existing features
5. **Animation & Polish Last**: Final UX improvements

### Testing Strategy (from user input)

**Auth Flow Testing**:
- Email/password login success
- Email/password signup success
- Google OAuth flow
- Facebook OAuth flow
- LinkedIn OAuth flow
- Invalid credentials error handling
- Session persistence across refresh
- Logout clears session

**Route Protection Checks**:
- Unauthenticated user redirected to /login
- Authenticated user can access /dashboard
- Authenticated user can access /dashboard/todos
- Logout redirects to /login

**Theme Toggle Persistence**:
- Theme switches between light and dark
- Theme preference persists in localStorage
- Theme preference persists across refresh
- System preference detection works
- Contrast ratios meet WCAG AA standards

**Todo CRUD Regression Tests**:
- Create todo works (no regression)
- Read todos works (no regression)
- Update todo works (no regression)
- Delete todo works (no regression)
- Empty state displays correctly
- Loading states display correctly
- Error states display correctly

## Architectural Decisions

### Decision 1: Better Auth for Authentication
**Context**: Need authentication with email/password + OAuth (Google, Facebook, LinkedIn)
**Options Considered**:
1. NextAuth.js (popular, mature)
2. Better Auth (modern, Next.js 15 optimized)
3. Clerk (managed service, paid)
4. Custom implementation

**Decision**: Better Auth
**Rationale**:
- Native Next.js 15 App Router support
- Built-in OAuth provider support
- Simpler configuration than NextAuth.js
- No backend API changes needed (client-side session management)
- Free and open-source

**Trade-offs**:
- Newer library (less mature than NextAuth.js)
- Smaller community
- Acceptable for this use case (standard auth flows)

### Decision 2: shadcn/ui for Component Library
**Context**: Need polished UI components with animations
**Options Considered**:
1. shadcn/ui (Radix UI + Tailwind)
2. Material-UI (comprehensive, heavy)
3. Chakra UI (good DX, different styling approach)
4. Custom components (time-consuming)

**Decision**: shadcn/ui
**Rationale**:
- Built on Radix UI (accessible, unstyled primitives)
- Tailwind CSS integration (matches existing stack)
- Copy-paste components (no npm dependency bloat)
- Excellent accessibility out of the box
- Modern, polished design

**Trade-offs**:
- Components copied into codebase (not npm package)
- Need to maintain component code
- Acceptable for this use case (better control, no version conflicts)

### Decision 3: React Context for Theme Management
**Context**: Need global theme state (light/dark mode)
**Options Considered**:
1. React Context API
2. Zustand (state management library)
3. Redux (overkill for theme)
4. next-themes (specialized library)

**Decision**: React Context API
**Rationale**:
- Built-in React feature (no extra dependency)
- Simple use case (theme state only)
- localStorage persistence straightforward
- Sufficient for global theme state

**Trade-offs**:
- Manual localStorage integration
- No built-in devtools
- Acceptable for this use case (simple state, no complex logic)

### Decision 4: CSS Transitions for Animations
**Context**: Need subtle animations for UI interactions
**Options Considered**:
1. Framer Motion (powerful, feature-rich)
2. CSS transitions (lightweight, native)
3. React Spring (physics-based)
4. GSAP (professional, heavy)

**Decision**: CSS Transitions (with Framer Motion for complex animations if needed)
**Rationale**:
- CSS transitions for simple hover/focus states (zero JS overhead)
- Framer Motion for page transitions and complex animations (if needed)
- Performance-first approach
- Smaller bundle size

**Trade-offs**:
- CSS transitions less powerful than Framer Motion
- May need Framer Motion for some animations
- Acceptable for this use case (subtle animations, performance priority)

### Decision 5: Component-Level Route Protection
**Context**: Need to protect dashboard routes from unauthenticated access
**Options Considered**:
1. Next.js middleware (global, runs on edge)
2. Component-level protection (per-page)
3. Layout-level protection (route group)

**Decision**: Layout-level protection in dashboard route group
**Rationale**:
- Cleaner than per-page protection
- Better Auth session check in layout
- Redirect to /login if unauthenticated
- Simpler than middleware for this use case

**Trade-offs**:
- Not as global as middleware
- Need to ensure all protected routes in (dashboard) group
- Acceptable for this use case (clear route organization)

## Risk Analysis

### Risk 1: OAuth Provider Configuration Complexity
**Probability**: Medium | **Impact**: High | **Severity**: High

**Description**: Setting up OAuth credentials for Google, Facebook, LinkedIn can be complex and error-prone.

**Mitigation**:
- Create detailed OAuth setup guide in quickstart.md
- Provide .env.local.example with all required variables
- Test each OAuth provider independently
- Fallback to email/password if OAuth fails
- Document common OAuth errors and solutions

**Contingency**: If OAuth setup blocks development, implement email/password first and add OAuth incrementally.

### Risk 2: Theme Accessibility Compliance
**Probability**: Medium | **Impact**: Medium | **Severity**: Medium

**Description**: Dark mode colors may not meet WCAG AA contrast ratios (4.5:1 for normal text).

**Mitigation**:
- Use contrast checking tools during development (WebAIM, Stark)
- Test with accessibility validators (axe, WAVE)
- Define theme colors in CSS variables for easy adjustment
- Test with screen readers
- Document contrast ratios in theme-api.md

**Contingency**: If contrast issues found, adjust theme colors before launch. Light mode can be default if dark mode fails compliance.

### Risk 3: Better Auth Integration Issues
**Probability**: Low | **Impact**: High | **Severity**: Medium

**Description**: Better Auth is newer library, may have undocumented edge cases or bugs.

**Mitigation**:
- Research Better Auth thoroughly in Phase 0
- Test all authentication flows early
- Have NextAuth.js as backup option
- Monitor Better Auth GitHub issues
- Test session persistence across browsers

**Contingency**: If Better Auth has critical issues, switch to NextAuth.js (well-documented migration path).

### Risk 4: Todo CRUD Regression
**Probability**: Low | **Impact**: High | **Severity**: Medium

**Description**: Upgrading UI components and moving todos into dashboard could break existing functionality.

**Mitigation**:
- Write regression tests before making changes
- Test all CRUD operations after each change
- Keep existing API calls unchanged
- Use feature flags if needed for gradual rollout
- Maintain existing todo components as backup

**Contingency**: If regressions found, revert UI changes and fix incrementally.

### Risk 5: Mobile Layout Complexity
**Probability**: Low | **Impact**: Medium | **Severity**: Low

**Description**: Responsive dashboard layout may not work well on all mobile devices.

**Mitigation**:
- Mobile-first design approach
- Test on multiple device sizes (< 768px, 768-1023px, ≥ 1024px)
- Use standard Tailwind breakpoints
- Test hamburger menu on mobile
- Use browser dev tools for responsive testing

**Contingency**: If mobile layout issues found, simplify sidebar to bottom navigation on mobile.

## Dependencies

### External Dependencies (New)
- **better-auth**: ^1.0.0 (authentication library)
- **@radix-ui/react-***: Latest (shadcn/ui primitives)
- **lucide-react**: Latest (icons)
- **framer-motion**: ^11.0.0 (animations, if needed)
- **class-variance-authority**: Latest (component variants)
- **clsx**: Latest (className utilities)
- **tailwind-merge**: Latest (Tailwind class merging)

### External Dependencies (Existing)
- **next**: 15+ (framework)
- **react**: 19+ (UI library)
- **typescript**: 5+ (type safety)
- **tailwindcss**: 3+ (styling)

### Internal Dependencies
- **Existing Todo API**: `/api/v1/todos` endpoints must remain functional
- **Existing Todo Components**: Will be upgraded but functionality preserved
- **Existing API Client**: `web/src/lib/api/client.ts` unchanged

### OAuth Provider Dependencies
- **Google OAuth**: Client ID and secret from Google Cloud Console
- **Facebook OAuth**: App ID and secret from Facebook Developers
- **LinkedIn OAuth**: Client ID and secret from LinkedIn Developers

### Environment Variables Required
```
# Better Auth
BETTER_AUTH_SECRET=<random-secret>
BETTER_AUTH_URL=http://localhost:3000

# Google OAuth
GOOGLE_CLIENT_ID=<from-google-cloud-console>
GOOGLE_CLIENT_SECRET=<from-google-cloud-console>

# Facebook OAuth
FACEBOOK_APP_ID=<from-facebook-developers>
FACEBOOK_APP_SECRET=<from-facebook-developers>

# LinkedIn OAuth
LINKEDIN_CLIENT_ID=<from-linkedin-developers>
LINKEDIN_CLIENT_SECRET=<from-linkedin-developers>

# API URL (existing)
NEXT_PUBLIC_API_URL=http://localhost:8001
```

## Success Criteria

### Phase 0 Success (Research Complete)
- ✅ Better Auth configuration guide documented
- ✅ OAuth provider setup steps documented
- ✅ shadcn/ui integration guide documented
- ✅ Theme system architecture documented
- ✅ Route protection strategy documented
- ✅ Animation approach documented
- ✅ Figma layout analysis documented

### Phase 1 Success (Design Complete)
- ✅ Data model documented (client-side models)
- ✅ Auth flow diagrams created
- ✅ Theme context API contract defined
- ✅ Auth context API contract defined
- ✅ Quickstart guide created
- ✅ Agent context updated with new technologies

### Phase 2 Success (Ready for Implementation)
- ✅ Implementation plan complete and approved
- ✅ All research questions answered
- ✅ All contracts defined
- ✅ All risks identified and mitigated
- ✅ All dependencies documented
- ✅ Ready for `/sp.tasks` command

### Final Success (Feature Complete)
- ✅ All 6 user stories implemented (P1-P6)
- ✅ All 32 functional requirements met
- ✅ All 10 success criteria achieved
- ✅ Zero console errors in production
- ✅ All tests passing (unit, integration, e2e)
- ✅ WCAG AA compliance verified
- ✅ Todo CRUD works without regression
- ✅ Authentication works for all providers
- ✅ Theme system works in both modes
- ✅ Dashboard responsive on all devices

## Next Steps

After this planning phase completes:

1. **Review Plan**: User reviews and approves implementation plan
2. **Run `/sp.tasks`**: Generate atomic, testable tasks from this plan
3. **Run `/sp.implement`**: Execute tasks in order (P1 → P2 → P3 → P4 → P5)
4. **Test & Validate**: Run all tests, verify success criteria
5. **Create PR**: Commit changes and create pull request
6. **Deploy**: Deploy to production after PR approval

## Plan Completion

**Status**: ✅ Planning Complete
**Branch**: `002-authenticated-dashboard`
**Spec**: `specs/002-authenticated-dashboard/spec.md`
**Plan**: `specs/002-authenticated-dashboard/plan.md`
**Next Command**: `/sp.tasks` to generate implementation tasks
