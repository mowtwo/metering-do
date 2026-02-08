"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/use-auth";
import { UserAvatar } from "@/components/auth/user-avatar";

const navItems = [
  { href: "/", label: "首页", icon: "🏠" },
  { href: "/categories", label: "分类", icon: "📁" },
  { href: "/assets/new", label: "新增", icon: "➕" },
  { href: "/settings", label: "设置", icon: "⚙️" },
];

export function NavBar() {
  const pathname = usePathname();
  const { user, isLoggedIn } = useAuth();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 md:hidden">
      <div className="flex h-16 items-center justify-around px-4">
        {navItems.map((item) => {
          const isActive =
            item.href === "/"
              ? pathname === "/"
              : pathname.startsWith(item.href);
          const isSettings = item.href === "/settings";
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center gap-1 text-xs transition-colors",
                isActive
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {isSettings && isLoggedIn && user ? (
                <UserAvatar user={user} size="sm" />
              ) : (
                <span className="text-xl">{item.icon}</span>
              )}
              <span>{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
