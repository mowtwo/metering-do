"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { EmojiPickerWrapper } from "./emoji-picker-wrapper";

interface CategoryFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: { name: string; emoji: string }) => void;
  initialValues?: { name: string; emoji: string };
  title: string;
}

export function CategoryForm({
  open,
  onOpenChange,
  onSubmit,
  initialValues,
  title,
}: CategoryFormProps) {
  const [name, setName] = useState(initialValues?.name ?? "");
  const [emoji, setEmoji] = useState(initialValues?.emoji ?? "📦");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;
    onSubmit({ name: name.trim(), emoji });
    setName("");
    setEmoji("📦");
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex items-end gap-3">
            <div>
              <Label className="mb-2 block">图标</Label>
              <EmojiPickerWrapper value={emoji} onChange={setEmoji} />
            </div>
            <div className="flex-1">
              <Label htmlFor="category-name" className="mb-2 block">名称</Label>
              <Input
                id="category-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="分类名称"
                autoFocus
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              取消
            </Button>
            <Button type="submit" disabled={!name.trim()}>
              保存
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
