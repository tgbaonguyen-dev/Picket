import type { Budget } from "@/types";

export const BUDGETS: Budget[] = [
  { id: "food", name: "Ăn uống", spent: 3200000, limit: 4500000, status: "ok", icon: "🍜" },
  { id: "transport", name: "Di chuyển", spent: 1800000, limit: 2000000, status: "warn", icon: "🚕" },
  { id: "shopping", name: "Mua sắm", spent: 2600000, limit: 2000000, status: "over", icon: "🛍️" },
  { id: "bills", name: "Hóa đơn", spent: 2100000, limit: 3000000, status: "ok", icon: "💡" },
  { id: "fun", name: "Giải trí", spent: 900000, limit: 1500000, status: "ok", icon: "🎬" },
];

// Điểm nối API: thay thân hàm bằng fetch() khi có backend.
export function getBudgets(): Budget[] {
  return BUDGETS;
}
