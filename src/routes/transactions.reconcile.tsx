import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Check, AlertTriangle, Plus, CheckCircle2 } from "lucide-react";
import { PhoneFrame } from "@/components/phone-frame";
import { TRANSACTIONS, ACCOUNTS, formatVND } from "@/data";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

export const Route = createFileRoute("/transactions/reconcile")({
  component: ReconcilePage,
});

function ReconcilePage() {
  const nav = useNavigate();
  const [account, setAccount] = useState(ACCOUNTS[0]);
  const [statementBalance, setStatementBalance] = useState(12_450_000);
  const [statementDate, setStatementDate] = useState("2026-04-15");
  const [cleared, setCleared] = useState<Set<string>>(
    new Set(TRANSACTIONS.filter((t) => t.status === "posted").map((t) => t.id)),
  );

  const items = TRANSACTIONS.filter((t) => t.account === account.name);
  const clearedItems = items.filter((t) => cleared.has(t.id));
  const calculated = clearedItems.reduce((s, t) => {
    if (t.type === "expense") return s - t.amount;
    if (t.type === "income" || t.type === "refund") return s + t.amount;
    return s;
  }, 0);
  const startingBalance = account.balance - calculated;
  const currentTotal = startingBalance + calculated;
  const diff = statementBalance - currentTotal;
  const balanced = diff === 0;

  const toggle = (id: string) =>
    setCleared((s) => {
      const n = new Set(s);
      if (n.has(id)) n.delete(id); else n.add(id);
      return n;
    });

  return (
    <PhoneFrame title="Đối soát tài khoản" subtitle={account.name}>
      <div className="space-y-4 px-5 pb-6">
        <Select
          value={account.id}
          onValueChange={(val) => {
            const a = ACCOUNTS.find((x) => x.id === val);
            if (a) setAccount(a);
          }}
        >
          <SelectTrigger className="w-full flex h-auto items-center justify-between rounded-2xl border border-white/70 bg-white/85 px-4 py-3 font-display text-[15px] font-semibold shadow-sm outline-none ring-0 focus:ring-0 [&>span:last-child]:hidden">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="rounded-xl border border-white/40 bg-white/95 backdrop-blur-md shadow-lg">
            {ACCOUNTS.map((a) => (<SelectItem key={a.id} value={a.id} className="rounded-lg">{a.name}</SelectItem>))}
          </SelectContent>
        </Select>

        {/* Statement */}
        <div className="space-y-3 rounded-2xl border border-white/70 bg-white/85 p-4 shadow-sm">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-widest text-foreground/50">
              Ngày sao kê
            </p>
            <input
              type="date"
              value={statementDate}
              onChange={(e) => setStatementDate(e.target.value)}
              className="w-full bg-transparent text-[14px] font-semibold outline-none"
            />
          </div>
          <div>
            <p className="text-[11px] font-bold uppercase tracking-widest text-foreground/50">
              Số dư theo sao kê
            </p>
            <input
              type="number"
              value={statementBalance}
              onChange={(e) => setStatementBalance(Number(e.target.value) || 0)}
              className="w-full bg-transparent font-display text-[22px] font-bold tabular-nums outline-none"
            />
          </div>
        </div>

        {/* Compare */}
        <div className={`rounded-3xl p-5 text-background shadow-lg ${
          balanced ? "bg-gradient-to-br from-[#B5828C] to-[#FFB4A2]" : "bg-gradient-to-br from-amber-600 to-amber-500"
        }`}>
          <div className="flex items-center gap-2 text-[11px] uppercase tracking-widest opacity-80">
            {balanced ? <CheckCircle2 className="h-4 w-4" /> : <AlertTriangle className="h-4 w-4" />}
            {balanced ? "Đã cân" : "Chênh lệch"}
          </div>
          <p className="mt-2 font-display text-[30px] font-bold tabular-nums">
            {diff > 0 ? "+" : ""}
            {formatVND(diff)}
          </p>
          <div className="mt-3 grid grid-cols-2 gap-2 text-[12px] opacity-90">
            <div>
              <p className="opacity-70">Sổ cái tính</p>
              <p className="font-semibold tabular-nums">{formatVND(currentTotal)}</p>
            </div>
            <div>
              <p className="opacity-70">Sao kê</p>
              <p className="font-semibold tabular-nums">{formatVND(statementBalance)}</p>
            </div>
          </div>
        </div>

        {!balanced && (
          <button className="flex w-full items-center justify-center gap-2 rounded-2xl border border-foreground/10 bg-white py-3 text-[13px] font-semibold">
            <Plus className="h-4 w-4" /> Tạo giao dịch điều chỉnh {formatVND(diff)}
          </button>
        )}

        {/* Items */}
        <div>
          <div className="mb-2 flex items-center justify-between">
            <p className="text-[11px] font-bold uppercase tracking-widest text-foreground/50">
              Giao dịch chưa đối soát ({items.length - cleared.size})
            </p>
          </div>
          <div className="overflow-hidden rounded-2xl border border-white/70 bg-white/85 shadow-sm">
            {items.map((t, i) => {
              const on = cleared.has(t.id);
              return (
                <button
                  key={t.id}
                  onClick={() => toggle(t.id)}
                  className={`flex w-full items-center gap-3 px-4 py-3 text-left ${
                    i > 0 ? "border-t border-foreground/5" : ""
                  }`}
                >
                  <div
                    className={`flex h-6 w-6 items-center justify-center rounded-md border ${
                      on
                        ? "border-[#FFB4A2] bg-[#FFB4A2] text-white"
                        : "border-foreground/30"
                    }`}
                  >
                    {on && <Check className="h-4 w-4" />}
                  </div>
                  <div className="flex-1">
                    <p className="text-[13px] font-semibold">{t.merchant}</p>
                    <p className="text-[11px] text-foreground/55">
                      {new Date(t.date).toLocaleDateString("vi-VN")}
                    </p>
                  </div>
                  <p className="font-display text-[13px] font-bold tabular-nums">
                    {t.type === "expense" ? "−" : "+"}
                    {formatVND(t.amount, t.currency)}
                  </p>
                </button>
              );
            })}
          </div>
        </div>

        <button
          disabled={!balanced}
          onClick={() => {
            toast.success("Đã hoàn tất đối soát");
            nav({ to: "/transactions" });
          }}
          className="w-full rounded-2xl bg-foreground py-3.5 text-[14px] font-semibold text-background disabled:opacity-40"
        >
          {balanced ? "Hoàn tất đối soát" : `Còn chênh ${formatVND(Math.abs(diff))}`}
        </button>
      </div>
    </PhoneFrame>
  );
}
