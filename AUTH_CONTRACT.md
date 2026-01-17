# Authentication Contract

This document defines the strict authentication payload contracts for the Todo App.

## Version
- Better Auth: 1.4.10
- Last Updated: 2026-01-17

## Signup Payload

### Frontend → Better Auth
```typescript
{
  name: string,      // REQUIRED - User's full name
  email: string,     // REQUIRED - Valid email address
  password: string   // REQUIRED - Min 8 characters, max 128
}
```

### Validation Rules
- `name`: Required, non-empty string
- `email`: Required, valid email format, unique
- `password`: Required, 8-128 characters

### Example
```typescript
await signUp.email({
  name: "John Doe",
  email: "john@example.com",
  password: "securepass123"
});
```

## Signin Payload

### Frontend → Better Auth
```typescript
{
  email: string,     // REQUIRED - Registered email
  password: string   // REQUIRED - User's password
}
```

### Validation Rules
- `email`: Required, valid email format
- `password`: Required, non-empty string

### Example
```typescript
await signIn.email({
  email: "john@example.com",
  password: "securepass123"
});
```

## Database Schema

### User Table
```sql
CREATE TABLE user (
    id TEXT PRIMARY KEY,
    email TEXT NOT NULL UNIQUE,
    emailVerified INTEGER DEFAULT 0,
    name TEXT,
    image TEXT,
    createdAt INTEGER NOT NULL,
    updatedAt INTEGER NOT NULL
)
```

## Error Handling

### Common Errors
- `[body.name] Invalid input: expected string, received undefined` - Name field missing or undefined
- `[body.email] Invalid input` - Invalid email format
- `[body.password] Invalid input` - Password doesn't meet requirements
- `Email already exists` - Duplicate email registration

## Implementation Notes

1. **Frontend**: All fields must be controlled inputs with state
2. **Payload**: Must use object notation with exact field names
3. **Order**: Field order doesn't matter in object notation
4. **Validation**: Frontend validates before submission, backend validates on receipt
