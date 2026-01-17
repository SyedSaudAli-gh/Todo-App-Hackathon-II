"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { ProfileHeader } from "@/components/profile/ProfileHeader";
import { ProfileForm } from "@/components/profile/ProfileForm";
import { AvatarUpload } from "@/components/profile/AvatarUpload";
import { ProfileStats } from "@/components/profile/ProfileStats";
import { ProfileTaskSummary } from "@/components/profile/ProfileTaskSummary";
import { getProfile, updateProfile, initializeProfile } from "@/lib/storage/profile";
import { UserProfile } from "@/types/storage";
import { listTodos } from "@/lib/api/todos";
import { Todo } from "@/types/todo";
import { calculateTodoStats } from "@/lib/utils/calculateTodoStats";

export default function ProfilePage() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [todos, setTodos] = useState<Todo[]>([]);
  const [isEditMode, setIsEditMode] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingTodos, setIsLoadingTodos] = useState(true);

  useEffect(() => {
    if (!user?.id) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);

    let userProfile = getProfile(user.id);
    if (!userProfile) {
      userProfile = initializeProfile(user.id, user.name || 'User', user.email || '');
    }

    setProfile(userProfile);
    setIsLoading(false);
  }, [user?.id, user?.name, user?.email]);

  // Fetch todos from API
  useEffect(() => {
    if (!user?.id) {
      setIsLoadingTodos(false);
      return;
    }

    setIsLoadingTodos(true);

    listTodos()
      .then((response) => {
        setTodos(response.todos || []);
        setIsLoadingTodos(false);
      })
      .catch((error) => {
        console.error('Failed to fetch todos:', error);
        // Set empty array on error - graceful degradation
        setTodos([]);
        setIsLoadingTodos(false);
      });
  }, [user?.id]);

  const handleSaveName = async (name: string) => {
    if (!user?.id) return;

    const updated = updateProfile(user.id, { name });
    setProfile(updated);
    setIsEditMode(false);
  };

  const handleUploadAvatar = async (avatarDataUrl: string) => {
    if (!user?.id) return;

    const updated = updateProfile(user.id, { avatar: avatarDataUrl });
    setProfile(updated);
  };

  const handleToggleEditMode = () => {
    setIsEditMode((prev) => !prev);
  };

  const handleCancelEdit = () => {
    setIsEditMode(false);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user || !profile) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Profile</h1>
          <p className="text-muted-foreground mt-2">
            Please log in to view your profile
          </p>
        </div>
      </div>
    );
  }

  // Calculate statistics from todos data
  const stats = calculateTodoStats(todos);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Profile</h1>
        <p className="text-muted-foreground mt-2">
          Manage your profile information and view your activity
        </p>
      </div>

      <ProfileHeader
        name={profile.name}
        email={profile.email}
        avatarUrl={profile.avatar}
        joinDate={profile.joinDate}
        isEditMode={isEditMode}
        onToggleEditMode={handleToggleEditMode}
      />

      {isEditMode && (
        <div className="grid gap-6 md:grid-cols-2">
          <ProfileForm
            initialName={profile.name}
            email={profile.email}
            onSave={handleSaveName}
            onCancel={handleCancelEdit}
          />
          <AvatarUpload
            currentAvatarUrl={profile.avatar}
            userName={profile.name}
            onUpload={handleUploadAvatar}
          />
        </div>
      )}

      {/* Statistics Section - Calculated from Todos */}
      {isLoadingTodos ? (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      ) : (
        <>
          <ProfileStats
            totalTasks={stats.totalTasks}
            completedTasks={stats.completedTasks}
            completionRate={stats.completionRate}
            activeDays={stats.activeDays}
          />

          <ProfileTaskSummary
            totalTasks={stats.totalTasks}
            completedTasks={stats.completedTasks}
            incompleteTasks={stats.incompleteTasks}
          />
        </>
      )}
    </div>
  );
}
