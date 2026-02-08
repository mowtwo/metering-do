"use client";

import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { shareImage, downloadImage } from "@/lib/share/share-utils";
import { toast } from "sonner";

interface SharePreviewDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  canvas: HTMLCanvasElement | null;
  title: string;
  generating: boolean;
}

export function SharePreviewDialog({
  open,
  onOpenChange,
  canvas,
  title,
  generating,
}: SharePreviewDialogProps) {
  const [imgSrc, setImgSrc] = useState<string | null>(null);
  const [canShare, setCanShare] = useState(false);

  useEffect(() => {
    if (canvas) {
      setImgSrc(canvas.toDataURL("image/png"));
    } else {
      setImgSrc(null);
    }
  }, [canvas]);

  useEffect(() => {
    if (typeof navigator !== "undefined" && navigator.canShare) {
      const testFile = new File([""], "test.png", { type: "image/png" });
      setCanShare(navigator.canShare({ files: [testFile] }));
    }
  }, []);

  async function handleShare() {
    if (!canvas) return;
    try {
      await shareImage(canvas, title);
    } catch (err) {
      if (err instanceof Error && err.name !== "AbortError") {
        toast.error("分享失败");
      }
    }
  }

  function handleDownload() {
    if (!canvas) return;
    downloadImage(canvas, "metering-do-share.png");
    toast.success("图片已保存");
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>分享</DialogTitle>
        </DialogHeader>

        <div className="flex items-center justify-center py-2">
          {generating ? (
            <div className="flex h-48 items-center justify-center text-muted-foreground">
              生成中...
            </div>
          ) : imgSrc ? (
            <img
              src={imgSrc}
              alt={title}
              className="w-full rounded-md border"
            />
          ) : null}
        </div>

        <DialogFooter className="flex-row gap-2 sm:justify-center">
          {canShare && (
            <Button onClick={handleShare} disabled={generating || !canvas}>
              分享
            </Button>
          )}
          <Button
            variant="outline"
            onClick={handleDownload}
            disabled={generating || !canvas}
          >
            保存图片
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
