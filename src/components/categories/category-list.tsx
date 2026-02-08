"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useCategories } from "@/hooks/use-categories";
import { CategoryForm } from "./category-form";
import { toast } from "sonner";

export function CategoryList() {
  const {
    topLevelCategories,
    getSubcategories,
    createCategory,
    updateCategory,
    deleteCategory,
  } = useCategories();

  const [editingCategory, setEditingCategory] = useState<{
    id: string;
    name: string;
    emoji: string;
  } | null>(null);
  const [addingSubcategoryParentId, setAddingSubcategoryParentId] = useState<
    string | null
  >(null);
  const [addingTopLevel, setAddingTopLevel] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  async function handleAddTopLevel(data: { name: string; emoji: string }) {
    await createCategory({ ...data, parentId: null });
    toast.success("分类已添加");
  }

  async function handleAddSubcategory(data: { name: string; emoji: string }) {
    if (!addingSubcategoryParentId) return;
    await createCategory({ ...data, parentId: addingSubcategoryParentId });
    toast.success("子分类已添加");
  }

  async function handleUpdate(data: { name: string; emoji: string }) {
    if (!editingCategory) return;
    await updateCategory(editingCategory.id, data);
    toast.success("分类已更新");
  }

  async function handleDelete() {
    if (!deletingId) return;
    await deleteCategory(deletingId);
    setDeletingId(null);
    toast.success("分类已删除");
  }

  return (
    <div className="space-y-2">
      {topLevelCategories.map((cat) => {
        const subs = getSubcategories(cat.id);
        return (
          <div key={cat.id} className="rounded-lg border">
            {/* Parent category */}
            <div className="flex items-center gap-3 px-4 py-3">
              <span className="text-2xl">{cat.emoji}</span>
              <span className="flex-1 font-medium">{cat.name}</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() =>
                  setEditingCategory({
                    id: cat.id,
                    name: cat.name,
                    emoji: cat.emoji,
                  })
                }
              >
                编辑
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="text-destructive"
                onClick={() => setDeletingId(cat.id)}
              >
                删除
              </Button>
            </div>

            {/* Subcategories */}
            {subs.length > 0 && (
              <div className="border-t">
                {subs.map((sub) => (
                  <div
                    key={sub.id}
                    className="flex items-center gap-3 border-b last:border-b-0 py-2 pl-10 pr-4"
                  >
                    <span className="text-lg">{sub.emoji}</span>
                    <span className="flex-1 text-sm">{sub.name}</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-7 text-xs"
                      onClick={() =>
                        setEditingCategory({
                          id: sub.id,
                          name: sub.name,
                          emoji: sub.emoji,
                        })
                      }
                    >
                      编辑
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-7 text-xs text-destructive"
                      onClick={() => setDeletingId(sub.id)}
                    >
                      删除
                    </Button>
                  </div>
                ))}
              </div>
            )}

            {/* Add subcategory button */}
            <div className="border-t px-4 py-2">
              <Button
                variant="ghost"
                size="sm"
                className="w-full text-muted-foreground"
                onClick={() => setAddingSubcategoryParentId(cat.id)}
              >
                + 添加子分类
              </Button>
            </div>
          </div>
        );
      })}

      {/* Add top-level category button */}
      <Button
        className="w-full"
        variant="outline"
        onClick={() => setAddingTopLevel(true)}
      >
        + 添加分类
      </Button>

      {/* Dialogs */}
      <CategoryForm
        open={addingTopLevel}
        onOpenChange={setAddingTopLevel}
        onSubmit={handleAddTopLevel}
        title="添加分类"
      />

      <CategoryForm
        open={!!addingSubcategoryParentId}
        onOpenChange={(open) => {
          if (!open) setAddingSubcategoryParentId(null);
        }}
        onSubmit={handleAddSubcategory}
        title="添加子分类"
      />

      {editingCategory && (
        <CategoryForm
          open={true}
          onOpenChange={(open) => {
            if (!open) setEditingCategory(null);
          }}
          onSubmit={handleUpdate}
          initialValues={editingCategory}
          title="编辑分类"
        />
      )}

      <AlertDialog
        open={!!deletingId}
        onOpenChange={(open) => {
          if (!open) setDeletingId(null);
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>确认删除</AlertDialogTitle>
            <AlertDialogDescription>
              删除分类后，其下的所有子分类也会被一并删除。此操作不可撤销。
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>取消</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>确认删除</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
