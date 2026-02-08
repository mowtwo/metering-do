"use client";

import { useState, lazy, Suspense } from "react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

const EmojiPicker = lazy(() => import("@emoji-mart/react"));

interface EmojiPickerWrapperProps {
  value: string;
  onChange: (emoji: string) => void;
}

export function EmojiPickerWrapper({ value, onChange }: EmojiPickerWrapperProps) {
  const [open, setOpen] = useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="lg"
          className="h-12 w-12 text-2xl p-0"
        >
          {value || "😀"}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0 border-0" align="start">
        <Suspense
          fallback={
            <div className="flex h-[350px] w-[352px] items-center justify-center">
              加载中...
            </div>
          }
        >
          <EmojiPickerInner
            onSelect={(emoji: string) => {
              onChange(emoji);
              setOpen(false);
            }}
          />
        </Suspense>
      </PopoverContent>
    </Popover>
  );
}

function EmojiPickerInner({ onSelect }: { onSelect: (emoji: string) => void }) {
  const [data, setData] = useState<unknown>(null);

  if (!data) {
    import("@emoji-mart/data").then((mod) => setData(mod.default));
    return (
      <div className="flex h-[350px] w-[352px] items-center justify-center">
        加载中...
      </div>
    );
  }

  return (
    <EmojiPicker
      data={data}
      onEmojiSelect={(emoji: { native: string }) => onSelect(emoji.native)}
      locale="zh"
      theme="light"
      previewPosition="none"
      skinTonePosition="none"
    />
  );
}
