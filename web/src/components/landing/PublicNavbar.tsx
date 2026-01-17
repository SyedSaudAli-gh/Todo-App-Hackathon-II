"use client";

import { useEffect, useState } from "react";
import { useThemeContext } from "@/contexts/ThemeContext";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Moon, Sun } from "lucide-react";
import { LANDING_CONTENT } from "@/lib/constants";

export function PublicNavbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const { resolvedTheme, toggleTheme } = useThemeContext();
  const router = useRouter();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`sticky top-0 z-50 backdrop-blur-md bg-background/80 transition-shadow ${
        isScrolled ? "shadow-md" : ""
      }`}
      aria-label="Main navigation"
    >
      <div className="container mx-auto flex items-center justify-between px-4 py-3 md:px-6 md:py-4 lg:px-12">
        {/* Left: Logo and App Name */}
        <div className="flex items-center gap-2 md:gap-3">
          <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
            <span className="text-primary-foreground font-bold text-sm">T</span>
          </div>
          <span className="text-sm font-semibold md:text-base lg:text-lg">
            {LANDING_CONTENT.navbar.appName}
          </span>
        </div>

        {/* Right: Theme Toggle and Auth Buttons */}
        <div className="flex items-center gap-2 md:gap-3 lg:gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            aria-label="Toggle theme"
            className="h-9 w-9"
          >
            {resolvedTheme === "light" ? (
              <Moon className="h-4 w-4" />
            ) : (
              <Sun className="h-4 w-4" />
            )}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.push("/login")}
            className="text-sm md:text-base"
          >
            {LANDING_CONTENT.navbar.signInText}
          </Button>
          <Button
            size="sm"
            onClick={() => router.push("/signup")}
            className="text-sm md:text-base"
          >
            {LANDING_CONTENT.navbar.signUpText}
          </Button>
        </div>
      </div>
    </nav>
  );
}
