export type ViewMode = "list" | "card";

export type SortField = "date" | "name" | "totalCost" | "dailyCost";
export type SortDirection = "asc" | "desc";

export interface SortOption {
  field: SortField;
  direction: SortDirection;
}

export interface AssetWithStats {
  id: string;
  name: string;
  categoryId: string;
  subcategoryId: string | null;
  categoryName: string;
  categoryEmoji: string;
  subcategoryName: string | null;
  notes: string;
  createdAt: Date;
  holdingDays: number;
  totalCost: number;
  dailyCost: number;
  netCost: number;
  totalSaleIncome: number;
}
