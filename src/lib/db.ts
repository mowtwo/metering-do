import Dexie, { type EntityTable } from "dexie";

export type ExpenseType = "initial" | "one-time" | "recurring" | "sale";
export type RecurringInterval = "daily" | "monthly" | "yearly";

export interface Category {
  id: string;
  name: string;
  emoji: string;
  parentId: string | null;
  sortOrder: number;
  createdAt: Date;
}

export interface Asset {
  id: string;
  name: string;
  categoryId: string;
  subcategoryId: string | null;
  notes: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Expense {
  id: string;
  assetId: string;
  type: ExpenseType;
  name: string;
  amount: number;
  date: Date;
  recurringInterval: RecurringInterval | null;
  recurringEndDate: Date | null;
  notes: string;
  createdAt: Date;
}

export const db = new Dexie("metering-do") as Dexie & {
  categories: EntityTable<Category, "id">;
  assets: EntityTable<Asset, "id">;
  expenses: EntityTable<Expense, "id">;
};

db.version(1).stores({
  categories: "id, parentId, sortOrder, name",
  assets: "id, categoryId, subcategoryId, name, createdAt",
  expenses: "id, assetId, type, date, amount",
});
