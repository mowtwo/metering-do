"use client";

import { useMemo, useState, useCallback } from "react";
import { useLiveQuery } from "dexie-react-hooks";
import { db } from "@/lib/db";
import { computeAssetStats } from "@/lib/calculations";
import { AppShell } from "@/components/layout/app-shell";
import { PageHeader } from "@/components/layout/page-header";
import { AssetSummary } from "@/components/assets/asset-summary";
import { AssetList } from "@/components/assets/asset-list";
import { SearchBar } from "@/components/search/search-bar";
import { SortSelector } from "@/components/search/sort-selector";
import { ViewToggle } from "@/components/search/view-toggle";
import { ShareTotalButton } from "@/components/share/share-total-button";
import { useAssetSearch } from "@/hooks/use-search";
import type { AssetWithStats, SortField, SortDirection, ViewMode } from "@/types";

export default function HomePage() {
  const assets = useLiveQuery(() => db.assets.toArray());
  const expenses = useLiveQuery(() => db.expenses.toArray());
  const categories = useLiveQuery(() => db.categories.toArray());

  const [sortField, setSortField] = useState<SortField>(() => {
    if (typeof window !== "undefined") {
      return (localStorage.getItem("sort-field") as SortField) || "date";
    }
    return "date";
  });
  const [sortDirection, setSortDirection] = useState<SortDirection>(() => {
    if (typeof window !== "undefined") {
      return (localStorage.getItem("sort-direction") as SortDirection) || "desc";
    }
    return "desc";
  });
  const [viewMode, setViewMode] = useState<ViewMode>(() => {
    if (typeof window !== "undefined") {
      return (localStorage.getItem("view-mode") as ViewMode) || "card";
    }
    return "card";
  });

  // Compute asset stats
  const assetsWithStats = useMemo<AssetWithStats[] | undefined>(() => {
    if (!assets || !expenses || !categories) return undefined;

    const expensesByAsset = new Map<string, typeof expenses>();
    for (const e of expenses) {
      const arr = expensesByAsset.get(e.assetId) ?? [];
      arr.push(e);
      expensesByAsset.set(e.assetId, arr);
    }

    const catMap = new Map(categories.map((c) => [c.id, c]));

    return assets.map((asset) => {
      const assetExpenses = expensesByAsset.get(asset.id) ?? [];
      const stats = computeAssetStats(assetExpenses);
      const cat = catMap.get(asset.categoryId);
      const subcat = asset.subcategoryId
        ? catMap.get(asset.subcategoryId)
        : null;

      return {
        id: asset.id,
        name: asset.name,
        categoryId: asset.categoryId,
        subcategoryId: asset.subcategoryId,
        categoryName: cat?.name ?? "未分类",
        categoryEmoji: cat?.emoji ?? "📦",
        subcategoryName: subcat?.name ?? null,
        notes: asset.notes,
        createdAt: asset.createdAt,
        holdingDays: stats.holdingDays,
        totalCost: stats.totalExpenses,
        dailyCost: stats.dailyCost,
        netCost: stats.netCost,
        totalSaleIncome: stats.totalSaleIncome,
      };
    });
  }, [assets, expenses, categories]);

  const { query, setQuery, results } = useAssetSearch(assetsWithStats);

  // Sort results
  const sortedResults = useMemo(() => {
    if (!results) return [];
    const sorted = [...results].sort((a, b) => {
      let cmp = 0;
      switch (sortField) {
        case "date":
          cmp =
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
          break;
        case "name":
          cmp = a.name.localeCompare(b.name, "zh-CN");
          break;
        case "totalCost":
          cmp = a.netCost - b.netCost;
          break;
        case "dailyCost":
          cmp = a.dailyCost - b.dailyCost;
          break;
      }
      return sortDirection === "asc" ? cmp : -cmp;
    });
    return sorted;
  }, [results, sortField, sortDirection]);

  // Global summary
  const globalSummary = useMemo(() => {
    if (!assetsWithStats) return { totalNetCost: 0, totalDailyCost: 0, assetCount: 0 };
    return {
      totalNetCost: assetsWithStats.reduce((sum, a) => sum + a.netCost, 0),
      totalDailyCost: assetsWithStats.reduce((sum, a) => sum + a.dailyCost, 0),
      assetCount: assetsWithStats.length,
    };
  }, [assetsWithStats]);

  const handleSortFieldChange = useCallback((field: SortField) => {
    setSortField(field);
    localStorage.setItem("sort-field", field);
  }, []);

  const handleSortDirectionToggle = useCallback(() => {
    setSortDirection((prev) => {
      const next = prev === "asc" ? "desc" : "asc";
      localStorage.setItem("sort-direction", next);
      return next;
    });
  }, []);

  const handleViewModeChange = useCallback((mode: ViewMode) => {
    setViewMode(mode);
    localStorage.setItem("view-mode", mode);
  }, []);

  if (!assetsWithStats) {
    return (
      <AppShell>
        <PageHeader title="我的资产" />
        <div className="flex items-center justify-center py-12 text-muted-foreground">
          加载中...
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <PageHeader title="我的资产" />
      <div className="mx-auto max-w-2xl space-y-4 p-4">
        {/* Summary */}
        <AssetSummary
          totalNetCost={globalSummary.totalNetCost}
          totalDailyCost={globalSummary.totalDailyCost}
          assetCount={globalSummary.assetCount}
        />

        {/* Toolbar */}
        <div className="flex items-center gap-2">
          <SearchBar value={query} onChange={setQuery} />
          <SortSelector
            field={sortField}
            direction={sortDirection}
            onFieldChange={handleSortFieldChange}
            onDirectionToggle={handleSortDirectionToggle}
          />
          <ViewToggle mode={viewMode} onChange={handleViewModeChange} />
          <ShareTotalButton assets={assetsWithStats} summary={globalSummary} />
        </div>

        {/* Asset List */}
        <AssetList assets={sortedResults} viewMode={viewMode} />
      </div>
    </AppShell>
  );
}
