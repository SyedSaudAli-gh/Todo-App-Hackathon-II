"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { useSession } from "next-auth/react";
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
  const { data: sessionData, status } = useSession();
  const [error, setError] = useState<string | null>(null);

  const authState: AuthState = {
    user: sessionData?.user as User | null,
    session: sessionData as Session | null,
    isLoading: status === "loading",
    isAuthenticated: status === "authenticated",
    error: error,
  };

  const login = async (email: string, password: string) => {
    try {
      setError(null);

      console.log("🔐 Login attempt:", email);

      const { signIn } = await import("next-auth/react");

      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      // Check for errors in result
      if (result?.error) {
        throw new Error(result.error || "Login failed");
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

      // Step 1: Create user account
      const signupResponse = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim().toLowerCase(),
          password: password,
        })
      });

      if (!signupResponse.ok) {
        const errorData = await signupResponse.json();
        throw new Error(errorData.error || "Signup failed");
      }

      // Step 2: Sign in with NextAuth
      const { signIn } = await import("next-auth/react");
      const result = await signIn("credentials", {
        email: email.trim().toLowerCase(),
        password: password,
        redirect: false,
      });

      if (result?.error) {
        throw new Error("Account created but login failed. Please try logging in.");
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

      // Then sign out from NextAuth
      const { signOut } = await import("next-auth/react");
      await signOut({ redirect: false });

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
      const { signIn } = await import("next-auth/react");
      await signIn(provider, {
        callbackUrl: "/dashboard",
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
