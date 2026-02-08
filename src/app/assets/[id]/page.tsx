"use client";

import { use } from "react";
import { useRouter } from "next/navigation";
import { AppShell } from "@/components/layout/app-shell";
import { PageHeader } from "@/components/layout/page-header";
import { Card, CardContent } from "@/components/ui/card";
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
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { ExpenseList } from "@/components/expenses/expense-list";
import { useAsset, useAssets } from "@/hooks/use-assets";
import { useExpenses } from "@/hooks/use-expenses";
import { useAssetStats } from "@/hooks/use-asset-stats";
import { useCategories } from "@/hooks/use-categories";
import { formatCurrency, formatDays, formatDate } from "@/lib/format";
import { toast } from "sonner";

export default function AssetDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const asset = useAsset(id);
  const { deleteAsset } = useAssets();
  const { expenses } = useExpenses(id);
  const stats = useAssetStats(expenses);
  const { getCategoryById } = useCategories();

  if (asset === undefined) {
    return (
      <AppShell>
        <PageHeader title="加载中..." showBack />
        <div className="flex items-center justify-center py-12 text-muted-foreground">
          加载中...
        </div>
      </AppShell>
    );
  }

  if (!asset) {
    return (
      <AppShell>
        <PageHeader title="未找到" showBack />
        <div className="flex items-center justify-center py-12 text-muted-foreground">
          资产不存在
        </div>
      </AppShell>
    );
  }

  const category = getCategoryById(asset.categoryId);
  const subcategory = asset.subcategoryId
    ? getCategoryById(asset.subcategoryId)
    : null;

  async function handleDelete() {
    await deleteAsset(id);
    toast.success("资产已删除");
    router.push("/");
  }

  return (
    <AppShell>
      <PageHeader
        title={asset.name}
        showBack
        actions={
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => router.push(`/assets/${id}/edit`)}
            >
              编辑
            </Button>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="outline" size="sm" className="text-destructive">
                  删除
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>确认删除</AlertDialogTitle>
                  <AlertDialogDescription>
                    删除资产后，所有相关的费用记录也会被一并删除。此操作不可撤销。
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>取消</AlertDialogCancel>
                  <AlertDialogAction onClick={handleDelete}>
                    确认删除
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        }
      />

      <div className="mx-auto max-w-2xl space-y-4 p-4">
        {/* Asset Info */}
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <span className="text-3xl">{category?.emoji ?? "📦"}</span>
              <div>
                <div className="text-sm text-muted-foreground">
                  {category?.name ?? "未分类"}
                  {subcategory && ` / ${subcategory.name}`}
                </div>
                {asset.notes && (
                  <p className="mt-1 text-sm text-muted-foreground">
                    {asset.notes}
                  </p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stats */}
        {stats && (
          <Card>
            <CardContent className="p-4">
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                <div className="text-center">
                  <div className="text-xs text-muted-foreground">持有时间</div>
                  <div className="text-lg font-bold">
                    {formatDays(stats.holdingDays)}
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-xs text-muted-foreground">总支出</div>
                  <div className="text-lg font-bold">
                    {formatCurrency(stats.totalExpenses)}
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-xs text-muted-foreground">净费用</div>
                  <div className="text-lg font-bold">
                    {formatCurrency(stats.netCost)}
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-xs text-muted-foreground">每日成本</div>
                  <div className="text-lg font-bold">
                    {formatCurrency(stats.dailyCost)}
                  </div>
                </div>
              </div>
              {stats.totalSaleIncome > 0 && (
                <div className="mt-3 text-center text-sm text-green-600">
                  已回收: {formatCurrency(stats.totalSaleIncome)}
                </div>
              )}
              {stats.initialExpenseDate && (
                <div className="mt-2 text-center text-xs text-muted-foreground">
                  购入日期: {formatDate(stats.initialExpenseDate)}
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Expense Records */}
        <ExpenseList assetId={id} />
      </div>
    </AppShell>
  );
}
