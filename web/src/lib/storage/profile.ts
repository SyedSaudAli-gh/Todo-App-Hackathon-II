import { UserProfile, STORAGE_KEYS } from '@/types/storage';

/**
 * Get user profile from localStorage
 */
export function getProfile(userId: string): UserProfile | null {
  if (typeof window === 'undefined') return null;

  try {
    const stored = localStorage.getItem(STORAGE_KEYS.USER_PROFILE);
    if (!stored) return null;

    const profile = JSON.parse(stored) as UserProfile;

    // Verify profile belongs to current user
    if (profile.id !== userId) return null;

    return profile;
  } catch (error) {
    console.error('Error reading profile from localStorage:', error);
    return null;
  }
}

/**
 * Save user profile to localStorage
 */
export function saveProfile(profile: UserProfile): void {
  if (typeof window === 'undefined') return;

  try {
    localStorage.setItem(STORAGE_KEYS.USER_PROFILE, JSON.stringify(profile));
  } catch (error) {
    console.error('Error saving profile to localStorage:', error);
    throw new Error('Failed to save profile');
  }
}

/**
 * Update user profile fields
 */
export function updateProfile(
  userId: string,
  updates: Partial<Omit<UserProfile, 'id'>>
): UserProfile {
  const existing = getProfile(userId);

  const updated: UserProfile = {
    id: userId,
    name: updates.name ?? existing?.name ?? '',
    email: updates.email ?? existing?.email ?? '',
    avatar: updates.avatar ?? existing?.avatar,
    joinDate: existing?.joinDate ?? new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  saveProfile(updated);
  return updated;
}

/**
 * Delete user profile from localStorage
 */
export function deleteProfile(userId: string): void {
  if (typeof window === 'undefined') return;

  try {
    const existing = getProfile(userId);
    if (existing && existing.id === userId) {
      localStorage.removeItem(STORAGE_KEYS.USER_PROFILE);
    }
  } catch (error) {
    console.error('Error deleting profile from localStorage:', error);
  }
}

/**
 * Initialize profile for new user
 */
export function initializeProfile(userId: string, name: string, email: string): UserProfile {
  const profile: UserProfile = {
    id: userId,
    name,
    email,
    joinDate: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  saveProfile(profile);
  return profile;
}
