import type { Tx } from "@/types/transaction";

export type { Tx, TxType, TxStatus } from "@/types/transaction";

// ACCOUNTS có một nguồn duy nhất ở data/accounts.ts; re-export để giữ tương thích.
export { ACCOUNTS, getAccounts } from "./accounts";

const receipt = (seed: string) => `https://picsum.photos/seed/${seed}/200/280`;

export function getTransactions(): Tx[] {
  return TRANSACTIONS;
}

export function getExpenses() {
  return TRANSACTIONS.filter((t) => t.type === "expense");
}

export const CATEGORIES = [
  { id: "food", label: "Ăn uống", emoji: "🍜", color: "#dc2626" },
  { id: "transport", label: "Di chuyển", emoji: "🚗", color: "#f59e0b" },
  { id: "shopping", label: "Mua sắm", emoji: "🛍️", color: "#ec4899" },
  { id: "bills", label: "Hóa đơn", emoji: "💡", color: "#3b82f6" },
  { id: "entertainment", label: "Giải trí", emoji: "🎬", color: "#8b5cf6" },
  { id: "salary", label: "Lương", emoji: "💰", color: "#16a34a" },
  { id: "transfer", label: "Chuyển khoản", emoji: "🔁", color: "#64748b" },
  { id: "other", label: "Khác", emoji: "📦", color: "#94a3b8" },
];

export const TRANSACTIONS: Tx[] = [
  {
    id: "tx-001", type: "expense", status: "posted", amount: 185_000, currency: "VND",
    merchant: "Highlands Coffee", category: "Ăn uống", categoryEmoji: "🍜",
    account: "Vietcombank ••4821", date: "2026-04-15T09:12:00Z",
    note: "Họp sáng với team", receipts: [receipt("hl1")],
  },
  {
    id: "tx-002", type: "expense", status: "pending", amount: 42_000, currency: "VND",
    merchant: "Grab", category: "Di chuyển", categoryEmoji: "🚗",
    account: "Momo", date: "2026-04-15T08:20:00Z",
  },
  {
    id: "tx-003", type: "income", status: "posted", amount: 24_500_000, currency: "VND",
    merchant: "Công ty ABC", category: "Lương", categoryEmoji: "💰",
    account: "Vietcombank ••4821", date: "2026-04-15T07:00:00Z",
    note: "Lương tháng 4",
  },
  {
    id: "tx-004", type: "expense", status: "posted", amount: 780_000, currency: "VND",
    merchant: "Circle K", category: "Mua sắm", categoryEmoji: "🛍️",
    account: "Tiền mặt", date: "2026-04-14T21:30:00Z",
    shared: true, receipts: [receipt("ck1"), receipt("ck2")],
  },
  {
    id: "tx-005", type: "transfer", status: "posted", amount: 2_000_000, currency: "VND",
    merchant: "Vietcombank → Momo", category: "Chuyển khoản", categoryEmoji: "🔁",
    account: "Vietcombank ••4821", date: "2026-04-14T15:00:00Z",
  },
  {
    id: "tx-006", type: "expense", status: "posted", amount: 1_250_000, currency: "VND",
    merchant: "EVN — Tiền điện", category: "Hóa đơn", categoryEmoji: "💡",
    account: "Vietcombank ••4821", date: "2026-04-14T10:15:00Z",
  },
  {
    id: "tx-007", type: "refund", status: "posted", amount: 320_000, currency: "VND",
    merchant: "Shopee (hoàn)", category: "Mua sắm", categoryEmoji: "🛍️",
    account: "Momo", date: "2026-04-13T18:44:00Z",
    note: "Trả hàng đơn #A-9821",
  },
  {
    id: "tx-008", type: "expense", status: "posted", amount: 460_000, currency: "VND",
    merchant: "CGV Vincom", category: "Giải trí", categoryEmoji: "🎬",
    account: "Vietcombank ••4821", date: "2026-04-13T20:10:00Z", shared: true,
  },
  {
    id: "tx-009", type: "expense", status: "pending", amount: 55_000, currency: "VND",
    merchant: "Bún bò Huế", category: "Ăn uống", categoryEmoji: "🍜",
    account: "Tiền mặt", date: "2026-04-12T12:15:00Z",
  },
  {
    id: "tx-010", type: "expense", status: "posted", amount: 3_200_000, currency: "VND",
    merchant: "The Coffee House Franchise", category: "Ăn uống", categoryEmoji: "🍜",
    account: "Vietcombank ••4821", date: "2026-04-11T11:00:00Z",
  },
];

export const CATEGORY_RECENT_IDS = ["food", "transport", "shopping"];
export const TAGS = ["#công-tác", "#gia-đình", "#du-lịch", "#khẩn-cấp", "#thưởng"];

export function findTx(id: string): Tx | undefined {
  return TRANSACTIONS.find((t) => t.id === id);
}

export function formatVND(n: number, currency = "VND") {
  if (currency === "USD") return `$${n.toLocaleString("en-US")}`;
  return `${n.toLocaleString("vi-VN")}₫`;
}

export function groupByDay(list: Tx[]) {
  const map = new Map<string, Tx[]>();
  for (const t of list) {
    const day = t.date.slice(0, 10);
    if (!map.has(day)) map.set(day, []);
    map.get(day)!.push(t);
  }
  return Array.from(map.entries()).sort((a, b) => (a[0] < b[0] ? 1 : -1));
}

export function dayLabel(iso: string) {
  const d = new Date(iso);
  const today = new Date("2026-04-15");
  const diff = Math.round((today.getTime() - d.getTime()) / 86400000);
  if (diff === 0) return "Hôm nay";
  if (diff === 1) return "Hôm qua";
  const wd = ["CN", "T2", "T3", "T4", "T5", "T6", "T7"][d.getDay()];
  return `${wd}, ${d.getDate()}/${d.getMonth() + 1}`;
}

export function daySum(list: Tx[]) {
  let net = 0;
  for (const t of list) {
    if (t.type === "income" || t.type === "refund") net += t.amount;
    else if (t.type === "expense") net -= t.amount;
  }
  return net;
}


export function getCategories() { return CATEGORIES; }
export function getTags() { return TAGS; }
