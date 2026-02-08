import type { SkinId } from "@/lib/skins";
import type { AssetWithStats } from "@/types";
import { formatCurrency, formatDays } from "@/lib/format";
import { SKIN_PALETTES } from "./skin-colors";
import {
  createCanvas,
  drawCard,
  drawHeader,
  drawFooter,
  drawText,
} from "./canvas-renderer";

const W = 720;
const PADDING = 20;
const CONTENT_W = W - PADDING * 2;
const MAX_ASSETS = 15;

export interface TotalShareData {
  assets: AssetWithStats[];
  summary: {
    totalNetCost: number;
    totalDailyCost: number;
    assetCount: number;
  };
}

export async function renderTotalShareImage(
  data: TotalShareData,
  skinId: SkinId,
): Promise<HTMLCanvasElement> {
  await document.fonts.ready;

  const p = SKIN_PALETTES[skinId];
  const displayAssets = data.assets.slice(0, MAX_ASSETS);
  const overflow = data.assets.length - MAX_ASSETS;

  // Calculate height
  const headerH = 56;
  const summaryCardH = 80;
  const assetRowH = 44;
  const assetListH =
    displayAssets.length * assetRowH + (overflow > 0 ? 36 : 0);
  const footerH = 120;
  const totalH =
    headerH + 16 + summaryCardH + 16 + assetListH + 16 + footerH + 8;

  const { canvas, ctx } = createCanvas(W, totalH);

  // Background
  p.drawBackground(ctx, W, totalH);

  // Header
  let y = drawHeader(ctx, W, p);

  // Summary card
  y += 16;
  drawCard(ctx, PADDING, y, CONTENT_W, summaryCardH, p);

  const colW = CONTENT_W / 3;
  const summaryItems = [
    { label: "资产数量", value: String(data.summary.assetCount) },
    { label: "总费用", value: formatCurrency(data.summary.totalNetCost) },
    { label: "每日总成本", value: formatCurrency(data.summary.totalDailyCost) },
  ];

  for (let i = 0; i < summaryItems.length; i++) {
    const cx = PADDING + colW * i + colW / 2;
    drawText(ctx, summaryItems[i].label, cx, y + 16, {
      font: p.bodyFont,
      size: 12,
      color: p.mutedForeground,
      align: "center",
    });
    drawText(ctx, summaryItems[i].value, cx, y + 36, {
      font: p.titleFont,
      size: 20,
      color: p.cardForeground,
      align: "center",
      bold: true,
    });
  }

  y += summaryCardH;

  // Asset list
  y += 16;

  for (let i = 0; i < displayAssets.length; i++) {
    const asset = displayAssets[i];
    const rowY = y + i * assetRowH;

    // Subtle row separator
    if (i > 0) {
      ctx.strokeStyle = p.border;
      ctx.lineWidth = 0.5;
      ctx.beginPath();
      ctx.moveTo(PADDING + 8, rowY);
      ctx.lineTo(W - PADDING - 8, rowY);
      ctx.stroke();
    }

    // Emoji
    ctx.font = `24px ${p.bodyFont}`;
    ctx.textBaseline = "top";
    ctx.fillText(asset.categoryEmoji, PADDING + 8, rowY + 8);

    // Name
    drawText(ctx, asset.name, PADDING + 44, rowY + 6, {
      font: p.bodyFont,
      size: 14,
      color: p.foreground,
      bold: true,
      maxWidth: 300,
    });

    // Category
    const categoryText = asset.subcategoryName
      ? `${asset.categoryName} / ${asset.subcategoryName}`
      : asset.categoryName;
    drawText(ctx, categoryText, PADDING + 44, rowY + 24, {
      font: p.bodyFont,
      size: 11,
      color: p.mutedForeground,
      maxWidth: 300,
    });

    // Net cost (right aligned)
    drawText(ctx, formatCurrency(asset.netCost), W - PADDING - 8, rowY + 6, {
      font: p.titleFont,
      size: 14,
      color: p.foreground,
      align: "right",
      bold: true,
    });

    // Daily cost (right aligned)
    drawText(
      ctx,
      `${formatCurrency(asset.dailyCost)}/天`,
      W - PADDING - 8,
      rowY + 24,
      {
        font: p.bodyFont,
        size: 11,
        color: p.mutedForeground,
        align: "right",
      },
    );
  }

  if (overflow > 0) {
    const overflowY = y + displayAssets.length * assetRowH + 6;
    drawText(ctx, `...及其他 ${overflow} 项资产`, W / 2, overflowY, {
      font: p.bodyFont,
      size: 13,
      color: p.mutedForeground,
      align: "center",
    });
  }

  // Footer
  const footerY = y + assetListH + 16;
  await drawFooter(ctx, footerY, W, p);

  return canvas;
}
