"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AppShell } from "@/components/layout/app-shell";
import { PageHeader } from "@/components/layout/page-header";
import { AssetForm } from "@/components/assets/asset-form";
import { useAssets } from "@/hooks/use-assets";
import { toast } from "sonner";

export default function NewAssetPage() {
  const router = useRouter();
  const { createAssetWithInitialExpense } = useAssets();
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(
    assetData: Parameters<typeof createAssetWithInitialExpense>[0],
    initialExpense: Parameters<typeof createAssetWithInitialExpense>[1]
  ) {
    setIsSubmitting(true);
    try {
      const assetId = await createAssetWithInitialExpense(
        assetData,
        initialExpense
      );
      toast.success("资产已创建");
      router.push(`/assets/${assetId}`);
    } catch {
      toast.error("创建失败");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <AppShell>
      <PageHeader title="新增资产" showBack />
      <div className="mx-auto max-w-lg p-4">
        <AssetForm onSubmit={handleSubmit} isSubmitting={isSubmitting} />
      </div>
    </AppShell>
  );
}
