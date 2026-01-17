# Research: Dashboard Polish & Advanced Features

**Feature**: 003-dashboard-polish
**Date**: 2026-01-08
**Status**: Complete

## Purpose

This document resolves technical unknowns identified in the implementation plan's Technical Context section. All decisions are made to support the portfolio showcase scope with production-quality patterns.

---

## Research Item 1: Chart Library Selection

### Context
Dashboard home page requires a completion chart showing task trends over time (7/30/90 days). Need lightweight, TypeScript-compatible, responsive charting solution.

### Options Evaluated

#### Option A: Recharts
- **Pros**:
  - React-specific (no wrapper needed)
  - Excellent TypeScript support
  - Declarative API (JSX-based)
  - Responsive by default
  - Good documentation
  - ~100KB gzipped
  - Active maintenance
- **Cons**:
  - Slightly larger than Chart.js
  - Limited animation customization
- **Best For**: React applications prioritizing developer experience

#### Option B: Chart.js with react-chartjs-2
- **Pros**:
  - Very popular (~60K GitHub stars)
  - Smaller bundle (~60KB gzipped)
  - Extensive plugin ecosystem
  - Highly customizable animations
- **Cons**:
  - Requires wrapper library (react-chartjs-2)
  - Imperative API (less React-idiomatic)
  - TypeScript support through @types package
  - More configuration required
- **Best For**: Applications needing maximum customization

#### Option C: Victory
- **Pros**:
  - Excellent animation support
  - Modular architecture
  - Strong TypeScript support
- **Cons**:
  - Larger bundle size (~150KB gzipped)
  - Steeper learning curve
  - Less popular (fewer resources)
- **Best For**: Complex data visualization needs

### Decision: Recharts

**Rationale**:
1. **React-First**: Declarative JSX API aligns with React patterns, easier to maintain
2. **TypeScript**: Native TypeScript support without additional type packages
3. **Bundle Size**: 100KB is acceptable for portfolio scope (not production-scale optimization)
4. **Developer Experience**: Faster implementation for interview/demo timeline
5. **Responsive**: Built-in responsive behavior reduces custom code

**Alternatives Considered**: Chart.js rejected due to imperative API and wrapper complexity. Victory rejected due to bundle size and learning curve for simple use case.

**Implementation Notes**:
- Install: `npm install recharts`
- Use `<LineChart>` or `<AreaChart>` for completion trends
- Implement time range selector (7/30/90 days) with React state
- Ensure responsive container with `<ResponsiveContainer>`
- Apply Tailwind CSS variables for theme colors

---

## Research Item 2: Avatar Upload & Image Handling

### Context
Profile page requires avatar upload with preview, client-side validation (max 2MB, JPEG/PNG/GIF), and localStorage persistence as base64.

### Options Evaluated

#### Option A: Native File API + FileReader
- **Pros**:
  - No dependencies (built-in browser APIs)
  - Full control over validation and conversion
  - Lightweight (0KB bundle impact)
  - Works with localStorage (base64 output)
- **Cons**:
  - Manual implementation required
  - Need to handle browser compatibility
  - More code to write and test
- **Best For**: Simple use cases, portfolio projects

#### Option B: react-dropzone + image processing library
- **Pros**:
  - Drag-and-drop support
  - Built-in validation
  - Better UX with visual feedback
- **Cons**:
  - Additional dependencies (~30KB)
  - Overkill for single file upload
  - More complexity than needed
- **Best For**: Production apps with advanced upload needs

#### Option C: Third-party service (Cloudinary, Uploadcare)
- **Pros**:
  - Image optimization and CDN
  - Advanced features (cropping, filters)
- **Cons**:
  - External dependency
  - Requires API keys and account
  - Not suitable for localStorage approach
  - Adds complexity for portfolio scope
- **Best For**: Production apps with image management needs

### Decision: Native File API + FileReader

**Rationale**:
1. **Zero Dependencies**: No additional bundle size for simple use case
2. **localStorage Compatible**: FileReader produces base64 strings directly
3. **Full Control**: Custom validation logic for size and format
4. **Portfolio Appropriate**: Demonstrates understanding of browser APIs
5. **Sufficient UX**: File input with preview meets requirements

**Alternatives Considered**: react-dropzone rejected as overkill for single file upload. Third-party services rejected due to external dependencies and localStorage incompatibility.

**Implementation Notes**:
- Use `<input type="file" accept="image/jpeg,image/png,image/gif">`
- Validate file size before reading: `file.size <= 2 * 1024 * 1024` (2MB)
- Use `FileReader.readAsDataURL()` for base64 conversion
- Display preview with `<img src={base64String}>`
- Store in localStorage: `localStorage.setItem('user_avatar', base64String)`
- Handle errors: file too large, invalid format, read failure
- Provide clear user feedback with toast notifications

---

## Research Item 3: localStorage Data Structure

### Context
Need efficient localStorage schema for tasks, preferences, activity events, and profile data. Must support filtering, sorting, and statistics calculation.

### Design Decision: Separate Keys with JSON Serialization

**Schema**:
```typescript
// localStorage keys
'todos': Todo[]                    // All tasks
'user_preferences': Preferences    // Theme, display settings
'user_profile': UserProfile        // Name, email, avatar
'activity_events': ActivityEvent[] // Recent actions (max 100)
'app_version': string              // Schema version for migrations
```

**Rationale**:
1. **Separation of Concerns**: Each data type in separate key for easier access
2. **Performance**: Read only needed data (don't parse entire store)
3. **Maintainability**: Clear schema, easy to debug in DevTools
4. **Migration Support**: Version key enables future schema changes
5. **Size Management**: Can implement cleanup strategies per key

**Data Limits**:
- Todos: Max 1000 items (~500KB estimated)
- Activity Events: Max 100 items (~50KB estimated)
- Profile: Single object (~10KB with base64 avatar)
- Preferences: Single object (~1KB)
- Total: ~561KB (well under 5MB browser limit)

---

## Research Item 4: Animation Strategy

### Context
Need performance-first animations with graceful degradation. Must respect `prefers-reduced-motion` and maintain 60fps on low-end devices.

### Design Decision: CSS-Based Animations with Framer Motion for Complex Cases

**Approach**:
1. **Primary**: CSS transitions and animations (GPU-accelerated)
   - Use for: hover effects, theme transitions, simple fades
   - Benefits: Best performance, no JavaScript overhead
   - Implementation: Tailwind CSS utilities + custom CSS

2. **Secondary**: Framer Motion for complex animations
   - Use for: dialog entry/exit, list reordering, page transitions
   - Benefits: Declarative API, built-in gesture support
   - Implementation: `<motion.div>` with variants

3. **Accessibility**: Respect `prefers-reduced-motion`
   ```css
   @media (prefers-reduced-motion: reduce) {
     * {
       animation-duration: 0.01ms !important;
       transition-duration: 0.01ms !important;
     }
   }
   ```

**Performance Targets**:
- Animation duration: 200-300ms (perceived as instant)
- Use `transform` and `opacity` only (GPU-accelerated)
- Avoid animating: `width`, `height`, `top`, `left` (causes reflow)
- Debounce rapid state changes (e.g., filter updates)

**Rationale**:
- CSS animations are fastest (no JavaScript execution)
- Framer Motion already installed (no new dependency)
- Accessibility-first approach (prefers-reduced-motion)
- Performance budget maintained (300ms max duration)

---

## Research Item 5: State Management Approach

### Context
Need to manage global state for todos, filters, preferences, and theme. Must be simple, TypeScript-friendly, and avoid over-engineering.

### Design Decision: React Context API + Custom Hooks

**Approach**:
```typescript
// Contexts
- TodoContext: todos, filters, CRUD operations
- ThemeContext: theme, setTheme
- PreferencesContext: preferences, updatePreferences

// Custom Hooks
- useTodos(): Access todo state and operations
- useTheme(): Access theme state and toggle
- usePreferences(): Access preferences and updates
- useLocalStorage<T>(): Generic localStorage hook
```

**Rationale**:
1. **No External Dependencies**: Context API is built-in
2. **TypeScript Support**: Full type safety with interfaces
3. **Sufficient for Scope**: Single-user app, no complex async state
4. **Familiar Pattern**: Standard React approach, easy to understand
5. **Testable**: Contexts can be mocked in tests

**Alternatives Considered**:
- **Zustand**: Rejected - adds dependency for simple use case
- **Redux**: Rejected - massive overkill for portfolio scope
- **Jotai/Recoil**: Rejected - unnecessary complexity

**Implementation Notes**:
- Wrap app in context providers in `layout.tsx`
- Use `useReducer` for complex state updates (todos with filters)
- Memoize context values to prevent unnecessary re-renders
- Sync context state with localStorage on changes

---

## Summary of Decisions

| Item | Decision | Rationale |
|------|----------|-----------|
| Chart Library | Recharts | React-first, TypeScript support, good DX |
| Image Handling | Native File API + FileReader | Zero dependencies, localStorage compatible |
| localStorage Schema | Separate keys with JSON | Performance, maintainability, clear structure |
| Animation Strategy | CSS + Framer Motion | Performance-first, accessibility, GPU-accelerated |
| State Management | Context API + Custom Hooks | Built-in, sufficient for scope, TypeScript-friendly |

## Dependencies to Add

```json
{
  "recharts": "^2.10.0"
}
```

**Note**: All other technologies (Framer Motion, Tailwind CSS, TypeScript) are already installed in the project.

## Next Steps

1. Create `data-model.md` with TypeScript interfaces for all entities
2. Create `contracts/localStorage-schema.ts` with type definitions
3. Create `quickstart.md` with development setup instructions
4. Update agent context with new technology decisions
5. Proceed to `/sp.tasks` for task breakdown
