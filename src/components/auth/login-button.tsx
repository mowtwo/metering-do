"use client";

import { Button } from "@/components/ui/button";
import { Github } from "lucide-react";

interface LoginButtonProps {
  onLogin: () => void;
}

export function LoginButton({ onLogin }: LoginButtonProps) {
  return (
    <Button onClick={onLogin} className="w-full gap-2">
      <Github className="h-4 w-4" />
      使用 GitHub 登录
    </Button>
  );
}
