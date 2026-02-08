"use client";

import { useLiveQuery } from "dexie-react-hooks";
import { db, type Expense, type ExpenseType, type RecurringInterval } from "@/lib/db";
import { generateId } from "@/lib/id";

export function useExpenses(assetId: string) {
  const expenses = useLiveQuery(
    () => db.expenses.where("assetId").equals(assetId).toArray(),
    [assetId]
  );

  const hasInitialExpense = expenses?.some((e) => e.type === "initial") ?? false;

  async function createExpense(data: {
    type: ExpenseType;
    name: string;
    amount: number;
    date: Date;
    notes: string;
    recurringInterval?: RecurringInterval | null;
    recurringEndDate?: Date | null;
  }) {
    if (data.type === "initial" && hasInitialExpense) {
      throw new Error("该资产已有初始费用记录");
    }

    return db.expenses.add({
      id: generateId(),
      assetId,
      type: data.type,
      name: data.name,
      amount: data.amount,
      date: data.date,
      recurringInterval: data.recurringInterval ?? null,
      recurringEndDate: data.recurringEndDate ?? null,
      notes: data.notes,
      createdAt: new Date(),
    });
  }

  async function updateExpense(
    id: string,
    data: Partial<Omit<Expense, "id" | "assetId" | "createdAt">>
  ) {
    return db.expenses.update(id, data);
  }

  async function deleteExpense(id: string) {
    return db.expenses.delete(id);
  }

  return {
    expenses,
    hasInitialExpense,
    createExpense,
    updateExpense,
    deleteExpense,
  };
}
