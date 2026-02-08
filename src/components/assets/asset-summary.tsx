"use client";

import { Card, CardContent } from "@/components/ui/card";
import { formatCurrency } from "@/lib/format";

interface AssetSummaryProps {
  totalNetCost: number;
  totalDailyCost: number;
  assetCount: number;
}

export function AssetSummary({
  totalNetCost,
  totalDailyCost,
  assetCount,
}: AssetSummaryProps) {
  return (
    <Card>
      <CardContent className="p-4">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-xs text-muted-foreground">资产数量</div>
            <div className="text-lg font-bold">{assetCount}</div>
          </div>
          <div>
            <div className="text-xs text-muted-foreground">总费用</div>
            <div className="text-lg font-bold">{formatCurrency(totalNetCost)}</div>
          </div>
          <div>
            <div className="text-xs text-muted-foreground">每日总成本</div>
            <div className="text-lg font-bold">
              {formatCurrency(totalDailyCost)}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
