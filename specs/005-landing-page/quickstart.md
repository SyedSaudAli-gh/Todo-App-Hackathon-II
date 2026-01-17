# Quickstart: Public Landing Page Implementation

**Feature**: 005-landing-page
**Date**: 2026-01-17
**Purpose**: Developer guide for implementing the public landing page with animations and authentication

## Prerequisites

- ✅ Next.js 15+ project setup (existing at `web/`)
- ✅ Framer Motion 12+ installed (confirmed in package.json)
- ✅ shadcn/ui components available (existing)
- ✅ Better Auth configured (existing)
- ✅ Tailwind CSS 3+ configured (existing)
- ✅ TypeScript 5+ with strict mode (existing)
- ✅ Lucide React icons (existing)

## Development Setup

### 1. Review Documentation
- Read `spec.md` for feature requirements and user stories
- Read `plan.md` for technical approach and architectural decisions
- Read `research.md` for animation patterns, responsive design, and accessibility requirements

### 2. Create Directory Structure

```bash
# From web/ directory
mkdir -p src/components/landing
mkdir -p src/components/auth
mkdir -p src/types
mkdir -p src/lib
mkdir -p src/app/login
mkdir -p src/app/signup
```

### 3. Create Foundation Files

Create these files in order:

1. **Content Constants**: `web/src/lib/constants.ts`
2. **Animation Variants**: `web/src/lib/animations.ts`
3. **TypeScript Types**: `web/src/types/landing.ts`

### 4. Implement Components (TDD Approach)

Follow this order for component implementation:

1. **PublicNavbar** (foundation)
2. **Footer** (foundation)
3. **HeroSection** (core conversion)
4. **FeaturesSection** (supporting content)
5. **AnimatedShowcase** (engagement)
6. **CTASection** (final conversion)
7. **AuthForm** (authentication)
8. **Landing Page** (assembly)
9. **Auth Pages** (login, signup)

## Component Implementation Order

### Phase 1: Foundation Components (T001-T020)

#### T001: Create Content Constants
**File**: `web/src/lib/constants.ts`

```typescript
export const LANDING_CONTENT = {
  navbar: {
    appName: "Todos",
    signInText: "Sign In",
    signUpText: "Sign Up"
  },
  hero: {
    headline: "Organize Your Work, Amplify Your Productivity",
    subheading: "Smart todo management with personalized settings that adapt to your workflow. Stay focused on what matters.",
    primaryCTA: "Get Started",
    secondaryCTA: "View Demo"
  },
  showcase: {
    title: "See It In Action",
    demoTodos: [
      { id: 1, title: "Launch product feature", priority: "high", completed: false },
      { id: 2, title: "Review team proposals", priority: "medium", completed: false },
      { id: 3, title: "Update documentation", priority: "low", completed: false },
      { id: 4, title: "Prepare presentation", priority: "medium", completed: true },
      { id: 5, title: "Send weekly report", priority: "low", completed: true }
    ]
  },
  features: {
    title: "Built For Productivity",
    items: [
      {
        icon: "Settings",
        title: "Smart Task Behavior",
        description: "Customize how your todos behave with intelligent sorting and auto-hide options"
      },
      {
        icon: "User",
        title: "Personalized Settings",
        description: "Your preferences control everything - from priority display to completion behavior"
      },
      {
        icon: "Layout",
        title: "Clean, Distraction-Free UI",
        description: "Focus on your work with a minimal interface that adapts to your needs"
      },
      {
        icon: "Zap",
        title: "Fast & Responsive",
        description: "Built for speed with instant updates and smooth interactions"
      }
    ]
  },
  cta: {
    headline: "Start organizing your work today",
    buttonText: "Create Free Account"
  },
  footer: {
    appName: "Todos",
    tagline: "Productivity simplified",
    copyright: "© 2026 Todos. All rights reserved.",
    links: [
      { text: "Privacy Policy", href: "/privacy" },
      { text: "GitHub", href: "https://github.com/yourusername/todos" }
    ]
  }
} as const;
```

#### T002: Create Animation Variants
**File**: `web/src/lib/animations.ts`

See `research.md` R1 section for complete animation variant definitions.

#### T003: Create TypeScript Types
**File**: `web/src/types/landing.ts`

```typescript
export interface DemoTodo {
  id: number;
  title: string;
  priority: "high" | "medium" | "low";
  completed: boolean;
}

export interface Feature {
  icon: string;
  title: string;
  description: string;
}

export interface FooterLink {
  text: string;
  href: string;
}

export interface AuthFormProps {
  mode: "signin" | "signup";
  onSubmit: (data: AuthFormData) => Promise<void>;
  loading: boolean;
  error: string | null;
}

export interface AuthFormData {
  email: string;
  password: string;
  confirmPassword?: string;
}

export interface ValidationErrors {
  email?: string;
  password?: string;
  confirmPassword?: string;
}
```

### Phase 2: Static Components (T021-T040)

#### T021: Implement PublicNavbar
**File**: `web/src/components/landing/PublicNavbar.tsx`

**Component Type**: Client Component (interactive)

**Props**: None (uses ThemeContext)

**State**:
- `isScrolled: boolean` - Track scroll position for styling

**Interactions**:
- Theme toggle click
- Sign In button click → navigate to /login
- Sign Up button click → navigate to /signup

**Styling**:
- Sticky positioning (`sticky top-0 z-50`)
- Backdrop blur (`backdrop-blur-md`)
- Shadow on scroll (`shadow-md` when scrolled)
- Responsive spacing (see research.md R2)

**Accessibility**:
- `<nav aria-label="Main navigation">`
- Theme toggle: `aria-label="Toggle theme"`
- Keyboard navigation support

**Implementation Pattern**:
```tsx
"use client";

import { useEffect, useState } from "react";
import { useTheme } from "@/contexts/ThemeContext";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Moon, Sun } from "lucide-react";
import { LANDING_CONTENT } from "@/lib/constants";

export function PublicNavbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const { theme, setTheme } = useTheme();
  const router = useRouter();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`sticky top-0 z-50 backdrop-blur-md transition-shadow ${
        isScrolled ? "shadow-md" : ""
      }`}
      aria-label="Main navigation"
    >
      {/* Implementation */}
    </nav>
  );
}
```

#### T022: Implement Footer
**File**: `web/src/components/landing/Footer.tsx`

**Component Type**: Server Component (static)

**Props**: None (uses constants)

**Styling**:
- Subtle background
- Centered content
- Responsive padding

**Accessibility**:
- Semantic `<footer>` element
- Descriptive link text

#### T023: Implement HeroSection
**File**: `web/src/components/landing/HeroSection.tsx`

**Component Type**: Server Component with client animations

**Props**: None (uses constants)

**Animations**:
- Staggered fade-in for headline, subheading, CTAs
- See research.md R1 for animation variants

**Responsive Design**:
- Mobile: Single column, smaller text
- Tablet/Desktop: Larger text, horizontal buttons
- See research.md R2 for breakpoints

**Accessibility**:
- `<section aria-labelledby="hero-heading">`
- Proper heading hierarchy (h1)

#### T024: Implement FeaturesSection
**File**: `web/src/components/landing/FeaturesSection.tsx`

**Component Type**: Server Component with client hover effects

**Props**: None (uses constants)

**Layout**:
- Mobile: 1 column grid
- Tablet: 2 columns
- Desktop: 4 columns

**Animations**:
- Hover scale and shadow on feature cards
- See research.md R1 for variants

#### T025: Implement CTASection
**File**: `web/src/components/landing/CTASection.tsx`

**Component Type**: Server Component

**Props**: None (uses constants)

**Styling**:
- Visually prominent (gradient or contrasting background)
- Large button
- Centered content

### Phase 3: Interactive Components (T041-T060)

#### T041: Implement AnimatedShowcase
**File**: `web/src/components/landing/AnimatedShowcase.tsx`

**Component Type**: Client Component (complex animations)

**Props**: None (uses mock data from constants)

**State**:
- `demoTodos: DemoTodo[]` - Array of demo todos
- `currentAnimation: string` - Current animation state

**Animations**:
- Todo slide-in from left
- Completion checkmark animation
- Priority badge pulse
- Fade-out for completed todos
- See research.md R1 for all variants

**Implementation Pattern**:
```tsx
"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { LANDING_CONTENT } from "@/lib/constants";
import { todoSlideVariants, checkmarkVariants } from "@/lib/animations";

export function AnimatedShowcase() {
  const [demoTodos, setDemoTodos] = useState(LANDING_CONTENT.showcase.demoTodos);

  // Automated animation sequence
  useEffect(() => {
    // Implement animation loop
  }, []);

  return (
    <section className="py-12 md:py-16 lg:py-20">
      <h2 className="text-center text-3xl font-bold md:text-4xl">
        {LANDING_CONTENT.showcase.title}
      </h2>
      <div className="mt-8 space-y-4">
        <AnimatePresence mode="wait">
          {demoTodos.map(todo => (
            <motion.div
              key={todo.id}
              variants={todoSlideVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              {/* Todo card content */}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </section>
  );
}
```

#### T042: Implement AuthForm
**File**: `web/src/components/auth/AuthForm.tsx`

**Component Type**: Client Component (form state and API calls)

**Props**:
- `mode: "signin" | "signup"` - Form mode
- `onSubmit: (data: AuthFormData) => Promise<void>` - Submit handler
- `loading: boolean` - Loading state
- `error: string | null` - Error message

**State**:
- `formData: AuthFormData` - Form field values
- `validationErrors: ValidationErrors` - Client-side validation errors

**Validation**:
- Email format validation
- Password length (min 8 characters)
- Confirm password match (signup only)
- See research.md R4 for validation patterns

**Error Handling**:
- Inline error messages below fields
- API error mapping to user-friendly messages
- See research.md R4 for error patterns

**Accessibility**:
- Associated labels for all inputs
- `aria-invalid` on error fields
- `aria-describedby` for error messages
- `role="alert"` for error text

**Implementation Pattern**:
```tsx
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";

export function AuthForm({ mode, onSubmit, loading, error }: AuthFormProps) {
  const [formData, setFormData] = useState<AuthFormData>({
    email: "",
    password: "",
    confirmPassword: ""
  });
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Client-side validation
    const errors = validateForm(formData, mode);
    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      return;
    }

    // Call parent onSubmit
    await onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Form fields */}
    </form>
  );
}
```

### Phase 4: Page Assembly (T061-T070)

#### T061: Implement Landing Page
**File**: `web/src/app/page.tsx`

**Component Type**: Server Component (page)

**Structure**:
```tsx
import { PublicNavbar } from "@/components/landing/PublicNavbar";
import { HeroSection } from "@/components/landing/HeroSection";
import { AnimatedShowcase } from "@/components/landing/AnimatedShowcase";
import { FeaturesSection } from "@/components/landing/FeaturesSection";
import { CTASection } from "@/components/landing/CTASection";
import { Footer } from "@/components/landing/Footer";

export default function LandingPage() {
  return (
    <div className="min-h-screen">
      <PublicNavbar />
      <main id="main-content">
        <HeroSection />
        <AnimatedShowcase />
        <FeaturesSection />
        <CTASection />
      </main>
      <Footer />
    </div>
  );
}
```

#### T062: Implement Sign-In Page
**File**: `web/src/app/login/page.tsx`

**Component Type**: Client Component (uses router and auth)

**Implementation**:
```tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AuthForm } from "@/components/auth/AuthForm";
import { AuthFormData } from "@/types/landing";

export default function SignInPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  async function handleSignIn(data: AuthFormData) {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/auth/sign-in/email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: data.email, password: data.password })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Sign in failed");
      }

      router.push("/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="w-full max-w-md space-y-6 p-6">
        <h1 className="text-2xl font-bold">Sign In</h1>
        <AuthForm
          mode="signin"
          onSubmit={handleSignIn}
          loading={loading}
          error={error}
        />
      </div>
    </div>
  );
}
```

#### T063: Implement Sign-Up Page
**File**: `web/src/app/signup/page.tsx`

Similar to sign-in page but with `mode="signup"` and `/api/auth/sign-up/email` endpoint.

## Testing Strategy

### Unit Tests
- Test each component in isolation
- Mock external dependencies (router, theme context, API calls)
- Test props, state, and interactions
- Use React Testing Library

### Integration Tests
- Test authentication flows end-to-end
- Test form validation and error handling
- Test navigation between pages
- Use React Testing Library + MSW for API mocking

### E2E Tests
- Test complete user journeys
- Test landing page → sign up → dashboard flow
- Test landing page → sign in → dashboard flow
- Test theme toggle persistence
- Use Playwright or Cypress

### Accessibility Tests
- Run axe-core audit on all pages
- Test keyboard navigation (Tab, Enter, Escape)
- Test screen reader announcements
- Validate color contrast ratios
- Test with reduced motion preference

### Performance Tests
- Lighthouse audit (target score > 90)
- Core Web Vitals (FCP < 1.5s, LCP < 2.5s, CLS < 0.1)
- Bundle size analysis (target < 200KB gzipped)
- Animation performance (60fps on throttled CPU)

## Development Workflow

### 1. TDD Approach (Red-Green-Refactor)

For each component:

1. **Red**: Write failing test
   ```typescript
   describe("PublicNavbar", () => {
     it("should render app name", () => {
       render(<PublicNavbar />);
       expect(screen.getByText("Todos")).toBeInTheDocument();
     });
   });
   ```

2. **Green**: Implement minimum code to pass
   ```tsx
   export function PublicNavbar() {
     return <nav>Todos</nav>;
   }
   ```

3. **Refactor**: Improve code quality
   ```tsx
   export function PublicNavbar() {
     const { appName } = LANDING_CONTENT.navbar;
     return (
       <nav aria-label="Main navigation">
         <span className="font-semibold">{appName}</span>
       </nav>
     );
   }
   ```

### 2. Component Checklist

Before marking a component complete, verify:

- [ ] Component renders without errors
- [ ] Props are properly typed
- [ ] State management works correctly
- [ ] Interactions trigger expected behavior
- [ ] Responsive design works on all breakpoints
- [ ] Animations run smoothly at 60fps
- [ ] Accessibility requirements met (keyboard, ARIA, contrast)
- [ ] Unit tests pass
- [ ] No console errors or warnings
- [ ] Code follows project style guide

### 3. Git Workflow

```bash
# Create feature branch (already on 005-landing-page)
git checkout 005-landing-page

# Implement component
# ... code changes ...

# Run tests
npm test

# Commit with descriptive message
git add .
git commit -m "feat(landing): implement PublicNavbar component

- Add sticky navbar with theme toggle
- Implement scroll-based shadow
- Add responsive spacing
- Include accessibility attributes

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>"

# Push to remote
git push origin 005-landing-page
```

## Common Patterns

### Pattern 1: Server Component with Client Wrapper

```tsx
// Server component (default)
export default function FeaturesSection() {
  return (
    <section>
      <h2>{LANDING_CONTENT.features.title}</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
        {LANDING_CONTENT.features.items.map(feature => (
          <FeatureCard key={feature.title} {...feature} />
        ))}
      </div>
    </section>
  );
}

// Client component for hover effects
"use client";
function FeatureCard({ icon, title, description }: Feature) {
  return (
    <motion.article
      variants={featureHoverVariants}
      initial="rest"
      whileHover="hover"
    >
      {/* Card content */}
    </motion.article>
  );
}
```

### Pattern 2: Conditional Rendering Based on Mode

```tsx
<AuthForm mode={mode}>
  {/* Email field (both modes) */}
  <Input type="email" {...emailProps} />

  {/* Password field (both modes) */}
  <Input type="password" {...passwordProps} />

  {/* Confirm password (signup only) */}
  {mode === "signup" && (
    <Input type="password" {...confirmPasswordProps} />
  )}

  {/* Submit button text */}
  <Button type="submit">
    {mode === "signin" ? "Sign In" : "Sign Up"}
  </Button>
</AuthForm>
```

### Pattern 3: Error Handling with User Feedback

```tsx
async function handleSubmit(data: FormData) {
  try {
    setLoading(true);
    setError(null);

    const response = await fetch(endpoint, {
      method: "POST",
      body: JSON.stringify(data)
    });

    if (!response.ok) {
      throw new Error(await response.text());
    }

    // Success
    router.push("/dashboard");
  } catch (err) {
    setError(mapAuthError(err));
  } finally {
    setLoading(false);
  }
}
```

## Troubleshooting

### Issue: Animations are janky on mobile
**Solution**:
- Use CSS transforms only (translateX, translateY, scale)
- Reduce number of simultaneous animations
- Test on throttled CPU (4x slowdown in DevTools)
- Implement reduced motion fallback

### Issue: Theme toggle doesn't persist
**Solution**:
- Verify ThemeContext is wrapping the app
- Check localStorage is being updated
- Ensure theme is read on initial load

### Issue: Better Auth API returns 401
**Solution**:
- Check CORS configuration in backend
- Verify API endpoint URLs are correct
- Check request headers include Content-Type
- Verify credentials are being sent

### Issue: Bundle size too large
**Solution**:
- Use dynamic imports for heavy components
- Tree-shake unused Framer Motion features
- Optimize images (use Next.js Image component)
- Run bundle analyzer: `npm run build -- --analyze`

## Next Steps

1. ✅ Review this quickstart guide
2. ✅ Review research.md for technical patterns
3. ✅ Review plan.md for architectural decisions
4. ⏭️ Run `/sp.tasks` to generate detailed task breakdown
5. ⏭️ Begin implementation following TDD approach
6. ⏭️ Run tests after each component
7. ⏭️ Perform accessibility audit before deployment
8. ⏭️ Final QA and performance testing

## Resources

- **Framer Motion Docs**: https://www.framer.com/motion/
- **Next.js App Router**: https://nextjs.org/docs/app
- **Tailwind CSS**: https://tailwindcss.com/docs
- **shadcn/ui**: https://ui.shadcn.com/
- **WCAG 2.1 Guidelines**: https://www.w3.org/WAI/WCAG21/quickref/
- **Better Auth Docs**: https://www.better-auth.com/docs

---

**Ready to implement?** Run `/sp.tasks` to generate the detailed task breakdown and begin development!
