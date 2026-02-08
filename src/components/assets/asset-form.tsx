"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { CategoryPicker } from "@/components/categories/category-picker";
import { format } from "date-fns";

interface AssetFormProps {
  onSubmit: (
    asset: {
      name: string;
      categoryId: string;
      subcategoryId: string | null;
      notes: string;
    },
    initialExpense: {
      name: string;
      amount: number;
      date: Date;
      notes: string;
    }
  ) => void;
  isSubmitting?: boolean;
}

export function AssetForm({ onSubmit, isSubmitting }: AssetFormProps) {
  // Asset fields
  const [name, setName] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [subcategoryId, setSubcategoryId] = useState<string | null>(null);
  const [notes, setNotes] = useState("");

  // Initial expense fields
  const [expenseName, setExpenseName] = useState("购入费用");
  const [expenseAmount, setExpenseAmount] = useState("");
  const [expenseDate, setExpenseDate] = useState(
    format(new Date(), "yyyy-MM-dd")
  );
  const [expenseNotes, setExpenseNotes] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const parsedAmount = parseFloat(expenseAmount);
    if (!name.trim() || !categoryId || isNaN(parsedAmount)) return;

    onSubmit(
      {
        name: name.trim(),
        categoryId,
        subcategoryId,
        notes: notes.trim(),
      },
      {
        name: expenseName.trim() || "购入费用",
        amount: Math.abs(parsedAmount),
        date: new Date(expenseDate),
        notes: expenseNotes.trim(),
      }
    );
  }

  const isValid =
    name.trim() &&
    categoryId &&
    expenseAmount &&
    !isNaN(parseFloat(expenseAmount));

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Asset Details */}
      <div className="space-y-4">
        <h3 className="font-semibold">资产信息</h3>

        <div>
          <Label htmlFor="asset-name" className="mb-2 block">资产名称</Label>
          <Input
            id="asset-name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="例如：MacBook Pro 14"
            autoFocus
          />
        </div>

        <CategoryPicker
          categoryId={categoryId}
          subcategoryId={subcategoryId}
          onCategoryChange={setCategoryId}
          onSubcategoryChange={setSubcategoryId}
        />

        <div>
          <Label htmlFor="asset-notes" className="mb-2 block">备注</Label>
          <Textarea
            id="asset-notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="可选备注"
            rows={2}
          />
        </div>
      </div>

      <Separator />

      {/* Initial Expense */}
      <div className="space-y-4">
        <h3 className="font-semibold">初始费用</h3>
        <p className="text-sm text-muted-foreground">
          登记该资产的初始购入或获取费用
        </p>

        <div>
          <Label htmlFor="expense-name" className="mb-2 block">费用名称</Label>
          <Input
            id="expense-name"
            value={expenseName}
            onChange={(e) => setExpenseName(e.target.value)}
            placeholder="购入费用"
          />
        </div>

        <div>
          <Label htmlFor="expense-amount" className="mb-2 block">金额</Label>
          <Input
            id="expense-amount"
            type="number"
            step="0.01"
            min="0"
            value={expenseAmount}
            onChange={(e) => setExpenseAmount(e.target.value)}
            placeholder="0.00"
          />
        </div>

        <div>
          <Label htmlFor="expense-date" className="mb-2 block">购入日期</Label>
          <Input
            id="expense-date"
            type="date"
            value={expenseDate}
            onChange={(e) => setExpenseDate(e.target.value)}
          />
        </div>

        <div>
          <Label htmlFor="expense-notes" className="mb-2 block">备注</Label>
          <Textarea
            id="expense-notes"
            value={expenseNotes}
            onChange={(e) => setExpenseNotes(e.target.value)}
            placeholder="可选备注"
            rows={2}
          />
        </div>
      </div>

      <Button type="submit" className="w-full" disabled={!isValid || isSubmitting}>
        {isSubmitting ? "创建中..." : "创建资产"}
      </Button>
    </form>
  );
}
