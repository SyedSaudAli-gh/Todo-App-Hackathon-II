# Component Contracts: Dashboard Polish & Advanced Features

**Feature**: 003-dashboard-polish
**Date**: 2026-01-08

## Purpose

This document defines the prop interfaces and contracts for all React components in the dashboard polish feature. These contracts ensure type safety and clear component boundaries.

---

## Dashboard Components

### StatisticsCards

**Purpose**: Display key task metrics in card format on dashboard home page.

**Props Interface**:
```typescript
interface StatisticsCardsProps {
  /** Total number of tasks */
  totalTasks: number;

  /** Number of completed tasks */
  completedTasks: number;

  /** Number of pending tasks */
  pendingTasks: number;

  /** Completion rate percentage (0-100) */
  completionRate: number;

  /** Loading state */
  isLoading?: boolean;
}
```

**Usage Example**:
```tsx
<StatisticsCards
  totalTasks={42}
  completedTasks={28}
  pendingTasks={14}
  completionRate={66.7}
  isLoading={false}
/>
```

---

### CompletionChart

**Purpose**: Visualize task completion trends over time using Recharts.

**Props Interface**:
```typescript
interface CompletionChartProps {
  /** Chart data points */
  data: ChartDataPoint[];

  /** Selected time range (days) */
  timeRange: 7 | 30 | 90;

  /** Callback when time range changes */
  onTimeRangeChange: (range: 7 | 30 | 90) => void;

  /** Loading state */
  isLoading?: boolean;

  /** Chart height in pixels */
  height?: number;
}
```

**Usage Example**:
```tsx
<CompletionChart
  data={chartData.dataPoints}
  timeRange={7}
  onTimeRangeChange={(range) => setTimeRange(range)}
  isLoading={false}
  height={300}
/>
```

---

### ActivityFeed

**Purpose**: Display recent task activity events in chronological order.

**Props Interface**:
```typescript
interface ActivityFeedProps {
  /** Array of activity events (max 5) */
  events: ActivityEvent[];

  /** Loading state */
  isLoading?: boolean;

  /** Callback when event is clicked */
  onEventClick?: (event: ActivityEvent) => void;

  /** Maximum number of events to display */
  maxEvents?: number;
}
```

**Usage Example**:
```tsx
<ActivityFeed
  events={recentActivity}
  isLoading={false}
  onEventClick={(event) => console.log('Event clicked:', event)}
  maxEvents={5}
/>
```

---

### PriorityBreakdown

**Purpose**: Display task count breakdown by priority level.

**Props Interface**:
```typescript
interface PriorityBreakdownProps {
  /** Count of high priority tasks */
  high: number;

  /** Count of medium priority tasks */
  medium: number;

  /** Count of low priority tasks */
  low: number;

  /** Loading state */
  isLoading?: boolean;

  /** Callback when priority is clicked */
  onPriorityClick?: (priority: 'High' | 'Medium' | 'Low') => void;
}
```

**Usage Example**:
```tsx
<PriorityBreakdown
  high={10}
  medium={20}
  low={12}
  isLoading={false}
  onPriorityClick={(priority) => filterByPriority(priority)}
/>
```

---

## Todo Components (Enhanced)

### TodoList

**Purpose**: Display filtered and sorted list of todos.

**Props Interface**:
```typescript
interface TodoListProps {
  /** Array of todos to display */
  todos: Todo[];

  /** Current filter state */
  filters: FilterState;

  /** Callback when todo is updated */
  onUpdate: (id: string, updates: Partial<Todo>) => void;

  /** Callback when todo is deleted */
  onDelete: (id: string) => void;

  /** Loading state */
  isLoading?: boolean;

  /** Empty state message */
  emptyMessage?: string;
}
```

**Usage Example**:
```tsx
<TodoList
  todos={filteredTodos}
  filters={filterState}
  onUpdate={handleUpdateTodo}
  onDelete={handleDeleteTodo}
  isLoading={false}
  emptyMessage="No tasks match your filters"
/>
```

---

### TodoItem

**Purpose**: Display individual todo with priority/status indicators and quick actions.

**Props Interface**:
```typescript
interface TodoItemProps {
  /** Todo data */
  todo: Todo;

  /** Callback when todo is updated */
  onUpdate: (updates: Partial<Todo>) => void;

  /** Callback when todo is deleted */
  onDelete: () => void;

  /** Callback when status changes */
  onStatusChange: (status: Todo['status']) => void;

  /** Callback when priority changes */
  onPriorityChange: (priority: Todo['priority']) => void;

  /** Show quick action buttons */
  showQuickActions?: boolean;
}
```

**Usage Example**:
```tsx
<TodoItem
  todo={todo}
  onUpdate={(updates) => handleUpdate(todo.id, updates)}
  onDelete={() => handleDelete(todo.id)}
  onStatusChange={(status) => handleStatusChange(todo.id, status)}
  onPriorityChange={(priority) => handlePriorityChange(todo.id, priority)}
  showQuickActions={true}
/>
```

---

### TodoForm

**Purpose**: Form for creating/editing todos with priority and status fields.

**Props Interface**:
```typescript
interface TodoFormProps {
  /** Initial todo data (for editing) */
  initialData?: Partial<Todo>;

  /** Callback when form is submitted */
  onSubmit: (data: Omit<Todo, 'id' | 'createdAt' | 'updatedAt' | 'userId'>) => void;

  /** Callback when form is cancelled */
  onCancel: () => void;

  /** Submit button text */
  submitText?: string;

  /** Loading state */
  isLoading?: boolean;
}
```

**Usage Example**:
```tsx
<TodoForm
  initialData={editingTodo}
  onSubmit={handleSubmit}
  onCancel={handleCancel}
  submitText="Save Changes"
  isLoading={false}
/>
```

---

### FilterPanel

**Purpose**: Provide filtering controls for todo list.

**Props Interface**:
```typescript
interface FilterPanelProps {
  /** Current filter state */
  filters: FilterState;

  /** Callback when filters change */
  onFilterChange: (filters: FilterState) => void;

  /** Available priority options */
  priorities: ('High' | 'Medium' | 'Low')[];

  /** Available status options */
  statuses: ('To Do' | 'In Progress' | 'Done')[];

  /** Show search input */
  showSearch?: boolean;

  /** Show sort controls */
  showSort?: boolean;
}
```

**Usage Example**:
```tsx
<FilterPanel
  filters={filterState}
  onFilterChange={setFilterState}
  priorities={['High', 'Medium', 'Low']}
  statuses={['To Do', 'In Progress', 'Done']}
  showSearch={true}
  showSort={true}
/>
```

---

### FilterTags

**Purpose**: Display active filter tags with remove capability.

**Props Interface**:
```typescript
interface FilterTagsProps {
  /** Current filter state */
  filters: FilterState;

  /** Callback when filter is removed */
  onRemoveFilter: (filterType: 'priority' | 'status' | 'search', value?: string) => void;

  /** Callback when all filters are cleared */
  onClearAll: () => void;

  /** Show clear all button */
  showClearAll?: boolean;
}
```

**Usage Example**:
```tsx
<FilterTags
  filters={filterState}
  onRemoveFilter={handleRemoveFilter}
  onClearAll={handleClearAll}
  showClearAll={true}
/>
```

---

## Profile Components

### ProfileHeader

**Purpose**: Display user profile information with avatar.

**Props Interface**:
```typescript
interface ProfileHeaderProps {
  /** User profile data */
  profile: UserProfile;

  /** Show edit button */
  showEditButton?: boolean;

  /** Callback when edit is clicked */
  onEdit?: () => void;

  /** Loading state */
  isLoading?: boolean;
}
```

**Usage Example**:
```tsx
<ProfileHeader
  profile={userProfile}
  showEditButton={true}
  onEdit={() => setIsEditing(true)}
  isLoading={false}
/>
```

---

### ProfileForm

**Purpose**: Form for editing user profile information.

**Props Interface**:
```typescript
interface ProfileFormProps {
  /** Initial profile data */
  initialData: UserProfile;

  /** Callback when form is submitted */
  onSubmit: (data: Partial<UserProfile>) => void;

  /** Callback when form is cancelled */
  onCancel: () => void;

  /** Loading state */
  isLoading?: boolean;

  /** Validation errors */
  errors?: Record<string, string>;
}
```

**Usage Example**:
```tsx
<ProfileForm
  initialData={userProfile}
  onSubmit={handleSubmit}
  onCancel={handleCancel}
  isLoading={false}
  errors={validationErrors}
/>
```

---

### AvatarUpload

**Purpose**: Handle avatar image upload with preview and validation.

**Props Interface**:
```typescript
interface AvatarUploadProps {
  /** Current avatar URL or base64 */
  currentAvatar?: string;

  /** Callback when avatar is uploaded */
  onUpload: (base64: string) => void;

  /** Maximum file size in bytes */
  maxSize?: number;

  /** Allowed file types */
  allowedTypes?: string[];

  /** Upload progress (0-100) */
  uploadProgress?: number;

  /** Loading state */
  isLoading?: boolean;
}
```

**Usage Example**:
```tsx
<AvatarUpload
  currentAvatar={userProfile.avatar}
  onUpload={handleAvatarUpload}
  maxSize={2 * 1024 * 1024}
  allowedTypes={['image/jpeg', 'image/png', 'image/gif']}
  uploadProgress={uploadProgress}
  isLoading={false}
/>
```

---

### ProfileStats

**Purpose**: Display user statistics (join date, task counts, etc.).

**Props Interface**:
```typescript
interface ProfileStatsProps {
  /** User profile data */
  profile: UserProfile;

  /** Dashboard statistics */
  statistics: DashboardStatistics;

  /** Loading state */
  isLoading?: boolean;
}
```

**Usage Example**:
```tsx
<ProfileStats
  profile={userProfile}
  statistics={dashboardStats}
  isLoading={false}
/>
```

---

## Settings Components

### SettingsForm

**Purpose**: Form for managing user preferences.

**Props Interface**:
```typescript
interface SettingsFormProps {
  /** Current preferences */
  preferences: UserPreferences;

  /** Callback when preferences are updated */
  onUpdate: (preferences: Partial<UserPreferences>) => void;

  /** Callback when reset is clicked */
  onReset: () => void;

  /** Loading state */
  isLoading?: boolean;

  /** Show reset button */
  showReset?: boolean;
}
```

**Usage Example**:
```tsx
<SettingsForm
  preferences={userPreferences}
  onUpdate={handleUpdatePreferences}
  onReset={handleResetPreferences}
  isLoading={false}
  showReset={true}
/>
```

---

### ThemeSelector

**Purpose**: Allow theme selection with live preview.

**Props Interface**:
```typescript
interface ThemeSelectorProps {
  /** Current theme */
  currentTheme: 'Light' | 'Dark' | 'System';

  /** Callback when theme changes */
  onThemeChange: (theme: 'Light' | 'Dark' | 'System') => void;

  /** Show preview */
  showPreview?: boolean;
}
```

**Usage Example**:
```tsx
<ThemeSelector
  currentTheme={preferences.theme}
  onThemeChange={handleThemeChange}
  showPreview={true}
/>
```

---

### PreferenceToggles

**Purpose**: Toggle switches for boolean preferences.

**Props Interface**:
```typescript
interface PreferenceTogglesProps {
  /** Current preferences */
  preferences: UserPreferences;

  /** Callback when preference is toggled */
  onToggle: (key: keyof UserPreferences, value: boolean) => void;

  /** Disabled state */
  disabled?: boolean;
}
```

**Usage Example**:
```tsx
<PreferenceToggles
  preferences={userPreferences}
  onToggle={handleTogglePreference}
  disabled={false}
/>
```

---

### ResetButton

**Purpose**: Button to reset all settings to defaults with confirmation.

**Props Interface**:
```typescript
interface ResetButtonProps {
  /** Callback when reset is confirmed */
  onReset: () => void;

  /** Loading state */
  isLoading?: boolean;

  /** Disabled state */
  disabled?: boolean;

  /** Confirmation dialog title */
  confirmTitle?: string;

  /** Confirmation dialog message */
  confirmMessage?: string;
}
```

**Usage Example**:
```tsx
<ResetButton
  onReset={handleResetToDefaults}
  isLoading={false}
  disabled={false}
  confirmTitle="Reset Settings"
  confirmMessage="Are you sure you want to reset all settings to defaults?"
/>
```

---

## Summary

| Component | Category | Props Count | Key Features |
|-----------|----------|-------------|--------------|
| StatisticsCards | Dashboard | 5 | Display metrics, loading state |
| CompletionChart | Dashboard | 5 | Recharts integration, time range selector |
| ActivityFeed | Dashboard | 4 | Event list, click handlers |
| PriorityBreakdown | Dashboard | 5 | Priority counts, click handlers |
| TodoList | Todos | 6 | Filtering, sorting, CRUD operations |
| TodoItem | Todos | 6 | Quick actions, status/priority changes |
| TodoForm | Todos | 5 | Create/edit, validation |
| FilterPanel | Todos | 6 | Multi-select filters, search, sort |
| FilterTags | Todos | 4 | Active filters, remove capability |
| ProfileHeader | Profile | 4 | Avatar display, edit button |
| ProfileForm | Profile | 5 | Edit profile, validation |
| AvatarUpload | Profile | 6 | File upload, preview, validation |
| ProfileStats | Profile | 3 | User statistics display |
| SettingsForm | Settings | 5 | Preferences management, reset |
| ThemeSelector | Settings | 3 | Theme selection, preview |
| PreferenceToggles | Settings | 3 | Boolean preferences |
| ResetButton | Settings | 5 | Reset with confirmation |

**Total Components**: 17
**Total Props Interfaces**: 17

## Next Steps

1. Copy type definitions to `web/src/types/`
2. Implement components in `web/src/components/`
3. Create custom hooks for data access
4. Write component tests
5. Integrate with existing dashboard layout
