# Quickstart Guide: Dynamic Profile Statistics

**Feature**: 004-dynamic-profile-stats
**Date**: 2026-01-12
**Audience**: Frontend Developers

## Overview

This guide provides step-by-step instructions for integrating the user statistics API into the Next.js frontend. The integration replaces local statistics calculation with backend API calls.

## Prerequisites

- Backend API running at `http://localhost:8001`
- User authenticated via Better Auth (session cookie present)
- ProfileStats component exists at `web/src/components/profile/ProfileStats.tsx`

## Implementation Steps

### Step 1: Create TypeScript Types

**File**: `web/src/types/user-stats.ts`

```typescript
/**
 * User activity statistics from backend API
 */
export interface UserStats {
  /** Total number of todos created by user */
  total_tasks: number;

  /** Number of todos marked as completed */
  completed_tasks: number;

  /** Completion rate percentage (0-100) */
  completion_rate: number;

  /** Days since user account creation (inclusive) */
  active_days: number;
}

/**
 * API error response
 */
export interface ApiError {
  detail: string;
}
```

**Usage**:
```typescript
import { UserStats } from '@/types/user-stats';
```

---

### Step 2: Create API Client

**File**: `web/src/lib/api/user-stats.ts`

```typescript
import { UserStats } from '@/types/user-stats';

/**
 * Fetch user statistics from backend API
 *
 * @returns Promise resolving to user statistics
 * @throws Error if request fails or user not authenticated
 */
export async function getUserStats(): Promise<UserStats> {
  const response = await fetch('http://localhost:8001/api/v1/users/me/stats', {
    method: 'GET',
    credentials: 'include', // Include Better Auth session cookie
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    if (response.status === 401) {
      throw new Error('Not authenticated');
    }
    throw new Error('Failed to fetch user statistics');
  }

  return response.json();
}
```

**Key Points**:
- `credentials: 'include'` ensures session cookie is sent
- Error handling for 401 (unauthenticated) and 500 (server error)
- Returns typed `UserStats` object

---

### Step 3: Update Profile Page

**File**: `web/src/app/dashboard/profile/page.tsx`

**Changes Required**:

1. **Remove local stats calculation**:
```typescript
// DELETE THIS FUNCTION
const calculateStats = () => {
  // ... local calculation logic
};
```

2. **Add API call with state management**:
```typescript
import { getUserStats } from '@/lib/api/user-stats';
import { UserStats } from '@/types/user-stats';

export default function ProfilePage() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [stats, setStats] = useState<UserStats | null>(null);
  const [isLoadingStats, setIsLoadingStats] = useState(true);
  const [statsError, setStatsError] = useState<string | null>(null);

  // Fetch user statistics from API
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

  // ... rest of component
}
```

3. **Update ProfileStats component usage**:
```typescript
{/* Replace local stats with API stats */}
{isLoadingStats ? (
  <div className="flex justify-center items-center py-12">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
  </div>
) : statsError ? (
  <div className="text-center py-12 text-red-500">
    <p>Failed to load statistics: {statsError}</p>
    <button
      onClick={() => window.location.reload()}
      className="mt-4 px-4 py-2 bg-primary text-white rounded"
    >
      Retry
    </button>
  </div>
) : stats ? (
  <ProfileStats
    totalTasks={stats.total_tasks}
    completedTasks={stats.completed_tasks}
    completionRate={stats.completion_rate}
    activeDays={stats.active_days}
  />
) : null}
```

**Complete Example**:
```typescript
"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { ProfileHeader } from "@/components/profile/ProfileHeader";
import { ProfileForm } from "@/components/profile/ProfileForm";
import { AvatarUpload } from "@/components/profile/AvatarUpload";
import { ProfileStats } from "@/components/profile/ProfileStats";
import { getProfile, updateProfile, initializeProfile } from "@/lib/storage/profile";
import { UserProfile } from "@/types/storage";
import { getUserStats } from "@/lib/api/user-stats";
import { UserStats } from "@/types/user-stats";

export default function ProfilePage() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [stats, setStats] = useState<UserStats | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingStats, setIsLoadingStats] = useState(true);
  const [statsError, setStatsError] = useState<string | null>(null);

  // Load user profile
  useEffect(() => {
    if (!user?.id) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    let userProfile = getProfile(user.id);
    if (!userProfile) {
      userProfile = initializeProfile(user.id, user.name || 'User', user.email || '');
    }
    setProfile(userProfile);
    setIsLoading(false);
  }, [user?.id, user?.name, user?.email]);

  // Fetch user statistics from API
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

  const handleSaveName = async (name: string) => {
    if (!user?.id) return;
    const updated = updateProfile(user.id, { name });
    setProfile(updated);
    setIsEditMode(false);
  };

  const handleUploadAvatar = async (avatarDataUrl: string) => {
    if (!user?.id) return;
    const updated = updateProfile(user.id, { avatarUrl: avatarDataUrl });
    setProfile(updated);
  };

  const handleToggleEditMode = () => {
    setIsEditMode((prev) => !prev);
  };

  const handleCancelEdit = () => {
    setIsEditMode(false);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user || !profile) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Profile</h1>
          <p className="text-muted-foreground mt-2">
            Please log in to view your profile
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Profile</h1>
        <p className="text-muted-foreground mt-2">
          Manage your profile information and view your activity
        </p>
      </div>

      <ProfileHeader
        name={profile.name}
        email={profile.email}
        avatarUrl={profile.avatarUrl}
        joinDate={profile.joinedAt}
        isEditMode={isEditMode}
        onToggleEditMode={handleToggleEditMode}
      />

      {isEditMode && (
        <div className="grid gap-6 md:grid-cols-2">
          <ProfileForm
            initialName={profile.name}
            email={profile.email}
            onSave={handleSaveName}
            onCancel={handleCancelEdit}
          />
          <AvatarUpload
            currentAvatarUrl={profile.avatarUrl}
            userName={profile.name}
            onUpload={handleUploadAvatar}
          />
        </div>
      )}

      {/* Statistics Section with Loading and Error States */}
      {isLoadingStats ? (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      ) : statsError ? (
        <div className="text-center py-12 text-red-500">
          <p>Failed to load statistics: {statsError}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-primary text-white rounded hover:bg-primary/90"
          >
            Retry
          </button>
        </div>
      ) : stats ? (
        <ProfileStats
          totalTasks={stats.total_tasks}
          completedTasks={stats.completed_tasks}
          completionRate={stats.completion_rate}
          activeDays={stats.active_days}
        />
      ) : null}
    </div>
  );
}
```

---

## Testing the Integration

### Manual Testing

1. **Start Backend API**:
```bash
cd api
source venv/bin/activate  # or venv\Scripts\activate on Windows
uvicorn src.main:app --reload --port 8001
```

2. **Start Frontend**:
```bash
cd web
npm run dev
```

3. **Test Scenarios**:

**Scenario 1: Authenticated User with Todos**
- Navigate to `/dashboard/profile`
- Verify statistics display correctly
- Check browser DevTools Network tab for API call
- Verify response matches expected format

**Scenario 2: Authenticated User with Zero Todos**
- Create new user account
- Navigate to `/dashboard/profile`
- Verify: `total_tasks: 0`, `completed_tasks: 0`, `completion_rate: 0.0`

**Scenario 3: Unauthenticated User**
- Log out
- Navigate to `/dashboard/profile`
- Verify error message displayed
- Check console for 401 error

**Scenario 4: API Unavailable**
- Stop backend API
- Navigate to `/dashboard/profile`
- Verify error message with retry button

---

## Debugging

### Common Issues

**Issue 1: CORS Error**
```
Access to fetch at 'http://localhost:8001/api/v1/users/me/stats' from origin 'http://localhost:3000' has been blocked by CORS policy
```

**Solution**: Ensure backend CORS configuration includes frontend origin:
```python
# api/src/main.py
from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

**Issue 2: 401 Unauthorized**
```
Failed to fetch user statistics: Not authenticated
```

**Solution**: Verify Better Auth session cookie is present:
1. Open browser DevTools → Application → Cookies
2. Check for `better-auth.session_token` cookie
3. If missing, log in again

**Issue 3: Statistics Not Updating**
```
Statistics show old data after creating/completing todos
```

**Solution**: Refresh the page or add dependency to useEffect:
```typescript
useEffect(() => {
  // Fetch stats
}, [user?.id, /* add trigger here */]);
```

---

## Performance Optimization

### Caching Strategy (Future Enhancement)

```typescript
// Add caching with SWR or React Query
import useSWR from 'swr';

function useUserStats() {
  const { data, error, isLoading } = useSWR(
    '/api/v1/users/me/stats',
    getUserStats,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      refreshInterval: 60000, // Refresh every minute
    }
  );

  return {
    stats: data,
    isLoading,
    error,
  };
}
```

### Loading State Optimization

```typescript
// Show skeleton loader instead of spinner
{isLoadingStats && (
  <Card>
    <CardHeader>
      <Skeleton className="h-6 w-48" />
    </CardHeader>
    <CardContent>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <Skeleton key={i} className="h-24" />
        ))}
      </div>
    </CardContent>
  </Card>
)}
```

---

## API Reference

### Endpoint

**URL**: `GET /api/v1/users/me/stats`

**Authentication**: Required (Better Auth session cookie)

**Response (200 OK)**:
```json
{
  "total_tasks": 10,
  "completed_tasks": 7,
  "completion_rate": 70.0,
  "active_days": 15
}
```

**Response (401 Unauthorized)**:
```json
{
  "detail": "Not authenticated"
}
```

**Response (500 Internal Server Error)**:
```json
{
  "detail": "Failed to calculate statistics"
}
```

---

## Next Steps

1. ✅ Implement TypeScript types
2. ✅ Create API client function
3. ✅ Update profile page with API integration
4. ⏳ Test all scenarios (authenticated, unauthenticated, errors)
5. ⏳ Add loading and error states
6. ⏳ Verify statistics update correctly

---

## Support

**Documentation**:
- Feature Specification: `specs/004-dynamic-profile-stats/spec.md`
- Implementation Plan: `specs/004-dynamic-profile-stats/plan.md`
- API Contract: `specs/004-dynamic-profile-stats/contracts/user-stats-api.yaml`

**API Documentation**:
- Swagger UI: http://localhost:8001/api/v1/docs
- ReDoc: http://localhost:8001/api/v1/redoc

**Troubleshooting**:
- Check browser console for errors
- Verify API is running: `curl http://localhost:8001/health`
- Check session cookie in DevTools
- Review backend logs for errors
