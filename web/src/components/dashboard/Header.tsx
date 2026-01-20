"use client";

import { useState, useEffect } from "react";
import { Menu, LogOut, CheckSquare } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { getProfile } from "@/lib/storage/profile";
import Link from "next/link";

interface HeaderProps {
  onMenuClick: () => void;
}

export function Header({ onMenuClick }: HeaderProps) {
  const { user, logout } = useAuth();
  const [avatarUrl, setAvatarUrl] = useState<string | undefined>(undefined);

  // Load profile avatar from localStorage
  useEffect(() => {
    if (!user?.id) return;

    const profile = getProfile(user.id);
    if (profile?.avatar) {
      setAvatarUrl(profile.avatar);
    } else if (user?.image) {
      setAvatarUrl(user.image);
    }
  }, [user?.id, user?.image]);

  const getInitials = (name: string | null | undefined) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <header className="flex h-16 items-center justify-between border-b bg-card px-4 lg:px-8">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          className="lg:hidden"
          onClick={onMenuClick}
        >
          <Menu className="h-6 w-6" />
        </Button>

        {/* Todo App Logo - Links to Home Page */}
        <Link
          href="/"
          className="flex items-center gap-2 hover:opacity-80 transition-opacity"
          title="Go to Home"
        >
          <CheckSquare className="h-6 w-6 text-primary" />
          <span className="hidden sm:inline text-lg font-semibold">Todo App</span>
        </Link>

        <div className="hidden lg:block h-6 w-px bg-border mx-2" />
        <h2 className="hidden lg:block text-lg font-semibold lg:text-xl">Dashboard</h2>
      </div>

      <div className="flex items-center gap-4">
        <ThemeToggle />

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-10 w-10 rounded-full">
              <Avatar>
                <AvatarImage src={avatarUrl} alt={user?.name || "User"} />
                <AvatarFallback>{getInitials(user?.name)}</AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium">{user?.name || "User"}</p>
                <p className="text-xs text-muted-foreground">{user?.email}</p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => logout()} className="cursor-pointer">
              <LogOut className="mr-2 h-4 w-4" />
              Sign out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
