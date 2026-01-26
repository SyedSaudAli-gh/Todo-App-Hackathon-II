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
    enabled: !!(process.env.NEXT_PUBLIC_GOOGLE_ENABLED === 'true' && typeof window !== 'undefined'),
  },
  {
    id: "facebook",
    name: "Facebook",
    icon: "facebook",
    enabled: !!(process.env.NEXT_PUBLIC_FACEBOOK_ENABLED === 'true' && typeof window !== 'undefined'),
  },
];

export const getEnabledProviders = (): OAuthProviderConfig[] => {
  return oauthProviders.filter((provider) => provider.enabled);
};
