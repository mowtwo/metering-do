"use client";

import { useMemo } from "react";
import { type Expense } from "@/lib/db";
import { computeAssetStats, type AssetStats } from "@/lib/calculations";

export function useAssetStats(expenses: Expense[] | undefined): AssetStats | null {
  return useMemo(() => {
    if (!expenses) return null;
    return computeAssetStats(expenses);
  }, [expenses]);
}
