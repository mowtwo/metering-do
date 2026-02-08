"use client";

import { Button } from "@/components/ui/button";
import type { ViewMode } from "@/types";

interface ViewToggleProps {
  mode: ViewMode;
  onChange: (mode: ViewMode) => void;
}

export function ViewToggle({ mode, onChange }: ViewToggleProps) {
  return (
    <div className="flex rounded-md border">
      <Button
        variant={mode === "list" ? "default" : "ghost"}
        size="sm"
        className="h-9 rounded-r-none px-3"
        onClick={() => onChange("list")}
      >
        ☰
      </Button>
      <Button
        variant={mode === "card" ? "default" : "ghost"}
        size="sm"
        className="h-9 rounded-l-none px-3"
        onClick={() => onChange("card")}
      >
        ⊞
      </Button>
    </div>
  );
}
