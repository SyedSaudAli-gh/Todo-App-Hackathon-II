# Skill: Add UI Animations

## Purpose
Implement smooth, purposeful animations and transitions to enhance user experience, provide visual feedback, guide attention, and create a polished, professional feel while respecting accessibility preferences and maintaining performance.

## When to Use
- After replacing UI with shadcn/ui components
- After adding loading skeletons and toast notifications
- When UI feels static or abrupt
- Before production deployment
- When improving perceived performance
- When guiding user attention to important changes
- After core functionality is complete

## Inputs
- Existing components with shadcn/ui
- Component interaction patterns (hover, click, focus)
- Page transition requirements
- List/grid layouts for enter/exit animations
- User preferences for reduced motion
- Performance budget for animations

## Step-by-Step Process

### 1. Install Framer Motion
```bash
cd web
npm install framer-motion
```

Framer Motion is the recommended animation library for React with:
- Declarative API
- Spring physics
- Gesture support
- Layout animations
- Accessibility support (respects prefers-reduced-motion)

### 2. Create Animation Utilities
Create `web/src/lib/animations.ts`:
```typescript
/**
 * Reusable animation variants and utilities.
 */

import { Variants } from 'framer-motion';

/**
 * Fade in animation.
 */
export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

/**
 * Fade in with slide up.
 */
export const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

/**
 * Fade in with slide down.
 */
export const fadeInDown: Variants = {
  hidden: { opacity: 0, y: -20 },
  visible: { opacity: 1, y: 0 },
};

/**
 * Fade in with slide from left.
 */
export const fadeInLeft: Variants = {
  hidden: { opacity: 0, x: -20 },
  visible: { opacity: 1, x: 0 },
};

/**
 * Fade in with slide from right.
 */
export const fadeInRight: Variants = {
  hidden: { opacity: 0, x: 20 },
  visible: { opacity: 1, x: 0 },
};

/**
 * Scale in animation.
 */
export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: { opacity: 1, scale: 1 },
};

/**
 * Stagger children animation.
 */
export const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

/**
 * List item animation for stagger.
 */
export const staggerItem: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

/**
 * Default transition settings.
 */
export const defaultTransition = {
  type: 'spring',
  stiffness: 300,
  damping: 30,
};

/**
 * Smooth transition settings.
 */
export const smoothTransition = {
  type: 'tween',
  duration: 0.3,
  ease: 'easeInOut',
};

/**
 * Check if user prefers reduced motion.
 */
export function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/**
 * Get animation variants respecting user preferences.
 */
export function getAnimationVariants(variants: Variants): Variants | undefined {
  return prefersReducedMotion() ? undefined : variants;
}
```

### 3. Create Animated Components
Create `web/src/components/animated/AnimatedDiv.tsx`:
```typescript
'use client';

import { motion, HTMLMotionProps } from 'framer-motion';
import { fadeInUp, defaultTransition } from '@/lib/animations';

interface AnimatedDivProps extends HTMLMotionProps<'div'> {
  delay?: number;
}

/**
 * Animated div with fade in up effect.
 */
export function AnimatedDiv({ delay = 0, children, ...props }: AnimatedDivProps) {
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={fadeInUp}
      transition={{ ...defaultTransition, delay }}
      {...props}
    >
      {children}
    </motion.div>
  );
}
```

Create `web/src/components/animated/AnimatedList.tsx`:
```typescript
'use client';

import { motion } from 'framer-motion';
import { staggerContainer, staggerItem } from '@/lib/animations';

interface AnimatedListProps {
  children: React.ReactNode;
  className?: string;
}

/**
 * Animated list with stagger effect.
 */
export function AnimatedList({ children, className }: AnimatedListProps) {
  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
      className={className}
    >
      {children}
    </motion.div>
  );
}

interface AnimatedListItemProps {
  children: React.ReactNode;
  className?: string;
}

/**
 * Animated list item for use with AnimatedList.
 */
export function AnimatedListItem({ children, className }: AnimatedListItemProps) {
  return (
    <motion.div variants={staggerItem} className={className}>
      {children}
    </motion.div>
  );
}
```

### 4. Add Page Transition Animations
Create `web/src/components/animated/PageTransition.tsx`:
```typescript
'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { usePathname } from 'next/navigation';
import { fadeIn, smoothTransition } from '@/lib/animations';

interface PageTransitionProps {
  children: React.ReactNode;
}

/**
 * Page transition wrapper for smooth navigation.
 */
export function PageTransition({ children }: PageTransitionProps) {
  const pathname = usePathname();

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={pathname}
        initial="hidden"
        animate="visible"
        exit="hidden"
        variants={fadeIn}
        transition={smoothTransition}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
```

### 5. Animate Todo List Items
Update `web/src/components/todos/TodoItem.tsx`:
```typescript
'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { MoreVertical, Edit, Trash2 } from 'lucide-react';
import { fadeInUp, defaultTransition } from '@/lib/animations';

interface TodoItemProps {
  todo: {
    id: string;
    title: string;
    description?: string;
    completed: boolean;
    priority: 'low' | 'medium' | 'high';
  };
  onToggle: (id: string) => void;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

export function TodoItem({ todo, onToggle, onEdit, onDelete }: TodoItemProps) {
  const [isHovered, setIsHovered] = useState(false);

  const priorityColors = {
    low: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
    medium: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
    high: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
  };

  return (
    <motion.div
      layout
      initial="hidden"
      animate="visible"
      exit={{ opacity: 0, x: -100 }}
      variants={fadeInUp}
      transition={defaultTransition}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      <Card className={todo.completed ? 'opacity-60' : ''}>
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-3 flex-1">
              <motion.div
                whileTap={{ scale: 0.9 }}
                transition={{ type: 'spring', stiffness: 400, damping: 17 }}
              >
                <Checkbox
                  id={`todo-${todo.id}`}
                  checked={todo.completed}
                  onCheckedChange={() => onToggle(todo.id)}
                  className="mt-1"
                />
              </motion.div>

              <div className="flex-1">
                <CardTitle
                  className={`text-base ${
                    todo.completed ? 'line-through text-muted-foreground' : ''
                  }`}
                >
                  {todo.title}
                </CardTitle>
                {todo.description && (
                  <CardDescription className="mt-1">
                    {todo.description}
                  </CardDescription>
                )}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1 }}
              >
                <Badge variant="secondary" className={priorityColors[todo.priority]}>
                  {todo.priority}
                </Badge>
              </motion.div>

              <motion.div
                animate={{ opacity: isHovered ? 1 : 0.5 }}
                transition={{ duration: 0.2 }}
              >
                <Button variant="ghost" size="icon">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </motion.div>
            </div>
          </div>
        </CardHeader>
      </Card>
    </motion.div>
  );
}
```

### 6. Add Button Hover Animations
Create `web/src/components/animated/AnimatedButton.tsx`:
```typescript
'use client';

import { motion } from 'framer-motion';
import { Button, ButtonProps } from '@/components/ui/button';
import { forwardRef } from 'react';

/**
 * Button with hover and tap animations.
 */
export const AnimatedButton = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ children, ...props }, ref) => {
    return (
      <motion.div
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        transition={{ type: 'spring', stiffness: 400, damping: 17 }}
      >
        <Button ref={ref} {...props}>
          {children}
        </Button>
      </motion.div>
    );
  }
);

AnimatedButton.displayName = 'AnimatedButton';
```

### 7. Add Card Hover Effects
Create `web/src/components/animated/AnimatedCard.tsx`:
```typescript
'use client';

import { motion } from 'framer-motion';
import { Card, CardProps } from '@/components/ui/card';
import { forwardRef } from 'react';

/**
 * Card with hover lift effect.
 */
export const AnimatedCard = forwardRef<HTMLDivElement, CardProps>(
  ({ children, className, ...props }, ref) => {
    return (
      <motion.div
        whileHover={{ y: -4, boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)' }}
        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      >
        <Card ref={ref} className={className} {...props}>
          {children}
        </Card>
      </motion.div>
    );
  }
);

AnimatedCard.displayName = 'AnimatedCard';
```

### 8. Add Modal/Dialog Animations
Create `web/src/components/animated/AnimatedDialog.tsx`:
```typescript
'use client';

import { motion, AnimatePresence } from 'framer-motion';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface AnimatedDialogProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children: React.ReactNode;
}

/**
 * Dialog with fade and scale animation.
 */
export function AnimatedDialog({
  isOpen,
  onClose,
  title,
  description,
  children,
}: AnimatedDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <AnimatePresence>
        {isOpen && (
          <DialogContent asChild>
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
            >
              <DialogHeader>
                <DialogTitle>{title}</DialogTitle>
                {description && <DialogDescription>{description}</DialogDescription>}
              </DialogHeader>
              {children}
            </motion.div>
          </DialogContent>
        )}
      </AnimatePresence>
    </Dialog>
  );
}
```

### 9. Add Scroll Animations
Create `web/src/components/animated/ScrollReveal.tsx`:
```typescript
'use client';

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { fadeInUp, defaultTransition } from '@/lib/animations';

interface ScrollRevealProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}

/**
 * Reveal element when scrolled into view.
 */
export function ScrollReveal({ children, className, delay = 0 }: ScrollRevealProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={isInView ? 'visible' : 'hidden'}
      variants={fadeInUp}
      transition={{ ...defaultTransition, delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
```

### 10. Add Loading Spinner Animation
Create `web/src/components/animated/AnimatedSpinner.tsx`:
```typescript
'use client';

import { motion } from 'framer-motion';

interface AnimatedSpinnerProps {
  size?: number;
  className?: string;
}

/**
 * Animated loading spinner.
 */
export function AnimatedSpinner({ size = 24, className }: AnimatedSpinnerProps) {
  return (
    <motion.div
      className={className}
      style={{ width: size, height: size }}
      animate={{ rotate: 360 }}
      transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        className="w-full h-full"
      >
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        />
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        />
      </svg>
    </motion.div>
  );
}
```

### 11. Add Number Counter Animation
Create `web/src/components/animated/AnimatedCounter.tsx`:
```typescript
'use client';

import { motion, useSpring, useTransform } from 'framer-motion';
import { useEffect } from 'react';

interface AnimatedCounterProps {
  value: number;
  duration?: number;
  className?: string;
}

/**
 * Animated number counter.
 */
export function AnimatedCounter({ value, duration = 1, className }: AnimatedCounterProps) {
  const spring = useSpring(0, { duration: duration * 1000 });
  const display = useTransform(spring, (current) => Math.round(current));

  useEffect(() => {
    spring.set(value);
  }, [spring, value]);

  return (
    <motion.span className={className}>
      {display}
    </motion.span>
  );
}
```

### 12. Create Animation Exports
Create `web/src/components/animated/index.ts`:
```typescript
/**
 * Animated component exports.
 */

export { AnimatedDiv } from './AnimatedDiv';
export { AnimatedList, AnimatedListItem } from './AnimatedList';
export { PageTransition } from './PageTransition';
export { AnimatedButton } from './AnimatedButton';
export { AnimatedCard } from './AnimatedCard';
export { AnimatedDialog } from './AnimatedDialog';
export { ScrollReveal } from './ScrollReveal';
export { AnimatedSpinner } from './AnimatedSpinner';
export { AnimatedCounter } from './AnimatedCounter';
```

### 13. Add Reduced Motion Support
Create `web/src/lib/use-reduced-motion.ts`:
```typescript
'use client';

import { useEffect, useState } from 'react';

/**
 * Hook to detect user's reduced motion preference.
 */
export function useReducedMotion(): boolean {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);

    const handleChange = (event: MediaQueryListEvent) => {
      setPrefersReducedMotion(event.matches);
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  return prefersReducedMotion;
}
```

Update animations to respect reduced motion:
```typescript
import { useReducedMotion } from '@/lib/use-reduced-motion';

export function AnimatedComponent() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.div
      animate={shouldReduceMotion ? {} : { opacity: 1, y: 0 }}
      transition={shouldReduceMotion ? { duration: 0 } : defaultTransition}
    >
      Content
    </motion.div>
  );
}
```

### 14. Update Dashboard with Animations
Update `web/src/app/dashboard/page.tsx`:
```typescript
'use client';

import { AnimatedDiv } from '@/components/animated/AnimatedDiv';
import { AnimatedList, AnimatedListItem } from '@/components/animated/AnimatedList';
import { ScrollReveal } from '@/components/animated/ScrollReveal';
import { AnimatedCounter } from '@/components/animated/AnimatedCounter';
import { StatCard } from '@/components/dashboard/StatCard';

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      <AnimatedDiv>
        <h1 className="text-3xl font-bold">Dashboard</h1>
      </AnimatedDiv>

      <AnimatedList className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <AnimatedListItem>
          <StatCard
            title="Total Todos"
            value={<AnimatedCounter value={42} />}
            icon={<CheckIcon />}
          />
        </AnimatedListItem>
        <AnimatedListItem>
          <StatCard
            title="Completed"
            value={<AnimatedCounter value={28} />}
            icon={<CheckCircleIcon />}
          />
        </AnimatedListItem>
        <AnimatedListItem>
          <StatCard
            title="In Progress"
            value={<AnimatedCounter value={14} />}
            icon={<ClockIcon />}
          />
        </AnimatedListItem>
        <AnimatedListItem>
          <StatCard
            title="Completion Rate"
            value={<><AnimatedCounter value={67} />%</>}
            icon={<TrendingUpIcon />}
          />
        </AnimatedListItem>
      </AnimatedList>

      <ScrollReveal>
        <div className="bg-card border rounded-lg p-6">
          <h2 className="text-2xl font-bold mb-4">Recent Activity</h2>
          {/* Activity content */}
        </div>
      </ScrollReveal>
    </div>
  );
}
```

### 15. Test Animations
1. Test all animated components:
   - Page transitions
   - List stagger animations
   - Button hover/tap effects
   - Card hover effects
   - Dialog animations
   - Scroll reveal
   - Counter animations
   - Loading spinners

2. Test performance:
   - Check FPS with Chrome DevTools Performance tab
   - Ensure animations run at 60fps
   - Test on slower devices
   - Monitor CPU usage

3. Test accessibility:
   - Enable "Reduce motion" in OS settings
   - Verify animations are disabled/simplified
   - Test with keyboard navigation
   - Test with screen reader

4. Test on different devices:
   - Desktop browsers (Chrome, Firefox, Safari)
   - Mobile devices (iOS, Android)
   - Different screen sizes
   - Touch interactions

## Output
- ✅ Framer Motion installed
- ✅ Animation utilities created
- ✅ Animated components library
- ✅ Page transition animations
- ✅ List stagger animations
- ✅ Button hover/tap animations
- ✅ Card hover effects
- ✅ Dialog animations
- ✅ Scroll reveal animations
- ✅ Loading spinner animations
- ✅ Counter animations
- ✅ Reduced motion support
- ✅ Performance optimized
- ✅ Accessible animations

## Failure Handling

### Error: "Animations are janky/laggy"
**Solution**:
1. Use `transform` and `opacity` (GPU-accelerated)
2. Avoid animating `width`, `height`, `top`, `left`
3. Use `will-change` CSS property sparingly
4. Reduce number of simultaneous animations
5. Test on target devices

### Error: "Layout shift during animations"
**Solution**:
1. Use `layout` prop for layout animations
2. Reserve space for animated elements
3. Use `position: absolute` for exit animations
4. Test with Chrome DevTools CLS metric

### Error: "Animations don't respect reduced motion"
**Solution**:
1. Use `useReducedMotion` hook
2. Disable animations when preference is set
3. Provide instant transitions instead
4. Test with OS reduced motion enabled

### Error: "Page transitions cause flicker"
**Solution**:
1. Use `AnimatePresence` with `mode="wait"`
2. Ensure unique keys for animated elements
3. Preload next page content
4. Use `exitBeforeEnter` for sequential animations

### Error: "Framer Motion increases bundle size"
**Solution**:
1. Use tree-shaking (import only what you need)
2. Consider lazy loading animated components
3. Use native CSS animations for simple cases
4. Measure bundle size impact

### Error: "Animations don't work on mobile"
**Solution**:
1. Test touch events (onTap instead of onClick)
2. Reduce animation complexity on mobile
3. Test on actual devices, not just emulators
4. Check for touch event conflicts

### Error: "Scroll animations trigger too early/late"
**Solution**:
1. Adjust `margin` in `useInView` hook
2. Use `once: true` to prevent re-triggering
3. Test on different screen sizes
4. Consider viewport height variations

## Validation Checklist
- [ ] Framer Motion installed
- [ ] Animation utilities created
- [ ] Page transitions work
- [ ] List stagger animations work
- [ ] Button animations work
- [ ] Card hover effects work
- [ ] Dialog animations work
- [ ] Scroll reveal works
- [ ] Counter animations work
- [ ] Loading spinners work
- [ ] Reduced motion respected
- [ ] Animations run at 60fps
- [ ] No layout shift (CLS)
- [ ] Accessible with keyboard
- [ ] Works on mobile devices
- [ ] No console errors
- [ ] Bundle size acceptable

## Best Practices
- Use GPU-accelerated properties (transform, opacity)
- Respect user's reduced motion preference
- Keep animations subtle and purposeful
- Aim for 60fps performance
- Use spring physics for natural feel
- Stagger list animations for visual interest
- Add hover feedback to interactive elements
- Use layout animations for smooth transitions
- Preload content for page transitions
- Test on target devices and browsers
- Avoid animating expensive properties
- Use `will-change` sparingly
- Provide instant feedback for user actions
- Don't overuse animations (less is more)
- Ensure animations enhance, not distract
