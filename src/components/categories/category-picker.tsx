"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { useCategories } from "@/hooks/use-categories";

interface CategoryPickerProps {
  categoryId: string;
  subcategoryId: string | null;
  onCategoryChange: (categoryId: string) => void;
  onSubcategoryChange: (subcategoryId: string | null) => void;
}

export function CategoryPicker({
  categoryId,
  subcategoryId,
  onCategoryChange,
  onSubcategoryChange,
}: CategoryPickerProps) {
  const { topLevelCategories, getSubcategories } = useCategories();
  const subcategories = categoryId ? getSubcategories(categoryId) : [];

  return (
    <div className="space-y-3">
      <div>
        <Label className="mb-2 block">分类</Label>
        <Select
          value={categoryId}
          onValueChange={(val) => {
            onCategoryChange(val);
            onSubcategoryChange(null);
          }}
        >
          <SelectTrigger>
            <SelectValue placeholder="选择分类" />
          </SelectTrigger>
          <SelectContent position="popper" sideOffset={4}>
            {topLevelCategories.map((cat) => (
              <SelectItem key={cat.id} value={cat.id}>
                {cat.emoji} {cat.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {subcategories.length > 0 && (
        <div>
          <Label className="mb-2 block">子分类</Label>
          <Select
            value={subcategoryId ?? ""}
            onValueChange={(val) =>
              onSubcategoryChange(val === "" ? null : val)
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="选择子分类（可选）" />
            </SelectTrigger>
            <SelectContent position="popper" sideOffset={4}>
              {subcategories.map((sub) => (
                <SelectItem key={sub.id} value={sub.id}>
                  {sub.emoji} {sub.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}
    </div>
  );
}
