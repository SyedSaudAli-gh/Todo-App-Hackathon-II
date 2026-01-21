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
    enabled: !!process.env.NEXT_PUBLIC_GOOGLE_ENABLED,
  },
  {
    id: "facebook",
    name: "Facebook",
    icon: "facebook",
    enabled: !!process.env.NEXT_PUBLIC_FACEBOOK_ENABLED,
  },
  {
    id: "linkedin",
    name: "LinkedIn",
    icon: "linkedin",
    enabled: !!process.env.NEXT_PUBLIC_LINKEDIN_ENABLED,
  },
];

export const getEnabledProviders = (): OAuthProviderConfig[] => {
  return oauthProviders.filter((provider) => provider.enabled);
};
