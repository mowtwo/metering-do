"use client";

import { useState } from "react";
import { type Expense } from "@/lib/db";
import { ExpenseItem } from "./expense-item";
import { ExpenseForm } from "./expense-form";
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
import { useExpenses } from "@/hooks/use-expenses";
import { toast } from "sonner";

interface ExpenseListProps {
  assetId: string;
}

export function ExpenseList({ assetId }: ExpenseListProps) {
  const { expenses, hasInitialExpense, createExpense, updateExpense, deleteExpense } =
    useExpenses(assetId);
  const [showForm, setShowForm] = useState(false);
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  if (!expenses) return null;

  // Sort: initial first, then by date descending
  const sorted = [...expenses].sort((a, b) => {
    if (a.type === "initial") return -1;
    if (b.type === "initial") return 1;
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  });

  async function handleSubmit(data: Parameters<typeof createExpense>[0]) {
    try {
      if (editingExpense) {
        await updateExpense(editingExpense.id, data);
        toast.success("费用记录已更新");
      } else {
        await createExpense(data);
        toast.success("费用记录已添加");
      }
      setEditingExpense(null);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "操作失败");
    }
  }

  async function handleDelete() {
    if (!deletingId) return;
    await deleteExpense(deletingId);
    setDeletingId(null);
    toast.success("费用记录已删除");
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold">费用记录</h3>
        <Button size="sm" onClick={() => setShowForm(true)}>
          + 添加
        </Button>
      </div>

      {sorted.length === 0 ? (
        <div className="py-8 text-center text-muted-foreground">
          暂无费用记录
        </div>
      ) : (
        <div className="space-y-2">
          {sorted.map((expense) => (
            <ExpenseItem
              key={expense.id}
              expense={expense}
              onEdit={(e) => {
                setEditingExpense(e);
                setShowForm(true);
              }}
              onDelete={setDeletingId}
            />
          ))}
        </div>
      )}

      <ExpenseForm
        open={showForm}
        onOpenChange={(open) => {
          setShowForm(open);
          if (!open) setEditingExpense(null);
        }}
        onSubmit={handleSubmit}
        editingExpense={editingExpense}
        hasInitialExpense={hasInitialExpense}
      />

      <AlertDialog
        open={!!deletingId}
        onOpenChange={(open) => {
          if (!open) setDeletingId(null);
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>确认删除</AlertDialogTitle>
            <AlertDialogDescription>
              确定要删除这条费用记录吗？此操作不可撤销。
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>取消</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>确认删除</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
