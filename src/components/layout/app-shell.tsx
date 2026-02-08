"use client";

import Image from "next/image";
import { NavBar } from "./nav-bar";
import { DbInitializer } from "@/components/db-initializer";
import { useAuth } from "@/hooks/use-auth";
import { UserAvatar } from "@/components/auth/user-avatar";

interface AppShellProps {
  children: React.ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  return (
    <DbInitializer>
      <div className="min-h-screen pb-16 md:pb-0">
        {/* Desktop sidebar */}
        <aside className="fixed inset-y-0 left-0 z-50 hidden w-56 border-r bg-background md:block">
          <DesktopNav />
        </aside>

        {/* Main content */}
        <main className="md:ml-56">
          {children}
        </main>

        {/* Mobile bottom nav */}
        <NavBar />
      </div>
    </DbInitializer>
  );
}

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/", label: "首页", icon: "🏠" },
  { href: "/categories", label: "分类管理", icon: "📁" },
  { href: "/assets/new", label: "新增资产", icon: "➕" },
  { href: "/settings", label: "设置", icon: "⚙️" },
];

function DesktopNav() {
  const pathname = usePathname();
  const { user, isLoggedIn } = useAuth();

  return (
    <div className="flex h-full flex-col">
      <div className="flex h-14 items-center gap-2.5 border-b px-4">
        <Image src="/icon.svg" alt="Metering Do" width={32} height={32} className="shrink-0 rounded-md" />
        <span className="text-base font-bold tracking-tight">Metering Do</span>
      </div>
      <nav className="flex-1 space-y-1 p-3">
        {navItems.map((item) => {
          const isActive =
            item.href === "/"
              ? pathname === "/"
              : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors",
                isActive
                  ? "bg-accent text-accent-foreground font-medium"
                  : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
              )}
            >
              <span className="text-lg">{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>
      {isLoggedIn && user && (
        <div className="border-t p-3">
          <Link
            href="/settings"
            className="flex items-center gap-2 rounded-md px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
          >
            <UserAvatar user={user} size="sm" />
            <span className="truncate">{user.name || user.login}</span>
          </Link>
        </div>
      )}
    </div>
  );
}
