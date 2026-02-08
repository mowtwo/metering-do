"use client";

import { useState } from "react";
import { AppShell } from "@/components/layout/app-shell";
import { PageHeader } from "@/components/layout/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { ExportButton } from "@/components/data/export-button";
import { ImportDialog } from "@/components/data/import-dialog";
import { CloudSyncCard } from "@/components/settings/cloud-sync-card";
import { SkinPicker } from "@/components/settings/skin-picker";
import { db } from "@/lib/db";
import { toast } from "sonner";

export default function SettingsPage() {
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  async function handleClearAll() {
    await db.transaction("rw", [db.categories, db.assets, db.expenses], async () => {
      await db.categories.clear();
      await db.assets.clear();
      await db.expenses.clear();
    });
    setShowClearConfirm(false);
    toast.success("所有数据已清除");
    window.location.reload();
  }

  return (
    <AppShell>
      <PageHeader title="设置" />
      <div className="mx-auto max-w-lg space-y-4 p-4">
        <CloudSyncCard />

        <Card>
          <CardHeader>
            <CardTitle className="text-base">数据管理</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <ExportButton />
            <ImportDialog />
          </CardContent>
        </Card>

        <SkinPicker />

        <Card>
          <CardHeader>
            <CardTitle className="text-base">关于</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground space-y-1">
            <p>Metering Do 个人资产费用追踪</p>
            <p>所有数据存储在浏览器本地 (IndexedDB)</p>
            <p>版本 1.0.0</p>
          </CardContent>
        </Card>

        <Separator />

        <Card className="border-destructive/50">
          <CardHeader>
            <CardTitle className="text-base text-destructive">危险操作</CardTitle>
          </CardHeader>
          <CardContent>
            <Button
              variant="destructive"
              className="w-full"
              onClick={() => setShowClearConfirm(true)}
            >
              清除所有数据
            </Button>
          </CardContent>
        </Card>
      </div>

      <AlertDialog open={showClearConfirm} onOpenChange={setShowClearConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>确认清除所有数据</AlertDialogTitle>
            <AlertDialogDescription>
              这将永久删除所有分类、资产和费用记录。建议先导出备份。此操作不可撤销。
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>取消</AlertDialogCancel>
            <AlertDialogAction onClick={handleClearAll}>确认清除</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AppShell>
  );
}
