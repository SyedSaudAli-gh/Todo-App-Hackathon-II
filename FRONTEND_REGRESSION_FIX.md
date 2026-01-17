# Frontend Regression Fix - Complete

## Problem
**Error:** `"[body.name] Invalid input: expected string, received undefined"`

## Root Cause
**UI update removed the name field from the signup form.**

### Specific Issues Found:
1. `AuthFormData` type (landing.ts) - Missing `name` field
2. `AuthForm` component state - Missing `name` in initial state
3. `AuthForm` component render - No name input field in the form
4. `signup/page.tsx` - Payload sent without `name`: `{ email, password }`

## Solution Applied

### 1. Updated Type Definition (landing.ts)
```typescript
export interface AuthFormData {
  name?: string; // Required for signup
  email: string;
  password: string;
  confirmPassword?: string;
}

export interface ValidationErrors {
  name?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
}
```

### 2. Updated Form State (AuthForm.tsx)
```typescript
const [formData, setFormData] = useState<AuthFormData>({
  name: "",        // ADDED
  email: "",
  password: "",
  confirmPassword: ""
});
```

### 3. Added Name Validation (AuthForm.tsx)
```typescript
// Name validation (signup only)
if (mode === "signup") {
  if (!data.name || data.name.trim().length === 0) {
    errors.name = "Name is required";
  }
}
```

### 4. Added Name Input Field (AuthForm.tsx)
```tsx
{/* Name Field (Signup Only) */}
{mode === "signup" && (
  <div className="space-y-2">
    <Label htmlFor="name">Name</Label>
    <Input
      id="name"
      type="text"
      value={formData.name}
      onChange={handleChange("name")}
      disabled={loading}
      aria-invalid={!!validationErrors.name}
      className={validationErrors.name ? "border-destructive" : ""}
    />
    {validationErrors.name && (
      <p role="alert" className="text-sm text-destructive">
        {validationErrors.name}
      </p>
    )}
  </div>
)}
```

### 5. Updated Signup Handler (signup/page.tsx)
```typescript
body: JSON.stringify({
  name: data.name,      // ADDED
  email: data.email,
  password: data.password
})
```

## Files Modified
- `web/src/types/landing.ts` - Added name field to types
- `web/src/components/auth/AuthForm.tsx` - Added name field, validation, and input
- `web/src/app/signup/page.tsx` - Added name to payload

## Verification
✅ TypeScript compilation successful
✅ Name field now present in signup form
✅ Name validation enforced
✅ Name sent in API payload

## Expected Behavior
- **Signup form** now shows Name field (first field)
- **Frontend validation** catches empty name before API call
- **API receives** complete payload: `{ name, email, password }`
- **No more** "[body.name] Invalid input" errors

## Test Instructions
1. Navigate to http://localhost:3000/signup
2. Verify Name field appears as first input
3. Try submitting without name → Should show "Name is required" error
4. Fill in all fields and submit → Should succeed
5. Check browser console → Should log: `Signup payload: { name: "...", email: "...", password: "***" }`

## Explanation
**UI update removed/disconnected the name field, causing undefined payload.**

This was a straightforward frontend regression where the new landing page AuthForm component was created without the name field that Better Auth requires for signup. The fix restores the name field with proper validation and payload construction.
