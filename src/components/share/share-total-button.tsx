"use client";

import { useState, useCallback } from "react";
import { Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SharePreviewDialog } from "./share-preview-dialog";
import { useSkin } from "@/components/skin-provider";
import {
  renderTotalShareImage,
  type TotalShareData,
} from "@/lib/share/render-total";
import type { AssetWithStats } from "@/types";

interface ShareTotalButtonProps {
  assets: AssetWithStats[];
  summary: {
    totalNetCost: number;
    totalDailyCost: number;
    assetCount: number;
  };
}

export function ShareTotalButton({ assets, summary }: ShareTotalButtonProps) {
  const { skin } = useSkin();
  const [open, setOpen] = useState(false);
  const [canvas, setCanvas] = useState<HTMLCanvasElement | null>(null);
  const [generating, setGenerating] = useState(false);

  const handleOpen = useCallback(async () => {
    setOpen(true);
    setGenerating(true);
    setCanvas(null);

    try {
      const data: TotalShareData = { assets, summary };
      const result = await renderTotalShareImage(data, skin);
      setCanvas(result);
    } catch {
      setCanvas(null);
    } finally {
      setGenerating(false);
    }
  }, [assets, summary, skin]);

  return (
    <>
      <Button
        variant="outline"
        size="icon"
        className="h-9 w-9 shrink-0"
        onClick={handleOpen}
        title="分享总资产"
      >
        <Share2 className="h-4 w-4" />
      </Button>
      <SharePreviewDialog
        open={open}
        onOpenChange={setOpen}
        canvas={canvas}
        title="我的资产总览"
        generating={generating}
      />
    </>
  );
}
