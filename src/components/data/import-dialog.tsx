"use client";

import { useState, useRef } from "react";
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
} from "@/components/ui/alert-dialog";
import { importAllData } from "@/lib/import-export";
import { toast } from "sonner";

export function ImportDialog() {
  const [showConfirm, setShowConfirm] = useState(false);
  const [fileContent, setFileContent] = useState<string | null>(null);
  const [importing, setImporting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (ev) => {
      const content = ev.target?.result as string;
      setFileContent(content);
      setShowConfirm(true);
    };
    reader.readAsText(file);

    e.target.value = "";
  }

  async function handleImport() {
    if (!fileContent) return;
    setImporting(true);
    try {
      const result = await importAllData(fileContent);
      toast.success(
        `导入成功：${result.categories} 个分类，${result.assets} 个资产，${result.expenses} 条费用记录`
      );
      // Reload to apply imported skin preference
      setTimeout(() => window.location.reload(), 500);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "导入失败");
    } finally {
      setImporting(false);
      setShowConfirm(false);
      setFileContent(null);
    }
  }

  return (
    <>
      <input
        ref={fileInputRef}
        type="file"
        accept=".json"
        className="hidden"
        onChange={handleFileSelect}
      />
      <Button
        variant="outline"
        className="w-full"
        onClick={() => fileInputRef.current?.click()}
      >
        导入数据 (JSON)
      </Button>

      <AlertDialog open={showConfirm} onOpenChange={setShowConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>确认导入</AlertDialogTitle>
            <AlertDialogDescription>
              导入将会覆盖当前所有数据（分类、资产、费用记录）。此操作不可撤销，建议先导出备份。
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={importing}>取消</AlertDialogCancel>
            <AlertDialogAction onClick={handleImport} disabled={importing}>
              {importing ? "导入中..." : "确认导入"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
