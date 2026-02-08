"use client";

import { useState, useEffect } from "react";
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
import { LoginButton } from "@/components/auth/login-button";
import { UserAvatar } from "@/components/auth/user-avatar";
import { useAuth } from "@/hooks/use-auth";
import { exportAllData, importAllData } from "@/lib/import-export";
import { toast } from "sonner";
import { format } from "date-fns";
import { CloudUpload, CloudDownload, LogOut } from "lucide-react";
import type { BackupMetadata } from "@/lib/backup/types";

export function CloudSyncCard() {
  const { user, loading, login, logout, isLoggedIn } = useAuth();
  const [backupInfo, setBackupInfo] = useState<BackupMetadata | null>(null);
  const [loadingInfo, setLoadingInfo] = useState(false);
  const [backing, setBacking] = useState(false);
  const [restoring, setRestoring] = useState(false);
  const [showRestoreConfirm, setShowRestoreConfirm] = useState(false);

  useEffect(() => {
    if (!isLoggedIn) return;
    setLoadingInfo(true);
    fetch("/api/backup/info")
      .then((res) => res.json())
      .then((data) => setBackupInfo(data.info ?? null))
      .catch(() => {})
      .finally(() => setLoadingInfo(false));
  }, [isLoggedIn]);

  async function handleBackup() {
    setBacking(true);
    try {
      const data = await exportAllData();
      const res = await fetch("/api/backup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ data }),
      });
      const result = await res.json();
      if (!res.ok || !result.success) {
        throw new Error(result.error || "备份失败");
      }
      setBackupInfo(result.metadata ?? null);
      toast.success("备份成功");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "备份失败");
    } finally {
      setBacking(false);
    }
  }

  async function handleRestore() {
    setRestoring(true);
    try {
      const res = await fetch("/api/backup");
      const result = await res.json();
      if (!res.ok || !result.success) {
        throw new Error(result.error || "恢复失败");
      }
      const imported = await importAllData(result.data);
      toast.success(
        `恢复成功：${imported.categories} 个分类，${imported.assets} 个资产，${imported.expenses} 条费用记录`
      );
      setTimeout(() => window.location.reload(), 500);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "恢复失败");
    } finally {
      setRestoring(false);
      setShowRestoreConfirm(false);
    }
  }

  async function handleLogout() {
    await logout();
    setBackupInfo(null);
    toast.success("已退出登录");
  }

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-base">账户与云同步</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-10 animate-pulse rounded bg-muted" />
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="text-base">账户与云同步</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {!isLoggedIn ? (
            <LoginButton onLogin={login} />
          ) : (
            <>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <UserAvatar user={user!} />
                  <span className="text-sm font-medium">
                    {user!.name || user!.login}
                  </span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleLogout}
                  className="gap-1 text-muted-foreground"
                >
                  <LogOut className="h-3.5 w-3.5" />
                  退出
                </Button>
              </div>

              <Separator />

              <p className="text-xs text-muted-foreground">
                {loadingInfo
                  ? "正在获取备份信息..."
                  : backupInfo
                    ? `上次备份: ${format(new Date(backupInfo.updatedAt), "yyyy-MM-dd HH:mm")}`
                    : "暂无云端备份"}
              </p>

              <Button
                variant="outline"
                className="w-full gap-2"
                onClick={handleBackup}
                disabled={backing}
              >
                <CloudUpload className="h-4 w-4" />
                {backing ? "备份中..." : "备份到云端"}
              </Button>

              <Button
                variant="outline"
                className="w-full gap-2"
                onClick={() => setShowRestoreConfirm(true)}
                disabled={restoring || !backupInfo}
              >
                <CloudDownload className="h-4 w-4" />
                {restoring ? "恢复中..." : "从云端恢复"}
              </Button>
            </>
          )}
        </CardContent>
      </Card>

      <AlertDialog
        open={showRestoreConfirm}
        onOpenChange={setShowRestoreConfirm}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>确认从云端恢复</AlertDialogTitle>
            <AlertDialogDescription>
              恢复将会覆盖当前所有数据（分类、资产、费用记录）。此操作不可撤销，建议先导出备份。
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={restoring}>取消</AlertDialogCancel>
            <AlertDialogAction onClick={handleRestore} disabled={restoring}>
              {restoring ? "恢复中..." : "确认恢复"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
