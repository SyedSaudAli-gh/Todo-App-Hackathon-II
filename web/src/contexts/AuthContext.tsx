"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { useSession } from "@/lib/auth/auth-client";
import type { AuthState, User, Session } from "@/types/auth";

interface AuthContextValue extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, name: string) => Promise<void>;
  logout: () => Promise<void>;
  loginWithOAuth: (provider: "google" | "facebook" | "linkedin") => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { data: sessionData, isPending, error: sessionError } = useSession();
  const [error, setError] = useState<string | null>(null);

  const authState: AuthState = {
    user: sessionData?.user as User | null,
    session: sessionData?.session as Session | null,
    isLoading: isPending,
    isAuthenticated: !!sessionData?.user,
    error: error || (sessionError ? String(sessionError) : null),
  };

  const login = async (email: string, password: string) => {
    try {
      setError(null);

      // COMPREHENSIVE LOGIN TRACE
      console.log("\n" + "=".repeat(80));
      console.log("🔐 AUTHCONTEXT LOGIN CALLED");
      console.log("=".repeat(80));
      console.log("Email:", email);
      console.log("Email type:", typeof email);
      console.log("Email length:", email?.length || 0);
      console.log("Password type:", typeof password);
      console.log("Password length:", password?.length || 0);
      console.log("Password exists:", !!password);
      console.log("Password is string:", typeof password === 'string');
      console.log("=".repeat(80));

      const { signIn } = await import("@/lib/auth/auth-client");

      const payload = {
        email,
        password,
      };

      console.log("\n📤 CALLING signIn.email()");
      console.log("Payload keys:", Object.keys(payload));
      console.log("Payload.email:", payload.email);
      console.log("Payload.password length:", payload.password?.length || 0);

      const result = await signIn.email(payload);

      console.log("\n✅ signIn.email() RETURNED");
      console.log("Result:", result);
      console.log("Result.error:", result?.error);
      console.log("Result.data:", result?.data);
      console.log("=".repeat(80) + "\n");

      // Check for errors in result
      if (result && result.error) {
        throw new Error(result.error.message || "Login failed");
      }
    } catch (err) {
      console.error("\n❌ LOGIN ERROR IN AUTHCONTEXT");
      console.error("Error type:", typeof err);
      console.error("Error:", err);
      console.error("Error message:", err instanceof Error ? err.message : String(err));
      console.error("=".repeat(80) + "\n");

      const message = err instanceof Error ? err.message : "Login failed";
      setError(message);
      throw err;
    }
  };

  const signup = async (email: string, password: string, name: string) => {
    try {
      setError(null);

      // Validate inputs before sending
      if (!name || name.trim().length === 0) {
        throw new Error("Name is required");
      }
      if (!email || email.trim().length === 0) {
        throw new Error("Email is required");
      }
      if (!password || password.length < 8) {
        throw new Error("Password must be at least 8 characters");
      }

      console.log("Signup called with:", { email, password: "***", name });
      const { signUp } = await import("@/lib/auth/auth-client");

      // Ensure payload matches Better Auth contract exactly
      const payload = {
        name: name.trim(),
        email: email.trim().toLowerCase(),
        password: password,
      };

      console.log("Sending signup payload:", {
        name: payload.name,
        email: payload.email,
        password: "***",
        payloadKeys: Object.keys(payload)
      });

      const result = await signUp.email(payload);
      console.log("Signup result:", result);

      if (result.error) {
        throw new Error(result.error.message || "Signup failed");
      }
    } catch (err) {
      console.error("Signup error:", err);
      const message = err instanceof Error ? err.message : "Signup failed";
      setError(message);
      throw err;
    }
  };

  const logout = async () => {
    try {
      setError(null);
      const { signOut } = await import("@/lib/auth/auth-client");
      await signOut();
    } catch (err) {
      const message = err instanceof Error ? err.message : "Logout failed";
      setError(message);
      throw err;
    }
  };

  const loginWithOAuth = async (provider: "google" | "facebook" | "linkedin") => {
    try {
      setError(null);
      const { signIn } = await import("@/lib/auth/auth-client");
      await signIn.social({
        provider,
      });
    } catch (err) {
      const message = err instanceof Error ? err.message : "OAuth login failed";
      setError(message);
      throw err;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        ...authState,
        login,
        signup,
        logout,
        loginWithOAuth,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuthContext() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuthContext must be used within an AuthProvider");
  }
  return context;
}
