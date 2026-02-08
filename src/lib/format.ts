import { format as dateFnsFormat } from "date-fns";
import { zhCN } from "date-fns/locale";

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("zh-CN", {
    style: "currency",
    currency: "CNY",
    minimumFractionDigits: 2,
  }).format(amount);
}

export function formatDate(date: Date): string {
  return dateFnsFormat(date, "yyyy-MM-dd", { locale: zhCN });
}

export function formatDateShort(date: Date): string {
  return dateFnsFormat(date, "MM/dd", { locale: zhCN });
}

export function formatDays(days: number): string {
  if (days < 30) return `${days} 天`;
  if (days < 365) {
    const months = Math.floor(days / 30);
    const remainDays = days % 30;
    return remainDays > 0 ? `${months} 个月 ${remainDays} 天` : `${months} 个月`;
  }
  const years = Math.floor(days / 365);
  const remainDays = days % 365;
  if (remainDays === 0) return `${years} 年`;
  const months = Math.floor(remainDays / 30);
  if (months > 0) return `${years} 年 ${months} 个月`;
  return `${years} 年 ${remainDays} 天`;
}
