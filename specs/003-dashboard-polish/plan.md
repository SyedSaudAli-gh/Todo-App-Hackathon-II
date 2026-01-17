# Implementation Plan: Dashboard Polish & Advanced Features

**Branch**: `003-dashboard-polish` | **Date**: 2026-01-09 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/003-dashboard-polish/spec.md`

**Note**: This template is filled in by the `/sp.plan` command. See `.specify/templates/commands/plan.md` for the execution workflow.

## Summary

This feature enhances the existing authenticated dashboard with production-quality polish and advanced task management capabilities. The primary requirements include: (1) Dashboard home page with at-a-glance insights (statistics, charts, activity feed), (2) Advanced todo management with priority levels, status tracking, and filtering, (3) User profile management with editable information and avatar upload, (4) Settings page for theme and preference customization, and (5) Animated UI components using shadcn/ui for professional polish and animate On scroll.

**Technical Approach**: Incremental enhancement of existing Next.js dashboard using localStorage for data persistence (portfolio showcase pattern). State management via React Context API, data visualization with Recharts, and selective animations using shadcn/ui components with Framer Motion. Focus on clean architecture patterns suitable for interview/portfolio demonstration and animate On scroll.

## Technical Context

**Project Type**: web (Phase II Full-Stack Web Application with portfolio-specific adaptations)

### Phase II Full-Stack Web Application

**Frontend**:
- Framework: Next.js 15+ with App Router
- UI Library: React 19+ with hooks
- Language: TypeScript 5+ (strict mode)
- Styling: Tailwind CSS 3+ with shadcn/ui components (https://ui.shadcn.com/)
- Animate On Scroll Library for (https://michalsnik.github.io/aos/)
- State Management: React Context API for global state (theme, user preferences)
- Data Persistence: localStorage (portfolio showcase pattern - no backend API)
- Charts: Recharts for data visualization
- Animations: Framer Motion with shadcn/ui animated components (https://ui.shadcn.com/docs/components)
- HTTP Client: fetch API (for existing todo CRUD operations)
- Deployment: Vercel (recommended)

**Backend**:
- Framework: FastAPI 0.100+ (existing - already implemented)
- Language: Python 3.13+
- Validation: Pydantic v2
- ORM: SQLModel (SQLAlchemy + Pydantic)
- Note: Backend exists for basic todo CRUD; this feature adds client-side enhancements

**Database**:
- Primary Storage: localStorage (browser-based, portfolio showcase pattern)
- Fallback: Existing Neon PostgreSQL for basic todo operations
- Note: Dashboard statistics and preferences stored client-side for demo purposes

**Testing**:
- Frontend: Jest, React Testing Library
- Component Tests: shadcn/ui component integration
- Website Animate On Scroll
- E2E: Manual testing for portfolio demonstration
- Visual Regression: Manual review of animations and theme transitions

### Performance Goals
- Dashboard statistics calculation: <100ms for up to 1000 tasks
- Filter operations: <1 second response time
- Theme switching: <500ms for complete application update
- Animations: 200-300ms duration, GPU-accelerated
- Chart rendering: <2 seconds for 90-day data range
- Avatar upload: <3 seconds for 2MB image processing

### Constraints
- Browser localStorage limit: 5-10MB (sufficient for task data + preferences)
- No backend API for new features (portfolio showcase - client-side only)
- Desktop + Tablet focus (768px+), mobile not primary target
- Modern browser support only (ES6+, CSS Grid, Flexbox)
- Animations respect prefers-reduced-motion media query
- Avatar images stored as base64 in localStorage (size-limited)

### Scale/Scope
- Target: 100-1000 tasks (realistic portfolio demo scale)
- Users: Single-user application (no multi-user collaboration)
- Components: ~15-20 new/enhanced components
- Pages: 4 main pages (Dashboard, Todos, Profile, Settings)
- Animations: 6-8 strategic animation points (dialogs, dropdowns, transitions)
- Chart Types: 2-3 visualization types (line chart, bar chart, pie chart)

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

### Phase II Requirements

- ✅ Uses approved technology stack (Next.js, React, TypeScript, Tailwind)
- ⚠️ API-first architecture (PARTIAL - uses existing API for todos, localStorage for new features)
- ✅ Frontend-backend separation (frontend code properly separated)
- ⚠️ Persistent storage (ADAPTED - localStorage for portfolio demo, not Neon PostgreSQL)
- ✅ No Phase I patterns (no in-memory lists, no CLI, no positional indexes)
- ✅ Database migrations with Alembic (existing backend maintains this)
- ✅ OpenAPI/Swagger documentation (existing backend maintains this)
- ✅ Proper error handling and validation (implemented in frontend)

### Phase II Compliance Notes

**Compliant Areas**:
- Frontend uses approved Next.js 15+ with React 19+ and TypeScript 5+
- Component architecture follows React best practices
- Styling uses Tailwind CSS 3+ with shadcn/ui
- State management uses React Context API (approved pattern)
- No Phase I anti-patterns (in-memory, CLI, positional indexes)
- Proper separation of concerns (components, hooks, contexts, types)

**Adapted Areas** (Portfolio Showcase Pattern):
- **Data Persistence**: Uses localStorage instead of Neon PostgreSQL for dashboard-specific features
  - **Justification**: Portfolio showcase project demonstrating client-side state management
  - **Scope**: Only affects new dashboard features (statistics, preferences, activity)
  - **Existing**: Basic todo CRUD still uses FastAPI + PostgreSQL backend
  - **Rationale**: Demonstrates full-stack capability while keeping demo self-contained

- **API Layer**: New features are client-side only (no new backend endpoints)
  - **Justification**: Portfolio project optimized for quick demonstration
  - **Scope**: Dashboard statistics, user preferences, activity feed
  - **Existing**: Todo CRUD operations maintain full API-first architecture
  - **Rationale**: Reduces deployment complexity for portfolio showcase

**Risk Assessment**: LOW
- Core todo functionality maintains Phase II compliance (API + Database)
- New features are additive enhancements (don't break existing architecture)
- localStorage pattern is explicitly documented and justified
- Code quality and architecture patterns remain production-grade
- Easy to migrate to full backend if needed (localStorage → API endpoints)

**Approval Status**: ✅ APPROVED with documented adaptations for portfolio context

## Project Structure

### Documentation (this feature)

```text
specs/003-dashboard-polish/
├── plan.md              # This file (/sp.plan command output)
├── research.md          # Phase 0 output (/sp.plan command)
├── data-model.md        # Phase 1 output (/sp.plan command)
├── quickstart.md        # Phase 1 output (/sp.plan command)
├── contracts/           # Phase 1 output (/sp.plan command)
│   ├── localStorage-schema.json    # localStorage data structure
│   └── component-contracts.md      # Component prop interfaces
└── tasks.md             # Phase 2 output (/sp.tasks command - NOT created by /sp.plan)
```

### Source Code (repository root)

```text
web/                          # Next.js frontend (existing + enhancements)
├── src/
│   ├── app/                 # Next.js App Router pages
│   │   ├── (auth)/          # Authentication routes (existing)
│   │   │   ├── login/
│   │   │   └── signup/
│   │   ├── dashboard/       # Dashboard routes (existing + enhanced)
│   │   │   ├── layout.tsx   # Dashboard layout with sidebar (existing)
│   │   │   ├── page.tsx     # Dashboard home (ENHANCED - add statistics, charts, activity)
│   │   │   ├── todos/       # Todos page (existing)
│   │   │   │   └── page.tsx # (ENHANCED - add priority, status, filters)
│   │   │   ├── profile/     # Profile page (NEW)
│   │   │   │   └── page.tsx
│   │   │   └── settings/    # Settings page (NEW)
│   │   │       └── page.tsx
│   │   ├── layout.tsx       # Root layout (existing)
│   │   └── page.tsx         # Root redirect page (existing)
│   │
│   ├── components/          # React components
│   │   ├── auth/            # Authentication components (existing)
│   │   │   ├── LoginForm.tsx
│   │   │   ├── SignupForm.tsx
│   │   │   ├── OAuthButtons.tsx
│   │   │   └── ProtectedRoute.tsx
│   │   ├── dashboard/       # Dashboard components (existing + new)
│   │   │   ├── DashboardLayout.tsx  # (existing)
│   │   │   ├── Sidebar.tsx          # (existing)
│   │   │   ├── Header.tsx           # (existing)
│   │   │   ├── MobileMenu.tsx       # (existing)
│   │   │   ├── StatisticsCards.tsx  # (NEW - dashboard stats)
│   │   │   ├── CompletionChart.tsx  # (NEW - task completion trends)
│   │   │   ├── ActivityFeed.tsx     # (NEW - recent activity)
│   │   │   └── PriorityBreakdown.tsx # (NEW - tasks by priority)
│   │   ├── todos/           # Todo components (existing + enhanced)
│   │   │   ├── TodoList.tsx         # (existing - ENHANCE with filters)
│   │   │   ├── TodoItem.tsx         # (existing - ENHANCE with priority/status)
│   │   │   ├── TodoForm.tsx         # (existing - ENHANCE with priority/status fields)
│   │   │   ├── EmptyState.tsx       # (existing)
│   │   │   ├── FilterPanel.tsx      # (NEW - filter controls)
│   │   │   └── FilterTags.tsx       # (NEW - active filter display)
│   │   ├── profile/         # Profile components (NEW)
│   │   │   ├── ProfileHeader.tsx
│   │   │   ├── ProfileForm.tsx
│   │   │   ├── AvatarUpload.tsx
│   │   │   └── ProfileStats.tsx
│   │   ├── settings/        # Settings components (NEW)
│   │   │   ├── SettingsForm.tsx
│   │   │   ├── ThemeSelector.tsx
│   │   │   ├── PreferenceToggles.tsx
│   │   │   └── ResetButton.tsx
│   │   └── ui/              # shadcn/ui components (existing + new)
│   │       ├── button.tsx           # (existing)
│   │       ├── card.tsx             # (existing)
│   │       ├── input.tsx            # (existing)
│   │       ├── dialog.tsx           # (existing)
│   │       ├── dropdown-menu.tsx    # (existing)
│   │       ├── toast.tsx            # (existing)
│   │       ├── theme-toggle.tsx     # (existing)
│   │       ├── loading-spinner.tsx  # (existing)
│   │       ├── error-message.tsx    # (existing)
│   │       ├── tabs.tsx             # (NEW - for settings)
│   │       ├── select.tsx           # (NEW - for filters)
│   │       └── badge.tsx            # (NEW - for priority/status indicators)
│   │
│   ├── lib/                 # Utilities and API client
│   │   ├── api/             # API client functions (existing)
│   │   │   ├── client.ts
│   │   │   └── todos.ts
│   │   ├── auth/            # Authentication utilities (existing)
│   │   │   ├── auth.ts
│   │   │   ├── auth-client.ts
│   │   │   └── providers.ts
│   │   ├── storage/         # localStorage utilities (NEW)
│   │   │   ├── preferences.ts       # User preferences storage
│   │   │   ├── activity.ts          # Activity feed storage
│   │   │   └── statistics.ts        # Statistics calculation
│   │   └── utils.ts         # Utility functions (existing + enhanced)
│   │
│   ├── contexts/            # React contexts (existing + new)
│   │   ├── AuthContext.tsx          # (existing)
│   │   ├── ThemeContext.tsx         # (existing)
│   │   ├── PreferencesContext.tsx   # (NEW - user preferences)
│   │   └── ActivityContext.tsx      # (NEW - activity tracking)
│   │
│   ├── hooks/               # Custom hooks (existing + new)
│   │   ├── useAuth.ts               # (existing)
│   │   ├── useTheme.ts              # (existing)
│   │   ├── use-toast.ts             # (existing)
│   │   ├── usePreferences.ts        # (NEW - preferences management)
│   │   ├── useActivity.ts           # (NEW - activity tracking)
│   │   ├── useStatistics.ts         # (NEW - statistics calculation)
│   │   └── useFilters.ts            # (NEW - filter state management)
│   │
│   └── types/               # TypeScript types (existing + new)
│       ├── auth.ts                  # (existing)
│       ├── theme.ts                 # (existing)
│       ├── todo.ts                  # (existing - ENHANCE with priority/status)
│       ├── preferences.ts           # (NEW - user preferences types)
│       ├── activity.ts              # (NEW - activity event types)
│       ├── statistics.ts            # (NEW - statistics types)
│       └── filters.ts               # (NEW - filter types)
│
├── public/                  # Static assets
│   └── avatars/             # Default avatar images (NEW)
│
├── tests/                   # Tests
│   ├── unit/                # Component tests
│   │   ├── dashboard/       # Dashboard component tests (NEW)
│   │   ├── profile/         # Profile component tests (NEW)
│   │   └── settings/        # Settings component tests (NEW)
│   └── e2e/                 # End-to-end tests
│       └── dashboard-polish.spec.ts  # (NEW)
│
├── package.json             # Dependencies (ADD: recharts, framer-motion)
└── tsconfig.json            # TypeScript config (existing)

api/                          # FastAPI backend (existing - no changes)
├── src/
│   ├── models/              # SQLModel database models (existing)
│   ├── schemas/             # Pydantic request/response models (existing)
│   ├── routers/             # API endpoints (existing)
│   ├── services/            # Business logic (existing)
│   ├── database.py          # Database connection (existing)
│   └── main.py              # FastAPI app (existing)
├── alembic/                 # Database migrations (existing)
├── tests/                   # API tests (existing)
└── requirements.txt         # Python dependencies (existing)
```

**Structure Decision**: This feature enhances the existing Next.js frontend with new dashboard polish components while maintaining the existing FastAPI backend unchanged. New features are organized by domain (dashboard/, profile/, settings/) with shared utilities in lib/storage/ for localStorage operations. The structure follows Next.js App Router conventions and React best practices for component organization.

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| localStorage instead of Neon PostgreSQL | Portfolio showcase project optimized for quick demonstration and self-contained deployment. Dashboard statistics, user preferences, and activity feed are client-side features that don't require backend persistence. | Full backend API for these features would add deployment complexity (additional endpoints, database tables, migrations) without demonstrating new architectural patterns beyond what's already shown in existing todo CRUD operations. Portfolio context prioritizes clean demonstration over production-scale persistence. |
| Client-side only features (no new API endpoints) | New dashboard features (statistics, preferences, activity) are purely presentational enhancements that can be calculated/stored client-side. Existing todo CRUD already demonstrates full API-first architecture. | Adding backend endpoints for these features would be redundant demonstration of patterns already shown. Portfolio projects benefit from focused scope that highlights specific capabilities without unnecessary duplication. |

**Mitigation Strategy**:
- Core todo functionality maintains full Phase II compliance (API + Database)
- localStorage usage is explicitly scoped to dashboard enhancements only
- Code architecture remains production-grade (proper separation of concerns, TypeScript types, error handling)
- Migration path documented: localStorage utilities can be replaced with API calls if needed
- All architectural decisions documented in this plan for interview discussion

**Risk Level**: LOW - Adaptations are well-justified, scoped, and don't compromise code quality or architectural learning objectives.
