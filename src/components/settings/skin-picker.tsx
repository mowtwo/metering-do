"use client";

import { useSkin } from "@/components/skin-provider";
import { SKINS } from "@/lib/skins";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function SkinPicker() {
  const { skin, setSkin } = useSkin();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">主题皮肤</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {SKINS.map((s) => (
          <button
            key={s.id}
            type="button"
            onClick={() => setSkin(s.id)}
            className={cn(
              "flex w-full items-center gap-3 rounded-lg border-2 p-3 text-left transition-colors",
              skin === s.id
                ? "border-primary bg-primary/5"
                : "border-border hover:bg-accent/50"
            )}
          >
            <span className="text-2xl">{s.icon}</span>
            <div className="flex-1 min-w-0">
              <div className="font-medium">{s.name}</div>
              <div className="text-sm text-muted-foreground">
                {s.description}
              </div>
            </div>
            {skin === s.id && (
              <span className="text-primary text-sm font-medium shrink-0">
                使用中
              </span>
            )}
          </button>
        ))}
      </CardContent>
    </Card>
  );
}
