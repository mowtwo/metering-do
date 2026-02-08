"use client";

import type { AssetWithStats } from "@/types";
import type { ViewMode } from "@/types";
import { AssetCard } from "./asset-card";
import { AssetListItem } from "./asset-list-item";

interface AssetListProps {
  assets: AssetWithStats[];
  viewMode: ViewMode;
}

export function AssetList({ assets, viewMode }: AssetListProps) {
  if (assets.length === 0) {
    return (
      <div className="py-12 text-center text-muted-foreground">
        <p className="text-4xl mb-3">📦</p>
        <p>暂无资产</p>
        <p className="text-sm mt-1">点击"新增"来添加你的第一个资产</p>
      </div>
    );
  }

  if (viewMode === "card") {
    return (
      <div className="grid gap-3 sm:grid-cols-2">
        {assets.map((asset) => (
          <AssetCard key={asset.id} asset={asset} />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {assets.map((asset) => (
        <AssetListItem key={asset.id} asset={asset} />
      ))}
    </div>
  );
}
