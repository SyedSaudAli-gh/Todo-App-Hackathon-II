export type OAuthProvider = "google" | "facebook" | "linkedin";

export interface OAuthProviderConfig {
  id: OAuthProvider;
  name: string;
  icon: string;
  enabled: boolean;
}

export const oauthProviders: OAuthProviderConfig[] = [
  {
    id: "google",
    name: "Google",
    icon: "google",
    enabled: true, // Always show, server will handle availability
  },
  {
    id: "facebook",
    name: "Facebook",
    icon: "facebook",
    enabled: true, // Always show, server will handle availability
  },
];

export const getEnabledProviders = (): OAuthProviderConfig[] => {
  return oauthProviders.filter((provider) => provider.enabled);
};
