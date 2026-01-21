# Todo Management Web App - Frontend

Next.js frontend for Phase II Todo Management application.

## Tech Stack

- **Framework**: Next.js 15+ with App Router
- **UI Library**: React 19+ with hooks
- **Language**: TypeScript 5+ (strict mode)
- **Styling**: Tailwind CSS 3+
- **State Management**: React hooks, Context API
- **HTTP Client**: fetch API (native)
- **Testing**: Jest, React Testing Library
- **E2E Testing**: Playwright

## Prerequisites

- Node.js 18 or higher
- npm or yarn or pnpm
- Backend API running at http://localhost:8000

## Setup Instructions

### 1. Initialize Next.js Project

**Note**: This step requires manual execution as it's interactive.

```bash
cd web
npx create-next-app@latest . --typescript --tailwind --app --no-src-dir --import-alias "@/*"
```

Answer prompts:
- TypeScript: Yes
- ESLint: Yes
- Tailwind CSS: Yes
- `src/` directory: Yes
- App Router: Yes
- Import alias: @/*

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Create `.env.local` file from example:

```bash
cp .env.local.example .env.local
```

Edit `.env.local`:

```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000
NEXT_PUBLIC_API_VERSION=v1
```

### 4. Start Development Server

```bash
npm run dev
```

The app will be available at http://localhost:3000

## Project Structure

```
web/
├── src/
│   ├── app/                 # Next.js App Router pages
│   │   ├── layout.tsx       # Root layout
│   │   ├── page.tsx         # Home page (todo list)
│   │   ├── globals.css      # Global styles
│   │   └── error.tsx        # Error boundary
│   ├── components/          # React components
│   │   ├── todos/           # Todo-specific components
│   │   │   ├── TodoList.tsx
│   │   │   ├── TodoItem.tsx
│   │   │   ├── TodoForm.tsx
│   │   │   └── EmptyState.tsx
│   │   └── ui/              # Reusable UI components
│   │       ├── Button.tsx
│   │       ├── Input.tsx
│   │       └── LoadingSpinner.tsx
│   ├── lib/                 # Utilities and API client
│   │   ├── api/             # API client functions
│   │   │   ├── client.ts    # Base API client
│   │   │   └── todos.ts     # Todo API functions
│   │   └── utils.ts         # Helper functions
│   └── types/               # TypeScript types
│       ├── todo.ts          # Todo type definitions
│       └── api.ts           # API response types
├── public/                  # Static assets
├── tests/                   # Test suite
│   ├── unit/                # Component tests
│   └── e2e/                 # End-to-end tests
├── package.json             # Node dependencies
├── tsconfig.json            # TypeScript configuration
├── tailwind.config.js       # Tailwind CSS configuration
├── next.config.js           # Next.js configuration
└── .env.local.example       # Environment variable template
```

## Features

### Phase 3: User Story 1 (MVP)
- ✅ Create todos with title and description
- ✅ View all todos in a list
- ✅ Todos persist to database
- ✅ Validation for title (required, 1-200 chars)
- ✅ Empty state when no todos exist

### Phase 4: User Story 2
- ✅ Mark todos as complete/incomplete
- ✅ Visual distinction for completed todos
- ✅ Completion status persists

### Phase 5: User Story 3
- ✅ Edit todo title and description
- ✅ Validation on edit
- ✅ Cancel editing

### Phase 6: User Story 4
- ✅ Delete todos with confirmation
- ✅ Deletion persists

## Development

### Running Tests

```bash
# Run unit tests
npm test

# Run with coverage
npm test -- --coverage

# Run E2E tests
npm run test:e2e

# Run specific test file
npm test -- TodoList.test.tsx
```

### Building for Production

```bash
# Create production build
npm run build

# Start production server
npm start
```

### Linting and Formatting

```bash
# Run ESLint
npm run lint

# Fix ESLint issues
npm run lint -- --fix
```

## API Integration

The frontend communicates with the backend API at `NEXT_PUBLIC_API_BASE_URL`.

### API Client Usage

#### Todo Operations

```typescript
import { listTodos, createTodo, updateTodo, deleteTodo } from '@/lib/api/todos';

// List all todos
const { todos, total } = await listTodos();

// Create new todo
const newTodo = await createTodo({ title: 'Buy groceries', description: 'Milk, eggs' });

// Update todo
const updated = await updateTodo(1, { completed: true });

// Delete todo
await deleteTodo(1);
```

#### User Statistics

```typescript
import { getUserStats } from '@/lib/api/user-stats';
import { UserStats } from '@/types/user-stats';

// Fetch authenticated user's activity statistics
const stats: UserStats = await getUserStats();
// Returns: { total_tasks, completed_tasks, completion_rate, active_days }
```

**Profile Page Integration Example**:

```typescript
const [stats, setStats] = useState<UserStats | null>(null);
const [isLoadingStats, setIsLoadingStats] = useState(true);
const [statsError, setStatsError] = useState<string | null>(null);

useEffect(() => {
  if (!user?.id) {
    setIsLoadingStats(false);
    return;
  }

  setIsLoadingStats(true);
  setStatsError(null);

  getUserStats()
    .then((data) => {
      setStats(data);
      setIsLoadingStats(false);
    })
    .catch((error) => {
      console.error('Failed to fetch stats:', error);
      setStatsError(error.message);
      setIsLoadingStats(false);
    });
}, [user?.id]);
```

### Error Handling

```typescript
import { ApiError } from '@/lib/api/client';

try {
  await createTodo({ title: '' });
} catch (error) {
  if (error instanceof ApiError) {
    console.error(`API Error ${error.status}: ${error.message}`);
    console.error('Details:', error.details);
  }
}
```

**User Statistics Error Handling**:

```typescript
try {
  const stats = await getUserStats();
} catch (error) {
  if (error.message === 'Not authenticated') {
    // Redirect to login
  } else if (error.message === 'Failed to calculate statistics') {
    // Show error message with retry option
  }
}
```

## Deployment

### Vercel (Recommended)

1. **Connect GitHub repository to Vercel**

2. **Configure environment variables in Vercel Dashboard**:

   Required variables:
   - `NEXT_PUBLIC_API_BASE_URL`: Your production API URL (e.g., `https://api.yourdomain.com`)
   - `NEXT_PUBLIC_API_VERSION`: `v1`
   - `BETTER_AUTH_SECRET`: Generate with `openssl rand -base64 32`
   - `BETTER_AUTH_URL`: Your production frontend URL (e.g., `https://yourdomain.com`)
   - `JWT_PRIVATE_KEY`: Your RSA private key in PEM format (see below)

   Optional OAuth variables:
   - `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET`
   - `FACEBOOK_APP_ID` and `FACEBOOK_APP_SECRET`
   - `LINKEDIN_CLIENT_ID` and `LINKEDIN_CLIENT_SECRET`

3. **Setting up JWT_PRIVATE_KEY on Vercel**:

   The JWT private key must be stored as an environment variable (not a file) for Vercel deployment.

   **Step 1: Generate RSA key pair** (if you don't have one):
   ```bash
   # Generate private key
   openssl genrsa -out private_key.pem 2048

   # Generate public key (for backend verification)
   openssl rsa -in private_key.pem -pubout -out public_key.pem
   ```

   **Step 2: Convert private key to single-line format**:
   ```bash
   # On Linux/Mac:
   awk 'NF {sub(/\r/, ""); printf "%s\\n",$0;}' private_key.pem

   # On Windows PowerShell:
   (Get-Content private_key.pem -Raw) -replace "`r`n", "\n" -replace "`n", "\n"
   ```

   **Step 3: Add to Vercel**:
   - Go to Vercel Dashboard → Your Project → Settings → Environment Variables
   - Add new variable: `JWT_PRIVATE_KEY`
   - Paste the entire key with `\n` for newlines:
     ```
     -----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQ...\n-----END PRIVATE KEY-----
     ```
   - Save and redeploy

   **Important Notes**:
   - The key must include `-----BEGIN PRIVATE KEY-----` and `-----END PRIVATE KEY-----` markers
   - Use `\n` (literal backslash-n) for line breaks, not actual newlines
   - Keep the private key secret - never commit it to git
   - Share the public key (`public_key.pem`) with your backend for JWT verification

4. **Deploy**: Vercel will automatically deploy on push to main branch

### Manual Deployment

```bash
# Build for production
npm run build

# Start production server
npm start
```

## Troubleshooting

### API Connection Issues

- Verify backend is running at `NEXT_PUBLIC_API_BASE_URL`
- Check CORS configuration in backend
- Verify environment variables in `.env.local`

### Build Errors

- Clear Next.js cache: `rm -rf .next`
- Reinstall dependencies: `rm -rf node_modules && npm install`
- Check TypeScript errors: `npm run type-check`

### Styling Issues

- Rebuild Tailwind: `npm run build`
- Check `tailwind.config.js` configuration
- Verify `globals.css` imports Tailwind directives

## Documentation

- [Next.js Documentation](https://nextjs.org/docs)
- [React Documentation](https://react.dev/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [TypeScript Documentation](https://www.typescriptlang.org/docs/)

## License

MIT
