import type { Bill, Subscription } from "@/types";

export const BILLS: Bill[] = [
  { id: "netflix", day: 5, name: "Netflix", amount: 260000, status: "paid", icon: "🎬" },
  { id: "electric", day: 10, name: "Điện EVN", amount: 850000, status: "due", icon: "💡" },
  { id: "internet", day: 12, name: "FPT Internet", amount: 240000, status: "upcoming", icon: "🌐" },
  { id: "spotify", day: 15, name: "Spotify", amount: 59000, status: "upcoming", icon: "🎵" },
  { id: "rent", day: 25, name: "Tiền nhà", amount: 6500000, status: "upcoming", icon: "🏠" },
];

export const SUBSCRIPTIONS: Subscription[] = [
  { id: "netflix", name: "Netflix Premium", icon: "🎬", monthly: 260000, flag: "trial", note: "Trial hết 12/07" },
  { id: "spotify", name: "Spotify Family", icon: "🎵", monthly: 149000, flag: null, note: "Đang dùng thường xuyên" },
  { id: "icloud", name: "iCloud+ 200GB", icon: "☁️", monthly: 59000, flag: "increase", note: "Tăng giá +10.000₫ từ 08/2026" },
  { id: "chatgpt", name: "ChatGPT Plus", icon: "🤖", monthly: 520000, flag: null, note: "" },
  { id: "youtube", name: "YouTube Premium", icon: "▶️", monthly: 79000, flag: "duplicate", note: "Trùng với Family plan" },
];

// Điểm nối API: thay thân hàm bằng fetch() khi có backend.
export function getBills(): Bill[] {
  return BILLS;
}

export function getSubscriptions(): Subscription[] {
  return SUBSCRIPTIONS;
}

export function findSubscription(id: string): Subscription | undefined {
  return SUBSCRIPTIONS.find((s) => s.id === id);
}

export function findBill(id: string): Bill | undefined {
  return BILLS.find((b) => b.id === id);
}
