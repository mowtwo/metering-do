"use client";

import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { SharePreviewDialog } from "./share-preview-dialog";
import { useSkin } from "@/components/skin-provider";
import {
  renderAssetShareImage,
  type AssetShareData,
} from "@/lib/share/render-asset";
import type { AssetStats } from "@/lib/calculations";

interface ShareAssetButtonProps {
  name: string;
  categoryEmoji: string;
  categoryName: string;
  subcategoryName: string | null;
  notes: string;
  stats: AssetStats;
}

export function ShareAssetButton({
  name,
  categoryEmoji,
  categoryName,
  subcategoryName,
  notes,
  stats,
}: ShareAssetButtonProps) {
  const { skin } = useSkin();
  const [open, setOpen] = useState(false);
  const [canvas, setCanvas] = useState<HTMLCanvasElement | null>(null);
  const [generating, setGenerating] = useState(false);

  const handleOpen = useCallback(async () => {
    setOpen(true);
    setGenerating(true);
    setCanvas(null);

    try {
      const data: AssetShareData = {
        name,
        categoryEmoji,
        categoryName,
        subcategoryName,
        notes,
        stats,
      };
      const result = await renderAssetShareImage(data, skin);
      setCanvas(result);
    } catch {
      setCanvas(null);
    } finally {
      setGenerating(false);
    }
  }, [name, categoryEmoji, categoryName, subcategoryName, notes, stats, skin]);

  return (
    <>
      <Button variant="outline" size="sm" onClick={handleOpen}>
        分享
      </Button>
      <SharePreviewDialog
        open={open}
        onOpenChange={setOpen}
        canvas={canvas}
        title={name}
        generating={generating}
      />
    </>
  );
}
