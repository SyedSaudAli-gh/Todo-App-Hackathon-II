"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { AuthFormProps, AuthFormData, ValidationErrors } from "@/types/landing";
import { OAuthButton } from "@/components/auth/OAuthButton";

function validateForm(data: AuthFormData, mode: "signin" | "signup"): ValidationErrors {
  const errors: ValidationErrors = {};

  // Name validation (signup only)
  if (mode === "signup") {
    if (!data.name || data.name.trim().length === 0) {
      errors.name = "Name is required";
    }
  }

  // Email validation
  if (!data.email) {
    errors.email = "Email is required";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    errors.email = "Invalid email format";
  }

  // Password validation
  if (!data.password) {
    errors.password = "Password is required";
  } else if (data.password.length < 8) {
    errors.password = "Password must be at least 8 characters";
  }

  // Confirm password (signup only)
  if (mode === "signup") {
    if (!data.confirmPassword) {
      errors.confirmPassword = "Please confirm your password";
    } else if (data.password !== data.confirmPassword) {
      errors.confirmPassword = "Passwords do not match";
    }
  }

  return errors;
}

export function AuthForm({ mode, onSubmit, loading, error }: AuthFormProps) {
  const [formData, setFormData] = useState<AuthFormData>({
    name: "",
    email: "",
    password: "",
    confirmPassword: ""
  });
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Client-side validation
    const errors = validateForm(formData, mode);
    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      return;
    }

    setValidationErrors({});
    await onSubmit(formData);
  };

  const handleChange = (field: keyof AuthFormData) => (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setFormData((prev) => ({ ...prev, [field]: e.target.value }));
    // Clear validation error for this field
    if (validationErrors[field]) {
      setValidationErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
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
            aria-describedby={validationErrors.name ? "name-error" : undefined}
            className={validationErrors.name ? "border-destructive" : ""}
          />
          {validationErrors.name && (
            <p id="name-error" role="alert" className="text-sm text-destructive">
              {validationErrors.name}
            </p>
          )}
        </div>
      )}

      {/* Email Field */}
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          value={formData.email}
          onChange={handleChange("email")}
          disabled={loading}
          aria-invalid={!!validationErrors.email}
          aria-describedby={validationErrors.email ? "email-error" : undefined}
          className={validationErrors.email ? "border-destructive" : ""}
        />
        {validationErrors.email && (
          <p id="email-error" role="alert" className="text-sm text-destructive">
            {validationErrors.email}
          </p>
        )}
      </div>

      {/* Password Field */}
      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          type="password"
          value={formData.password}
          onChange={handleChange("password")}
          disabled={loading}
          aria-invalid={!!validationErrors.password}
          aria-describedby={validationErrors.password ? "password-error" : undefined}
          className={validationErrors.password ? "border-destructive" : ""}
        />
        {validationErrors.password && (
          <p id="password-error" role="alert" className="text-sm text-destructive">
            {validationErrors.password}
          </p>
        )}
      </div>

      {/* Confirm Password Field (Signup Only) */}
      {mode === "signup" && (
        <div className="space-y-2">
          <Label htmlFor="confirmPassword">Confirm Password</Label>
          <Input
            id="confirmPassword"
            type="password"
            value={formData.confirmPassword}
            onChange={handleChange("confirmPassword")}
            disabled={loading}
            aria-invalid={!!validationErrors.confirmPassword}
            aria-describedby={
              validationErrors.confirmPassword ? "confirm-password-error" : undefined
            }
            className={validationErrors.confirmPassword ? "border-destructive" : ""}
          />
          {validationErrors.confirmPassword && (
            <p
              id="confirm-password-error"
              role="alert"
              className="text-sm text-destructive"
            >
              {validationErrors.confirmPassword}
            </p>
          )}
        </div>
      )}

      {/* API Error Message */}
      {error && (
        <div role="alert" className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
          {error}
        </div>
      )}

      {/* Submit Button */}
      <Button type="submit" disabled={loading} className="w-full">
        {loading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            {mode === "signin" ? "Signing in..." : "Creating account..."}
          </>
        ) : (
          mode === "signin" ? "Sign In" : "Sign Up"
        )}
      </Button>

      {/* Divider */}
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-card px-2 text-muted-foreground">Or continue with</span>
        </div>
      </div>

      {/* OAuth Buttons */}
      <div className="space-y-2">
        <OAuthButton
          provider="google"
          disabled={loading}
          onError={(err) => setValidationErrors({ email: err })}
        />
        <OAuthButton
          provider="facebook"
          disabled={loading}
          onError={(err) => setValidationErrors({ email: err })}
        />
      </div>

      {/* Mode Toggle Link */}
      <div className="text-center text-sm">
        {mode === "signin" ? (
          <p className="text-muted-foreground">
            Don&apos;t have an account?{" "}
            <Link href="/signup" className="text-primary hover:underline">
              Sign up
            </Link>
          </p>
        ) : (
          <p className="text-muted-foreground">
            Already have an account?{" "}
            <Link href="/login" className="text-primary hover:underline">
              Sign in
            </Link>
          </p>
        )}
      </div>
    </form>
  );
}
