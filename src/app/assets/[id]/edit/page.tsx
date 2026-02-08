"use client";

import { use, useState } from "react";
import { useRouter } from "next/navigation";
import { AppShell } from "@/components/layout/app-shell";
import { PageHeader } from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { CategoryPicker } from "@/components/categories/category-picker";
import { useAsset, useAssets } from "@/hooks/use-assets";
import { useExpenses } from "@/hooks/use-expenses";
import { toast } from "sonner";
import { format } from "date-fns";

export default function EditAssetPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const asset = useAsset(id);
  const { updateAsset } = useAssets();
  const { expenses, updateExpense } = useExpenses(id);

  const initialExpense = expenses?.find((e) => e.type === "initial") ?? null;

  if (asset === undefined) {
    return (
      <AppShell>
        <PageHeader title="加载中..." showBack />
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

  return (
    <AppShell>
      <PageHeader title="编辑资产" showBack />
      <div className="mx-auto max-w-lg p-4">
        <EditForm
          initialData={asset}
          initialExpenseDate={initialExpense?.date ?? null}
          onSubmit={async (data) => {
            await updateAsset(id, {
              name: data.name,
              categoryId: data.categoryId,
              subcategoryId: data.subcategoryId,
              notes: data.notes,
            });
            if (data.purchaseDate && initialExpense) {
              await updateExpense(initialExpense.id, { date: data.purchaseDate });
            }
            toast.success("资产已更新");
            router.push(`/assets/${id}`);
          }}
        />
      </div>
    </AppShell>
  );
}

function EditForm({
  initialData,
  initialExpenseDate,
  onSubmit,
}: {
  initialData: {
    name: string;
    categoryId: string;
    subcategoryId: string | null;
    notes: string;
  };
  initialExpenseDate: Date | null;
  onSubmit: (data: {
    name: string;
    categoryId: string;
    subcategoryId: string | null;
    notes: string;
    purchaseDate?: Date;
  }) => void;
}) {
  const [name, setName] = useState(initialData.name);
  const [categoryId, setCategoryId] = useState(initialData.categoryId);
  const [subcategoryId, setSubcategoryId] = useState(
    initialData.subcategoryId
  );
  const [notes, setNotes] = useState(initialData.notes);
  const [purchaseDate, setPurchaseDate] = useState(
    initialExpenseDate ? format(initialExpenseDate, "yyyy-MM-dd") : ""
  );

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || !categoryId) return;
    onSubmit({
      name: name.trim(),
      categoryId,
      subcategoryId,
      notes: notes.trim(),
      purchaseDate: purchaseDate ? new Date(purchaseDate) : undefined,
    });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="asset-name" className="mb-2 block">资产名称</Label>
        <Input
          id="asset-name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          autoFocus
        />
      </div>

      <CategoryPicker
        categoryId={categoryId}
        subcategoryId={subcategoryId}
        onCategoryChange={setCategoryId}
        onSubcategoryChange={setSubcategoryId}
      />

      {initialExpenseDate && (
        <div>
          <Label htmlFor="purchase-date" className="mb-2 block">购入日期</Label>
          <Input
            id="purchase-date"
            type="date"
            value={purchaseDate}
            onChange={(e) => setPurchaseDate(e.target.value)}
          />
        </div>
      )}

      <div>
        <Label htmlFor="asset-notes" className="mb-2 block">备注</Label>
        <Textarea
          id="asset-notes"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={2}
        />
      </div>

      <Button
        type="submit"
        className="w-full"
        disabled={!name.trim() || !categoryId}
      >
        保存
      </Button>
    </form>
  );
}
