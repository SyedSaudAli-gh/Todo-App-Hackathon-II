# Skill: Replace UI with shadcn/ui

## Purpose
Upgrade basic HTML elements and custom components to polished, accessible shadcn/ui components, improving consistency, accessibility, and visual quality across the Todo App while maintaining theme compatibility.

## When to Use
- After completing basic functionality implementation
- When UI looks functional but lacks polish
- Before adding animations and advanced interactions
- After theme system is implemented
- When accessibility improvements are needed
- During UI refinement phase before production
- When replacing custom components with battle-tested alternatives

## Inputs
- Existing components with basic HTML elements (buttons, inputs, forms)
- Theme system with CSS variables
- Tailwind CSS configuration
- Component locations and usage patterns
- Design requirements for component variants
- Accessibility requirements (WCAG compliance)

## Step-by-Step Process

### 1. Install shadcn/ui CLI and Dependencies
```bash
cd web
npx shadcn-ui@latest init
```

When prompted, configure:
- **Style**: Default
- **Base color**: Slate
- **CSS variables**: Yes (for theme support)
- **Tailwind config**: Yes
- **Components directory**: `src/components/ui`
- **Utils directory**: `src/lib/utils`
- **React Server Components**: Yes
- **TypeScript**: Yes

This creates:
- `components.json` - shadcn/ui configuration
- `src/lib/utils.ts` - Utility functions (cn helper)
- Updates `tailwind.config.ts` with shadcn/ui presets

### 2. Install Core shadcn/ui Components
```bash
# Install commonly used components
npx shadcn-ui@latest add button
npx shadcn-ui@latest add input
npx shadcn-ui@latest add label
npx shadcn-ui@latest add card
npx shadcn-ui@latest add dialog
npx shadcn-ui@latest add dropdown-menu
npx shadcn-ui@latest add select
npx shadcn-ui@latest add checkbox
npx shadcn-ui@latest add textarea
npx shadcn-ui@latest add badge
npx shadcn-ui@latest add separator
npx shadcn-ui@latest add avatar
npx shadcn-ui@latest add alert
```

This creates individual component files in `src/components/ui/`:
- `button.tsx`
- `input.tsx`
- `label.tsx`
- `card.tsx`
- etc.

### 3. Verify Utils Helper
Check `web/src/lib/utils.ts` exists:
```typescript
import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
```

If not, create it manually and install dependencies:
```bash
npm install clsx tailwind-merge
```

### 4. Replace Button Components
**Before** - Basic HTML button in `web/src/components/ui/Button.tsx`:
```typescript
export function Button({ children, onClick, variant = 'primary' }: ButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 rounded ${variant === 'primary' ? 'bg-blue-600' : 'bg-gray-600'}`}
    >
      {children}
    </button>
  );
}
```

**After** - Using shadcn/ui Button:
```typescript
import { Button } from '@/components/ui/button';

// Usage in components
<Button variant="default" size="default">
  Primary Action
</Button>

<Button variant="secondary" size="sm">
  Secondary Action
</Button>

<Button variant="destructive" size="lg">
  Delete
</Button>

<Button variant="outline" size="icon">
  <PlusIcon className="h-4 w-4" />
</Button>

<Button variant="ghost">
  Cancel
</Button>
```

### 5. Replace Input Components
**Before** - Basic HTML input:
```typescript
<input
  type="text"
  value={value}
  onChange={(e) => setValue(e.target.value)}
  className="border rounded px-3 py-2"
  placeholder="Enter text"
/>
```

**After** - Using shadcn/ui Input with Label:
```typescript
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

<div className="space-y-2">
  <Label htmlFor="todo-title">Todo Title</Label>
  <Input
    id="todo-title"
    type="text"
    value={value}
    onChange={(e) => setValue(e.target.value)}
    placeholder="Enter todo title"
  />
</div>
```

### 6. Replace Card Components
**Before** - Basic div with styling:
```typescript
<div className="bg-white border rounded-lg p-4 shadow">
  <h3 className="font-bold mb-2">Card Title</h3>
  <p>Card content</p>
</div>
```

**After** - Using shadcn/ui Card:
```typescript
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

<Card>
  <CardHeader>
    <CardTitle>Card Title</CardTitle>
    <CardDescription>Card description text</CardDescription>
  </CardHeader>
  <CardContent>
    <p>Card content goes here</p>
  </CardContent>
  <CardFooter>
    <Button>Action</Button>
  </CardFooter>
</Card>
```

### 7. Upgrade Todo Form Component
Update `web/src/components/todos/TodoForm.tsx`:
```typescript
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface TodoFormProps {
  onSubmit: (todo: { title: string; description: string; priority: string }) => void;
  onCancel?: () => void;
  initialValues?: {
    title: string;
    description: string;
    priority: string;
  };
}

export function TodoForm({ onSubmit, onCancel, initialValues }: TodoFormProps) {
  const [title, setTitle] = useState(initialValues?.title || '');
  const [description, setDescription] = useState(initialValues?.description || '');
  const [priority, setPriority] = useState(initialValues?.priority || 'medium');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ title, description, priority });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{initialValues ? 'Edit Todo' : 'Create New Todo'}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter todo title"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter todo description (optional)"
              rows={4}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="priority">Priority</Label>
            <Select value={priority} onValueChange={setPriority}>
              <SelectTrigger id="priority">
                <SelectValue placeholder="Select priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="low">Low</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="high">High</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex gap-2 justify-end">
            {onCancel && (
              <Button type="button" variant="outline" onClick={onCancel}>
                Cancel
              </Button>
            )}
            <Button type="submit" disabled={!title.trim()}>
              {initialValues ? 'Update' : 'Create'} Todo
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
```

### 8. Upgrade Todo List Item Component
Update `web/src/components/todos/TodoItem.tsx`:
```typescript
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { MoreVertical, Edit, Trash2 } from 'lucide-react';

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
  const priorityColors = {
    low: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
    medium: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
    high: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
  };

  return (
    <Card className={todo.completed ? 'opacity-60' : ''}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-3 flex-1">
            <Checkbox
              id={`todo-${todo.id}`}
              checked={todo.completed}
              onCheckedChange={() => onToggle(todo.id)}
              className="mt-1"
            />
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
            <Badge variant="secondary" className={priorityColors[todo.priority]}>
              {todo.priority}
            </Badge>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <MoreVertical className="h-4 w-4" />
                  <span className="sr-only">Open menu</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => onEdit(todo.id)}>
                  <Edit className="mr-2 h-4 w-4" />
                  Edit
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => onDelete(todo.id)}
                  className="text-destructive focus:text-destructive"
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </CardHeader>
    </Card>
  );
}
```

### 9. Add Delete Confirmation Dialog
Create `web/src/components/todos/DeleteTodoDialog.tsx`:
```typescript
'use client';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

interface DeleteTodoDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  todoTitle: string;
}

export function DeleteTodoDialog({
  isOpen,
  onClose,
  onConfirm,
  todoTitle,
}: DeleteTodoDialogProps) {
  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Todo</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete "{todoTitle}"? This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={onConfirm} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
```

### 10. Install Icon Library
```bash
npm install lucide-react
```

Update components to use Lucide icons:
```typescript
import { Plus, Edit, Trash2, Check, X, MoreVertical } from 'lucide-react';

// Usage
<Button>
  <Plus className="mr-2 h-4 w-4" />
  Add Todo
</Button>
```

### 11. Update Dashboard Header with shadcn/ui
Update `web/src/components/dashboard/Header.tsx`:
```typescript
'use client';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Bell, Menu, User, Settings, LogOut } from 'lucide-react';
import { ThemeToggle } from '@/components/theme/ThemeToggle';

interface HeaderProps {
  user: {
    name: string;
    email: string;
    image?: string;
  };
  onMenuToggle: () => void;
}

export function Header({ user, onMenuToggle }: HeaderProps) {
  return (
    <header className="h-16 border-b border-border bg-card px-4 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={onMenuToggle}
          className="lg:hidden"
        >
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle menu</span>
        </Button>

        <h1 className="text-xl font-bold text-foreground">Todo App</h1>
      </div>

      <div className="flex items-center gap-2">
        <ThemeToggle />

        <Button variant="ghost" size="icon">
          <Bell className="h-5 w-5" />
          <span className="sr-only">Notifications</span>
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-10 w-10 rounded-full">
              <Avatar>
                <AvatarImage src={user.image} alt={user.name} />
                <AvatarFallback>
                  {user.name.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium">{user.name}</p>
                <p className="text-xs text-muted-foreground">{user.email}</p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <User className="mr-2 h-4 w-4" />
              Profile
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Settings className="mr-2 h-4 w-4" />
              Settings
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-destructive focus:text-destructive">
              <LogOut className="mr-2 h-4 w-4" />
              Sign Out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
```

### 12. Test All Upgraded Components
1. Start development server: `npm run dev`
2. Navigate through all pages
3. Test each upgraded component:
   - Buttons (all variants)
   - Inputs and forms
   - Cards
   - Dropdowns
   - Dialogs
   - Checkboxes
   - Badges
4. Verify theme compatibility (light/dark)
5. Test keyboard navigation (Tab, Enter, Escape)
6. Test with screen reader
7. Check mobile responsiveness

## Output
- ✅ shadcn/ui installed and configured
- ✅ Core components installed (button, input, card, etc.)
- ✅ Utils helper with cn() function
- ✅ All basic HTML elements replaced with shadcn/ui
- ✅ TodoForm upgraded with accessible inputs
- ✅ TodoItem upgraded with checkbox and dropdown
- ✅ Delete confirmation dialog added
- ✅ Dashboard header upgraded with avatar and dropdown
- ✅ Lucide icons integrated
- ✅ Theme compatibility maintained
- ✅ Keyboard navigation working
- ✅ Screen reader accessible

## Failure Handling

### Error: "shadcn-ui init fails"
**Solution**:
1. Ensure you're in the `web` directory
2. Check Node.js version (requires 16+)
3. Delete `node_modules` and reinstall: `npm install`
4. Try manual installation: copy component files from shadcn/ui docs

### Error: "cn() function not found"
**Solution**:
1. Create `src/lib/utils.ts` manually
2. Install dependencies: `npm install clsx tailwind-merge`
3. Verify import path in components
4. Check TypeScript configuration

### Error: "Components don't match theme"
**Solution**:
1. Verify CSS variables are defined in `theme-variables.css`
2. Check Tailwind config includes shadcn/ui preset
3. Ensure `darkMode` is configured correctly
4. Restart dev server after config changes

### Error: "Icons not rendering"
**Solution**:
1. Install lucide-react: `npm install lucide-react`
2. Check import statements are correct
3. Verify icon names match lucide-react exports
4. Add className for sizing: `className="h-4 w-4"`

### Error: "Dropdown menu doesn't close"
**Solution**:
1. Verify `DropdownMenuTrigger` wraps a button
2. Check `asChild` prop is used correctly
3. Ensure no conflicting click handlers
4. Test with React DevTools for state issues

### Error: "Form validation not working"
**Solution**:
1. Add `required` attribute to inputs
2. Implement custom validation logic
3. Use form libraries like react-hook-form
4. Add error states to Input components

### Error: "Components look broken on mobile"
**Solution**:
1. Test responsive classes (sm:, md:, lg:)
2. Adjust dialog/dropdown positioning
3. Increase touch target sizes
4. Test on actual mobile devices

## Validation Checklist
- [ ] shadcn/ui CLI installed and configured
- [ ] components.json created
- [ ] Utils helper (cn function) working
- [ ] Core components installed
- [ ] Button component replaced
- [ ] Input component replaced
- [ ] Card component replaced
- [ ] TodoForm upgraded
- [ ] TodoItem upgraded
- [ ] Delete dialog added
- [ ] Dashboard header upgraded
- [ ] Lucide icons installed
- [ ] All components theme-compatible
- [ ] Keyboard navigation works
- [ ] Screen reader accessible
- [ ] Mobile responsive
- [ ] No console errors
- [ ] TypeScript types correct

## Best Practices
- Use shadcn/ui for consistency and accessibility
- Always use the `cn()` utility for className merging
- Prefer shadcn/ui variants over custom styling
- Use Lucide icons for consistency
- Add proper ARIA labels for accessibility
- Test keyboard navigation (Tab, Enter, Escape)
- Verify theme compatibility (light/dark)
- Use semantic HTML (Button, not div with onClick)
- Add loading and disabled states
- Implement proper form validation
- Use AlertDialog for destructive actions
- Keep component API simple and predictable
- Document custom variants and extensions
- Test on multiple browsers and devices
- Follow shadcn/ui composition patterns
