"use client";

import { NavBar } from "./nav-bar";
import { DbInitializer } from "@/components/db-initializer";

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

  return (
    <div className="flex h-full flex-col">
      <div className="flex h-14 items-center border-b px-4">
        <span className="text-lg font-bold">📊 Metering-Do</span>
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
    </div>
  );
}
