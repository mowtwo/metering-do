"use client";

import { useState } from "react";
import { EmojiPicker } from "frimousse";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface EmojiPickerWrapperProps {
  value: string;
  onChange: (emoji: string) => void;
}

export function EmojiPickerWrapper({
  value,
  onChange,
}: EmojiPickerWrapperProps) {
  const [open, setOpen] = useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="lg"
          className="p-0 w-12 h-12 text-2xl"
        >
          {value || "😀"}
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="w-auto p-0"
        align="start"
        side="bottom"
        avoidCollisions={false}
        onOpenAutoFocus={(e) => e.preventDefault()}
      >
        <EmojiPicker.Root
          locale="zh"
          columns={8}
          onEmojiSelect={({ emoji }) => {
            onChange(emoji);
            setOpen(false);
          }}
          className="h-[min(435px,45vh)] flex flex-col"
        >
          <EmojiPicker.Search
            placeholder="搜索表情..."
            className="mx-2 mt-2 mb-1 flex flex-shrink-0 h-9 rounded-md border border-input bg-transparent px-3 py-1 text-sm text-popover-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
          />
          <EmojiPicker.Viewport className="flex-1 min-h-0">
            <EmojiPicker.Loading className="flex items-center justify-center h-full text-sm text-muted-foreground">
              加载中...
            </EmojiPicker.Loading>
            <EmojiPicker.Empty className="flex items-center justify-center h-full text-sm text-muted-foreground">
              未找到表情
            </EmojiPicker.Empty>
            <EmojiPicker.List
              components={{
                CategoryHeader: ({ category, ...props }) => (
                  <div
                    {...props}
                    className="px-2 pb-1 pt-2 text-xs font-medium text-muted-foreground bg-popover sticky top-0"
                  >
                    {category.label}
                  </div>
                ),
                Row: ({ children, ...props }) => (
                  <div {...props} className="flex px-1">
                    {children}
                  </div>
                ),
                Emoji: ({ emoji, ...props }) => (
                  <button
                    {...props}
                    className="flex items-center justify-center size-8 rounded text-lg hover:bg-accent cursor-pointer"
                  >
                    {emoji.emoji}
                  </button>
                ),
              }}
            />
          </EmojiPicker.Viewport>
        </EmojiPicker.Root>
      </PopoverContent>
    </Popover>
  );
}
