"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import type { AuthUser } from "@/types/auth";

interface UserAvatarProps {
  user: AuthUser;
  size?: "sm" | "md";
  className?: string;
}

export function UserAvatar({ user, size = "md", className }: UserAvatarProps) {
  const sizeClass = size === "sm" ? "h-6 w-6" : "h-8 w-8";

  return (
    <Avatar className={`${sizeClass} ${className ?? ""}`}>
      <AvatarImage src={user.avatar_url} alt={user.login} />
      <AvatarFallback>{user.login.slice(0, 2).toUpperCase()}</AvatarFallback>
    </Avatar>
  );
}
