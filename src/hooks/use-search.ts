"use client";

import { useMemo, useState } from "react";
import Fuse from "fuse.js";
import type { AssetWithStats } from "@/types";

export function useAssetSearch(items: AssetWithStats[] | undefined) {
  const [query, setQuery] = useState("");

  const fuse = useMemo(() => {
    if (!items) return null;
    return new Fuse(items, {
      keys: [
        { name: "name", weight: 2 },
        { name: "categoryName", weight: 1 },
        { name: "subcategoryName", weight: 1 },
        { name: "notes", weight: 0.5 },
      ],
      threshold: 0.3,
      includeScore: true,
    });
  }, [items]);

  const results = useMemo(() => {
    if (!items) return [];
    if (!query.trim() || !fuse) return items;
    return fuse.search(query).map((r) => r.item);
  }, [query, fuse, items]);

  return { query, setQuery, results };
}
