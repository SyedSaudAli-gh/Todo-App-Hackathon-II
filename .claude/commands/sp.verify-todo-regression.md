# Skill: Verify Todo Regression

## Purpose
Systematically test all todo CRUD operations after UI upgrades, component replacements, and integrations to ensure no functionality has been broken, data flows correctly, and all features work as expected.

## When to Use
- After replacing UI with shadcn/ui components
- After adding animations, toasts, and loading states
- After wiring auth to dashboard
- Before deploying to production
- When users report broken functionality
- After major refactoring or component changes
- As part of regular quality assurance

## Inputs
- Completed todo CRUD implementation
- Upgraded UI components (shadcn/ui)
- Integrated authentication
- API endpoints for todos
- Test data and scenarios
- Expected behavior documentation

## Step-by-Step Process

### 1. Create Regression Test Checklist
Create `web/docs/todo-regression-checklist.md`:
```markdown
# Todo Regression Test Checklist

## Test Environment Setup
- [ ] Backend server running on port 8001
- [ ] Frontend server running on port 3000
- [ ] Database accessible and seeded with test data
- [ ] User authenticated and logged in
- [ ] Browser DevTools open (Console, Network tabs)

## 1. Create Todo (C in CRUD)

### Basic Creation
- [ ] Click "Add Todo" button
- [ ] Form appears with all fields
- [ ] Enter title: "Test Todo 1"
- [ ] Leave description empty
- [ ] Select priority: "Medium"
- [ ] Click "Create" button
- [ ] Toast notification appears: "Todo created"
- [ ] Todo appears at top of list
- [ ] Form closes automatically

### Creation with All Fields
- [ ] Click "Add Todo" button
- [ ] Enter title: "Test Todo 2"
- [ ] Enter description: "This is a test description"
- [ ] Select priority: "High"
- [ ] Click "Create" button
- [ ] Verify all fields saved correctly
- [ ] Verify priority badge shows "High" in red

### Validation
- [ ] Click "Add Todo" button
- [ ] Leave title empty
- [ ] Try to submit
- [ ] Verify error message or disabled button
- [ ] Enter title with 200+ characters
- [ ] Verify validation error or character limit

### Cancel Creation
- [ ] Click "Add Todo" button
- [ ] Enter some data
- [ ] Click "Cancel" button
- [ ] Verify form closes
- [ ] Verify no todo was created

## 2. Read/Display Todos (R in CRUD)

### List Display
- [ ] Navigate to `/dashboard/todos`
- [ ] Verify all todos display
- [ ] Verify correct order (newest first)
- [ ] Verify all fields display correctly:
  - [ ] Title
  - [ ] Description (if present)
  - [ ] Priority badge
  - [ ] Completed checkbox
  - [ ] Action menu (three dots)

### Empty State
- [ ] Delete all todos
- [ ] Verify empty state message displays
- [ ] Verify "Create your first todo" message
- [ ] Verify no errors in console

### Loading State
- [ ] Refresh page
- [ ] Verify skeleton loaders display
- [ ] Verify smooth transition to actual content
- [ ] Verify no layout shift

### Filtering (if implemented)
- [ ] Filter by "All"
- [ ] Filter by "Active"
- [ ] Filter by "Completed"
- [ ] Verify correct todos display for each filter

### Sorting (if implemented)
- [ ] Sort by "Date created"
- [ ] Sort by "Priority"
- [ ] Sort by "Title"
- [ ] Verify correct order for each sort

## 3. Update Todo (U in CRUD)

### Toggle Completion
- [ ] Click checkbox on incomplete todo
- [ ] Verify todo marked as completed
- [ ] Verify strikethrough text
- [ ] Verify opacity change
- [ ] Verify toast: "Todo completed"
- [ ] Click checkbox again
- [ ] Verify todo marked as incomplete
- [ ] Verify toast: "Todo reopened"

### Edit Todo
- [ ] Click three-dot menu on todo
- [ ] Click "Edit"
- [ ] Verify form opens with current values
- [ ] Change title to "Updated Todo"
- [ ] Change description
- [ ] Change priority to "Low"
- [ ] Click "Update" button
- [ ] Verify toast: "Todo updated"
- [ ] Verify changes reflected in list
- [ ] Verify no duplicate todos created

### Edit Validation
- [ ] Click "Edit" on todo
- [ ] Clear title field
- [ ] Try to submit
- [ ] Verify validation error
- [ ] Enter valid title
- [ ] Submit successfully

### Cancel Edit
- [ ] Click "Edit" on todo
- [ ] Make changes
- [ ] Click "Cancel"
- [ ] Verify form closes
- [ ] Verify changes not saved

## 4. Delete Todo (D in CRUD)

### Delete with Confirmation
- [ ] Click three-dot menu on todo
- [ ] Click "Delete"
- [ ] Verify confirmation dialog appears
- [ ] Verify todo title shown in dialog
- [ ] Click "Cancel"
- [ ] Verify dialog closes
- [ ] Verify todo not deleted

### Confirm Delete
- [ ] Click "Delete" again
- [ ] Click "Delete" in confirmation dialog
- [ ] Verify toast: "Todo deleted"
- [ ] Verify todo removed from list
- [ ] Verify smooth exit animation
- [ ] Verify no errors in console

### Delete Last Todo
- [ ] Delete all todos except one
- [ ] Delete the last todo
- [ ] Verify empty state displays
- [ ] Verify no errors

## 5. Data Persistence

### Page Refresh
- [ ] Create several todos
- [ ] Refresh page (F5)
- [ ] Verify all todos still display
- [ ] Verify correct order maintained
- [ ] Verify completed state preserved

### Browser Close/Reopen
- [ ] Create todos
- [ ] Close browser completely
- [ ] Reopen browser
- [ ] Navigate to `/dashboard/todos`
- [ ] Verify all todos still present

### Multiple Tabs
- [ ] Open todos page in two tabs
- [ ] Create todo in tab 1
- [ ] Refresh tab 2
- [ ] Verify new todo appears in tab 2
- [ ] Complete todo in tab 2
- [ ] Refresh tab 1
- [ ] Verify completion reflected in tab 1

## 6. API Integration

### Network Requests
- [ ] Open DevTools Network tab
- [ ] Create a todo
- [ ] Verify POST request to `/api/v1/todos`
- [ ] Verify 201 Created response
- [ ] Verify response body contains todo data

### Authentication Headers
- [ ] Check request headers
- [ ] Verify cookies included
- [ ] Verify Content-Type: application/json

### Error Handling
- [ ] Stop backend server
- [ ] Try to create todo
- [ ] Verify error toast displays
- [ ] Verify user-friendly error message
- [ ] Restart backend server
- [ ] Verify can create todo again

### Rate Limiting (if implemented)
- [ ] Create 10 todos rapidly
- [ ] Verify all requests succeed
- [ ] Check for rate limit errors

## 7. UI/UX Features

### Loading States
- [ ] Create todo
- [ ] Verify loading spinner on button
- [ ] Verify button disabled during loading
- [ ] Verify smooth transition to success

### Toast Notifications
- [ ] Create todo → verify success toast
- [ ] Update todo → verify success toast
- [ ] Delete todo → verify success toast
- [ ] Complete todo → verify success toast
- [ ] Error scenario → verify error toast

### Animations
- [ ] Create todo → verify fade-in animation
- [ ] Delete todo → verify fade-out animation
- [ ] Toggle completion → verify smooth transition
- [ ] Hover over todo → verify hover effect
- [ ] Click checkbox → verify tap animation

### Keyboard Navigation
- [ ] Tab through form fields
- [ ] Verify focus indicators visible
- [ ] Press Enter to submit form
- [ ] Press Escape to close dialog
- [ ] Verify all interactive elements accessible

### Mobile Responsiveness
- [ ] Resize browser to mobile width
- [ ] Verify layout adapts correctly
- [ ] Verify touch targets are large enough
- [ ] Verify no horizontal scroll
- [ ] Test on actual mobile device

## 8. Edge Cases

### Long Text
- [ ] Create todo with very long title (100+ chars)
- [ ] Verify text truncates or wraps correctly
- [ ] Create todo with very long description (500+ chars)
- [ ] Verify description displays correctly

### Special Characters
- [ ] Create todo with title: "Test & <script>alert('xss')</script>"
- [ ] Verify no XSS vulnerability
- [ ] Verify special characters display correctly

### Rapid Actions
- [ ] Click checkbox rapidly 10 times
- [ ] Verify no duplicate requests
- [ ] Verify final state is correct

### Concurrent Operations
- [ ] Start creating todo
- [ ] Before it completes, start editing another
- [ ] Verify both operations complete correctly
- [ ] Verify no race conditions

### Offline Behavior
- [ ] Disconnect network
- [ ] Try to create todo
- [ ] Verify error message
- [ ] Reconnect network
- [ ] Verify can create todo

## 9. Theme Compatibility

### Light Theme
- [ ] Switch to light theme
- [ ] Verify all todos readable
- [ ] Verify priority badges have good contrast
- [ ] Verify completed todos visible but dimmed

### Dark Theme
- [ ] Switch to dark theme
- [ ] Verify all todos readable
- [ ] Verify priority badges have good contrast
- [ ] Verify no color issues

## 10. Performance

### Large Dataset
- [ ] Create 50+ todos
- [ ] Verify list renders smoothly
- [ ] Verify no lag when scrolling
- [ ] Verify animations still smooth

### Memory Leaks
- [ ] Create and delete 20 todos
- [ ] Open DevTools Performance tab
- [ ] Check memory usage
- [ ] Verify no memory leaks

## Test Results Summary

### Passed: ___/___
### Failed: ___/___
### Blocked: ___/___

### Critical Issues Found:
1.
2.
3.

### Minor Issues Found:
1.
2.
3.

### Notes:
```

### 2. Create Automated Regression Tests
Create `web/tests/regression/todo-crud.test.ts`:
```typescript
import { test, expect } from '@playwright/test';

test.describe('Todo CRUD Regression Tests', () => {
  test.beforeEach(async ({ page }) => {
    // Login before each test
    await page.goto('/login');
    await page.fill('input[name="email"]', 'test@example.com');
    await page.fill('input[name="password"]', 'password123');
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL('/dashboard');
    await page.goto('/dashboard/todos');
  });

  test('should create a new todo', async ({ page }) => {
    await page.click('button:has-text("Add Todo")');
    await page.fill('input[name="title"]', 'Test Todo');
    await page.fill('textarea[name="description"]', 'Test Description');
    await page.selectOption('select[name="priority"]', 'high');
    await page.click('button[type="submit"]');

    // Verify toast notification
    await expect(page.locator('text=Todo created')).toBeVisible();

    // Verify todo appears in list
    await expect(page.locator('text=Test Todo')).toBeVisible();
  });

  test('should toggle todo completion', async ({ page }) => {
    // Create a todo first
    await page.click('button:has-text("Add Todo")');
    await page.fill('input[name="title"]', 'Toggle Test');
    await page.click('button[type="submit"]');

    // Toggle completion
    const checkbox = page.locator('input[type="checkbox"]').first();
    await checkbox.check();

    // Verify completed state
    await expect(page.locator('text=Todo completed')).toBeVisible();
    await expect(checkbox).toBeChecked();
  });

  test('should edit a todo', async ({ page }) => {
    // Create a todo first
    await page.click('button:has-text("Add Todo")');
    await page.fill('input[name="title"]', 'Original Title');
    await page.click('button[type="submit"]');

    // Edit the todo
    await page.click('[aria-label="Open menu"]').first();
    await page.click('text=Edit');
    await page.fill('input[name="title"]', 'Updated Title');
    await page.click('button:has-text("Update")');

    // Verify update
    await expect(page.locator('text=Todo updated')).toBeVisible();
    await expect(page.locator('text=Updated Title')).toBeVisible();
    await expect(page.locator('text=Original Title')).not.toBeVisible();
  });

  test('should delete a todo with confirmation', async ({ page }) => {
    // Create a todo first
    await page.click('button:has-text("Add Todo")');
    await page.fill('input[name="title"]', 'Delete Me');
    await page.click('button[type="submit"]');

    // Delete the todo
    await page.click('[aria-label="Open menu"]').first();
    await page.click('text=Delete');

    // Confirm deletion
    await expect(page.locator('text=Are you sure')).toBeVisible();
    await page.click('button:has-text("Delete")');

    // Verify deletion
    await expect(page.locator('text=Todo deleted')).toBeVisible();
    await expect(page.locator('text=Delete Me')).not.toBeVisible();
  });

  test('should persist todos after page refresh', async ({ page }) => {
    // Create a todo
    await page.click('button:has-text("Add Todo")');
    await page.fill('input[name="title"]', 'Persist Test');
    await page.click('button[type="submit"]');

    // Refresh page
    await page.reload();

    // Verify todo still exists
    await expect(page.locator('text=Persist Test')).toBeVisible();
  });

  test('should show loading skeleton', async ({ page }) => {
    // Reload to trigger loading state
    await page.reload();

    // Verify skeleton appears (briefly)
    const skeleton = page.locator('[class*="animate-pulse"]');
    // Note: This might be flaky if loading is too fast
    // Consider adding artificial delay in dev mode
  });

  test('should handle validation errors', async ({ page }) => {
    await page.click('button:has-text("Add Todo")');
    // Try to submit without title
    await page.click('button[type="submit"]');

    // Verify form doesn't submit (button should be disabled or error shown)
    await expect(page.locator('text=Todo created')).not.toBeVisible();
  });

  test('should handle API errors gracefully', async ({ page }) => {
    // This test requires mocking API failure
    // You might need to use page.route() to intercept requests
    await page.route('**/api/v1/todos', (route) => {
      route.fulfill({
        status: 500,
        body: JSON.stringify({ error: 'Internal Server Error' }),
      });
    });

    await page.click('button:has-text("Add Todo")');
    await page.fill('input[name="title"]', 'Error Test');
    await page.click('button[type="submit"]');

    // Verify error toast
    await expect(page.locator('text=Failed to create todo')).toBeVisible();
  });
});
```

### 3. Create Visual Regression Test Script
Create `web/scripts/visual-regression.ts`:
```typescript
/**
 * Visual regression testing for todo components.
 * Run with: npx tsx scripts/visual-regression.ts
 */

import { chromium } from 'playwright';
import { compareImages } from 'resemblejs';
import fs from 'fs';
import path from 'path';

const SCREENSHOTS_DIR = path.join(__dirname, '../tests/screenshots');
const BASELINE_DIR = path.join(SCREENSHOTS_DIR, 'baseline');
const CURRENT_DIR = path.join(SCREENSHOTS_DIR, 'current');
const DIFF_DIR = path.join(SCREENSHOTS_DIR, 'diff');

// Ensure directories exist
[BASELINE_DIR, CURRENT_DIR, DIFF_DIR].forEach((dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

async function captureScreenshots() {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  // Login
  await page.goto('http://localhost:3000/login');
  await page.fill('input[name="email"]', 'test@example.com');
  await page.fill('input[name="password"]', 'password123');
  await page.click('button[type="submit"]');
  await page.waitForURL('**/dashboard');

  // Navigate to todos
  await page.goto('http://localhost:3000/dashboard/todos');
  await page.waitForLoadState('networkidle');

  // Capture screenshots
  const scenarios = [
    { name: 'todos-list', selector: 'main' },
    { name: 'todo-item', selector: '[data-testid="todo-item"]' },
    { name: 'todo-form', action: async () => {
      await page.click('button:has-text("Add Todo")');
      await page.waitForSelector('form');
    }},
    { name: 'empty-state', action: async () => {
      // Delete all todos first
      // Then capture empty state
    }},
  ];

  for (const scenario of scenarios) {
    if (scenario.action) {
      await scenario.action();
    }

    const screenshot = await page.screenshot({
      path: path.join(CURRENT_DIR, `${scenario.name}.png`),
      fullPage: false,
    });

    console.log(`✓ Captured: ${scenario.name}`);
  }

  await browser.close();
}

async function compareScreenshots() {
  const files = fs.readdirSync(CURRENT_DIR);

  for (const file of files) {
    const baselinePath = path.join(BASELINE_DIR, file);
    const currentPath = path.join(CURRENT_DIR, file);
    const diffPath = path.join(DIFF_DIR, file);

    if (!fs.existsSync(baselinePath)) {
      console.log(`⚠ No baseline for: ${file}`);
      continue;
    }

    const comparison = await compareImages(
      fs.readFileSync(baselinePath),
      fs.readFileSync(currentPath),
      {
        output: {
          errorColor: { red: 255, green: 0, blue: 255 },
          errorType: 'movement',
          transparency: 0.3,
        },
        scaleToSameSize: true,
        ignore: 'antialiasing',
      }
    );

    fs.writeFileSync(diffPath, comparison.getBuffer());

    const mismatch = parseFloat(comparison.misMatchPercentage);
    if (mismatch > 0.1) {
      console.log(`✗ Visual regression detected in ${file}: ${mismatch}% difference`);
    } else {
      console.log(`✓ ${file}: No significant changes`);
    }
  }
}

async function main() {
  console.log('Starting visual regression tests...\n');

  await captureScreenshots();
  console.log('\nComparing with baseline...\n');
  await compareScreenshots();

  console.log('\n✨ Visual regression tests complete!');
}

main().catch(console.error);
```

### 4. Test Data Integrity
Create `web/tests/regression/data-integrity.test.ts`:
```typescript
import { test, expect } from '@playwright/test';

test.describe('Todo Data Integrity', () => {
  test('should maintain data consistency across operations', async ({ page }) => {
    await page.goto('/dashboard/todos');

    // Create todo with specific data
    const todoData = {
      title: 'Data Integrity Test',
      description: 'Testing data consistency',
      priority: 'high',
    };

    await page.click('button:has-text("Add Todo")');
    await page.fill('input[name="title"]', todoData.title);
    await page.fill('textarea[name="description"]', todoData.description);
    await page.selectOption('select[name="priority"]', todoData.priority);
    await page.click('button[type="submit"]');

    // Verify data in UI
    await expect(page.locator(`text=${todoData.title}`)).toBeVisible();
    await expect(page.locator(`text=${todoData.description}`)).toBeVisible();
    await expect(page.locator('text=high')).toBeVisible();

    // Verify data in API
    const response = await page.request.get('http://localhost:8001/api/v1/todos');
    const todos = await response.json();
    const createdTodo = todos.find((t: any) => t.title === todoData.title);

    expect(createdTodo).toBeDefined();
    expect(createdTodo.title).toBe(todoData.title);
    expect(createdTodo.description).toBe(todoData.description);
    expect(createdTodo.priority).toBe(todoData.priority);
    expect(createdTodo.completed).toBe(false);
  });

  test('should not create duplicate todos', async ({ page }) => {
    await page.goto('/dashboard/todos');

    // Create todo twice
    for (let i = 0; i < 2; i++) {
      await page.click('button:has-text("Add Todo")');
      await page.fill('input[name="title"]', 'Duplicate Test');
      await page.click('button[type="submit"]');
      await page.waitForTimeout(500);
    }

    // Count todos with same title
    const count = await page.locator('text=Duplicate Test').count();
    expect(count).toBe(2); // Should have 2 separate todos, not duplicates
  });
});
```

### 5. Run Regression Test Suite
Create `web/package.json` scripts:
```json
{
  "scripts": {
    "test:regression": "playwright test tests/regression",
    "test:regression:ui": "playwright test tests/regression --ui",
    "test:visual": "tsx scripts/visual-regression.ts",
    "test:all": "npm run test:regression && npm run test:visual"
  }
}
```

### 6. Document Test Results
Create template for `web/docs/regression-test-results.md`:
```markdown
# Todo Regression Test Results

**Date**: YYYY-MM-DD
**Tester**: [Name]
**Environment**: Development/Staging/Production
**Browser**: Chrome/Firefox/Safari
**Version**: [App Version]

## Summary
- Total Tests: ___
- Passed: ___
- Failed: ___
- Blocked: ___
- Pass Rate: ___%

## Critical Issues
1. **[Issue Title]**
   - Severity: Critical/High/Medium/Low
   - Steps to Reproduce:
   - Expected Behavior:
   - Actual Behavior:
   - Screenshot/Video:

## Test Results by Category

### Create Todo
- ✅ Basic creation
- ✅ Creation with all fields
- ✅ Validation
- ✅ Cancel creation

### Read/Display Todos
- ✅ List display
- ✅ Empty state
- ✅ Loading state
- ✅ Filtering
- ✅ Sorting

### Update Todo
- ✅ Toggle completion
- ✅ Edit todo
- ✅ Edit validation
- ✅ Cancel edit

### Delete Todo
- ✅ Delete with confirmation
- ✅ Confirm delete
- ✅ Delete last todo

### Data Persistence
- ✅ Page refresh
- ✅ Browser close/reopen
- ✅ Multiple tabs

### API Integration
- ✅ Network requests
- ✅ Authentication headers
- ✅ Error handling

### UI/UX Features
- ✅ Loading states
- ✅ Toast notifications
- ✅ Animations
- ✅ Keyboard navigation
- ✅ Mobile responsiveness

### Edge Cases
- ✅ Long text
- ✅ Special characters
- ✅ Rapid actions
- ✅ Concurrent operations
- ✅ Offline behavior

### Theme Compatibility
- ✅ Light theme
- ✅ Dark theme

### Performance
- ✅ Large dataset
- ✅ Memory leaks

## Recommendations
1.
2.
3.

## Sign-off
- [ ] All critical issues resolved
- [ ] All tests passing
- [ ] Ready for deployment

**Approved by**: ___________
**Date**: ___________
```

## Output
- ✅ Comprehensive regression test checklist
- ✅ Automated Playwright tests
- ✅ Visual regression testing script
- ✅ Data integrity tests
- ✅ Test execution scripts
- ✅ Test results documentation template
- ✅ All CRUD operations verified
- ✅ Edge cases tested
- ✅ Performance validated
- ✅ No regressions found

## Failure Handling

### Error: "Tests fail after UI upgrade"
**Solution**:
1. Identify which specific test is failing
2. Check if selectors changed with new components
3. Update test selectors to match shadcn/ui structure
4. Verify functionality manually
5. Update tests to match new behavior

### Error: "Visual regression detected"
**Solution**:
1. Review diff images to understand changes
2. Determine if changes are intentional (new design)
3. If intentional, update baseline images
4. If unintentional, fix the regression
5. Re-run visual tests

### Error: "Data not persisting"
**Solution**:
1. Check API responses in Network tab
2. Verify database connection
3. Check for API errors
4. Verify session/auth is valid
5. Test API endpoints directly

### Error: "Animations breaking tests"
**Solution**:
1. Add waits for animations to complete
2. Use `waitForLoadState('networkidle')`
3. Disable animations in test environment
4. Use `page.waitForTimeout()` sparingly
5. Check for race conditions

### Error: "Tests flaky/inconsistent"
**Solution**:
1. Add explicit waits instead of timeouts
2. Use `waitForSelector` with proper selectors
3. Check for timing issues
4. Run tests multiple times to identify patterns
5. Add retry logic for flaky tests

## Validation Checklist
- [ ] All CRUD operations tested
- [ ] Create todo works
- [ ] Read/display todos works
- [ ] Update todo works
- [ ] Delete todo works
- [ ] Data persists correctly
- [ ] API integration verified
- [ ] Loading states work
- [ ] Toast notifications work
- [ ] Animations work
- [ ] Keyboard navigation works
- [ ] Mobile responsive
- [ ] Theme compatible
- [ ] Edge cases handled
- [ ] Performance acceptable
- [ ] No console errors
- [ ] Automated tests passing
- [ ] Visual regression tests passing
- [ ] Manual checklist completed

## Best Practices
- Test after every major change
- Automate repetitive tests
- Keep test data consistent
- Document test results
- Fix regressions immediately
- Test on multiple browsers
- Test on real devices
- Use visual regression testing
- Monitor performance metrics
- Test edge cases thoroughly
- Verify data integrity
- Check API responses
- Test error scenarios
- Validate accessibility
- Review test coverage regularly
