export const DEFAULT_CATEGORIES = [
  {
    name: "电子产品",
    emoji: "📱",
    subcategories: [
      { name: "手机", emoji: "📱" },
      { name: "电脑", emoji: "💻" },
      { name: "平板", emoji: "📟" },
      { name: "耳机", emoji: "🎧" },
      { name: "相机", emoji: "📷" },
    ],
  },
  {
    name: "家居",
    emoji: "🏠",
    subcategories: [
      { name: "家具", emoji: "🪑" },
      { name: "家电", emoji: "🔌" },
      { name: "厨具", emoji: "🍳" },
    ],
  },
  {
    name: "交通工具",
    emoji: "🚗",
    subcategories: [
      { name: "汽车", emoji: "🚗" },
      { name: "自行车", emoji: "🚲" },
      { name: "摩托车", emoji: "🏍️" },
    ],
  },
  {
    name: "服饰",
    emoji: "👕",
    subcategories: [
      { name: "衣服", emoji: "👔" },
      { name: "鞋子", emoji: "👟" },
      { name: "包包", emoji: "👜" },
    ],
  },
  {
    name: "娱乐",
    emoji: "🎮",
    subcategories: [
      { name: "游戏", emoji: "🎮" },
      { name: "运动", emoji: "⚽" },
      { name: "乐器", emoji: "🎸" },
    ],
  },
  {
    name: "其他",
    emoji: "📦",
    subcategories: [],
  },
];

export const EXPENSE_TYPE_LABELS: Record<string, string> = {
  initial: "初始费用",
  "one-time": "单次消费",
  recurring: "循环费用",
  sale: "卖出收入",
};

export const RECURRING_INTERVAL_LABELS: Record<string, string> = {
  daily: "每日",
  monthly: "每月",
  yearly: "每年",
};
