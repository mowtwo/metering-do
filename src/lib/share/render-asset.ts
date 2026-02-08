import type { SkinId } from "@/lib/skins";
import type { AssetStats } from "@/lib/calculations";
import { formatCurrency, formatDays, formatDate } from "@/lib/format";
import { SKIN_PALETTES } from "./skin-colors";
import {
  createCanvas,
  drawCard,
  drawHeader,
  drawFooter,
  drawText,
  drawEmoji,
} from "./canvas-renderer";

const W = 720;
const PADDING = 20;
const CONTENT_W = W - PADDING * 2;

export interface AssetShareData {
  name: string;
  categoryEmoji: string;
  categoryName: string;
  subcategoryName: string | null;
  notes: string;
  stats: AssetStats;
}

export async function renderAssetShareImage(
  data: AssetShareData,
  skinId: SkinId,
): Promise<HTMLCanvasElement> {
  await document.fonts.ready;

  const p = SKIN_PALETTES[skinId];

  // Calculate height
  const headerH = 56;
  const infoH = 72;
  const statsCardH = 90;
  const extraInfoH =
    (data.stats.initialExpenseDate ? 28 : 0) +
    (data.stats.totalSaleIncome > 0 ? 28 : 0) +
    (data.notes ? 32 : 0);
  const footerH = 120;
  const totalH =
    headerH + 16 + infoH + 12 + statsCardH + (extraInfoH > 0 ? 8 + extraInfoH : 0) + 16 + footerH + 8;

  const { canvas, ctx } = createCanvas(W, totalH);

  // Background
  p.drawBackground(ctx, W, totalH);

  // Header
  let y = drawHeader(ctx, W, p);

  // Asset info section
  y += 16;

  // Emoji — centered in a fixed 48×48 box for consistent alignment
  const emojiBoxSize = 48;
  drawEmoji(ctx, data.categoryEmoji, PADDING + 4, y + 8, emojiBoxSize, 36);

  // Name
  drawText(ctx, data.name, PADDING + 64, y + 8, {
    font: p.titleFont,
    size: 22,
    color: p.foreground,
    bold: true,
    maxWidth: CONTENT_W - 72,
  });

  // Category
  const categoryText = data.subcategoryName
    ? `${data.categoryName} / ${data.subcategoryName}`
    : data.categoryName;
  drawText(ctx, categoryText, PADDING + 64, y + 40, {
    font: p.bodyFont,
    size: 14,
    color: p.mutedForeground,
    maxWidth: CONTENT_W - 72,
  });

  y += infoH;

  // Stats card
  y += 12;
  drawCard(ctx, PADDING, y, CONTENT_W, statsCardH, p);

  const cols = [
    { label: "持有时间", value: formatDays(data.stats.holdingDays) },
    { label: "总支出", value: formatCurrency(data.stats.totalExpenses) },
    { label: "净费用", value: formatCurrency(data.stats.netCost) },
    { label: "每日成本", value: formatCurrency(data.stats.dailyCost) },
  ];

  const colW = CONTENT_W / cols.length;
  for (let i = 0; i < cols.length; i++) {
    const cx = PADDING + colW * i + colW / 2;

    // Vertical separator
    if (i > 0) {
      ctx.strokeStyle = p.border;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(PADDING + colW * i, y + 16);
      ctx.lineTo(PADDING + colW * i, y + statsCardH - 16);
      ctx.stroke();
    }

    drawText(ctx, cols[i].label, cx, y + 18, {
      font: p.bodyFont,
      size: 12,
      color: p.mutedForeground,
      align: "center",
    });
    drawText(ctx, cols[i].value, cx, y + 40, {
      font: p.titleFont,
      size: 17,
      color: p.cardForeground,
      align: "center",
      bold: true,
      maxWidth: colW - 12,
    });
  }

  y += statsCardH;

  // Extra info
  if (extraInfoH > 0) {
    y += 8;

    if (data.stats.initialExpenseDate) {
      drawText(
        ctx,
        `购入日期: ${formatDate(data.stats.initialExpenseDate)}`,
        W / 2,
        y,
        {
          font: p.bodyFont,
          size: 13,
          color: p.mutedForeground,
          align: "center",
        },
      );
      y += 28;
    }

    if (data.stats.totalSaleIncome > 0) {
      drawText(
        ctx,
        `已回收: ${formatCurrency(data.stats.totalSaleIncome)}`,
        W / 2,
        y,
        {
          font: p.bodyFont,
          size: 13,
          color: p.green,
          align: "center",
        },
      );
      y += 28;
    }

    if (data.notes) {
      drawText(ctx, data.notes, W / 2, y, {
        font: p.bodyFont,
        size: 12,
        color: p.mutedForeground,
        align: "center",
        maxWidth: CONTENT_W - 40,
      });
      y += 32;
    }
  }

  // Footer
  y += 16;
  await drawFooter(ctx, y, W, p);

  return canvas;
}
