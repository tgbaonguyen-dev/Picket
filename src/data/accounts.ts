import type { Account } from "@/types";

// Danh sách tài khoản dùng chung (AC-01 Ví, AC-02 Chi tiết).
export const ACCOUNTS: Account[] = [
  { id: "vcb", name: "Vietcombank ••4821", balance: 12_450_000, type: "bank", number: "0123456789" },
  { id: "cash", name: "Tiền mặt", balance: 850_000, type: "cash" },
  { id: "mmo", name: "Momo", balance: 2_100_000, type: "ewallet" },
  { id: "credit", name: "Thẻ Visa ••1234", balance: -4_200_000, type: "credit" },
  { id: "usd", name: "USD Savings", balance: 1240, type: "bank", currency: "USD" },
];

// Lịch sử giao dịch demo cho màn hình chi tiết tài khoản (AC-02).
export interface AccountTx {
  id: string;
  name: string;
  amount: number;
  date: string;
  type: "income" | "expense";
  category: string;
}

export const ACCOUNT_TRANSACTIONS: AccountTx[] = [
  { id: "1", name: "Nhận lương", amount: 15000000, date: "2026-07-05", type: "income", category: "Lương" },
  { id: "2", name: "Đóng tiền nhà", amount: -4000000, date: "2026-07-06", type: "expense", category: "Nhà ở" },
  { id: "3", name: "Ăn tối Lotte", amount: -250000, date: "2026-07-07", type: "expense", category: "Ăn uống" },
];

// Điểm nối API: thay thân hàm bằng fetch() khi có backend.
export function getAccounts(): Account[] {
  return ACCOUNTS;
}

export function findAccount(id: string): Account | undefined {
  return ACCOUNTS.find((a) => a.id === id);
}

export function getAccountTransactions(_accountId: string): AccountTx[] {
  return ACCOUNT_TRANSACTIONS;
}
