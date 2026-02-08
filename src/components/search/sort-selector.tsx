"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import type { SortField, SortDirection } from "@/types";

const SORT_OPTIONS: { value: SortField; label: string }[] = [
  { value: "date", label: "日期" },
  { value: "name", label: "名称" },
  { value: "totalCost", label: "总费用" },
  { value: "dailyCost", label: "每日成本" },
];

interface SortSelectorProps {
  field: SortField;
  direction: SortDirection;
  onFieldChange: (field: SortField) => void;
  onDirectionToggle: () => void;
}

export function SortSelector({
  field,
  direction,
  onFieldChange,
  onDirectionToggle,
}: SortSelectorProps) {
  return (
    <div className="flex items-center gap-1">
      <Select value={field} onValueChange={(v) => onFieldChange(v as SortField)}>
        <SelectTrigger className="w-[100px] h-9">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {SORT_OPTIONS.map((opt) => (
            <SelectItem key={opt.value} value={opt.value}>
              {opt.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Button
        variant="outline"
        size="sm"
        className="h-9 w-9 p-0"
        onClick={onDirectionToggle}
      >
        {direction === "asc" ? "↑" : "↓"}
      </Button>
    </div>
  );
}
