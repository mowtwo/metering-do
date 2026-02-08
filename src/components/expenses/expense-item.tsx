"use client";

import { type Expense } from "@/lib/db";
import { formatCurrency, formatDate } from "@/lib/format";
import { EXPENSE_TYPE_LABELS } from "@/lib/constants";
import { Badge } from "@/components/ui/badge";
import { RecurringBadge } from "./recurring-badge";
import { countOccurrences, totalRecurringCost } from "@/lib/recurring";
import { Button } from "@/components/ui/button";

interface ExpenseItemProps {
  expense: Expense;
  onEdit: (expense: Expense) => void;
  onDelete: (id: string) => void;
}

export function ExpenseItem({ expense, onEdit, onDelete }: ExpenseItemProps) {
  const isRecurring = expense.type === "recurring" && expense.recurringInterval;
  const isSale = expense.type === "sale";
  const occurrences = isRecurring ? countOccurrences(expense) : 0;
  const totalCost = isRecurring
    ? totalRecurringCost(expense)
    : expense.amount;

  return (
    <div className="flex items-start gap-3 rounded-lg border p-3">
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="font-medium truncate">{expense.name}</span>
          <Badge
            variant={expense.type === "initial" ? "default" : "outline"}
            className="text-xs shrink-0"
          >
            {EXPENSE_TYPE_LABELS[expense.type]}
          </Badge>
          {isRecurring && expense.recurringInterval && (
            <RecurringBadge interval={expense.recurringInterval} />
          )}
        </div>
        <div className="mt-1 flex items-center gap-3 text-sm text-muted-foreground">
          <span>{formatDate(expense.date)}</span>
          {isRecurring && (
            <span>已产生 {occurrences} 次</span>
          )}
        </div>
        {expense.notes && (
          <p className="mt-1 text-sm text-muted-foreground truncate">
            {expense.notes}
          </p>
        )}
      </div>
      <div className="text-right shrink-0">
        <div
          className={`font-semibold ${
            isSale ? "text-green-600" : "text-foreground"
          }`}
        >
          {isSale ? "+" : "-"}
          {formatCurrency(isSale ? expense.amount : totalCost)}
        </div>
        {isRecurring && (
          <div className="text-xs text-muted-foreground">
            单次 {formatCurrency(expense.amount)}
          </div>
        )}
      </div>
      <div className="flex flex-col gap-1 shrink-0">
        <Button
          variant="ghost"
          size="sm"
          className="h-7 text-xs"
          onClick={() => onEdit(expense)}
        >
          编辑
        </Button>
        {expense.type !== "initial" && (
          <Button
            variant="ghost"
            size="sm"
            className="h-7 text-xs text-destructive"
            onClick={() => onDelete(expense.id)}
          >
            删除
          </Button>
        )}
      </div>
    </div>
  );
}
