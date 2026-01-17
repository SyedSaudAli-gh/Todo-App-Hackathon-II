# Quickstart Guide: Dashboard Polish & Advanced Features

**Feature**: 003-dashboard-polish
**Date**: 2026-01-08
**Branch**: `003-dashboard-polish`

## Purpose

This guide provides step-by-step instructions for implementing the dashboard polish feature. Follow this guide to set up your development environment and understand the implementation workflow.

---

## Prerequisites

Before starting implementation, ensure you have:

- ✅ Node.js 20+ installed
- ✅ npm or yarn package manager
- ✅ Git repository cloned
- ✅ Existing Next.js 15 + React 19 + TypeScript 5 setup
- ✅ Better Auth authentication working
- ✅ shadcn/ui components installed
- ✅ Tailwind CSS configured
- ✅ Branch `003-dashboard-polish` checked out

**Verify Prerequisites**:
```bash
node --version  # Should be v20.x or higher
npm --version   # Should be v10.x or higher
git branch      # Should show * 003-dashboard-polish
```

---

## Step 1: Install New Dependencies

Install Recharts for chart visualization:

```bash
cd web
npm install recharts
```

**Verify Installation**:
```bash
npm list recharts
# Should show: recharts@2.10.0 or similar
```

---

## Step 2: Copy Type Definitions

Copy the localStorage schema types to your project:

```bash
# From project root
cp specs/003-dashboard-polish/contracts/localStorage-schema.ts web/src/types/storage.ts
```

**Verify**:
- File exists at `web/src/types/storage.ts`
- No TypeScript errors when importing types

---

## Step 3: Project Structure Overview

The implementation follows this structure:

```
web/src/
├── app/
│   └── dashboard/
│       ├── page.tsx              # Dashboard home (enhance)
│       ├── todos/page.tsx        # Todos page (enhance)
│       ├── profile/page.tsx      # Profile page (NEW)
│       └── settings/page.tsx     # Settings page (NEW)
├── components/
│   ├── dashboard/                # Dashboard components (NEW)
│   ├── todos/                    # Todo components (enhance)
│   ├── profile/                  # Profile components (NEW)
│   └── settings/                 # Settings components (NEW)
├── contexts/
│   └── ThemeContext.tsx          # Theme context (NEW)
├── hooks/
│   ├── useTodos.ts               # Todo operations (enhance)
│   ├── useLocalStorage.ts        # localStorage hook (NEW)
│   ├── useTheme.ts               # Theme hook (NEW)
│   └── usePreferences.ts         # Preferences hook (NEW)
├── lib/
│   └── storage/                  # localStorage utilities (NEW)
│       ├── todos.ts
│       ├── preferences.ts
│       ├── activity.ts
│       └── profile.ts
└── types/
    ├── storage.ts                # localStorage types (NEW)
    ├── todo.ts                   # Todo types (enhance)
    ├── preferences.ts            # Preferences types (NEW)
    └── activity.ts               # Activity types (NEW)
```

---

## Step 4: Implementation Workflow

Follow this order to implement the feature:

### Phase 1: Foundation (localStorage & Types)
1. Create `web/src/types/storage.ts` (copy from contracts)
2. Create `web/src/lib/storage/todos.ts` (CRUD operations)
3. Create `web/src/lib/storage/preferences.ts` (preferences management)
4. Create `web/src/lib/storage/activity.ts` (activity tracking)
5. Create `web/src/lib/storage/profile.ts` (profile management)
6. Create `web/src/hooks/useLocalStorage.ts` (generic hook)

### Phase 2: State Management (Contexts & Hooks)
1. Create `web/src/contexts/ThemeContext.tsx` (theme provider)
2. Create `web/src/hooks/useTheme.ts` (theme hook)
3. Create `web/src/hooks/usePreferences.ts` (preferences hook)
4. Enhance `web/src/hooks/useTodos.ts` (add priority, status, filters)

### Phase 3: Dashboard Components
1. Create `web/src/components/dashboard/StatisticsCards.tsx`
2. Create `web/src/components/dashboard/CompletionChart.tsx` (Recharts)
3. Create `web/src/components/dashboard/ActivityFeed.tsx`
4. Create `web/src/components/dashboard/PriorityBreakdown.tsx`
5. Enhance `web/src/app/dashboard/page.tsx` (integrate components)

### Phase 4: Advanced Todos
1. Enhance `web/src/components/todos/TodoForm.tsx` (add priority, status)
2. Enhance `web/src/components/todos/TodoItem.tsx` (show priority, status)
3. Create `web/src/components/todos/FilterPanel.tsx` (filter controls)
4. Create `web/src/components/todos/FilterTags.tsx` (active filters display)
5. Enhance `web/src/app/dashboard/todos/page.tsx` (integrate filters)

### Phase 5: Profile Page
1. Create `web/src/components/profile/ProfileHeader.tsx`
2. Create `web/src/components/profile/ProfileForm.tsx`
3. Create `web/src/components/profile/AvatarUpload.tsx` (File API)
4. Create `web/src/components/profile/ProfileStats.tsx`
5. Create `web/src/app/dashboard/profile/page.tsx`

### Phase 6: Settings Page
1. Create `web/src/components/settings/ThemeSelector.tsx`
2. Create `web/src/components/settings/PreferenceToggles.tsx`
3. Create `web/src/components/settings/ResetButton.tsx`
4. Create `web/src/components/settings/SettingsForm.tsx`
5. Create `web/src/app/dashboard/settings/page.tsx`

### Phase 7: Animations & Polish
1. Add Framer Motion animations to dialogs
2. Add CSS transitions to theme switching
3. Add hover effects to interactive elements
4. Implement prefers-reduced-motion support
5. Test animations on various devices

---

## Step 5: Development Commands

**Start Development Server**:
```bash
cd web
npm run dev
# Open http://localhost:3000
```

**Type Check**:
```bash
npm run type-check
# Should show no errors
```

**Build for Production**:
```bash
npm run build
# Should complete without errors
```

**Lint Code**:
```bash
npm run lint
# Should show no errors
```

---

## Step 6: Testing Strategy

### Manual Testing Checklist

**Dashboard Home**:
- [ ] Statistics cards display correct counts
- [ ] Completion chart renders with data
- [ ] Activity feed shows recent events
- [ ] Priority breakdown shows correct distribution
- [ ] Empty state displays when no tasks

**Advanced Todos**:
- [ ] Can create task with priority and status
- [ ] Can filter by priority (single and multiple)
- [ ] Can filter by status (single and multiple)
- [ ] Can combine priority + status filters
- [ ] Can clear all filters
- [ ] Filter tags display active filters
- [ ] Task list updates immediately on filter change

**Profile Page**:
- [ ] Profile information displays correctly
- [ ] Can edit name and save
- [ ] Can upload avatar (JPEG, PNG, GIF)
- [ ] Avatar preview shows before save
- [ ] Validation errors display for invalid email
- [ ] Can cancel edits and restore original values
- [ ] Avatar displays in header after save

**Settings Page**:
- [ ] Can switch theme (Light, Dark, System)
- [ ] Theme applies immediately without reload
- [ ] Theme persists across logout/login
- [ ] Can toggle task display preferences
- [ ] Can change default sort order
- [ ] Can reset all settings to defaults
- [ ] Settings persist across sessions

**Animations**:
- [ ] Dialogs fade in smoothly
- [ ] Dropdowns slide down smoothly
- [ ] Toast notifications appear from top-right
- [ ] Tab transitions are smooth
- [ ] Hover effects respond quickly
- [ ] Animations respect prefers-reduced-motion

### Automated Testing (Optional for Portfolio Scope)

**Component Tests** (Jest + React Testing Library):
```bash
npm test -- --watch
```

**E2E Tests** (Playwright - if configured):
```bash
npx playwright test
```

---

## Step 7: localStorage Debugging

**View localStorage in Browser DevTools**:
1. Open DevTools (F12)
2. Go to Application tab
3. Expand Local Storage
4. Click on your domain
5. View keys: `todos`, `user_profile`, `user_preferences`, `activity_events`

**Clear localStorage** (for testing):
```javascript
// In browser console
localStorage.clear();
location.reload();
```

**Inspect localStorage data**:
```javascript
// In browser console
JSON.parse(localStorage.getItem('todos'));
JSON.parse(localStorage.getItem('user_preferences'));
```

---

## Step 8: Common Issues & Troubleshooting

### Issue: "Cannot find module 'recharts'"
**Solution**: Install Recharts: `npm install recharts`

### Issue: TypeScript errors in storage.ts
**Solution**: Ensure TypeScript 5.3+ is installed: `npm install -D typescript@^5.3.3`

### Issue: Theme not persisting across sessions
**Solution**: Check localStorage is enabled in browser settings. Verify `user_preferences` key exists.

### Issue: Avatar upload fails
**Solution**:
- Check file size is under 2MB
- Verify file type is JPEG, PNG, or GIF
- Check browser console for FileReader errors

### Issue: Animations not working
**Solution**:
- Verify Framer Motion is installed: `npm list framer-motion`
- Check tailwindcss-animate is in tailwind.config.ts plugins
- Verify CSS transitions are not disabled globally

### Issue: Chart not rendering
**Solution**:
- Check Recharts is imported correctly
- Verify data format matches ChartDataPoint interface
- Check ResponsiveContainer has a defined height
- Inspect browser console for Recharts errors

### Issue: Filters not working
**Solution**:
- Verify FilterState is initialized correctly
- Check filter logic in applyFilters function
- Ensure todos array is not empty
- Check React DevTools for state updates

---

## Step 9: Performance Optimization

**localStorage Performance**:
- Debounce frequent writes (e.g., filter changes)
- Use `useMemo` for computed statistics
- Implement pagination for large todo lists (>100 items)

**Chart Performance**:
- Limit data points to 90 days maximum
- Use `useMemo` for chart data calculation
- Implement loading states for chart rendering

**Animation Performance**:
- Use CSS transforms (GPU-accelerated)
- Avoid animating width/height (causes reflow)
- Implement prefers-reduced-motion media query
- Cap animation duration at 300ms

---

## Step 10: Next Steps

After completing implementation:

1. **Run `/sp.tasks`** to generate task breakdown
2. **Implement tasks** following TDD workflow (Red-Green-Refactor)
3. **Test thoroughly** using manual testing checklist
4. **Create PR** with feature description and screenshots
5. **Demo** the feature for portfolio/interview

---

## Reference Documentation

- **Specification**: `specs/003-dashboard-polish/spec.md`
- **Implementation Plan**: `specs/003-dashboard-polish/plan.md`
- **Data Model**: `specs/003-dashboard-polish/data-model.md`
- **Research**: `specs/003-dashboard-polish/research.md`
- **Type Definitions**: `specs/003-dashboard-polish/contracts/localStorage-schema.ts`

---

## Support

For questions or issues during implementation:
1. Review specification and plan documents
2. Check data model for entity definitions
3. Inspect localStorage schema for type definitions
4. Refer to research document for technology decisions
5. Review constitution for Phase II requirements

---

**Ready to implement?** Start with Phase 1 (Foundation) and work through each phase sequentially. Good luck! 🚀
