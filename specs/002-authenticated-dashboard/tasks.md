# Tasks: Authenticated Dashboard Upgrade

**Input**: Design documents from `/specs/002-authenticated-dashboard/`
**Prerequisites**: plan.md (required), spec.md (required), research.md, data-model.md, contracts/

**Tests**: Tests are NOT explicitly requested in the specification. Test tasks are omitted per template guidelines.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- **Phase II Web App**: `web/src/` (frontend only - no backend changes)
- All tasks modify only the `web/` directory
- Backend (`api/`) and database remain unchanged

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Install dependencies and configure tools for authentication, UI components, and theme system

- [ ] T001 [P] Install Better Auth dependency in web/package.json
- [ ] T002 [P] Install shadcn/ui dependencies (@radix-ui/react-slot, class-variance-authority, clsx, tailwind-merge, lucide-react) in web/package.json
- [ ] T003 [P] Install Framer Motion for animations in web/package.json
- [ ] T004 Initialize shadcn/ui with default configuration in web/
- [ ] T005 [P] Add shadcn/ui Button component to web/src/components/ui/button.tsx
- [ ] T006 [P] Add shadcn/ui Input component to web/src/components/ui/input.tsx
- [ ] T007 [P] Add shadcn/ui Card component to web/src/components/ui/card.tsx
- [ ] T008 [P] Add shadcn/ui Dialog component to web/src/components/ui/dialog.tsx
- [ ] T009 [P] Add shadcn/ui Toast component to web/src/components/ui/toast.tsx
- [ ] T010 [P] Add shadcn/ui Skeleton component to web/src/components/ui/skeleton.tsx
- [ ] T011 [P] Add shadcn/ui Dropdown Menu component to web/src/components/ui/dropdown-menu.tsx
- [ ] T012 [P] Add shadcn/ui Avatar component to web/src/components/ui/avatar.tsx
- [ ] T013 Configure Tailwind for dark mode (class strategy) in web/tailwind.config.ts
- [ ] T014 Add theme CSS variables (light and dark) to web/src/app/globals.css
- [ ] T015 [P] Create .env.local.example with all required environment variables in web/
- [ ] T016 Update web/.gitignore to exclude .env.local

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

### Authentication Foundation

- [ ] T017 [P] Create Better Auth configuration in web/src/lib/auth/auth.ts
- [ ] T018 [P] Create Better Auth client utilities in web/src/lib/auth/auth-client.ts
- [ ] T019 [P] Create OAuth provider configurations in web/src/lib/auth/providers.ts
- [ ] T020 [P] Create authentication TypeScript types in web/src/types/auth.ts
- [ ] T021 Create AuthContext provider in web/src/contexts/AuthContext.tsx
- [ ] T022 [P] Create useAuth hook in web/src/hooks/useAuth.ts

### Theme Foundation

- [ ] T023 [P] Create theme TypeScript types in web/src/types/theme.ts
- [ ] T024 Create ThemeContext provider in web/src/contexts/ThemeContext.tsx
- [ ] T025 [P] Create useTheme hook in web/src/hooks/useTheme.ts

### Shared Components

- [ ] T026 [P] Create LoadingSpinner component in web/src/components/ui/loading-spinner.tsx
- [ ] T027 [P] Create ErrorMessage component in web/src/components/ui/error-message.tsx

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - User Authentication (Priority: P1) 🎯 MVP

**Goal**: Users can sign up and log in using email/password or OAuth providers (Google, Facebook, LinkedIn) to access the dashboard

**Independent Test**: Create accounts, log in with different methods, verify session persistence, test route protection

### Authentication Pages

- [ ] T028 [P] [US1] Create login page route in web/src/app/(auth)/login/page.tsx
- [ ] T029 [P] [US1] Create signup page route in web/src/app/(auth)/signup/page.tsx
- [ ] T030 [P] [US1] Create auth route group layout in web/src/app/(auth)/layout.tsx

### Authentication Components

- [ ] T031 [P] [US1] Create LoginForm component in web/src/components/auth/LoginForm.tsx
- [ ] T032 [P] [US1] Create SignupForm component in web/src/components/auth/SignupForm.tsx
- [ ] T033 [P] [US1] Create OAuthButtons component in web/src/components/auth/OAuthButtons.tsx
- [ ] T034 [US1] Implement email/password login logic in LoginForm component
- [ ] T035 [US1] Implement email/password signup logic in SignupForm component
- [ ] T036 [US1] Implement Google OAuth login in OAuthButtons component
- [ ] T037 [US1] Implement Facebook OAuth login in OAuthButtons component
- [ ] T038 [US1] Implement LinkedIn OAuth login in OAuthButtons component

### Route Protection

- [ ] T039 [P] [US1] Create ProtectedRoute wrapper component in web/src/components/auth/ProtectedRoute.tsx
- [ ] T040 [US1] Implement route protection logic with redirect to /login

### Error Handling

- [ ] T041 [US1] Add error handling for invalid credentials in LoginForm
- [ ] T042 [US1] Add error handling for duplicate email in SignupForm
- [ ] T043 [US1] Add error handling for OAuth failures in OAuthButtons
- [ ] T044 [US1] Add loading states to all authentication forms

### Root Page Redirect

- [ ] T045 [US1] Update root page (web/src/app/page.tsx) to redirect authenticated users to /dashboard and unauthenticated to /login

**Acceptance Criteria**:
- ✅ Valid email/password signup creates account and redirects to dashboard
- ✅ Valid email/password login authenticates and redirects to dashboard
- ✅ Google/Facebook/LinkedIn OAuth authenticates and redirects to dashboard
- ✅ Invalid credentials show error message
- ✅ Unauthenticated users redirected to /login when accessing /dashboard

**Checkpoint**: At this point, User Story 1 (Authentication) should be fully functional and testable independently

---

## Phase 4: User Story 2 - Dashboard Layout (Priority: P2)

**Goal**: Authenticated users see a Figma-based dashboard with sidebar navigation, header with user info/theme toggle/logout, and main content area

**Independent Test**: Log in, verify layout renders, test navigation, verify responsive behavior on mobile/tablet/desktop

### Dashboard Route Structure

- [ ] T046 [P] [US2] Create dashboard route group in web/src/app/(dashboard)/
- [ ] T047 [US2] Create dashboard layout with route protection in web/src/app/(dashboard)/layout.tsx
- [ ] T048 [P] [US2] Create dashboard home page in web/src/app/(dashboard)/dashboard/page.tsx

### Dashboard Layout Components

- [ ] T049 [P] [US2] Create DashboardLayout wrapper component in web/src/components/dashboard/DashboardLayout.tsx
- [ ] T050 [P] [US2] Create Sidebar component in web/src/components/dashboard/Sidebar.tsx
- [ ] T051 [P] [US2] Create Header component in web/src/components/dashboard/Header.tsx
- [ ] T052 [P] [US2] Create MobileMenu component in web/src/components/dashboard/MobileMenu.tsx

### Sidebar Implementation

- [ ] T053 [US2] Implement sidebar navigation links (Dashboard, Todos, Profile, Settings) in Sidebar component
- [ ] T054 [US2] Implement active link highlighting based on current route in Sidebar
- [ ] T055 [US2] Add user info display at bottom of Sidebar

### Header Implementation

- [ ] T056 [US2] Display user name/email in Header component
- [ ] T057 [US2] Add logout button to Header component
- [ ] T058 [US2] Implement logout functionality with session clearing and redirect

### Responsive Design

- [ ] T059 [US2] Implement desktop layout (≥ 1024px) with fixed sidebar in DashboardLayout
- [ ] T060 [US2] Implement tablet layout (768-1023px) with collapsible sidebar in DashboardLayout
- [ ] T061 [US2] Implement mobile layout (< 768px) with hamburger menu in DashboardLayout
- [ ] T062 [US2] Add hamburger menu toggle functionality in MobileMenu component

### Dashboard Home Page

- [ ] T063 [US2] Create dashboard home page content with welcome message and stats cards

**Acceptance Criteria**:
- ✅ Authenticated user sees sidebar with navigation links
- ✅ Header displays user info, theme toggle placeholder, and logout button
- ✅ Mobile (< 768px) shows hamburger menu instead of sidebar
- ✅ Navigation links update content area and highlight active link
- ✅ Desktop (≥ 1024px) shows fixed sidebar with adjusted content width

**Checkpoint**: At this point, User Stories 1 AND 2 should both work independently

---

## Phase 5: User Story 3 - Theme System (Priority: P3)

**Goal**: Users can toggle between light and dark modes with preference persistence across sessions

**Independent Test**: Toggle theme, verify visual changes, refresh page to verify persistence, check contrast ratios

### Theme Toggle Component

- [ ] T064 [P] [US3] Create ThemeToggle button component in web/src/components/theme/ThemeToggle.tsx
- [ ] T065 [US3] Implement theme toggle logic (light ↔ dark) in ThemeToggle component
- [ ] T066 [US3] Add theme toggle to dashboard Header component

### Theme Provider Integration

- [ ] T067 [US3] Wrap application with ThemeProvider in web/src/app/layout.tsx
- [ ] T068 [US3] Add suppressHydrationMismatch to html tag in root layout

### Theme Persistence

- [ ] T069 [US3] Implement localStorage persistence in ThemeContext
- [ ] T070 [US3] Implement system preference detection in ThemeContext
- [ ] T071 [US3] Add theme initialization script to prevent flash of wrong theme

### Theme Styling

- [ ] T072 [US3] Apply theme classes to document root in ThemeContext
- [ ] T073 [US3] Add smooth transition animation (≤ 300ms) for theme changes in globals.css
- [ ] T074 [US3] Verify WCAG AA contrast ratios (4.5:1) for all text in both themes

### Theme Icons

- [ ] T075 [US3] Add Sun icon (light mode) to ThemeToggle component
- [ ] T076 [US3] Add Moon icon (dark mode) to ThemeToggle component

**Acceptance Criteria**:
- ✅ Theme toggle switches between light and dark modes
- ✅ Theme preference persists in localStorage across refresh
- ✅ System preference detected on first visit
- ✅ Text contrast meets WCAG AA standards (4.5:1) in both themes
- ✅ Theme transition animation completes within 300ms

**Checkpoint**: All core features (Auth, Dashboard, Theme) should now be independently functional

---

## Phase 6: User Story 4 - Todo Integration (Priority: P4)

**Goal**: Existing todo CRUD functionality works seamlessly within the authenticated dashboard layout

**Independent Test**: Create, read, update, delete todos within dashboard, verify no regressions from existing functionality

### Todo Page Integration

- [ ] T077 [US4] Move existing todos page to dashboard route in web/src/app/(dashboard)/todos/page.tsx
- [ ] T078 [US4] Update todo page to use DashboardLayout wrapper

### Todo Component Updates

- [ ] T079 [P] [US4] Update TodoList component to use shadcn/ui Card in web/src/components/todos/TodoList.tsx
- [ ] T080 [P] [US4] Update TodoForm component to use shadcn/ui Input and Button in web/src/components/todos/TodoForm.tsx
- [ ] T081 [P] [US4] Update TodoItem component to use shadcn/ui styling in web/src/components/todos/TodoItem.tsx
- [ ] T082 [P] [US4] Update EmptyState component to use shadcn/ui styling in web/src/components/todos/EmptyState.tsx

### Todo CRUD Verification

- [ ] T083 [US4] Verify create todo functionality works in dashboard context
- [ ] T084 [US4] Verify read todos functionality works in dashboard context
- [ ] T085 [US4] Verify update todo functionality works in dashboard context
- [ ] T086 [US4] Verify delete todo functionality works in dashboard context
- [ ] T087 [US4] Verify empty state displays correctly when no todos exist

### Todo API Integration

- [ ] T088 [US4] Verify existing API client (web/src/lib/api/todos.ts) works unchanged
- [ ] T089 [US4] Verify existing API endpoints (/api/v1/todos) work unchanged

**Acceptance Criteria**:
- ✅ Create todo works without regression
- ✅ Read todos works without regression
- ✅ Update todo works without regression
- ✅ Delete todo works without regression
- ✅ Empty state displays correctly
- ✅ All operations work within dashboard layout

**Checkpoint**: Todo functionality integrated into dashboard without regressions

---

## Phase 7: User Story 5 - UI Polish (Priority: P5)

**Goal**: Replace custom components with shadcn/ui components and add animations, skeleton loaders, toast notifications, and dialogs for enhanced user experience

**Independent Test**: Trigger various user actions, verify toast notifications, skeleton loaders, confirmation dialogs, and smooth animations

### Toast Notifications

- [ ] T090 [P] [US5] Create Toaster component in web/src/components/ui/toaster.tsx
- [ ] T091 [US5] Add Toaster to root layout in web/src/app/layout.tsx
- [ ] T092 [US5] Add success toast for todo create in TodoForm component
- [ ] T093 [US5] Add success toast for todo update in TodoItem component
- [ ] T094 [US5] Add success toast for todo delete in TodoItem component
- [ ] T095 [US5] Add error toast for failed API calls in todo components
- [ ] T096 [US5] Add success toast for login in LoginForm component
- [ ] T097 [US5] Add success toast for signup in SignupForm component

### Skeleton Loaders

- [ ] T098 [P] [US5] Add skeleton loader for todo list loading state in TodoList component
- [ ] T099 [P] [US5] Add skeleton loader for dashboard stats loading in dashboard home page
- [ ] T100 [US5] Replace loading spinner with skeleton loaders where appropriate

### Confirmation Dialogs

- [ ] T101 [US5] Add confirmation dialog for todo delete in TodoItem component
- [ ] T102 [US5] Add confirmation dialog for logout in Header component

### Animations

- [ ] T103 [P] [US5] Add hover animations to buttons using CSS transitions
- [ ] T104 [P] [US5] Add focus animations to interactive elements using CSS transitions
- [ ] T105 [US5] Add page transition animations using Framer Motion (if needed)
- [ ] T106 [US5] Add smooth animations for sidebar collapse/expand on mobile

### Component Upgrades

- [ ] T107 [US5] Ensure all buttons use shadcn/ui Button component
- [ ] T108 [US5] Ensure all inputs use shadcn/ui Input component
- [ ] T109 [US5] Ensure all cards use shadcn/ui Card component
- [ ] T110 [US5] Add proper spacing and hierarchy to all components

**Acceptance Criteria**:
- ✅ Toast notifications appear for all user actions (create, update, delete)
- ✅ Skeleton loaders display during loading operations
- ✅ Confirmation dialogs appear for destructive actions
- ✅ Smooth animations on page transitions and interactions
- ✅ Hover states display with subtle animations

**Checkpoint**: UI polish complete with enhanced user feedback and animations

---

## Phase 8: User Story 6 - Session Management (Priority: P6)

**Goal**: User sessions persist across browser refresh and logout functionality clears session completely

**Independent Test**: Log in, refresh page, close/reopen browser, test logout, verify session behavior

### Session Persistence

- [ ] T111 [US6] Verify session persists across page refresh in AuthContext
- [ ] T112 [US6] Verify session persists across browser close/reopen (if "remember me") in Better Auth config
- [ ] T113 [US6] Add session expiration handling in AuthContext

### Logout Functionality

- [ ] T114 [US6] Verify logout clears session completely in Header logout button
- [ ] T115 [US6] Verify logout redirects to /login page
- [ ] T116 [US6] Verify user cannot access dashboard after logout without re-authentication

### Session Expiration

- [ ] T117 [US6] Add session expiration detection in AuthContext
- [ ] T118 [US6] Add redirect to /login with expiration message when session expires
- [ ] T119 [US6] Test session expiration behavior during active operations

### Route Protection Verification

- [ ] T120 [US6] Verify unauthenticated users redirected to /login when accessing /dashboard
- [ ] T121 [US6] Verify unauthenticated users redirected to /login when accessing /dashboard/todos
- [ ] T122 [US6] Verify authenticated users can access all dashboard routes

**Acceptance Criteria**:
- ✅ Session persists across page refresh
- ✅ Session persists across browser close/reopen (with "remember me")
- ✅ Logout clears session and redirects to /login
- ✅ User cannot access dashboard after logout
- ✅ Session expiration redirects to /login with message

**Checkpoint**: Session management complete with proper persistence and logout

---

## Phase 9: Polish & Cross-Cutting Concerns

**Purpose**: Final improvements, documentation, and validation

### Documentation

- [ ] T123 [P] Update README.md with setup instructions for Better Auth and OAuth providers
- [ ] T124 [P] Document environment variables in .env.local.example
- [ ] T125 [P] Add inline code comments for complex authentication logic

### Accessibility

- [ ] T126 [P] Verify keyboard navigation works for all interactive elements
- [ ] T127 [P] Verify screen reader compatibility for authentication forms
- [ ] T128 [P] Add ARIA labels to theme toggle and navigation elements
- [ ] T129 Verify WCAG AA compliance using axe DevTools or similar

### Performance

- [ ] T130 [P] Verify authentication completion < 30 seconds (SC-001)
- [ ] T131 [P] Verify redirect time < 100ms (SC-002)
- [ ] T132 [P] Verify dashboard render time < 2 seconds (SC-003)
- [ ] T133 [P] Verify theme toggle < 300ms (SC-004)

### Error Handling

- [ ] T134 Verify all API errors display user-friendly messages
- [ ] T135 Verify network errors handled gracefully with retry options
- [ ] T136 Verify OAuth errors handled with fallback to email/password

### Production Readiness

- [ ] T137 Run production build and verify zero console errors (SC-006)
- [ ] T138 [P] Test on multiple browsers (Chrome, Firefox, Safari, Edge)
- [ ] T139 [P] Test on multiple devices (mobile, tablet, desktop)
- [ ] T140 Verify all environment variables configured correctly

### Final Validation

- [ ] T141 Run through quickstart.md validation steps
- [ ] T142 Verify all 6 user stories work independently
- [ ] T143 Verify all 10 success criteria met (SC-001 through SC-010)
- [ ] T144 Create demo video or screenshots for documentation

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3-8)**: All depend on Foundational phase completion
  - User stories can proceed in parallel (if staffed)
  - Or sequentially in priority order (P1 → P2 → P3 → P4 → P5 → P6)
- **Polish (Phase 9)**: Depends on all desired user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2) - No dependencies on other stories
- **User Story 2 (P2)**: Can start after Foundational (Phase 2) - No dependencies on other stories (but typically done after US1 for UX flow)
- **User Story 3 (P3)**: Can start after Foundational (Phase 2) - Integrates with US2 (adds toggle to header)
- **User Story 4 (P4)**: Depends on US1 (authentication) and US2 (dashboard layout) being complete
- **User Story 5 (P5)**: Can enhance any completed user story - typically done after US1-US4
- **User Story 6 (P6)**: Depends on US1 (authentication) being complete

### Within Each User Story

- Setup tasks before implementation tasks
- Components before integration
- Core functionality before polish
- Story complete before moving to next priority

### Parallel Opportunities

- **Phase 1 (Setup)**: All tasks marked [P] can run in parallel (T001-T012, T015)
- **Phase 2 (Foundational)**: All tasks marked [P] can run in parallel (T017-T020, T022-T023, T025-T027)
- **Phase 3 (US1)**: Tasks T028-T033 can run in parallel (different files)
- **Phase 4 (US2)**: Tasks T046-T052 can run in parallel (different files)
- **Phase 5 (US3)**: Tasks T064, T075-T076 can run in parallel
- **Phase 6 (US4)**: Tasks T079-T082 can run in parallel (different files)
- **Phase 7 (US5)**: Tasks T090, T098-T100, T103-T104 can run in parallel
- **Phase 9 (Polish)**: Most tasks marked [P] can run in parallel

---

## Parallel Example: User Story 1 (Authentication)

```bash
# Launch all authentication page routes together:
Task T028: "Create login page route in web/src/app/(auth)/login/page.tsx"
Task T029: "Create signup page route in web/src/app/(auth)/signup/page.tsx"
Task T030: "Create auth route group layout in web/src/app/(auth)/layout.tsx"

# Launch all authentication components together:
Task T031: "Create LoginForm component in web/src/components/auth/LoginForm.tsx"
Task T032: "Create SignupForm component in web/src/components/auth/SignupForm.tsx"
Task T033: "Create OAuthButtons component in web/src/components/auth/OAuthButtons.tsx"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup (T001-T016)
2. Complete Phase 2: Foundational (T017-T027) - CRITICAL
3. Complete Phase 3: User Story 1 (T028-T045)
4. **STOP and VALIDATE**: Test authentication independently
5. Deploy/demo if ready

### Incremental Delivery

1. Complete Setup + Foundational → Foundation ready
2. Add User Story 1 (Authentication) → Test independently → Deploy/Demo (MVP!)
3. Add User Story 2 (Dashboard Layout) → Test independently → Deploy/Demo
4. Add User Story 3 (Theme System) → Test independently → Deploy/Demo
5. Add User Story 4 (Todo Integration) → Test independently → Deploy/Demo
6. Add User Story 5 (UI Polish) → Test independently → Deploy/Demo
7. Add User Story 6 (Session Management) → Test independently → Deploy/Demo
8. Each story adds value without breaking previous stories

### Parallel Team Strategy

With multiple developers:

1. Team completes Setup + Foundational together
2. Once Foundational is done:
   - Developer A: User Story 1 (Authentication)
   - Developer B: User Story 2 (Dashboard Layout) - can start in parallel
   - Developer C: User Story 3 (Theme System) - can start in parallel
3. After US1, US2 complete:
   - Developer A: User Story 4 (Todo Integration)
   - Developer B: User Story 5 (UI Polish)
   - Developer C: User Story 6 (Session Management)
4. Stories complete and integrate independently

---

## Task Summary

**Total Tasks**: 144
**Setup Tasks**: 16 (T001-T016)
**Foundational Tasks**: 11 (T017-T027)
**User Story 1 (P1)**: 18 tasks (T028-T045) - Authentication
**User Story 2 (P2)**: 18 tasks (T046-T063) - Dashboard Layout
**User Story 3 (P3)**: 13 tasks (T064-T076) - Theme System
**User Story 4 (P4)**: 13 tasks (T077-T089) - Todo Integration
**User Story 5 (P5)**: 21 tasks (T090-T110) - UI Polish
**User Story 6 (P6)**: 12 tasks (T111-T122) - Session Management
**Polish Tasks**: 22 tasks (T123-T144)

**Parallel Opportunities**: 47 tasks marked [P] can run in parallel within their phase

**MVP Scope**: Phase 1 (Setup) + Phase 2 (Foundational) + Phase 3 (User Story 1) = 45 tasks

**Suggested First Milestone**: Complete through User Story 2 (Dashboard Layout) = 63 tasks

---

## Notes

- [P] tasks = different files, no dependencies within phase
- [Story] label maps task to specific user story for traceability
- Each user story should be independently completable and testable
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
- Frontend-only changes - no backend or database modifications
- Existing todo API endpoints remain unchanged
- Better Auth manages user sessions (no custom user table)
- Theme preferences stored in localStorage (not database)
- Todos remain shared across all users (no user_id field)
