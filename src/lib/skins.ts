export const SKIN_IDS = ["minimal", "p5", "tech"] as const;
export type SkinId = (typeof SKIN_IDS)[number];
export const DEFAULT_SKIN: SkinId = "minimal";
export const SKIN_STORAGE_KEY = "metering-do-skin";

export interface SkinDefinition {
  id: SkinId;
  name: string;
  description: string;
  icon: string;
}

export const SKINS: SkinDefinition[] = [
  {
    id: "minimal",
    name: "极简风格",
    description: "简洁实用，细线条边框，无多余装饰",
    icon: "✨",
  },
  {
    id: "p5",
    name: "P5风格",
    description: "漫画线条感，高对比度，波普艺术色彩",
    icon: "💥",
  },
  {
    id: "tech",
    name: "科技风格",
    description: "赛博朋克，霓虹发光，深色未来感",
    icon: "🔮",
  },
];

export function isValidSkinId(id: string): id is SkinId {
  return SKIN_IDS.includes(id as SkinId);
}

export function resolveSkinId(id: string | undefined | null): SkinId {
  if (id && isValidSkinId(id)) return id;
  return DEFAULT_SKIN;
}
