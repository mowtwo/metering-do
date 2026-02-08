"use client";

import { useLiveQuery } from "dexie-react-hooks";
import { db, type Category } from "@/lib/db";
import { generateId } from "@/lib/id";

export function useCategories() {
  const categories = useLiveQuery(() => db.categories.toArray());

  const topLevelCategories = categories?.filter((c) => c.parentId === null) ?? [];

  function getSubcategories(parentId: string) {
    return categories?.filter((c) => c.parentId === parentId) ?? [];
  }

  function getCategoryById(id: string) {
    return categories?.find((c) => c.id === id);
  }

  async function createCategory(data: {
    name: string;
    emoji: string;
    parentId: string | null;
  }) {
    const maxSort = categories
      ? Math.max(0, ...categories.map((c) => c.sortOrder))
      : 0;

    return db.categories.add({
      id: generateId(),
      name: data.name,
      emoji: data.emoji,
      parentId: data.parentId,
      sortOrder: maxSort + 1,
      createdAt: new Date(),
    });
  }

  async function updateCategory(
    id: string,
    data: Partial<Pick<Category, "name" | "emoji">>
  ) {
    return db.categories.update(id, data);
  }

  async function deleteCategory(id: string) {
    // Delete category and all its subcategories
    await db.transaction("rw", db.categories, async () => {
      await db.categories.where("parentId").equals(id).delete();
      await db.categories.delete(id);
    });
  }

  return {
    categories,
    topLevelCategories,
    getSubcategories,
    getCategoryById,
    createCategory,
    updateCategory,
    deleteCategory,
  };
}
