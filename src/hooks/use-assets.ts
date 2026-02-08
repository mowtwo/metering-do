"use client";

import { useLiveQuery } from "dexie-react-hooks";
import { db, type Asset } from "@/lib/db";
import { generateId } from "@/lib/id";

export function useAssets() {
  const assets = useLiveQuery(() => db.assets.toArray());

  async function createAssetWithInitialExpense(
    assetData: {
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
  ) {
    const assetId = generateId();
    const now = new Date();

    await db.transaction("rw", [db.assets, db.expenses], async () => {
      await db.assets.add({
        id: assetId,
        ...assetData,
        createdAt: now,
        updatedAt: now,
      });

      await db.expenses.add({
        id: generateId(),
        assetId,
        type: "initial",
        name: initialExpense.name,
        amount: initialExpense.amount,
        date: initialExpense.date,
        recurringInterval: null,
        recurringEndDate: null,
        notes: initialExpense.notes,
        createdAt: now,
      });
    });

    return assetId;
  }

  async function updateAsset(
    id: string,
    data: Partial<Pick<Asset, "name" | "categoryId" | "subcategoryId" | "notes">>
  ) {
    return db.assets.update(id, { ...data, updatedAt: new Date() });
  }

  async function deleteAsset(id: string) {
    await db.transaction("rw", [db.assets, db.expenses], async () => {
      await db.expenses.where("assetId").equals(id).delete();
      await db.assets.delete(id);
    });
  }

  return { assets, createAssetWithInitialExpense, updateAsset, deleteAsset };
}

export function useAsset(id: string) {
  return useLiveQuery(() => db.assets.get(id), [id]);
}
