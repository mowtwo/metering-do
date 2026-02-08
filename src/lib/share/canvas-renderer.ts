import type { SkinCanvasPalette } from "./skin-colors";
import { drawQRCode } from "./qr-generator";
import { getAppUrl } from "./share-utils";

const DPR = typeof window !== "undefined"
  ? Math.min(window.devicePixelRatio || 1, 3)
  : 2;

export function createCanvas(
  logicalWidth: number,
  logicalHeight: number,
): { canvas: HTMLCanvasElement; ctx: CanvasRenderingContext2D } {
  const canvas = document.createElement("canvas");
  canvas.width = logicalWidth * DPR;
  canvas.height = logicalHeight * DPR;
  const ctx = canvas.getContext("2d")!;
  ctx.scale(DPR, DPR);
  return { canvas, ctx };
}

export function drawRoundRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  radius: number,
) {
  ctx.beginPath();
  ctx.roundRect(x, y, w, h, radius);
  ctx.closePath();
}

export function drawCard(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  p: SkinCanvasPalette,
) {
  ctx.save();

  if (p.cardRotation !== 0) {
    const cx = x + w / 2;
    const cy = y + h / 2;
    ctx.translate(cx, cy);
    ctx.rotate((p.cardRotation * Math.PI) / 180);
    ctx.translate(-cx, -cy);
  }

  // Shadow
  if (p.shadowOffsetX !== 0 || p.shadowOffsetY !== 0) {
    ctx.fillStyle = p.shadowColor;
    drawRoundRect(
      ctx,
      x + p.shadowOffsetX,
      y + p.shadowOffsetY,
      w,
      h,
      p.borderRadius,
    );
    ctx.fill();
  } else if (p.shadowColor !== "transparent") {
    ctx.shadowColor = p.shadowColor;
    ctx.shadowBlur = 8;
  }

  // Fill
  ctx.fillStyle = p.card;
  drawRoundRect(ctx, x, y, w, h, p.borderRadius);
  ctx.fill();
  ctx.shadowBlur = 0;

  // Border
  ctx.strokeStyle = p.border;
  ctx.lineWidth = p.borderWidth;
  drawRoundRect(ctx, x, y, w, h, p.borderRadius);
  ctx.stroke();

  ctx.restore();
}

export function drawText(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  opts: {
    font: string;
    size: number;
    color: string;
    align?: CanvasTextAlign;
    bold?: boolean;
    maxWidth?: number;
  },
) {
  const weight = opts.bold ? "bold" : "normal";
  ctx.font = `${weight} ${opts.size}px ${opts.font}`;
  ctx.fillStyle = opts.color;
  ctx.textAlign = opts.align ?? "left";
  ctx.textBaseline = "top";
  if (opts.maxWidth) {
    ctx.fillText(text, x, y, opts.maxWidth);
  } else {
    ctx.fillText(text, x, y);
  }
}

export function measureText(
  ctx: CanvasRenderingContext2D,
  text: string,
  font: string,
  size: number,
  bold?: boolean,
): number {
  const weight = bold ? "bold" : "normal";
  ctx.font = `${weight} ${size}px ${font}`;
  return ctx.measureText(text).width;
}

export function drawHeader(
  ctx: CanvasRenderingContext2D,
  w: number,
  p: SkinCanvasPalette,
): number {
  const headerH = 56;

  // Header background
  ctx.fillStyle = p.primary;
  ctx.fillRect(0, 0, w, headerH);

  // App name
  drawText(ctx, "Metering Do", 20, 17, {
    font: p.titleFont,
    size: 20,
    color: p.primaryForeground,
    bold: true,
  });

  return headerH;
}

export async function drawFooter(
  ctx: CanvasRenderingContext2D,
  y: number,
  w: number,
  p: SkinCanvasPalette,
): Promise<number> {
  const footerH = 120;
  const qrSize = 80;
  const padding = 20;
  const appUrl = getAppUrl();

  // Separator line
  ctx.strokeStyle = p.border;
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(padding, y);
  ctx.lineTo(w - padding, y);
  ctx.stroke();

  const qrY = y + (footerH - qrSize) / 2;

  // QR Code
  if (appUrl) {
    await drawQRCode(ctx, appUrl, padding, qrY, qrSize, p.foreground, p.card);
  }

  // Text next to QR
  const textX = padding + qrSize + 16;
  drawText(ctx, "扫码使用 Metering Do", textX, qrY + 12, {
    font: p.titleFont,
    size: 15,
    color: p.foreground,
    bold: true,
  });

  const today = new Date();
  const dateStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;
  drawText(ctx, dateStr, textX, qrY + 36, {
    font: p.bodyFont,
    size: 12,
    color: p.mutedForeground,
  });

  if (appUrl) {
    drawText(ctx, appUrl, textX, qrY + 56, {
      font: p.bodyFont,
      size: 11,
      color: p.mutedForeground,
      maxWidth: w - textX - padding,
    });
  }

  return footerH;
}
