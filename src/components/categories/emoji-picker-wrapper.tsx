"use client";

import { useRef, useState, useCallback, useEffect } from "react";
import { EmojiPicker } from "frimousse";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

const CATEGORY_ICONS = [
  "😀", "👋", "🐻", "🍔", "🚗", "⚽", "💡", "💬", "🚩",
];

interface EmojiPickerWrapperProps {
  value: string;
  onChange: (emoji: string) => void;
}

export function EmojiPickerWrapper({
  value,
  onChange,
}: EmojiPickerWrapperProps) {
  const [open, setOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState(0);
  const viewportRef = useRef<HTMLDivElement>(null);

  const scrollToCategory = useCallback((index: number) => {
    const viewport = viewportRef.current;
    if (!viewport) return;
    const categories = viewport.querySelectorAll("[frimousse-category]");
    const target = categories[index];
    if (target) {
      // frimousse uses absolute positioning with top offset on category wrappers
      // so we can read offsetTop directly
      viewport.scrollTo({
        top: (target as HTMLElement).offsetTop,
        behavior: "smooth",
      });
    }
    setActiveCategory(index);
  }, []);

  // Track active category on scroll
  useEffect(() => {
    if (!open) return;
    const viewport = viewportRef.current;
    if (!viewport) return;

    const handleScroll = () => {
      const categories = viewport.querySelectorAll("[frimousse-category]");
      const scrollTop = viewport.scrollTop;
      let current = 0;
      categories.forEach((el, i) => {
        if ((el as HTMLElement).offsetTop <= scrollTop + 10) {
          current = i;
        }
      });
      setActiveCategory(current);
    };

    viewport.addEventListener("scroll", handleScroll, { passive: true });
    return () => viewport.removeEventListener("scroll", handleScroll);
  }, [open]);

  return (
    <>
      <Button
        variant="outline"
        size="lg"
        className="p-0 w-12 h-12 text-2xl"
        onClick={() => setOpen(true)}
      >
        {value || "😀"}
      </Button>
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent
          side="bottom"
          showCloseButton={false}
          className="max-h-[60vh] p-0"
        >
          <SheetHeader className="border-b px-4 py-3">
            <SheetTitle>选择表情</SheetTitle>
          </SheetHeader>
          <EmojiPicker.Root
            locale="zh"
            columns={10}
            onEmojiSelect={({ emoji }) => {
              onChange(emoji);
              setOpen(false);
            }}
            className="flex-1 min-h-0 flex flex-col"
          >
            <div className="flex items-center gap-1 px-3 pt-2 pb-1 border-b flex-shrink-0">
              {CATEGORY_ICONS.map((icon, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => scrollToCategory(i)}
                  className={`flex-1 flex items-center justify-center h-8 rounded text-lg cursor-pointer transition-colors ${
                    activeCategory === i
                      ? "bg-accent text-accent-foreground"
                      : "hover:bg-accent/50"
                  }`}
                >
                  {icon}
                </button>
              ))}
            </div>
            <EmojiPicker.Search
              placeholder="搜索表情..."
              className="mx-3 mt-2 mb-1 flex flex-shrink-0 h-9 rounded-md border border-input bg-transparent px-3 py-1 text-sm text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            />
            <EmojiPicker.Viewport
              ref={viewportRef}
              className="flex-1 min-h-0 overflow-y-auto"
            >
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
                      className="px-3 pb-1 pt-2 text-xs font-medium text-muted-foreground bg-background sticky top-0"
                    >
                      {category.label}
                    </div>
                  ),
                  Row: ({ children, ...props }) => (
                    <div {...props} className="flex px-2">
                      {children}
                    </div>
                  ),
                  Emoji: ({ emoji, ...props }) => (
                    <button
                      {...props}
                      className="flex flex-1 items-center justify-center h-10 rounded text-2xl hover:bg-accent cursor-pointer"
                    >
                      {emoji.emoji}
                    </button>
                  ),
                }}
              />
            </EmojiPicker.Viewport>
          </EmojiPicker.Root>
        </SheetContent>
      </Sheet>
    </>
  );
}
