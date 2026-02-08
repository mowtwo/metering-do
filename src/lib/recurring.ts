import { type Expense, type RecurringInterval } from "@/lib/db";
import { addDays, addMonths, addYears, startOfDay, isAfter } from "date-fns";

export interface RecurringOccurrence {
  date: Date;
  amount: number;
  sourceExpenseId: string;
}

const advanceFns: Record<RecurringInterval, (date: Date, count: number) => Date> = {
  daily: addDays,
  monthly: addMonths,
  yearly: addYears,
};

export function generateOccurrences(
  expense: Expense,
  upToDate: Date = new Date()
): RecurringOccurrence[] {
  if (expense.type !== "recurring" || !expense.recurringInterval) return [];

  const occurrences: RecurringOccurrence[] = [];
  const endDate = expense.recurringEndDate
    ? startOfDay(expense.recurringEndDate)
    : startOfDay(upToDate);

  const advance = advanceFns[expense.recurringInterval];
  let step = 0;

  while (true) {
    const current = advance(startOfDay(expense.date), step);
    if (isAfter(current, endDate)) break;
    occurrences.push({
      date: current,
      amount: expense.amount,
      sourceExpenseId: expense.id,
    });
    step++;
    // Safety cap for daily recurrences
    if (step > 36500) break; // ~100 years
  }

  return occurrences;
}

export function countOccurrences(
  expense: Expense,
  upToDate: Date = new Date()
): number {
  return generateOccurrences(expense, upToDate).length;
}

export function totalRecurringCost(
  expense: Expense,
  upToDate: Date = new Date()
): number {
  return countOccurrences(expense, upToDate) * expense.amount;
}
