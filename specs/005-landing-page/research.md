# Research: Public Landing Page Implementation

**Feature**: 005-landing-page
**Date**: 2026-01-17
**Purpose**: Document research findings and technical decisions for landing page implementation

## R1: Animation Strategy with Framer Motion

### Decision
Use Framer Motion with declarative animation variants for all landing page animations, including staggered hero animations, todo showcase animations, and feature card hover effects.

### Rationale
- **Performance**: Framer Motion uses hardware-accelerated CSS transforms (translateX, translateY, scale) for smooth 60fps animations
- **Developer Experience**: Declarative API with variants matches React patterns and is easier to maintain than imperative animation code
- **Built-in Features**: AnimatePresence for enter/exit animations, layout animations, and gesture support
- **Accessibility**: Built-in support for `prefers-reduced-motion` media query
- **TypeScript Support**: Excellent type definitions for all animation properties
- **Bundle Size**: Tree-shakeable, only import what you use (~30KB gzipped for core features)

### Implementation Patterns

#### 1. Hero Staggered Fade-In
```typescript
// web/src/lib/animations.ts
export const heroVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.1,
      duration: 0.6,
      ease: "easeOut"
    }
  })
};

// Usage in HeroSection.tsx
<motion.h1
  custom={0}
  initial="hidden"
  animate="visible"
  variants={heroVariants}
>
  {headline}
</motion.h1>
<motion.p
  custom={1}
  initial="hidden"
  animate="visible"
  variants={heroVariants}
>
  {subheading}
</motion.p>
```

#### 2. Todo Card Animations
```typescript
export const todoSlideVariants = {
  hidden: { opacity: 0, x: -50 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.3, ease: "easeOut" }
  },
  exit: {
    opacity: 0,
    x: 50,
    transition: { duration: 0.4, ease: "easeIn" }
  }
};

export const checkmarkVariants = {
  unchecked: { scale: 0, rotate: -180 },
  checked: {
    scale: 1,
    rotate: 0,
    transition: { type: "spring", stiffness: 200, damping: 15 }
  }
};

// Usage with AnimatePresence for enter/exit
<AnimatePresence mode="wait">
  {todos.map(todo => (
    <motion.div
      key={todo.id}
      variants={todoSlideVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
    >
      {/* Todo content */}
    </motion.div>
  ))}
</AnimatePresence>
```

#### 3. Feature Card Hover
```typescript
export const featureHoverVariants = {
  rest: {
    scale: 1,
    boxShadow: "0 4px 6px rgba(0,0,0,0.1)"
  },
  hover: {
    scale: 1.02,
    boxShadow: "0 10px 20px rgba(0,0,0,0.15)",
    transition: { duration: 0.2, ease: "easeOut" }
  }
};

// Usage with whileHover
<motion.div
  variants={featureHoverVariants}
  initial="rest"
  whileHover="hover"
>
  {/* Feature card content */}
</motion.div>
```

#### 4. Scroll-Triggered Animations
```typescript
export const scrollFadeVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: "easeOut" }
  }
};

// Usage with viewport detection
<motion.section
  variants={scrollFadeVariants}
  initial="hidden"
  whileInView="visible"
  viewport={{ once: true, amount: 0.3 }}
>
  {/* Section content */}
</motion.section>
```

#### 5. Reduced Motion Support
```typescript
// Automatically handled by Framer Motion
// Add custom hook for additional control
export const useReducedMotion = () => {
  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  return prefersReducedMotion;
};

// Usage in components
const shouldAnimate = !useReducedMotion();
<motion.div animate={shouldAnimate ? "visible" : "hidden"}>
```

### Performance Optimization
- Use `will-change: transform` sparingly (only on actively animating elements)
- Limit simultaneous animations to 5-7 elements
- Use `layout` prop only when necessary (expensive)
- Prefer `transform` and `opacity` over `width`, `height`, `top`, `left`
- Test on throttled CPU (4x slowdown in Chrome DevTools)

---

## R2: Responsive Design Patterns

### Decision
Use mobile-first responsive design with Tailwind CSS breakpoints: mobile (default), tablet (md: 768px), desktop (lg: 1024px). All navigation elements visible on mobile without hamburger menu.

### Rationale
- **Mobile-First**: Ensures core experience works on smallest screens first
- **Tailwind Breakpoints**: Standard breakpoints align with common device sizes
- **No Hamburger Menu**: Simple navigation (3 items) fits on mobile without menu complexity
- **Progressive Enhancement**: Add features and spacing as screen size increases

### Breakpoint Strategy

```typescript
// Tailwind breakpoints (default configuration)
// sm: 640px  - Not used (mobile-first covers this)
// md: 768px  - Tablet
// lg: 1024px - Desktop
// xl: 1280px - Large desktop (optional enhancements)
```

### Component Responsive Patterns

#### 1. PublicNavbar
```tsx
// Mobile (default): Horizontal layout, compact spacing
<nav className="flex items-center justify-between px-4 py-3">
  <div className="flex items-center gap-2">
    <Logo />
    <span className="text-sm font-semibold">Todos</span>
  </div>
  <div className="flex items-center gap-2">
    <ThemeToggle />
    <Button size="sm" variant="ghost">Sign In</Button>
    <Button size="sm">Sign Up</Button>
  </div>
</nav>

// Tablet/Desktop: Increased spacing
<nav className="flex items-center justify-between px-6 py-4 md:px-8 lg:px-12">
  <div className="flex items-center gap-3">
    <Logo />
    <span className="text-base font-semibold md:text-lg">Todos</span>
  </div>
  <div className="flex items-center gap-3 md:gap-4">
    <ThemeToggle />
    <Button size="default" variant="ghost">Sign In</Button>
    <Button size="default">Sign Up</Button>
  </div>
</nav>
```

#### 2. HeroSection
```tsx
// Mobile: Single column, smaller text
<section className="px-4 py-12 text-center">
  <h1 className="text-3xl font-bold">
    {headline}
  </h1>
  <p className="mt-4 text-base text-muted-foreground">
    {subheading}
  </p>
  <div className="mt-6 flex flex-col gap-3">
    <Button size="lg">{primaryCTA}</Button>
    <Button size="lg" variant="outline">{secondaryCTA}</Button>
  </div>
</section>

// Tablet/Desktop: Larger text, horizontal buttons
<section className="px-6 py-16 text-center md:py-20 lg:py-24">
  <h1 className="text-4xl font-bold md:text-5xl lg:text-6xl">
    {headline}
  </h1>
  <p className="mt-6 text-lg text-muted-foreground md:text-xl lg:text-2xl">
    {subheading}
  </p>
  <div className="mt-8 flex flex-col gap-4 md:flex-row md:justify-center">
    <Button size="lg">{primaryCTA}</Button>
    <Button size="lg" variant="outline">{secondaryCTA}</Button>
  </div>
</section>
```

#### 3. FeaturesSection
```tsx
// Mobile: 1 column grid
<div className="grid grid-cols-1 gap-6">
  {features.map(feature => <FeatureCard key={feature.title} {...feature} />)}
</div>

// Tablet: 2 columns
<div className="grid grid-cols-1 gap-6 md:grid-cols-2 md:gap-8">
  {features.map(feature => <FeatureCard key={feature.title} {...feature} />)}
</div>

// Desktop: 4 columns
<div className="grid grid-cols-1 gap-6 md:grid-cols-2 md:gap-8 lg:grid-cols-4">
  {features.map(feature => <FeatureCard key={feature.title} {...feature} />)}
</div>
```

#### 4. AnimatedShowcase
```tsx
// Mobile: Smaller cards, reduced spacing
<div className="space-y-3">
  {demoTodos.map(todo => (
    <TodoCard key={todo.id} {...todo} className="p-3 text-sm" />
  ))}
</div>

// Tablet/Desktop: Larger cards, increased spacing
<div className="space-y-4 md:space-y-5">
  {demoTodos.map(todo => (
    <TodoCard key={todo.id} {...todo} className="p-4 text-base md:p-5" />
  ))}
</div>
```

### Typography Scaling
```typescript
// Tailwind responsive text classes
// Mobile → Tablet → Desktop
"text-3xl md:text-4xl lg:text-5xl"  // Hero headline
"text-base md:text-lg lg:text-xl"   // Hero subheading
"text-2xl md:text-3xl lg:text-4xl"  // Section titles
"text-sm md:text-base"              // Body text
"text-xs md:text-sm"                // Small text
```

---

## R3: Component Architecture

### Decision
Use Next.js App Router with server components for static content (Hero, Features, CTA, Footer) and client components for interactive elements (Navbar, AnimatedShowcase, AuthForm). Centralize content in constants file and types in dedicated types file.

### Rationale
- **Server Components**: Reduce JavaScript bundle size for static content, improve SEO with SSR
- **Client Components**: Required for animations, state management, and user interactions
- **Separation of Concerns**: Content, types, and logic separated for maintainability
- **Type Safety**: TypeScript interfaces ensure consistency across components

### Server vs. Client Component Boundaries

#### Server Components (Default)
- **HeroSection**: Static content with animations (animations run on client after hydration)
- **FeaturesSection**: Static feature cards (hover animations handled by CSS or client wrapper)
- **CTASection**: Static call-to-action content
- **Footer**: Static footer content with links

#### Client Components (Marked with "use client")
- **PublicNavbar**: Interactive theme toggle, navigation buttons
- **AnimatedShowcase**: Complex animations with state management
- **AuthForm**: Form state, validation, API calls
- **ThemeToggle**: Interactive button with theme context

### Component Prop Patterns

```typescript
// Server component with no props (uses constants)
export default function HeroSection() {
  const { headline, subheading, primaryCTA } = LANDING_CONTENT.hero;
  return (/* JSX */);
}

// Client component with typed props
"use client";
interface AuthFormProps {
  mode: "signin" | "signup";
  onSubmit: (data: AuthFormData) => Promise<void>;
  loading: boolean;
  error: string | null;
}
export function AuthForm({ mode, onSubmit, loading, error }: AuthFormProps) {
  return (/* JSX */);
}

// Client component using context
"use client";
export function PublicNavbar() {
  const { theme, setTheme } = useTheme();
  return (/* JSX */);
}
```

### Content Management Structure

```typescript
// web/src/lib/constants.ts
export const LANDING_CONTENT = {
  navbar: { /* ... */ },
  hero: { /* ... */ },
  showcase: { /* ... */ },
  features: { /* ... */ },
  cta: { /* ... */ },
  footer: { /* ... */ }
} as const;

// Type inference from constants
export type LandingContent = typeof LANDING_CONTENT;
```

### File Organization
```
web/src/
├── app/
│   ├── page.tsx                    # Landing page (server component)
│   ├── login/page.tsx              # Sign-in page (client component)
│   └── signup/page.tsx             # Sign-up page (client component)
├── components/
│   ├── landing/
│   │   ├── PublicNavbar.tsx        # Client component
│   │   ├── HeroSection.tsx         # Server component
│   │   ├── AnimatedShowcase.tsx    # Client component
│   │   ├── FeaturesSection.tsx     # Server component
│   │   ├── CTASection.tsx          # Server component
│   │   └── Footer.tsx              # Server component
│   └── auth/
│       └── AuthForm.tsx            # Client component
├── lib/
│   ├── constants.ts                # Content constants
│   └── animations.ts               # Animation variants
└── types/
    └── landing.ts                  # TypeScript interfaces
```

---

## R4: Authentication Flow Integration

### Decision
Use existing Better Auth API endpoints with client-side form validation, inline error messages, and loading states. Redirect to dashboard after successful authentication using Next.js router.

### Rationale
- **Existing Integration**: Better Auth already configured, no backend changes needed
- **Client Validation**: Immediate feedback before API call reduces unnecessary requests
- **Inline Errors**: Clearer than toast notifications for form-specific errors
- **Loading States**: Disabled buttons and loading indicators prevent double submissions

### Better Auth API Endpoints

```typescript
// Sign In
POST /api/auth/sign-in/email
Request: { email: string, password: string }
Response: { user: User, session: Session } | { error: string }

// Sign Up
POST /api/auth/sign-up/email
Request: { email: string, password: string, name?: string }
Response: { user: User, session: Session } | { error: string }

// Get Session
GET /api/auth/get-session
Response: { user: User, session: Session } | null
```

### Form Validation Strategy

```typescript
// Client-side validation (before API call)
interface ValidationErrors {
  email?: string;
  password?: string;
  confirmPassword?: string;
}

function validateForm(data: AuthFormData, mode: "signin" | "signup"): ValidationErrors {
  const errors: ValidationErrors = {};

  // Email validation
  if (!data.email) {
    errors.email = "Email is required";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    errors.email = "Invalid email format";
  }

  // Password validation
  if (!data.password) {
    errors.password = "Password is required";
  } else if (data.password.length < 8) {
    errors.password = "Password must be at least 8 characters";
  }

  // Confirm password (signup only)
  if (mode === "signup") {
    if (!data.confirmPassword) {
      errors.confirmPassword = "Please confirm your password";
    } else if (data.password !== data.confirmPassword) {
      errors.confirmPassword = "Passwords do not match";
    }
  }

  return errors;
}
```

### Error Handling Pattern

```typescript
// Map API errors to user-friendly messages
function mapAuthError(error: unknown): string {
  if (error instanceof Error) {
    // Better Auth error messages
    if (error.message.includes("Invalid password")) {
      return "Incorrect email or password";
    }
    if (error.message.includes("User not found")) {
      return "No account found with this email";
    }
    if (error.message.includes("Email already exists")) {
      return "An account with this email already exists";
    }
    return error.message;
  }
  return "An unexpected error occurred. Please try again.";
}

// Usage in AuthForm
async function handleSubmit(data: AuthFormData) {
  setLoading(true);
  setError(null);

  try {
    const response = await fetch(`/api/auth/${mode === "signin" ? "sign-in" : "sign-up"}/email`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Authentication failed");
    }

    // Success - redirect to dashboard
    router.push("/dashboard");
  } catch (error) {
    setError(mapAuthError(error));
  } finally {
    setLoading(false);
  }
}
```

### Loading State Implementation

```tsx
<Button
  type="submit"
  disabled={loading}
  className="w-full"
>
  {loading ? (
    <>
      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
      {mode === "signin" ? "Signing in..." : "Creating account..."}
    </>
  ) : (
    mode === "signin" ? "Sign In" : "Sign Up"
  )}
</Button>
```

### Post-Authentication Redirect

```typescript
"use client";
import { useRouter } from "next/navigation";

export function AuthForm({ mode }: AuthFormProps) {
  const router = useRouter();

  async function handleSubmit(data: AuthFormData) {
    // ... authentication logic

    // On success
    router.push("/dashboard");
    // Or with refresh to update server components
    router.push("/dashboard");
    router.refresh();
  }
}
```

---

## R5: Accessibility Implementation

### Decision
Implement WCAG 2.1 AA compliance with keyboard navigation, ARIA labels, focus management, color contrast validation, and screen reader support. Use semantic HTML and test with axe-core.

### Rationale
- **Legal Compliance**: WCAG 2.1 AA is standard for web accessibility
- **Inclusive Design**: Ensures usability for users with disabilities
- **SEO Benefits**: Semantic HTML improves search engine understanding
- **Keyboard Navigation**: Essential for power users and accessibility
- **Screen Readers**: Significant portion of users rely on assistive technology

### Keyboard Navigation Requirements

```typescript
// Tab order: Navbar → Hero CTA → Features → CTA → Footer links
// All interactive elements must be focusable

// Skip to main content link (first focusable element)
<a
  href="#main-content"
  className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50"
>
  Skip to main content
</a>

// Focus visible styles (Tailwind)
className="focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"

// Keyboard event handlers
<button
  onClick={handleClick}
  onKeyDown={(e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      handleClick();
    }
  }}
>
```

### ARIA Labels and Roles

```tsx
// Navbar
<nav aria-label="Main navigation">
  <button aria-label="Toggle theme" onClick={toggleTheme}>
    {theme === "light" ? <Moon /> : <Sun />}
  </button>
</nav>

// Hero section
<section aria-labelledby="hero-heading">
  <h1 id="hero-heading">{headline}</h1>
</section>

// Feature cards
<div role="list" aria-label="Product features">
  {features.map(feature => (
    <article key={feature.title} role="listitem">
      <h3>{feature.title}</h3>
      <p>{feature.description}</p>
    </article>
  ))}
</div>

// Form inputs
<label htmlFor="email">Email</label>
<input
  id="email"
  type="email"
  aria-required="true"
  aria-invalid={!!errors.email}
  aria-describedby={errors.email ? "email-error" : undefined}
/>
{errors.email && (
  <span id="email-error" role="alert" className="text-destructive">
    {errors.email}
  </span>
)}
```

### Color Contrast Requirements

```typescript
// WCAG 2.1 AA Standards
// Normal text (< 18pt): 4.5:1 contrast ratio
// Large text (≥ 18pt or ≥ 14pt bold): 3:1 contrast ratio

// Tailwind classes that meet contrast requirements
// Light mode
"text-gray-900 bg-white"           // 21:1 (excellent)
"text-gray-700 bg-gray-50"         // 10.7:1 (excellent)
"text-blue-600 bg-white"           // 8.6:1 (excellent)

// Dark mode
"text-gray-100 bg-gray-900"        // 18.2:1 (excellent)
"text-gray-300 bg-gray-800"        // 11.6:1 (excellent)
"text-blue-400 bg-gray-900"        // 8.2:1 (excellent)

// Validation tool
// Use Chrome DevTools Lighthouse or axe DevTools
```

### Screen Reader Support

```tsx
// Visually hidden but screen reader accessible
<span className="sr-only">
  Loading...
</span>

// Live regions for dynamic content
<div aria-live="polite" aria-atomic="true">
  {error && <p role="alert">{error}</p>}
</div>

// Descriptive link text (avoid "click here")
<a href="/privacy">
  Read our privacy policy
  <span className="sr-only"> (opens in new tab)</span>
</a>

// Image alt text
<img
  src="/logo.svg"
  alt="Todos - Productivity simplified"
/>

// Decorative images
<img
  src="/decoration.svg"
  alt=""
  role="presentation"
/>
```

### Focus Management

```typescript
// Trap focus in modal/dialog
import { useEffect, useRef } from "react";

function Dialog({ isOpen, onClose, children }) {
  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      // Focus first focusable element
      const firstFocusable = dialogRef.current?.querySelector(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      (firstFocusable as HTMLElement)?.focus();

      // Trap focus within dialog
      const handleTab = (e: KeyboardEvent) => {
        if (e.key === "Tab") {
          const focusableElements = dialogRef.current?.querySelectorAll(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
          );
          const firstElement = focusableElements?.[0] as HTMLElement;
          const lastElement = focusableElements?.[focusableElements.length - 1] as HTMLElement;

          if (e.shiftKey && document.activeElement === firstElement) {
            e.preventDefault();
            lastElement?.focus();
          } else if (!e.shiftKey && document.activeElement === lastElement) {
            e.preventDefault();
            firstElement?.focus();
          }
        }
      };

      document.addEventListener("keydown", handleTab);
      return () => document.removeEventListener("keydown", handleTab);
    }
  }, [isOpen]);

  return (/* dialog JSX */);
}
```

### Accessibility Testing Checklist

- [ ] All interactive elements keyboard accessible (Tab, Enter, Space, Escape)
- [ ] Focus indicators visible on all focusable elements
- [ ] Color contrast meets WCAG 2.1 AA (4.5:1 for normal text, 3:1 for large text)
- [ ] All images have appropriate alt text
- [ ] Form inputs have associated labels
- [ ] Error messages announced to screen readers (aria-live, role="alert")
- [ ] Semantic HTML used (nav, main, section, article, header, footer)
- [ ] Heading hierarchy logical (h1 → h2 → h3, no skipping levels)
- [ ] Links have descriptive text (not "click here")
- [ ] Animations respect prefers-reduced-motion
- [ ] axe-core audit passes with no violations
- [ ] Screen reader testing (NVDA, JAWS, or VoiceOver)

---

## Summary

All research tasks completed with clear decisions, rationale, and implementation patterns documented. Key findings:

1. **Animations**: Framer Motion with hardware-accelerated transforms, reduced motion support
2. **Responsive Design**: Mobile-first with Tailwind breakpoints, no hamburger menu
3. **Component Architecture**: Server components for static content, client components for interactivity
4. **Authentication**: Better Auth integration with client validation and inline errors
5. **Accessibility**: WCAG 2.1 AA compliance with keyboard navigation and screen reader support

Ready to proceed to Phase 1 (quickstart.md) and Phase 2 (tasks.md via `/sp.tasks`).
