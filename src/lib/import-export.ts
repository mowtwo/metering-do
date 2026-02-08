import { db } from "./db";

/* eslint-disable @typescript-eslint/no-explicit-any */
interface ExportData {
  version: 1;
  exportedAt: string;
  categories: any[];
  assets: any[];
  expenses: any[];
}

export async function exportAllData(): Promise<string> {
  const [categories, assets, expenses] = await Promise.all([
    db.categories.toArray(),
    db.assets.toArray(),
    db.expenses.toArray(),
  ]);

  const data: ExportData = {
    version: 1,
    exportedAt: new Date().toISOString(),
    categories,
    assets,
    expenses,
  };

  return JSON.stringify(data, null, 2);
}

export async function importAllData(jsonString: string): Promise<{
  categories: number;
  assets: number;
  expenses: number;
}> {
  const data = JSON.parse(jsonString) as ExportData;

  if (data.version !== 1) {
    throw new Error(`不支持的版本: ${data.version}`);
  }

  if (!Array.isArray(data.categories) || !Array.isArray(data.assets) || !Array.isArray(data.expenses)) {
    throw new Error("数据格式无效");
  }

  await db.transaction("rw", [db.categories, db.assets, db.expenses], async () => {
    await db.categories.clear();
    await db.assets.clear();
    await db.expenses.clear();

    const categories = data.categories.map((c: any) => ({
      ...c,
      createdAt: new Date(c.createdAt),
    }));

    const assets = data.assets.map((a: any) => ({
      ...a,
      createdAt: new Date(a.createdAt),
      updatedAt: new Date(a.updatedAt),
    }));

    const expenses = data.expenses.map((e: any) => ({
      ...e,
      date: new Date(e.date),
      createdAt: new Date(e.createdAt),
      recurringEndDate: e.recurringEndDate
        ? new Date(e.recurringEndDate)
        : null,
    }));

    await db.categories.bulkAdd(categories);
    await db.assets.bulkAdd(assets);
    await db.expenses.bulkAdd(expenses);
  });

  return {
    categories: data.categories.length,
    assets: data.assets.length,
    expenses: data.expenses.length,
  };
}

export function downloadJson(jsonString: string, filename: string) {
  const blob = new Blob([jsonString], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
