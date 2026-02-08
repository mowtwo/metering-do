import type { SkinId } from "@/lib/skins";

export interface SkinCanvasPalette {
  background: string;
  foreground: string;
  card: string;
  cardForeground: string;
  primary: string;
  primaryForeground: string;
  mutedForeground: string;
  border: string;
  accent: string;
  green: string;
  titleFont: string;
  bodyFont: string;
  borderWidth: number;
  borderRadius: number;
  shadowOffsetX: number;
  shadowOffsetY: number;
  shadowColor: string;
  cardRotation: number;
  drawBackground: (ctx: CanvasRenderingContext2D, w: number, h: number) => void;
}

const FONTS = {
  sans: '-apple-system, "Helvetica Neue", Arial, sans-serif',
  mono: '"Geist Mono", "SF Mono", "Fira Code", monospace',
  comic: '"ZCOOL KuaiLe", cursive, sans-serif',
};

export const SKIN_PALETTES: Record<SkinId, SkinCanvasPalette> = {
  minimal: {
    background: "#ffffff",
    foreground: "#1a1a1a",
    card: "#ffffff",
    cardForeground: "#1a1a1a",
    primary: "#2b2b2b",
    primaryForeground: "#fafafa",
    mutedForeground: "#737373",
    border: "#e5e5e5",
    accent: "#f5f5f5",
    green: "#16a34a",
    titleFont: FONTS.sans,
    bodyFont: FONTS.sans,
    borderWidth: 1,
    borderRadius: 8,
    shadowOffsetX: 0,
    shadowOffsetY: 0,
    shadowColor: "transparent",
    cardRotation: 0,
    drawBackground: (ctx, w, h) => {
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, w, h);
    },
  },
  p5: {
    background: "#faf5f5",
    foreground: "#1a1a1a",
    card: "#ffffff",
    cardForeground: "#1a1a1a",
    primary: "#cc2936",
    primaryForeground: "#ffffff",
    mutedForeground: "#5c5c5c",
    border: "#1a1a1a",
    accent: "#cc2936",
    green: "#16a34a",
    titleFont: FONTS.comic,
    bodyFont: FONTS.sans,
    borderWidth: 3,
    borderRadius: 4,
    shadowOffsetX: 4,
    shadowOffsetY: 4,
    shadowColor: "#1a1a1a",
    cardRotation: -0.3,
    drawBackground: (ctx, w, h) => {
      ctx.fillStyle = "#faf5f5";
      ctx.fillRect(0, 0, w, h);
      ctx.fillStyle = "rgba(26, 26, 26, 0.03)";
      for (let x = 0; x < w; x += 8) {
        for (let y = 0; y < h; y += 8) {
          ctx.beginPath();
          ctx.arc(x, y, 1, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    },
  },
  tech: {
    background: "#edf0f7",
    foreground: "#1e2a4a",
    card: "#f5f6fa",
    cardForeground: "#1e2a4a",
    primary: "#2b5cd9",
    primaryForeground: "#f8f8f8",
    mutedForeground: "#5a6b8a",
    border: "rgba(43, 92, 217, 0.25)",
    accent: "#8b3fcf",
    green: "#16a34a",
    titleFont: FONTS.mono,
    bodyFont: FONTS.sans,
    borderWidth: 1,
    borderRadius: 4,
    shadowOffsetX: 0,
    shadowOffsetY: 0,
    shadowColor: "rgba(43, 92, 217, 0.15)",
    cardRotation: 0,
    drawBackground: (ctx, w, h) => {
      ctx.fillStyle = "#edf0f7";
      ctx.fillRect(0, 0, w, h);
      ctx.strokeStyle = "rgba(43, 92, 217, 0.06)";
      ctx.lineWidth = 1;
      for (let x = 0; x < w; x += 24) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, h);
        ctx.stroke();
      }
      for (let y = 0; y < h; y += 24) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(w, y);
        ctx.stroke();
      }
    },
  },
};
