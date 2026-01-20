"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { AuthForm } from "@/components/auth/AuthForm";
import { AuthFormData } from "@/types/landing";
import { useAuth } from "@/hooks/useAuth";

function mapAuthError(error: unknown): string {
  if (error instanceof Error) {
    if (error.message.includes("Email already exists")) {
      return "An account with this email already exists";
    }
    if (error.message.includes("Invalid email")) {
      return "Please enter a valid email address";
    }
    return error.message;
  }
  return "An unexpected error occurred. Please try again.";
}

export default function SignUpPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAuth();

  // Redirect to dashboard if already logged in
  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      router.push("/dashboard");
    }
  }, [isAuthenticated, isLoading, router]);

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-muted-foreground">Loading...</div>
      </div>
    );
  }

  // Don't render signup form if already authenticated
  if (isAuthenticated) {
    return null;
  }

  async function handleSignUp(data: AuthFormData) {
    setLoading(true);
    setError(null);

    try {
      // Log payload before sending (for debugging)
      console.log("Signup payload:", { name: data.name, email: data.email, password: "***" });

      const response = await fetch("/api/auth/sign-up/email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: data.name,
          email: data.email,
          password: data.password
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Sign up failed");
      }

      // Success - redirect to dashboard
      router.push("/dashboard");
      router.refresh();
    } catch (err) {
      setError(mapAuthError(err));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-md space-y-6 rounded-lg border bg-card p-6 shadow-lg md:p-8">
        <div className="space-y-2 text-center">
          <h1 className="text-2xl font-bold md:text-3xl">Sign Up</h1>
          <p className="text-sm text-muted-foreground">
            Create your account to get started
          </p>
        </div>
        <AuthForm mode="signup" onSubmit={handleSignUp} loading={loading} error={error} />
      </div>
    </div>
  );
}
