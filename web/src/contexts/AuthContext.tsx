"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { useSession } from "@/lib/auth/auth-client";
import { refreshJwtToken, clearJwtToken } from "@/lib/auth/jwt-manager";
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

      console.log("🔐 Login attempt:", email);

      const { signIn } = await import("@/lib/auth/auth-client");

      const payload = {
        email,
        password,
      };

      const result = await signIn.email(payload);

      // Check for errors in result
      if (result && result.error) {
        throw new Error(result.error.message || "Login failed");
      }

      // Fetch JWT token after successful login
      console.log("✓ Login successful, fetching JWT token...");
      const token = await refreshJwtToken();

      if (token) {
        console.log("✓ JWT token obtained for API authentication");
      } else {
        console.warn("⚠ Failed to obtain JWT token");
      }
    } catch (err) {
      console.error("❌ Login error:", err);
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

      console.log("📝 Signup attempt:", { email, name });
      const { signUp } = await import("@/lib/auth/auth-client");

      // Ensure payload matches Better Auth contract exactly
      const payload = {
        name: name.trim(),
        email: email.trim().toLowerCase(),
        password: password,
      };

      const result = await signUp.email(payload);

      if (result.error) {
        throw new Error(result.error.message || "Signup failed");
      }

      // Fetch JWT token after successful signup
      console.log("✓ Signup successful, fetching JWT token...");
      const token = await refreshJwtToken();

      if (token) {
        console.log("✓ JWT token obtained for API authentication");
      } else {
        console.warn("⚠ Failed to obtain JWT token");
      }
    } catch (err) {
      console.error("❌ Signup error:", err);
      const message = err instanceof Error ? err.message : "Signup failed";
      setError(message);
      throw err;
    }
  };

  const logout = async () => {
    try {
      setError(null);

      // Clear JWT token cache first
      clearJwtToken();
      console.log("✓ JWT token cache cleared");

      // Then sign out from Better Auth
      const { signOut } = await import("@/lib/auth/auth-client");
      await signOut();

      console.log("✓ Logout successful");

      // Redirect to home page (not login page)
      if (typeof window !== 'undefined') {
        window.location.href = '/';
      }
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

      // Fetch JWT token after successful OAuth login
      console.log("✓ OAuth login successful, fetching JWT token...");
      const token = await refreshJwtToken();

      if (token) {
        console.log("✓ JWT token obtained for API authentication");
      } else {
        console.warn("⚠ Failed to obtain JWT token");
      }
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
