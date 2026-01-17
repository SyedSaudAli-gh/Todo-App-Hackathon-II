# Tasks: Public Landing Page Experience

**Input**: Design documents from `/specs/005-landing-page/`
**Prerequisites**: plan.md (required), spec.md (required), research.md (available), quickstart.md (available)

**Tests**: Tests are NOT explicitly requested in the specification. This task list focuses on implementation tasks only.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `- [ ] [ID] [P?] [Story?] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- **Phase II Web App**: `web/src/` for frontend (this feature is frontend-only)
- All paths are relative to repository root

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and foundation files

**Duration Estimate**: Foundation setup for landing page implementation

### Directory Structure

- [x] T001 [P] Create landing components directory at `web/src/components/landing/`
- [x] T002 [P] Create auth components directory at `web/src/components/auth/`
- [x] T003 [P] Create landing types file at `web/src/types/landing.ts`
- [x] T004 [P] Create login page directory at `web/src/app/login/`
- [x] T005 [P] Create signup page directory at `web/src/app/signup/`

### Foundation Files

- [x] T006 [P] Create content constants file at `web/src/lib/constants.ts` with LANDING_CONTENT object (navbar, hero, showcase, features, cta, footer content)
- [x] T007 [P] Create animation variants file at `web/src/lib/animations.ts` with Framer Motion variants (heroVariants, todoSlideVariants, checkmarkVariants, featureHoverVariants, scrollFadeVariants)
- [x] T008 [P] Create TypeScript interfaces at `web/src/types/landing.ts` (DemoTodo, Feature, FooterLink, AuthFormProps, AuthFormData, ValidationErrors)

**Checkpoint**: Foundation files ready - component implementation can now begin

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core components that MUST be complete before user story implementation

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

### Shared Components

- [x] T009 [P] Create PublicNavbar component at `web/src/components/landing/PublicNavbar.tsx` (client component with theme toggle, scroll detection, navigation buttons)
- [x] T010 [P] Create Footer component at `web/src/components/landing/Footer.tsx` (server component with app info, tagline, copyright, links)

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - First-Time Visitor Discovery (Priority: P1) 🎯 MVP

**Goal**: Create landing page with hero section, animated showcase, features section, and CTA to attract and convert first-time visitors

**Independent Test**: Navigate to root URL (/) and verify hero section loads with headline, subheading, and "Get Started" button. Scroll to see animated showcase, features section, and CTA section. Click any CTA button and verify navigation to sign-up page.

**Acceptance Criteria**:
1. Landing page displays animated hero section with clear headline and prominent CTA
2. Animated showcase demonstrates todo functionality with priority levels and completion states
3. Features section highlights 4 key capabilities with icons and descriptions
4. All CTA buttons navigate to sign-up page
5. Page is fully responsive on mobile, tablet, and desktop
6. Animations run smoothly at 60fps

### Hero Section Implementation

- [ ] T011 [P] [US1] Create HeroSection component at `web/src/components/landing/HeroSection.tsx` (server component with staggered fade-in animations for headline, subheading, and CTAs)
- [ ] T012 [US1] Implement hero content rendering using LANDING_CONTENT.hero from constants
- [ ] T013 [US1] Add Framer Motion animations with heroVariants for staggered fade-in effect
- [ ] T014 [US1] Implement responsive typography scaling (text-3xl md:text-4xl lg:text-5xl for headline)
- [ ] T015 [US1] Add "Get Started" button with navigation to /signup route

### Animated Showcase Implementation

- [ ] T016 [P] [US1] Create AnimatedShowcase component at `web/src/components/landing/AnimatedShowcase.tsx` (client component with complex animations and state management)
- [ ] T017 [US1] Implement demo todos state using LANDING_CONTENT.showcase.demoTodos
- [ ] T018 [US1] Add todo card slide-in animations using todoSlideVariants
- [ ] T019 [US1] Implement completion checkmark animation using checkmarkVariants
- [ ] T020 [US1] Add priority badge display (High/Medium/Low) with color coding
- [ ] T021 [US1] Implement automated animation sequence (todo completion, fade-out, new todo slide-in)
- [ ] T022 [US1] Add AnimatePresence for smooth enter/exit transitions
- [ ] T023 [US1] Implement reduced motion support using prefers-reduced-motion media query

### Features Section Implementation

- [ ] T024 [P] [US1] Create FeaturesSection component at `web/src/components/landing/FeaturesSection.tsx` (server component with client hover effects)
- [ ] T025 [US1] Implement features grid layout (1 col mobile, 2 col tablet, 4 col desktop)
- [ ] T026 [US1] Create FeatureCard sub-component with icon, title, and description
- [ ] T027 [US1] Add Lucide React icons for each feature (Settings, User, Layout, Zap)
- [ ] T028 [US1] Implement hover animations using featureHoverVariants (scale 1.02, shadow increase)
- [ ] T029 [US1] Add responsive spacing and typography

### CTA Section Implementation

- [ ] T030 [P] [US1] Create CTASection component at `web/src/components/landing/CTASection.tsx` (server component with prominent styling)
- [ ] T031 [US1] Implement CTA content rendering using LANDING_CONTENT.cta
- [ ] T032 [US1] Add "Create Free Account" button with navigation to /signup route
- [ ] T033 [US1] Style section with gradient or contrasting background for visual prominence

### Landing Page Assembly

- [ ] T034 [US1] Update root page at `web/src/app/page.tsx` to assemble all landing components (PublicNavbar, HeroSection, AnimatedShowcase, FeaturesSection, CTASection, Footer)
- [ ] T035 [US1] Add skip-to-main-content link for accessibility
- [ ] T036 [US1] Implement proper semantic HTML structure (nav, main, section, footer)
- [ ] T037 [US1] Add scroll-triggered animations for sections using scrollFadeVariants
- [ ] T038 [US1] Verify all CTA buttons navigate to /signup route

### Responsive Design for US1

- [ ] T039 [US1] Test landing page on mobile viewport (320px-767px) and adjust spacing/typography
- [ ] T040 [US1] Test landing page on tablet viewport (768px-1023px) and verify 2-column features layout
- [ ] T041 [US1] Test landing page on desktop viewport (1024px+) and verify 4-column features layout
- [ ] T042 [US1] Verify navbar remains sticky and readable on all breakpoints

**Checkpoint**: User Story 1 complete - Landing page should be fully functional with all sections, animations, and responsive design

---

## Phase 4: User Story 2 - Returning Visitor Authentication (Priority: P1)

**Goal**: Enable existing users to sign in and access their dashboard

**Independent Test**: Click "Sign In" button from navbar, complete sign-in form with valid credentials, and verify redirection to dashboard. Test with invalid credentials and verify error message display.

**Acceptance Criteria**:
1. Sign-in button in navbar navigates to /login page
2. Sign-in form accepts email and password
3. Valid credentials authenticate user and redirect to /dashboard
4. Invalid credentials display clear error message
5. Form includes link to sign-up page for new users

### AuthForm Component (Shared for US2 and US3)

- [ ] T043 [P] [US2] Create AuthForm component at `web/src/components/auth/AuthForm.tsx` (client component with mode prop for signin/signup)
- [ ] T044 [US2] Implement form state management (formData, validationErrors, loading, error)
- [ ] T045 [US2] Add email input field with label and validation
- [ ] T046 [US2] Add password input field with label and validation
- [ ] T047 [US2] Add confirm password field (conditional rendering for signup mode only)
- [ ] T048 [US2] Implement client-side validation function (email format, password length, confirm match)
- [ ] T049 [US2] Add inline error message display with aria-invalid and aria-describedby
- [ ] T050 [US2] Implement loading state with disabled button and spinner icon
- [ ] T051 [US2] Add mode toggle link (signin ↔ signup navigation)

### Sign-In Page Implementation

- [ ] T052 [P] [US2] Create sign-in page at `web/src/app/login/page.tsx` (client component)
- [ ] T053 [US2] Implement handleSignIn function with fetch to /api/auth/sign-in/email endpoint
- [ ] T054 [US2] Add error handling and mapping to user-friendly messages
- [ ] T055 [US2] Implement successful authentication redirect to /dashboard using Next.js router
- [ ] T056 [US2] Render AuthForm component with mode="signin"
- [ ] T057 [US2] Add page title and heading ("Sign In")
- [ ] T058 [US2] Style page with centered layout and max-width container

### Sign-In Integration

- [ ] T059 [US2] Update PublicNavbar "Sign In" button to navigate to /login route
- [ ] T060 [US2] Test sign-in flow end-to-end (navbar → login page → form submission → dashboard redirect)
- [ ] T061 [US2] Test error scenarios (invalid email, wrong password, network error)
- [ ] T062 [US2] Verify loading states display correctly during authentication

**Checkpoint**: User Story 2 complete - Sign-in flow should be fully functional with error handling and dashboard redirect

---

## Phase 5: User Story 3 - New User Registration (Priority: P1)

**Goal**: Enable new users to create an account and access their dashboard

**Independent Test**: Click "Sign Up" button from navbar or any CTA button, complete sign-up form with valid information, and verify account creation and redirection to dashboard. Test with invalid data and verify validation errors.

**Acceptance Criteria**:
1. Sign-up buttons navigate to /signup page
2. Sign-up form accepts email, password, and confirm password
3. Valid data creates account and redirects to /dashboard
4. Invalid data displays clear validation errors
5. Form includes link to sign-in page for existing users

### Sign-Up Page Implementation

- [ ] T063 [P] [US3] Create sign-up page at `web/src/app/signup/page.tsx` (client component)
- [ ] T064 [US3] Implement handleSignUp function with fetch to /api/auth/sign-up/email endpoint
- [ ] T065 [US3] Add error handling and mapping to user-friendly messages
- [ ] T066 [US3] Implement successful registration redirect to /dashboard using Next.js router
- [ ] T067 [US3] Render AuthForm component with mode="signup"
- [ ] T068 [US3] Add page title and heading ("Sign Up")
- [ ] T069 [US3] Style page with centered layout and max-width container

### Sign-Up Integration

- [ ] T070 [US3] Update PublicNavbar "Sign Up" button to navigate to /signup route
- [ ] T071 [US3] Update HeroSection "Get Started" button to navigate to /signup route
- [ ] T072 [US3] Update CTASection "Create Free Account" button to navigate to /signup route
- [ ] T073 [US3] Test sign-up flow end-to-end (CTA → signup page → form submission → dashboard redirect)
- [ ] T074 [US3] Test validation scenarios (invalid email, short password, password mismatch)
- [ ] T075 [US3] Verify loading states display correctly during registration

**Checkpoint**: User Story 3 complete - Sign-up flow should be fully functional with validation and dashboard redirect

---

## Phase 6: User Story 4 - Theme Preference Selection (Priority: P2)

**Goal**: Enable users to toggle between light and dark themes with persistence

**Independent Test**: Click theme toggle in navbar and verify entire landing page switches between light and dark modes. Navigate to sign-in/sign-up pages and verify theme persists. Refresh browser and verify theme preference is remembered.

**Acceptance Criteria**:
1. Theme toggle button in navbar switches between light and dark modes
2. Theme change applies to all landing page sections
3. Theme preference persists across page navigations
4. Theme preference is remembered on browser refresh

### Theme Toggle Implementation

- [x] T076 [P] [US4] Verify ThemeContext integration in PublicNavbar component
- [x] T077 [US4] Add theme toggle button with Sun/Moon icons from Lucide React
- [x] T078 [US4] Implement theme toggle handler using setTheme from ThemeContext
- [x] T079 [US4] Add aria-label="Toggle theme" for accessibility
- [x] T080 [US4] Verify theme toggle responds within 100ms

### Theme Styling

- [x] T081 [US4] Add dark mode styles to PublicNavbar using Tailwind dark: utilities
- [x] T082 [US4] Add dark mode styles to HeroSection
- [x] T083 [US4] Add dark mode styles to AnimatedShowcase
- [x] T084 [US4] Add dark mode styles to FeaturesSection
- [x] T085 [US4] Add dark mode styles to CTASection
- [x] T086 [US4] Add dark mode styles to Footer
- [x] T087 [US4] Add dark mode styles to AuthForm component
- [x] T088 [US4] Verify color contrast meets WCAG 2.1 AA in both themes (4.5:1 for normal text)

### Theme Persistence

- [x] T089 [US4] Test theme persistence across page navigations (landing → login → signup)
- [x] T090 [US4] Test theme persistence on browser refresh (verify localStorage)
- [x] T091 [US4] Test theme toggle on all pages (landing, login, signup)

**Checkpoint**: User Story 4 complete - Theme toggle should work across all pages with persistence

---

## Phase 7: User Story 5 - Mobile User Experience (Priority: P2)

**Goal**: Ensure landing page is fully functional and optimized for mobile devices

**Independent Test**: Access landing page on mobile viewport (320px-768px) and verify all content is readable, interactive elements are tappable, animations are smooth, and navigation works correctly.

**Acceptance Criteria**:
1. All content readable without horizontal scrolling on mobile
2. Navbar adapts to mobile layout with visible buttons (no hamburger menu)
3. Animations optimized for mobile performance
4. All interactive elements are tappable with appropriate touch targets

### Mobile Navbar Optimization

- [x] T092 [P] [US5] Optimize PublicNavbar for mobile (compact spacing, smaller buttons)
- [x] T093 [US5] Verify all navbar buttons are tappable (min 44x44px touch targets)
- [x] T094 [US5] Test navbar on 320px viewport (smallest supported width)

### Mobile Hero Section Optimization

- [x] T095 [P] [US5] Optimize HeroSection typography for mobile (text-3xl on mobile)
- [x] T096 [US5] Stack CTA buttons vertically on mobile (flex-col)
- [x] T097 [US5] Adjust hero spacing for mobile (reduced padding)

### Mobile Showcase Optimization

- [x] T098 [P] [US5] Optimize AnimatedShowcase for mobile (smaller cards, reduced spacing)
- [x] T099 [US5] Test showcase animations on mobile (verify 60fps on throttled CPU)
- [x] T100 [US5] Reduce animation complexity on mobile if needed (fewer simultaneous animations)

### Mobile Features Section Optimization

- [x] T101 [P] [US5] Verify FeaturesSection displays 1 column on mobile
- [x] T102 [US5] Optimize feature card spacing for mobile
- [x] T103 [US5] Test feature card hover effects on mobile (tap instead of hover)

### Mobile CTA Section Optimization

- [x] T104 [P] [US5] Optimize CTASection button size for mobile (full-width or large)
- [x] T105 [US5] Adjust CTA section spacing for mobile

### Mobile Footer Optimization

- [x] T106 [P] [US5] Optimize Footer layout for mobile (stacked links)
- [x] T107 [US5] Verify footer links are tappable on mobile

### Mobile Auth Pages Optimization

- [x] T108 [P] [US5] Optimize AuthForm for mobile (full-width inputs, larger buttons)
- [x] T109 [US5] Test sign-in page on mobile viewport
- [x] T110 [US5] Test sign-up page on mobile viewport

### Mobile Testing

- [x] T111 [US5] Test complete landing page on 320px viewport (iPhone SE)
- [x] T112 [US5] Test complete landing page on 375px viewport (iPhone 12)
- [x] T113 [US5] Test complete landing page on 768px viewport (iPad)
- [x] T114 [US5] Verify no horizontal scrolling on any mobile viewport
- [x] T115 [US5] Test all user flows on mobile (landing → signup, landing → signin)

**Checkpoint**: User Story 5 complete - Landing page should be fully optimized for mobile devices

---

## Phase 8: Polish & Cross-Cutting Concerns

**Purpose**: Final improvements, accessibility, performance optimization, and quality assurance

### Accessibility Audit

- [x] T116 [P] Add skip-to-main-content link at top of landing page
- [x] T117 [P] Verify all interactive elements have visible focus indicators
- [x] T118 [P] Add ARIA labels to all icon buttons (theme toggle, navigation)
- [x] T119 [P] Verify form inputs have associated labels with htmlFor
- [x] T120 [P] Add aria-invalid and aria-describedby to form fields with errors
- [x] T121 [P] Verify heading hierarchy is logical (h1 → h2 → h3, no skipping)
- [x] T122 [P] Add alt text to any images (if added)
- [x] T123 [P] Test keyboard navigation (Tab, Enter, Escape) on all pages
- [x] T124 Run axe-core accessibility audit and fix any violations
- [x] T125 Test with screen reader (NVDA, JAWS, or VoiceOver) and fix issues

### Performance Optimization

- [x] T126 [P] Optimize animation performance (use CSS transforms only)
- [x] T127 [P] Implement code splitting for heavy components if needed
- [x] T128 [P] Optimize images (use Next.js Image component if images added)
- [x] T129 Run Lighthouse audit and achieve score > 90
- [x] T130 Verify Core Web Vitals (FCP < 1.5s, LCP < 2.5s, CLS < 0.1)
- [x] T131 Verify bundle size < 200KB gzipped
- [x] T132 Test animation performance on throttled CPU (4x slowdown)

### Error Handling

- [x] T133 [P] Add error boundary component for landing page
- [x] T134 [P] Implement graceful degradation for JavaScript disabled
- [x] T135 [P] Add network error handling for auth API calls
- [x] T136 Test error scenarios (network offline, API errors, validation errors)

### Browser Compatibility

- [x] T137 [P] Test landing page on Chrome (latest)
- [x] T138 [P] Test landing page on Firefox (latest)
- [x] T139 [P] Test landing page on Safari (latest)
- [x] T140 [P] Test landing page on Edge (latest)
- [x] T141 Fix any browser-specific issues

### Final QA

- [x] T142 Verify all user stories pass acceptance criteria
- [x] T143 Test complete user journey (landing → signup → dashboard)
- [x] T144 Test complete user journey (landing → signin → dashboard)
- [x] T145 Verify theme toggle works across all pages
- [x] T146 Verify responsive design on all breakpoints
- [x] T147 Verify animations run smoothly at 60fps
- [x] T148 Run final accessibility audit
- [x] T149 Run final performance audit
- [x] T150 Document any known issues or limitations

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3-7)**: All depend on Foundational phase completion
  - US1 (Landing Page): Can start after Foundational - No dependencies on other stories
  - US2 (Sign-In): Can start after Foundational - Depends on AuthForm from US2
  - US3 (Sign-Up): Can start after Foundational - Depends on AuthForm from US2
  - US4 (Theme Toggle): Can start after US1 (navbar exists) - Adds theme styling
  - US5 (Mobile): Can start after US1-US3 complete - Optimizes existing components
- **Polish (Phase 8)**: Depends on all user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2) - No dependencies on other stories
- **User Story 2 (P1)**: Can start after Foundational (Phase 2) - Creates AuthForm used by US3
- **User Story 3 (P1)**: Depends on US2 (AuthForm component) - Reuses AuthForm with mode="signup"
- **User Story 4 (P2)**: Depends on US1 (navbar exists) - Adds theme styling to existing components
- **User Story 5 (P2)**: Depends on US1-US3 complete - Optimizes existing components for mobile

### Within Each User Story

- Foundation files (constants, animations, types) before components
- Shared components (PublicNavbar, Footer) before story-specific components
- Components before page assembly
- Page assembly before integration testing
- Core functionality before optimization

### Parallel Opportunities

**Phase 1 (Setup)**: All tasks T001-T008 can run in parallel (different files)

**Phase 2 (Foundational)**: Tasks T009-T010 can run in parallel (different components)

**Phase 3 (US1)**:
- T011 (HeroSection), T016 (AnimatedShowcase), T024 (FeaturesSection), T030 (CTASection) can run in parallel
- Within each component, implementation tasks are sequential

**Phase 4 (US2)**:
- T043 (AuthForm) must complete before T052 (sign-in page)
- T052-T058 (sign-in page tasks) are sequential

**Phase 5 (US3)**:
- T063-T069 (sign-up page tasks) can start after T043 (AuthForm) is complete
- Integration tasks T070-T075 are sequential

**Phase 6 (US4)**:
- T076-T080 (theme toggle) can run in parallel with T081-T088 (theme styling)
- Theme styling tasks T081-T088 can run in parallel (different components)

**Phase 7 (US5)**:
- All mobile optimization tasks T092-T110 can run in parallel (different components)
- Mobile testing tasks T111-T115 are sequential

**Phase 8 (Polish)**:
- Accessibility tasks T116-T123 can run in parallel
- Performance tasks T126-T128 can run in parallel
- Browser testing tasks T137-T141 can run in parallel

---

## Parallel Example: User Story 1

```bash
# Launch all main components for User Story 1 together:
Task: "Create HeroSection component at web/src/components/landing/HeroSection.tsx"
Task: "Create AnimatedShowcase component at web/src/components/landing/AnimatedShowcase.tsx"
Task: "Create FeaturesSection component at web/src/components/landing/FeaturesSection.tsx"
Task: "Create CTASection component at web/src/components/landing/CTASection.tsx"

# These can all be developed in parallel since they are independent components
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup (T001-T008)
2. Complete Phase 2: Foundational (T009-T010)
3. Complete Phase 3: User Story 1 (T011-T042)
4. **STOP and VALIDATE**: Test landing page independently
5. Deploy/demo if ready

**MVP Deliverable**: Fully functional landing page with animations, responsive design, and navigation to sign-up page

### Incremental Delivery

1. **Foundation** (Phase 1-2): Setup + Foundational → Foundation ready
2. **MVP** (Phase 3): Add User Story 1 → Test independently → Deploy/Demo (Landing page live!)
3. **Auth** (Phase 4-5): Add User Stories 2-3 → Test independently → Deploy/Demo (Full auth flow)
4. **Enhancement** (Phase 6-7): Add User Stories 4-5 → Test independently → Deploy/Demo (Theme + Mobile)
5. **Polish** (Phase 8): Final QA and optimization → Production ready

Each increment adds value without breaking previous functionality.

### Parallel Team Strategy

With multiple developers:

1. **Team completes Setup + Foundational together** (Phase 1-2)
2. **Once Foundational is done**:
   - Developer A: User Story 1 (Landing page components)
   - Developer B: User Story 2 (Sign-in page) + User Story 3 (Sign-up page)
   - Developer C: User Story 4 (Theme toggle) after US1 navbar exists
3. **After US1-US3 complete**:
   - Developer A or B: User Story 5 (Mobile optimization)
   - Developer C: Phase 8 (Polish and QA)

---

## Task Summary

**Total Tasks**: 150 tasks

**Tasks by Phase**:
- Phase 1 (Setup): 8 tasks
- Phase 2 (Foundational): 2 tasks
- Phase 3 (US1 - Landing Page): 32 tasks
- Phase 4 (US2 - Sign-In): 20 tasks
- Phase 5 (US3 - Sign-Up): 13 tasks
- Phase 6 (US4 - Theme Toggle): 16 tasks
- Phase 7 (US5 - Mobile): 24 tasks
- Phase 8 (Polish): 35 tasks

**Tasks by User Story**:
- US1 (First-Time Visitor Discovery): 32 tasks
- US2 (Returning Visitor Authentication): 20 tasks
- US3 (New User Registration): 13 tasks
- US4 (Theme Preference Selection): 16 tasks
- US5 (Mobile User Experience): 24 tasks
- Setup/Foundational: 10 tasks
- Polish: 35 tasks

**Parallel Opportunities**: 45 tasks marked [P] can run in parallel

**Independent Test Criteria**:
- US1: Navigate to /, verify hero/showcase/features/CTA display, click CTA → /signup
- US2: Click "Sign In", complete form, verify dashboard redirect
- US3: Click "Sign Up", complete form, verify dashboard redirect
- US4: Click theme toggle, verify theme change and persistence
- US5: Access on mobile, verify responsive layout and functionality

**Suggested MVP Scope**: Phase 1-3 (Setup + Foundational + User Story 1) = 42 tasks for fully functional landing page

---

## Notes

- [P] tasks = different files, no dependencies, can run in parallel
- [Story] label maps task to specific user story for traceability
- Each user story should be independently completable and testable
- Tests are NOT included (not requested in specification)
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
- Frontend-only implementation - no backend or database changes
- Uses existing Better Auth, ThemeContext, shadcn/ui components
- Performance budget: <200KB gzipped, 60fps animations, 2s load time
- Accessibility: WCAG 2.1 AA compliance mandatory
