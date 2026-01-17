# Tasks: Dashboard Polish & Advanced Features

**Feature**: 003-dashboard-polish
**Branch**: `003-dashboard-polish`
**Input**: Design documents from `/specs/003-dashboard-polish/`
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/

**Tests**: No tests requested in specification - implementation only

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `- [ ] [ID] [P?] [Story?] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization, dependencies, and type definitions

### Dependencies

- [X] T001 [P] Install recharts for chart visualization: `cd web && npm install recharts`
- [X] T002 [P] Install aos (Animate On Scroll) library: `cd web && npm install aos`
- [X] T003 [P] Install @types/aos for TypeScript support: `cd web && npm install -D @types/aos`

### Type Definitions

- [X] T004 [P] Copy localStorage schema types from contracts to web/src/types/storage.ts
- [X] T005 [P] Create preferences types in web/src/types/preferences.ts
- [X] T006 [P] Create activity types in web/src/types/activity.ts
- [X] T007 [P] Create statistics types in web/src/types/statistics.ts
- [X] T008 [P] Create filters types in web/src/types/filters.ts
- [X] T009 Enhance todo types with priority and status in web/src/types/todo.ts

### shadcn/ui Components

- [X] T010 [P] Add tabs component: `npx shadcn@latest add tabs`
- [X] T011 [P] Add select component: `npx shadcn@latest add select`
- [X] T012 [P] Add badge component: `npx shadcn@latest add badge`
- [X] T013 [P] Add avatar component: `npx shadcn@latest add avatar`
- [X] T014 [P] Add separator component: `npx shadcn@latest add separator`

**Checkpoint**: Dependencies installed, type definitions created, shadcn/ui components added

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

### localStorage Utilities

- [X] T015 [P] Create generic localStorage hook in web/src/hooks/useLocalStorage.ts
- [X] T016 [P] Create todos storage utilities in web/src/lib/storage/todos.ts
- [X] T017 [P] Create preferences storage utilities in web/src/lib/storage/preferences.ts
- [X] T018 [P] Create activity storage utilities in web/src/lib/storage/activity.ts
- [X] T019 [P] Create statistics calculation utilities in web/src/lib/storage/statistics.ts

### React Contexts

- [X] T020 Create PreferencesContext in web/src/contexts/PreferencesContext.tsx
- [X] T021 Create ActivityContext in web/src/contexts/ActivityContext.tsx
- [X] T022 Update root layout to wrap app with new context providers in web/src/app/layout.tsx

### Custom Hooks

- [X] T023 [P] Create usePreferences hook in web/src/hooks/usePreferences.ts
- [X] T024 [P] Create useActivity hook in web/src/hooks/useActivity.ts
- [X] T025 [P] Create useStatistics hook in web/src/hooks/useStatistics.ts
- [X] T026 [P] Create useFilters hook in web/src/hooks/useFilters.ts

### Utility Functions

- [X] T027 [P] Create chart data calculation utilities in web/src/lib/utils/chartData.ts
- [X] T028 [P] Create filter logic utilities in web/src/lib/utils/filters.ts
- [X] T029 [P] Create validation utilities in web/src/lib/utils/validation.ts

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - Dashboard Overview & Insights (Priority: P1) 🎯 MVP

**Goal**: Display comprehensive dashboard home page with statistics, charts, and activity feed

**Independent Test**: Log in and view dashboard home page. Should see task statistics, completion chart, activity feed, and priority breakdown without navigating elsewhere.

**Acceptance Criteria**:
- Statistics cards show accurate counts (total, completed, pending, completion rate)
- Completion chart displays trends over configurable time period (7/30/90 days)
- Activity feed shows 5 most recent task actions with timestamps
- Priority breakdown shows task distribution by priority level
- Empty state displays when no tasks exist

### Dashboard Components

- [X] T030 [P] [US1] Create StatisticsCards component in web/src/components/dashboard/StatisticsCards.tsx
- [X] T031 [P] [US1] Create CompletionChart component with Recharts in web/src/components/dashboard/CompletionChart.tsx
- [X] T032 [P] [US1] Create ActivityFeed component in web/src/components/dashboard/ActivityFeed.tsx
- [X] T033 [P] [US1] Create PriorityBreakdown component in web/src/components/dashboard/PriorityBreakdown.tsx
- [X] T034 [P] [US1] Create DashboardEmptyState component in web/src/components/dashboard/DashboardEmptyState.tsx

### Page Integration

- [X] T035 [US1] Enhance dashboard home page to integrate all components in web/src/app/dashboard/page.tsx
- [X] T036 [US1] Add loading states for dashboard statistics calculation
- [X] T037 [US1] Add error handling for dashboard data fetching
- [X] T038 [US1] Implement responsive layout for dashboard components (desktop + tablet)

**Checkpoint**: Dashboard home page fully functional with statistics, charts, and activity feed

---

## Phase 4: User Story 2 - Advanced Todo Management (Priority: P2)

**Goal**: Enable advanced task management with priority levels, status tracking, and filtering

**Independent Test**: Create tasks with different priorities and statuses, then use filters to view specific subsets. Should work independently of dashboard insights.

**Acceptance Criteria**:
- Can assign priority (High/Medium/Low) and status (To Do/In Progress/Done) when creating tasks
- Can filter tasks by priority (single and multiple selection)
- Can filter tasks by status (single and multiple selection)
- Can combine priority + status filters with AND logic
- Can clear all filters with single action
- Filter tags display active filters
- Task list updates immediately on filter change

### Type Enhancements

- [X] T039 [US2] Enhance Todo interface with priority and status fields in web/src/types/todo.ts
- [X] T040 [US2] Add priority and status enums to todo types

### Todo Components Enhancement

- [X] T041 [US2] Enhance TodoForm to include priority and status fields in web/src/components/todos/TodoForm.tsx
- [X] T042 [US2] Enhance TodoItem to display priority and status badges in web/src/components/todos/TodoItem.tsx
- [X] T043 [US2] Add quick-change controls for priority and status in TodoItem
- [X] T044 [US2] Update TodoList to handle filtered todos in web/src/components/todos/TodoList.tsx

### Filter Components

- [X] T045 [P] [US2] Create FilterPanel component with multi-select controls in web/src/components/todos/FilterPanel.tsx
- [X] T046 [P] [US2] Create FilterTags component to display active filters in web/src/components/todos/FilterTags.tsx
- [X] T047 [P] [US2] Create FilterEmptyState component for zero results in web/src/components/todos/FilterEmptyState.tsx

### Page Integration

- [X] T048 [US2] Enhance todos page to integrate filter components in web/src/app/dashboard/todos/page.tsx
- [X] T049 [US2] Implement filter state management with useFilters hook
- [X] T050 [US2] Add filter persistence to localStorage (optional - remember last filters)
- [X] T051 [US2] Update activity tracking to record priority and status changes

**Checkpoint**: Advanced todo management fully functional with priority, status, and filtering

---

## Phase 5: User Story 3 - User Profile Management (Priority: P3)

**Goal**: Enable users to view and edit profile information including name, email, and avatar

**Independent Test**: Navigate to profile page, view current information, make edits, and verify changes persist. Should work independently of other features.

**Acceptance Criteria**:
- Profile page displays current name, email, join date, and avatar
- Can edit name and avatar (email read-only from Better Auth)
- Avatar upload validates file size (max 2MB) and format (JPEG/PNG/GIF)
- Avatar preview shows before save
- Validation errors display for invalid inputs
- Can cancel edits and restore original values
- Avatar displays in header after save

### Profile Components

- [X] T052 [P] [US3] Create ProfileHeader component in web/src/components/profile/ProfileHeader.tsx
- [X] T053 [P] [US3] Create ProfileForm component in web/src/components/profile/ProfileForm.tsx
- [X] T054 [P] [US3] Create AvatarUpload component with FileReader API in web/src/components/profile/AvatarUpload.tsx
- [X] T055 [P] [US3] Create ProfileStats component in web/src/components/profile/ProfileStats.tsx

### Profile Storage

- [X] T056 [US3] Create profile storage utilities in web/src/lib/storage/profile.ts
- [X] T057 [US3] Add profile validation utilities in web/src/lib/utils/validation.ts

### Page Creation

- [X] T058 [US3] Create profile page in web/src/app/dashboard/profile/page.tsx
- [X] T059 [US3] Integrate profile components with edit mode toggle
- [X] T060 [US3] Add avatar upload with preview and validation
- [X] T061 [US3] Update Header component to display user avatar in web/src/components/dashboard/Header.tsx

**Checkpoint**: Profile management fully functional with avatar upload and validation

---

## Phase 6: User Story 4 - Settings & Preferences (Priority: P4)

**Goal**: Enable users to customize application experience through theme and display preferences

**Independent Test**: Navigate to settings, change preferences (theme, display options), verify they persist across logout/login. Should work independently of other features.

**Acceptance Criteria**:
- Settings page displays theme options (Light/Dark/System) and display preferences
- Theme changes apply immediately without page reload
- Theme preference persists across sessions
- Task display preferences (show completed, default sort) affect todo list
- Can reset all settings to defaults with confirmation
- Settings persist across 100% of logout/login cycles

### Settings Components

- [X] T062 [P] [US4] Create ThemeSelector component in web/src/components/settings/ThemeSelector.tsx
- [X] T063 [P] [US4] Create PreferenceToggles component in web/src/components/settings/PreferenceToggles.tsx
- [X] T064 [P] [US4] Create ResetButton component with confirmation dialog in web/src/components/settings/ResetButton.tsx
- [X] T065 [P] [US4] Create SettingsForm component in web/src/components/settings/SettingsForm.tsx

### Theme Integration

- [X] T066 [US4] Enhance ThemeContext to support System theme detection in web/src/contexts/ThemeContext.tsx
- [X] T067 [US4] Add theme persistence to localStorage via PreferencesContext
- [X] T068 [US4] Implement CSS variables for theme colors in web/src/app/globals.css

### Page Creation

- [X] T069 [US4] Create settings page in web/src/app/dashboard/settings/page.tsx
- [X] T070 [US4] Integrate settings components with preferences state
- [X] T071 [US4] Add reset to defaults functionality with confirmation
- [X] T072 [US4] Apply user preferences to todo list (show completed, default sort)

**Checkpoint**: Settings and preferences fully functional with theme switching and persistence

---

## Phase 7: User Story 5 - Animated UI Components (Priority: P5)

**Goal**: Add smooth, professional animations and transitions throughout the interface

**Independent Test**: Interact with various UI elements and observe smooth transitions. Should enhance existing features without changing functionality.

**Acceptance Criteria**:
- Dialogs fade in smoothly with subtle scale animation
- Dropdowns slide down smoothly with proper easing
- Toast notifications slide in from top-right corner
- Tab transitions are smooth between Dashboard/Todos/Profile/Settings
- Hover effects respond quickly on interactive elements
- Animations respect prefers-reduced-motion media query

### Animation Setup

- [X] T073 [US5] Initialize AOS (Animate On Scroll) library in web/src/app/layout.tsx
- [X] T074 [US5] Add prefers-reduced-motion CSS in web/src/app/globals.css
- [X] T075 [US5] Create animation variants for Framer Motion in web/src/lib/animations/variants.ts

### Dialog Animations

- [X] T076 [P] [US5] Add fade-in animation to TodoForm dialog
- [X] T077 [P] [US5] Add fade-in animation to confirmation dialogs
- [X] T078 [P] [US5] Add fade-in animation to profile edit mode

### Dropdown Animations

- [X] T079 [P] [US5] Add slide-down animation to FilterPanel dropdowns
- [X] T080 [P] [US5] Add slide-down animation to settings dropdowns
- [X] T081 [P] [US5] Add slide-down animation to user menu in header

### Toast Animations

- [X] T082 [US5] Enhance toast notifications with slide-in animation from top-right
- [X] T083 [US5] Add exit animations for toast dismissal

### Page Transitions

- [X] T084 [P] [US5] Add fade-in transition for dashboard page content
- [X] T085 [P] [US5] Add fade-in transition for todos page content
- [X] T086 [P] [US5] Add fade-in transition for profile page content
- [X] T087 [P] [US5] Add fade-in transition for settings page content

### Hover Effects

- [X] T088 [P] [US5] Add hover effects to StatisticsCards with subtle scale
- [X] T089 [P] [US5] Add hover effects to TodoItem with background color transition
- [X] T090 [P] [US5] Add hover effects to buttons with scale and color transition
- [X] T091 [P] [US5] Add hover effects to navigation links in sidebar

### List Animations

- [X] T092 [US5] Add fade-out animation when deleting todos
- [X] T093 [US5] Add smooth repositioning animation for remaining todos after deletion
- [X] T094 [US5] Add stagger animation for activity feed items

### AOS Integration

- [X] T095 [P] [US5] Add AOS animations to dashboard statistics cards
- [X] T096 [P] [US5] Add AOS animations to completion chart
- [X] T097 [P] [US5] Add AOS animations to activity feed
- [X] T098 [P] [US5] Add AOS animations to priority breakdown

**Checkpoint**: All animations implemented with prefers-reduced-motion support

---

## Phase 8: Polish & Cross-Cutting Concerns

**Purpose**: Final improvements that affect multiple user stories

### Performance Optimization

- [X] T099 [P] Implement memoization for statistics calculation with useMemo
- [X] T100 [P] Implement memoization for chart data calculation with useMemo
- [X] T101 [P] Implement memoization for filter logic with useMemo
- [X] T102 [P] Add debouncing for filter changes to prevent excessive re-renders
- [X] T103 Optimize localStorage reads/writes with batching

### Error Handling

- [X] T104 [P] Add error boundaries for dashboard components
- [X] T105 [P] Add error boundaries for todo components
- [X] T106 [P] Add error boundaries for profile components
- [X] T107 [P] Add error boundaries for settings components
- [X] T108 Add global error handler for localStorage quota exceeded

### Loading States

- [X] T109 [P] Add skeleton loaders for dashboard statistics
- [X] T110 [P] Add skeleton loaders for completion chart
- [X] T111 [P] Add skeleton loaders for activity feed
- [X] T112 [P] Add skeleton loaders for todo list
- [X] T113 Add loading spinner for avatar upload

### Accessibility

- [X] T114 [P] Add ARIA labels to all interactive elements
- [X] T115 [P] Ensure keyboard navigation works for all components
- [X] T116 [P] Add focus indicators for keyboard users
- [X] T117 Verify color contrast meets WCAG AA standards in both themes

### Documentation

- [X] T118 [P] Update README with feature description and screenshots
- [X] T119 [P] Document localStorage schema in code comments
- [X] T120 [P] Document component prop interfaces in code comments
- [X] T121 Add inline comments for complex logic (statistics, filters, animations)

### Validation

- [X] T122 Run quickstart.md validation checklist
- [X] T123 Test all user stories independently
- [X] T124 Test theme switching across all pages
- [X] T125 Test localStorage persistence across logout/login
- [X] T126 Test with 100+ tasks for performance
- [X] T127 Test with 1000 tasks for performance limits
- [X] T128 Test animations with prefers-reduced-motion enabled
- [X] T129 Test responsive layout on tablet (768px)
- [X] T130 Verify all acceptance criteria from spec.md

**Checkpoint**: Feature complete, polished, and validated

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3-7)**: All depend on Foundational phase completion
  - User stories can then proceed in parallel (if staffed)
  - Or sequentially in priority order (P1 → P2 → P3 → P4 → P5)
- **Polish (Phase 8)**: Depends on all desired user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2) - No dependencies on other stories
- **User Story 2 (P2)**: Can start after Foundational (Phase 2) - Enhances existing todos, independently testable
- **User Story 3 (P3)**: Can start after Foundational (Phase 2) - Independent profile management
- **User Story 4 (P4)**: Can start after Foundational (Phase 2) - Independent settings management
- **User Story 5 (P5)**: Should start after US1-US4 complete - Adds animations to existing components

### Within Each User Story

- Components marked [P] can be built in parallel (different files)
- Page integration tasks depend on component completion
- Each story should be fully functional before moving to next priority

### Parallel Opportunities

- All Setup tasks (T001-T014) can run in parallel
- All Foundational tasks marked [P] can run in parallel within Phase 2
- Once Foundational phase completes, User Stories 1-4 can start in parallel
- All components within a user story marked [P] can run in parallel
- All Polish tasks marked [P] can run in parallel

---

## Parallel Example: User Story 1

```bash
# Launch all dashboard components together:
Task T030: "Create StatisticsCards component in web/src/components/dashboard/StatisticsCards.tsx"
Task T031: "Create CompletionChart component with Recharts in web/src/components/dashboard/CompletionChart.tsx"
Task T032: "Create ActivityFeed component in web/src/components/dashboard/ActivityFeed.tsx"
Task T033: "Create PriorityBreakdown component in web/src/components/dashboard/PriorityBreakdown.tsx"
Task T034: "Create DashboardEmptyState component in web/src/components/dashboard/DashboardEmptyState.tsx"

# Then integrate all components into dashboard page:
Task T035: "Enhance dashboard home page to integrate all components in web/src/app/dashboard/page.tsx"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup (T001-T014)
2. Complete Phase 2: Foundational (T015-T029) - CRITICAL
3. Complete Phase 3: User Story 1 (T030-T038)
4. **STOP and VALIDATE**: Test dashboard home page independently
5. Deploy/demo if ready

### Incremental Delivery

1. Complete Setup + Foundational → Foundation ready
2. Add User Story 1 → Test independently → Deploy/Demo (MVP!)
3. Add User Story 2 → Test independently → Deploy/Demo
4. Add User Story 3 → Test independently → Deploy/Demo
5. Add User Story 4 → Test independently → Deploy/Demo
6. Add User Story 5 → Test independently → Deploy/Demo
7. Add Polish → Final validation → Production ready

### Parallel Team Strategy

With multiple developers:

1. Team completes Setup + Foundational together
2. Once Foundational is done:
   - Developer A: User Story 1 (Dashboard)
   - Developer B: User Story 2 (Advanced Todos)
   - Developer C: User Story 3 (Profile)
   - Developer D: User Story 4 (Settings)
3. Stories complete and integrate independently
4. Team collaborates on User Story 5 (Animations) and Polish

---

## Task Summary

**Total Tasks**: 130

**By Phase**:
- Phase 1 (Setup): 14 tasks
- Phase 2 (Foundational): 15 tasks
- Phase 3 (US1 - Dashboard): 9 tasks
- Phase 4 (US2 - Advanced Todos): 13 tasks
- Phase 5 (US3 - Profile): 10 tasks
- Phase 6 (US4 - Settings): 11 tasks
- Phase 7 (US5 - Animations): 26 tasks
- Phase 8 (Polish): 32 tasks

**Parallel Opportunities**: 78 tasks marked [P] can run in parallel

**MVP Scope** (Recommended): Phase 1 + Phase 2 + Phase 3 = 38 tasks

---

## Notes

- [P] tasks = different files, no dependencies, can run in parallel
- [Story] label maps task to specific user story for traceability
- Each user story should be independently completable and testable
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
- No tests included (not requested in specification)
- Focus on clean code and production-quality patterns for portfolio demonstration
- localStorage pattern is intentional for portfolio showcase (documented in plan.md)
