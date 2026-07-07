export type TxType = "expense" | "income" | "transfer" | "refund";
export type TxStatus = "pending" | "posted" | "refunded";

export type Tx = {
  id: string;
  type: TxType;
  status: TxStatus;
  amount: number; // positive number; sign inferred from type
  currency: string;
  merchant: string;
  category: string;
  categoryEmoji: string;
  account: string;
  date: string; // ISO
  note?: string;
  shared?: boolean;
  receipts?: string[];
};
