"use client";

import { useEffect, useState } from "react";
import { db } from "@/lib/db";
import { generateId } from "@/lib/id";
import { DEFAULT_CATEGORIES } from "@/lib/constants";

export function DbInitializer({ children }: { children: React.ReactNode }) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    async function init() {
      const count = await db.categories.count();
      if (count === 0) {
        await seedDefaultCategories();
      }
      setReady(true);
    }
    init();
  }, []);

  if (!ready) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-muted-foreground">加载中...</div>
      </div>
    );
  }

  return <>{children}</>;
}

async function seedDefaultCategories() {
  const now = new Date();
  let sortOrder = 0;

  await db.transaction("rw", db.categories, async () => {
    for (const cat of DEFAULT_CATEGORIES) {
      const parentId = generateId();
      await db.categories.add({
        id: parentId,
        name: cat.name,
        emoji: cat.emoji,
        parentId: null,
        sortOrder: sortOrder++,
        createdAt: now,
      });

      for (const sub of cat.subcategories) {
        await db.categories.add({
          id: generateId(),
          name: sub.name,
          emoji: sub.emoji,
          parentId,
          sortOrder: sortOrder++,
          createdAt: now,
        });
      }
    }
  });
}
