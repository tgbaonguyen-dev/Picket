import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { Tx, formatVND } from "@/data";

interface TransactionRowProps {
  transaction: Tx;
  selectMode?: boolean;
  isSelected?: boolean;
  maskBalance?: boolean;
}

export function TransactionRow({
  transaction: t,
  selectMode = false,
  isSelected = false,
  maskBalance = false,
}: TransactionRowProps) {
  const isNeg = t.type === "expense";
  const isPlus = t.type === "income" || t.type === "refund";

  return (
    <motion.div 
      whileTap={{ scale: 0.96 }}
      className="flex items-center gap-3 px-4 py-3 bg-white/60 rounded-2xl shadow-sm border border-white/60 backdrop-blur-md transition-colors w-full"
    >
      {selectMode ? (
        <div
          className={`flex h-6 w-6 items-center justify-center rounded-md border shrink-0 ${
            isSelected
              ? "border-foreground bg-foreground text-background"
              : "border-white/50 bg-white/50 shadow-sm"
          }`}
        >
          {isSelected && <Check className="h-4 w-4" />}
        </div>
      ) : (
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-white/70 border border-white/50 shadow-sm text-xl">
          {t.categoryEmoji}
        </div>
      )}
      <div className="min-w-0 flex-1 text-left">
        <p className="truncate font-display text-[14px] font-semibold">
          {t.merchant}
        </p>
        <p className="truncate text-[11px] text-foreground/55 mt-0.5">
          {t.category} {t.account ? `· ${t.account}` : ""}
          {t.shared && " · Chung"}
        </p>
      </div>
      <div className="text-right shrink-0">
        <p
          className={`font-display text-[14px] font-bold tabular-nums ${
            isPlus ? "text-income" : isNeg ? "text-expense" : "text-foreground"
          }`}
        >
          {maskBalance ? "••••" : (
            <>
              {isNeg ? "−" : isPlus ? "+" : ""}
              {formatVND(t.amount, t.currency)}
            </>
          )}
        </p>
        {t.status === "pending" && (
          <span className="mt-1 inline-block rounded-full bg-amber-100 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-amber-700">
            Chờ
          </span>
        )}
      </div>
    </motion.div>
  );
}
