"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
} from "@/components/ui/sheet";
import type { Expense, ExpenseType, RecurringInterval } from "@/lib/db";
import { EXPENSE_TYPE_LABELS, RECURRING_INTERVAL_LABELS } from "@/lib/constants";
import { format } from "date-fns";

interface ExpenseFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: {
    type: ExpenseType;
    name: string;
    amount: number;
    date: Date;
    notes: string;
    recurringInterval?: RecurringInterval | null;
    recurringEndDate?: Date | null;
  }) => void;
  editingExpense?: Expense | null;
  hasInitialExpense: boolean;
}

export function ExpenseForm({
  open,
  onOpenChange,
  onSubmit,
  editingExpense,
  hasInitialExpense,
}: ExpenseFormProps) {
  const [type, setType] = useState<ExpenseType>("one-time");
  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState(format(new Date(), "yyyy-MM-dd"));
  const [notes, setNotes] = useState("");
  const [recurringInterval, setRecurringInterval] =
    useState<RecurringInterval>("yearly");
  const [recurringEndDate, setRecurringEndDate] = useState("");

  useEffect(() => {
    if (editingExpense) {
      setType(editingExpense.type);
      setName(editingExpense.name);
      setAmount(String(editingExpense.amount));
      setDate(format(editingExpense.date, "yyyy-MM-dd"));
      setNotes(editingExpense.notes);
      if (editingExpense.recurringInterval) {
        setRecurringInterval(editingExpense.recurringInterval);
      }
      if (editingExpense.recurringEndDate) {
        setRecurringEndDate(format(editingExpense.recurringEndDate, "yyyy-MM-dd"));
      } else {
        setRecurringEndDate("");
      }
    } else {
      setType("one-time");
      setName("");
      setAmount("");
      setDate(format(new Date(), "yyyy-MM-dd"));
      setNotes("");
      setRecurringInterval("yearly");
      setRecurringEndDate("");
    }
  }, [editingExpense, open]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const parsedAmount = parseFloat(amount);
    if (!name.trim() || isNaN(parsedAmount)) return;

    onSubmit({
      type,
      name: name.trim(),
      amount: Math.abs(parsedAmount),
      date: new Date(date),
      notes: notes.trim(),
      recurringInterval: type === "recurring" ? recurringInterval : null,
      recurringEndDate:
        type === "recurring" && recurringEndDate
          ? new Date(recurringEndDate)
          : null,
    });

    onOpenChange(false);
  }

  const availableTypes = Object.entries(EXPENSE_TYPE_LABELS).filter(
    ([key]) => {
      if (key === "initial" && hasInitialExpense && editingExpense?.type !== "initial") {
        return false;
      }
      return true;
    }
  );

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="h-auto max-h-[85vh] overflow-y-auto">
        <SheetHeader>
          <SheetTitle>
            {editingExpense ? "编辑费用记录" : "添加费用记录"}
          </SheetTitle>
        </SheetHeader>
        <form onSubmit={handleSubmit} className="space-y-4 px-4 py-4">
          {/* Type */}
          {!editingExpense && (
            <div>
              <Label className="mb-2 block">类型</Label>
              <Select
                value={type}
                onValueChange={(v) => setType(v as ExpenseType)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {availableTypes.map(([key, label]) => (
                    <SelectItem key={key} value={key}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Name */}
          <div>
            <Label htmlFor="expense-name" className="mb-2 block">名称</Label>
            <Input
              id="expense-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={type === "sale" ? "卖出说明" : "费用名称"}
            />
          </div>

          {/* Amount */}
          <div>
            <Label htmlFor="expense-amount" className="mb-2 block">
              {type === "sale" ? "卖出金额" : "费用金额"}
            </Label>
            <Input
              id="expense-amount"
              type="number"
              step="0.01"
              min="0"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
            />
          </div>

          {/* Date */}
          <div>
            <Label htmlFor="expense-date" className="mb-2 block">
              {type === "recurring" ? "开始日期" : "日期"}
            </Label>
            <Input
              id="expense-date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>

          {/* Recurring fields */}
          {type === "recurring" && (
            <>
              <div>
                <Label className="mb-2 block">循环周期</Label>
                <Select
                  value={recurringInterval}
                  onValueChange={(v) =>
                    setRecurringInterval(v as RecurringInterval)
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(RECURRING_INTERVAL_LABELS).map(
                      ([key, label]) => (
                        <SelectItem key={key} value={key}>
                          {label}
                        </SelectItem>
                      )
                    )}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="expense-end-date" className="mb-2 block">
                  结束日期（可选，留空则持续至今）
                </Label>
                <Input
                  id="expense-end-date"
                  type="date"
                  value={recurringEndDate}
                  onChange={(e) => setRecurringEndDate(e.target.value)}
                />
              </div>
            </>
          )}

          {/* Notes */}
          <div>
            <Label htmlFor="expense-notes" className="mb-2 block">备注</Label>
            <Textarea
              id="expense-notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="可选备注"
              rows={2}
            />
          </div>

          <SheetFooter className="gap-2 px-0 sm:gap-0">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              取消
            </Button>
            <Button
              type="submit"
              disabled={!name.trim() || !amount || isNaN(parseFloat(amount))}
            >
              {editingExpense ? "保存" : "添加"}
            </Button>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  );
}
