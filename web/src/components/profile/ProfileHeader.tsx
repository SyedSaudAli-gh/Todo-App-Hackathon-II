"use client";

import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Edit, Mail, Calendar } from 'lucide-react';
import { formatDate } from '@/lib/utils';

interface ProfileHeaderProps {
  name: string;
  email: string;
  avatarUrl?: string;
  joinDate: string;
  isEditMode: boolean;
  onToggleEditMode: () => void;
}

export function ProfileHeader({
  name,
  email,
  avatarUrl,
  joinDate,
  isEditMode,
  onToggleEditMode,
}: ProfileHeaderProps) {
  const initials = name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
          {/* Avatar */}
          <Avatar className="h-24 w-24">
            <AvatarImage src={avatarUrl} alt={name} />
            <AvatarFallback className="text-2xl">{initials}</AvatarFallback>
          </Avatar>

          {/* Profile Info */}
          <div className="flex-1 text-center md:text-left">
            <h1 className="text-3xl font-bold mb-2">{name}</h1>
            <div className="space-y-2 text-sm text-muted-foreground">
              <div className="flex items-center justify-center md:justify-start gap-2">
                <Mail className="h-4 w-4" />
                <span>{email}</span>
              </div>
              <div className="flex items-center justify-center md:justify-start gap-2">
                <Calendar className="h-4 w-4" />
                <span>Joined {formatDate(joinDate)}</span>
              </div>
            </div>
          </div>

          {/* Edit Button */}
          <Button
            onClick={onToggleEditMode}
            variant={isEditMode ? "outline" : "default"}
            className="flex items-center gap-2"
          >
            <Edit className="h-4 w-4" />
            {isEditMode ? 'Cancel' : 'Edit Profile'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
