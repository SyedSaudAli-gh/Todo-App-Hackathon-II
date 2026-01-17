---
id: 2
title: Landing Page Implementation Plan
stage: plan
date: 2026-01-17
surface: agent
model: claude-sonnet-4-5-20250929
feature: 005-landing-page
branch: 005-landing-page
user: system
command: /sp.plan
labels: ["landing-page", "implementation-plan", "framer-motion", "responsive-design", "accessibility"]
links:
  spec: specs/005-landing-page/spec.md
  ticket: null
  adr: null
  pr: null
files:
  - specs/005-landing-page/plan.md
  - specs/005-landing-page/research.md
  - specs/005-landing-page/quickstart.md
tests:
  - None (planning phase)
---

## Prompt

# Project Plan: Animated Todos Landing Page + Auth Flow

## Objective
Create a modern, animated homepage for the Todos app with public-facing content that entices users to sign up or sign in. Ensure the UI is visually engaging, responsive, accessible, and theme-aware (light/dark). After authentication, redirect users to the dashboard.

---

## Create

### Architecture Sketch
- Component tree:
  - Navbar (Logo, app name, Theme toggle, Sign In/Sign Up buttons)
  - Hero Section (Headline, Subheading, Primary CTA, Animated Todo cards)
  - Features Section (3-4 key features with icons, titles, descriptions, hover animations)
  - Call to Action Section (Strong CTA, Primary button)
  - Footer (App name, Tagline, Links)

- Layout considerations:
  - Mobile-first, responsive breakpoints
  - Sticky navbar with subtle animation
  - Animations with framer-motion
  - Light/dark theme support

### Section Structure
- Navbar → Hero → Features → CTA → Footer
- Hero includes animated todo showcase
- Features include animated icons and hover effects
- CTA visually stands out

### Research Approach
- Competitor analysis of SaaS landing pages
- Best practices for animated micro-interactions
- Accessibility compliance
- Color contrast and typography for readability

### Quality Validation
- Visual testing across devices
- Cross-browser testing
- Accessibility (WCAG 2.1)
- Responsiveness & theme toggle testing
- Animation smoothness (no jank)
- CTA conversion clarity

---

## Decisions Needing Documentation

| Decision | Options | Tradeoffs |
|----------|--------|-----------|
| Animation style | Framer-motion vs Lottie | Framer-motion is lighter and easier to integrate; Lottie allows complex vector animations |
| Hero content | Static vs animated todos | Animated todos improve engagement but add complexity |
| Navbar auth buttons | Modal vs redirect | Modal is seamless but may need extra state; redirect is simpler |
| Color theme | Light/dark toggle | Increases user personalization but needs testing across all components |

---

## Testing Strategy
- Validate UI structure matches spec
- Test animated todos (entry/exit, completion)
- Test CTA buttons (Sign Up / Sign In) lead to correct pages
- Test theme toggle across all components
- Check mobile and desktop responsiveness
- Accessibility keyboard navigation and screen readers
- Ensure animations do not interfere with interactions

---

## Technical Details
- Use Next.js (App Router)
- TypeScript for type-safe components
- Tailwind CSS + shadcn/ui
- lucide-react for icons
- framer-motion for animations
- Organized by phases:
  1. Research → Component sketches & wireframes
  2. Foundation → Navbar + Hero layout
  3. Animation → Animated todos & features
  4. Integration → Auth buttons & redirects
  5. QA → Testing, accessibility, responsiveness
  6. Demo → Ready for presentation

---

## Notes
- Focus on landing page first; backend/auth logic is separate
- Ensure design is scalable for future features

## Response snapshot

Created comprehensive implementation plan for public landing page with three key deliverables:

**1. Implementation Plan (plan.md)**
- **Summary**: Frontend-only implementation using Next.js App Router with SSR, Framer Motion animations, shadcn/ui components, and Tailwind CSS
- **Technical Context**: Next.js 15+, React 19+, TypeScript 5+, Framer Motion 12+, existing Better Auth integration
- **Constitution Check**: ✅ PASS - Complies with Phase II principles (frontend-only nature appropriate for landing page)
- **Project Structure**: 7 main components in web/src/components/landing/ and web/src/components/auth/
- **Performance Goals**: 2s load time, 60fps animations, 100ms theme toggle, <200KB bundle
- **Constraints**: Frontend-only, no backend/DB changes, WCAG 2.1 AA compliance, mobile-first design
- **Phase 0 Research**: 5 research tasks (R1-R5) covering animations, responsive design, component architecture, auth integration, accessibility
- **Phase 1 Design**: 5 deliverables (D1-D5) for component specs, animation specs, content constants, TypeScript types, quickstart guide
- **Architectural Decisions**: 5 key decisions (AD1-AD5) documented with rationale and alternatives
- **Risk Assessment**: High risk (animation performance, bundle size), Medium risk (theme consistency, auth errors), Low risk (content updates)

**2. Research Document (research.md)**
- **R1 Animation Strategy**: Framer Motion with hardware-accelerated transforms, declarative variants, reduced motion support
  - Hero staggered fade-in (0.1s delay per element)
  - Todo card slide-in/exit animations (300-400ms)
  - Completion checkmark spring animation
  - Feature card hover scale (1.02) and shadow
  - Scroll-triggered fade-in with viewport detection
- **R2 Responsive Design**: Mobile-first with Tailwind breakpoints (md: 768px, lg: 1024px)
  - No hamburger menu (3 nav items fit on mobile)
  - Typography scaling (text-3xl → text-4xl → text-5xl)
  - Grid layouts (1 col mobile → 2 col tablet → 4 col desktop)
  - Component-specific responsive patterns documented
- **R3 Component Architecture**: Server components for static content, client components for interactivity
  - Server: HeroSection, FeaturesSection, CTASection, Footer
  - Client: PublicNavbar, AnimatedShowcase, AuthForm
  - Centralized content constants (lib/constants.ts)
  - TypeScript types (types/landing.ts)
- **R4 Authentication Integration**: Better Auth API with client validation and inline errors
  - Endpoints: /api/auth/sign-in/email, /api/auth/sign-up/email
  - Client-side validation (email format, password length, confirm match)
  - Error mapping to user-friendly messages
  - Loading states with disabled buttons
  - Post-auth redirect to /dashboard
- **R5 Accessibility**: WCAG 2.1 AA compliance with keyboard navigation and screen readers
  - Keyboard navigation (Tab, Enter, Space, Escape)
  - ARIA labels and roles for all interactive elements
  - Focus management and visible indicators
  - Color contrast validation (4.5:1 normal, 3:1 large text)
  - Screen reader support with semantic HTML

**3. Quickstart Guide (quickstart.md)**
- **Prerequisites**: Verified existing setup (Next.js 15+, Framer Motion, shadcn/ui, Better Auth, Tailwind, TypeScript)
- **Development Setup**: Directory structure, foundation files, component implementation order
- **Component Implementation Order**: 9 phases from foundation (PublicNavbar, Footer) to pages (landing, login, signup)
- **Component Specifications**: Detailed specs for all 7 components with props, state, interactions, styling, accessibility
- **Testing Strategy**: Unit tests, integration tests, E2E tests, accessibility tests, performance tests
- **Development Workflow**: TDD approach (Red-Green-Refactor), component checklist, git workflow
- **Common Patterns**: Server/client component patterns, conditional rendering, error handling
- **Troubleshooting**: Solutions for janky animations, theme persistence, auth errors, bundle size

**Key Technical Decisions:**
1. **Server vs Client Components**: Static sections as server components, interactive elements as client components (reduces bundle size, improves SEO)
2. **Animation Library**: Framer Motion (already installed, excellent performance, declarative API, TypeScript support)
3. **Content Management**: Centralized constants file (easy updates, supports future i18n, clear separation)
4. **Authentication Form**: Single reusable component with mode prop (reduces duplication, consistent validation)
5. **Mobile Navigation**: All buttons visible without hamburger menu (simple navigation, clearer CTAs)

**Performance Targets:**
- Landing page load: 2 seconds
- Animations: 60fps
- Theme toggle: 100ms response
- Bundle size: <200KB gzipped
- FCP: <1.5s, LCP: <2.5s, CLS: <0.1

**Accessibility Compliance:**
- WCAG 2.1 AA standards
- Keyboard navigation for all interactive elements
- ARIA labels and roles
- Color contrast ratios validated
- Screen reader support
- Reduced motion preference respected

**Project Structure:**
- 7 landing components (PublicNavbar, HeroSection, AnimatedShowcase, FeaturesSection, CTASection, Footer, AuthForm)
- 3 pages (/, /login, /signup)
- 3 foundation files (constants.ts, animations.ts, landing.ts)
- No backend or database changes required

## Outcome

- ✅ Impact: Comprehensive implementation plan created with research findings, component specifications, and developer guide for public landing page feature
- 🧪 Tests: No tests (planning phase) - testing strategy documented in quickstart.md for implementation phase
- 📁 Files: 3 files created (plan.md, research.md, quickstart.md)
- 🔁 Next prompts: `/sp.tasks` to generate detailed task breakdown, then begin implementation following TDD approach
- 🧠 Reflection: Planning phase complete with all technical unknowns resolved through research. Implementation plan provides clear roadmap with architectural decisions, component specifications, animation patterns, responsive design strategy, and accessibility requirements. Ready for task breakdown and implementation.

## Evaluation notes (flywheel)

- Failure modes observed: None - planning completed successfully with comprehensive research and design documentation
- Graders run and results (PASS/FAIL): Constitution Check: PASS, Research Complete: PASS, Design Specifications: PASS
- Prompt variant (if applicable): Standard /sp.plan workflow with user-provided architectural guidance
- Next experiment (smallest change to try): Consider adding interactive demo mode in future iteration (currently out of scope per spec)
