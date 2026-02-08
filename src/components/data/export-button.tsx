"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { exportAllData, downloadJson } from "@/lib/import-export";
import { toast } from "sonner";
import { format } from "date-fns";

export function ExportButton() {
  const [exporting, setExporting] = useState(false);

  async function handleExport() {
    setExporting(true);
    try {
      const json = await exportAllData();
      const filename = `metering-do-${format(new Date(), "yyyy-MM-dd")}.json`;
      downloadJson(json, filename);
      toast.success("数据已导出");
    } catch {
      toast.error("导出失败");
    } finally {
      setExporting(false);
    }
  }

  return (
    <Button
      variant="outline"
      className="w-full"
      onClick={handleExport}
      disabled={exporting}
    >
      {exporting ? "导出中..." : "导出数据 (JSON)"}
    </Button>
  );
}
