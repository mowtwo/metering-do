"use client";

import Link from "next/link";
import { formatCurrency, formatDays } from "@/lib/format";
import type { AssetWithStats } from "@/types";

interface AssetListItemProps {
  asset: AssetWithStats;
}

export function AssetListItem({ asset }: AssetListItemProps) {
  return (
    <Link href={`/assets/${asset.id}`}>
      <div className="flex items-center gap-3 rounded-lg border p-3 transition-colors hover:bg-accent/50">
        <span className="text-2xl shrink-0">{asset.categoryEmoji}</span>
        <div className="flex-1 min-w-0">
          <div className="font-medium truncate">{asset.name}</div>
          <div className="text-sm text-muted-foreground">
            {asset.categoryName}
            {asset.subcategoryName && ` / ${asset.subcategoryName}`}
            <span className="ml-2">{formatDays(asset.holdingDays)}</span>
          </div>
        </div>
        <div className="text-right shrink-0">
          <div className="font-semibold">{formatCurrency(asset.netCost)}</div>
          <div className="text-xs text-muted-foreground">
            {formatCurrency(asset.dailyCost)}/天
          </div>
        </div>
      </div>
    </Link>
  );
}
