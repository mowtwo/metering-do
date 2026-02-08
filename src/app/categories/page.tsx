"use client";

import { AppShell } from "@/components/layout/app-shell";
import { PageHeader } from "@/components/layout/page-header";
import { CategoryList } from "@/components/categories/category-list";

export default function CategoriesPage() {
  return (
    <AppShell>
      <PageHeader title="分类管理" />
      <div className="p-4">
        <CategoryList />
      </div>
    </AppShell>
  );
}
