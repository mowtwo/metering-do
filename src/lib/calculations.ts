import { type Expense } from "@/lib/db";
import { totalRecurringCost } from "./recurring";
import { differenceInDays, startOfDay } from "date-fns";

export interface AssetStats {
  initialExpenseDate: Date | null;
  holdingDays: number;
  totalExpenses: number;
  totalSaleIncome: number;
  netCost: number;
  dailyCost: number;
}

export function computeAssetStats(expenses: Expense[]): AssetStats {
  const today = startOfDay(new Date());
  const initial = expenses.find((e) => e.type === "initial");
  const initialDate = initial ? startOfDay(initial.date) : null;

  const holdingDays = initialDate
    ? Math.max(differenceInDays(today, initialDate), 1)
    : 1;

  let totalExpenses = 0;
  let totalSaleIncome = 0;

  for (const expense of expenses) {
    switch (expense.type) {
      case "initial":
      case "one-time":
        totalExpenses += expense.amount;
        break;
      case "recurring":
        totalExpenses += totalRecurringCost(expense, today);
        break;
      case "sale":
        totalSaleIncome += expense.amount;
        break;
    }
  }

  const netCost = totalExpenses - totalSaleIncome;
  const dailyCost = netCost / holdingDays;

  return {
    initialExpenseDate: initialDate,
    holdingDays,
    totalExpenses,
    totalSaleIncome,
    netCost,
    dailyCost,
  };
}

export function computeGlobalStats(allExpensesByAsset: Expense[][]): {
  totalNetCost: number;
  totalDailyCost: number;
  assetCount: number;
} {
  let totalNetCost = 0;
  let totalDailyCost = 0;

  for (const expenses of allExpensesByAsset) {
    const stats = computeAssetStats(expenses);
    totalNetCost += stats.netCost;
    totalDailyCost += stats.dailyCost;
  }

  return {
    totalNetCost,
    totalDailyCost,
    assetCount: allExpensesByAsset.length,
  };
}
