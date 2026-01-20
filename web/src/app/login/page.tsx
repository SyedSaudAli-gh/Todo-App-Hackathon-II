"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { AuthForm } from "@/components/auth/AuthForm";
import { AuthFormData } from "@/types/landing";
import { useAuth } from "@/hooks/useAuth";

function mapAuthError(error: unknown): string {
  if (error instanceof Error) {
    if (error.message.includes("Invalid password")) {
      return "Incorrect email or password";
    }
    if (error.message.includes("User not found")) {
      return "No account found with this email";
    }
    return error.message;
  }
  return "An unexpected error occurred. Please try again.";
}

export default function SignInPage() {
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

  // Don't render login form if already authenticated
  if (isAuthenticated) {
    return null;
  }

  async function handleSignIn(data: AuthFormData) {
    setLoading(true);
    setError(null);

    console.log("\n" + "=".repeat(80));
    console.log("🔐 LOGIN PAGE SUBMIT");
    console.log("=".repeat(80));
    console.log("Email from form:", data.email);
    console.log("Password from form length:", data.password?.length || 0);
    console.log("=".repeat(80) + "\n");

    try {
      const payload = { email: data.email, password: data.password };

      console.log("📤 Sending to /api/auth/sign-in/email");
      console.log("Payload:", { email: payload.email, password: `[${payload.password.length} chars]` });

      const response = await fetch("/api/auth/sign-in/email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      console.log("📥 Response status:", response.status);

      if (!response.ok) {
        const errorData = await response.json();
        console.error("❌ Signin failed:", errorData);
        throw new Error(errorData.message || "Sign in failed");
      }

      const responseData = await response.json();
      console.log("✅ Signin succeeded:", responseData);

      // Success - redirect to dashboard
      router.push("/dashboard");
      router.refresh();
    } catch (err) {
      console.error("❌ Error in handleSignIn:", err);
      setError(mapAuthError(err));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-md space-y-6 rounded-lg border bg-card p-6 shadow-lg md:p-8">
        <div className="space-y-2 text-center">
          <h1 className="text-2xl font-bold md:text-3xl">Sign In</h1>
          <p className="text-sm text-muted-foreground">
            Enter your credentials to access your account
          </p>
        </div>
        <AuthForm mode="signin" onSubmit={handleSignIn} loading={loading} error={error} />
      </div>
    </div>
  );
}
