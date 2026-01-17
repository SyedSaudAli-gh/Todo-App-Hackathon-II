"use client";

import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { ErrorMessage } from "@/components/ui/error-message";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { getEnabledProviders } from "@/lib/auth/providers";

export function OAuthButtons() {
  const { loginWithOAuth } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const [loadingProvider, setLoadingProvider] = useState<string | null>(null);

  const enabledProviders = getEnabledProviders();

  const handleOAuthLogin = async (provider: "google" | "facebook" | "linkedin") => {
    setError(null);
    setLoadingProvider(provider);

    try {
      await loginWithOAuth(provider);
    } catch (err) {
      setError(err instanceof Error ? err.message : `Failed to sign in with ${provider}`);
      setLoadingProvider(null);
    }
  };

  if (enabledProviders.length === 0) {
    return null;
  }

  return (
    <div className="space-y-2">
      {enabledProviders.map((provider) => (
        <Button
          key={provider.id}
          type="button"
          variant="outline"
          className="w-full"
          onClick={() => handleOAuthLogin(provider.id)}
          disabled={loadingProvider !== null}
        >
          {loadingProvider === provider.id ? (
            <>
              <LoadingSpinner size="sm" className="mr-2" />
              Connecting...
            </>
          ) : (
            <>
              <span className="mr-2">{getProviderIcon(provider.icon)}</span>
              Continue with {provider.name}
            </>
          )}
        </Button>
      ))}
      {error && <ErrorMessage message={error} />}
    </div>
  );
}

function getProviderIcon(icon: string): string {
  const icons: Record<string, string> = {
    google: "🔍",
    facebook: "📘",
    linkedin: "💼",
  };
  return icons[icon] || "🔐";
}
