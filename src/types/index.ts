// Kiểu dữ liệu (entity) dùng chung toàn app.
// Khi nối API thật, giữ nguyên các kiểu này làm hợp đồng dữ liệu (data contract).

export type { Tx, TxType, TxStatus } from "./transaction";

// ---- Tài khoản tiền / ví ----
export type AccountType = "bank" | "cash" | "ewallet" | "credit";

export interface Account {
  id: string;
  name: string;
  balance: number;
  type: string; // AccountType — để string cho linh hoạt với mock
  currency?: string;
  number?: string;
}

// ---- Ngân sách ----
export type BudgetStatus = "ok" | "warn" | "over";

export interface Budget {
  id: string;
  name: string;
  spent: number;
  limit: number;
  status: BudgetStatus;
  icon: string;
}

// ---- Hoá đơn định kỳ ----
export type BillStatus = "paid" | "due" | "upcoming";

export interface Bill {
  id: string;
  day: number;
  name: string;
  amount: number;
  status: string; // BillStatus
  icon: string;
}

// ---- Thuê bao ----
export type SubscriptionFlag = "trial" | "increase" | "duplicate" | null;

export interface Subscription {
  id: string;
  name: string;
  icon: string;
  monthly: number;
  flag: SubscriptionFlag;
  note: string;
}

// ---- Món đồ / tài sản ----
export interface Item {
  id: string;
  name: string;
  category: string;
  price: number;
  date: string;
  img: string;
  warranty: string;
  returnBy?: string;
}

// ---- Inbox: việc cần kiểm tra ----
export type TaskKind = "ocr" | "duplicate" | "uncategorized" | "sync";

export interface InboxTask {
  id: string;
  kind: TaskKind;
  title: string;
  reason: string;
  meta: string;
  cta: string;
}

// ---- Thông báo ----
export type NotificationType = "finance" | "social" | "system";

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  body: string;
  time: string;
  unread: boolean;
  action?: string;
}
