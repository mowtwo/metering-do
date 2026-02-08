"use client";

import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { formatCurrency, formatDays } from "@/lib/format";
import type { AssetWithStats } from "@/types";

interface AssetCardProps {
  asset: AssetWithStats;
}

export function AssetCard({ asset }: AssetCardProps) {
  return (
    <Link href={`/assets/${asset.id}`}>
      <Card className="transition-colors hover:bg-accent/50">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <span className="text-3xl">{asset.categoryEmoji}</span>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold truncate">{asset.name}</h3>
              <p className="text-sm text-muted-foreground">
                {asset.categoryName}
                {asset.subcategoryName && ` / ${asset.subcategoryName}`}
              </p>
            </div>
          </div>
          <div className="mt-3 grid grid-cols-3 gap-2 text-center">
            <div>
              <div className="text-xs text-muted-foreground">总费用</div>
              <div className="text-sm font-semibold">
                {formatCurrency(asset.netCost)}
              </div>
            </div>
            <div>
              <div className="text-xs text-muted-foreground">每日成本</div>
              <div className="text-sm font-semibold">
                {formatCurrency(asset.dailyCost)}
              </div>
            </div>
            <div>
              <div className="text-xs text-muted-foreground">持有时间</div>
              <div className="text-sm font-semibold">
                {formatDays(asset.holdingDays)}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
