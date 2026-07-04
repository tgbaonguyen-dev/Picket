import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Search, SlidersHorizontal, Plus, ChevronDown, Check, CheckSquare2 } from "lucide-react";
import { PhoneFrame } from "@/components/phone-frame";
import { SwipeableItem } from "@/components/swipeable-item";
import { toast } from "sonner";
import {
  TRANSACTIONS, ACCOUNTS, groupByDay, dayLabel, daySum, formatVND, type TxType,
} from "@/lib/mock-transactions";

export const Route = createFileRoute("/transactions")({
  component: TransactionsPage,
});

const FILTERS: { id: TxType | "all"; label: string }[] = [
  { id: "all", label: "Tất cả" },
  { id: "expense", label: "Chi" },
  { id: "income", label: "Thu" },
  { id: "transfer", label: "Chuyển" },
  { id: "refund", label: "Hoàn tiền" },
];

function TransactionsPage() {
  const [filter, setFilter] = useState<TxType | "all">("all");
  const [account, setAccount] = useState<string>("all");
  const [search, setSearch] = useState("");
  const [selectMode, setSelectMode] = useState(false);
  const [selected, setSelected] = useState<Set<string>>(new Set());

  const filtered = useMemo(() => {
    return TRANSACTIONS.filter((t) => {
      if (filter !== "all" && t.type !== filter) return false;
      if (account !== "all" && t.account !== account) return false;
      if (search && !`${t.merchant} ${t.category}`.toLowerCase().includes(search.toLowerCase()))
        return false;
      return true;
    });
  }, [filter, account, search]);

  const grouped = groupByDay(filtered);

  const toggle = (id: string) => {
    setSelected((s) => {
      const n = new Set(s);
      if (n.has(id)) n.delete(id); else n.add(id);
      return n;
    });
  };

  return (
    <PhoneFrame
      title="Giao dịch"
      subtitle="Tháng 4 · 2026"
      right={
        <button
          onClick={() => {
            setSelectMode((v) => !v);
            setSelected(new Set());
          }}
          className="flex h-10 w-10 items-center justify-center rounded-2xl border border-white/70 bg-white/70 text-foreground/80 shadow-sm"
        >
          <CheckSquare2 className="h-5 w-5" />
        </button>
      }
    >
      <div className="relative flex h-full flex-col">
        <div className="space-y-3 px-5 pb-3">
          {/* account switcher */}
          <button
            className="flex w-full items-center justify-between rounded-2xl border border-white/80 bg-white/80 px-4 py-3 text-left shadow-sm backdrop-blur-md"
            onClick={() =>
              setAccount(account === "all" ? ACCOUNTS[0].name : "all")
            }
          >
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-foreground/50">
                Tài khoản
              </p>
              <p className="font-display text-[15px] font-semibold">
                {account === "all" ? "Tất cả tài khoản" : account}
              </p>
            </div>
            <ChevronDown className="h-4 w-4 text-foreground/50" />
          </button>

          {/* search */}
          <div className="flex items-center gap-2 rounded-2xl border border-white/80 bg-white/80 px-4 py-2.5 shadow-sm">
            <Search className="h-4 w-4 text-foreground/50" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Tìm merchant, danh mục..."
              className="w-full bg-transparent text-[14px] outline-none placeholder:text-foreground/40"
            />
            <SlidersHorizontal className="h-4 w-4 text-foreground/50" />
          </div>

          {/* dedicated CTA */}
          <Link
            to="/expenses"
            className="flex items-center justify-between rounded-2xl border border-[#B5828C]/30 bg-gradient-to-r from-[#FFE9D9] to-[#ffe4e6] px-4 py-3 shadow-[0_6px_18px_-10px_rgba(181,130,140,0.6)] transition active:scale-[0.98]"
          >
            <div className="min-w-0">
              <p className="font-sans text-[10px] font-bold uppercase tracking-[0.14em] text-[#B5828C]">
                Xem theo danh mục
              </p>
              <p className="font-display text-[15px] font-semibold text-foreground">
                Chi tiêu chi tiết
              </p>
            </div>
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white/80 font-display text-[16px] font-bold text-[#B5828C] shadow-sm">
              →
            </span>
          </Link>

          {/* filter chips */}
          <div className="-mx-5 flex gap-2 overflow-x-auto px-5 pb-1">
            {FILTERS.map((f) => (
              <button
                key={f.id}
                onClick={() => setFilter(f.id)}
                className={`shrink-0 rounded-full px-3.5 py-1.5 text-[12px] font-semibold transition ${
                  filter === f.id
                    ? "bg-foreground text-background"
                    : "border border-white/70 bg-white/70 text-foreground/70"
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>


        {/* list */}
        <div className="flex-1 overflow-y-auto px-5 pb-32">
          {grouped.map(([day, items]) => {
            const net = daySum(items);
            return (
              <section key={day} className="mb-5">
                <header className="mb-2 flex items-baseline justify-between px-1">
                  <p className="font-display text-[13px] font-bold text-foreground/70">
                    {dayLabel(day)}
                  </p>
                  <p
                    className={`text-[12px] font-semibold tabular-nums ${
                      net >= 0 ? "text-[#B5828C]" : "text-foreground/70"
                    }`}
                  >
                    {net >= 0 ? "+" : ""}
                    {formatVND(net)}
                  </p>
                </header>
                <div className="overflow-hidden rounded-2xl border border-white/70 bg-white/80 shadow-sm">
                  {items.map((t, i) => {
                    const isNeg = t.type === "expense";
                    const isPlus = t.type === "income" || t.type === "refund";
                    const isSelected = selected.has(t.id);
                    const row = (
                      <div className="flex items-center gap-3 px-4 py-3">
                        {selectMode ? (
                          <div
                            className={`flex h-6 w-6 items-center justify-center rounded-md border ${
                              isSelected
                                ? "border-foreground bg-foreground text-background"
                                : "border-foreground/30"
                            }`}
                          >
                            {isSelected && <Check className="h-4 w-4" />}
                          </div>
                        ) : (
                          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-foreground/5 text-xl">
                            {t.categoryEmoji}
                          </div>
                        )}
                        <div className="min-w-0 flex-1">
                          <p className="truncate font-display text-[14px] font-semibold">
                            {t.merchant}
                          </p>
                          <p className="truncate text-[11px] text-foreground/55">
                            {t.category} · {t.account}
                            {t.shared && " · Chung"}
                          </p>
                        </div>
                        <div className="text-right">
                          <p
                            className={`font-display text-[14px] font-bold tabular-nums ${
                              isPlus ? "text-[#B5828C]" : "text-foreground"
                            }`}
                          >
                            {isNeg ? "−" : isPlus ? "+" : ""}
                            {formatVND(t.amount, t.currency)}
                          </p>
                          {t.status === "pending" && (
                            <span className="mt-0.5 inline-block rounded-full bg-amber-100 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-amber-700">
                              Chờ
                            </span>
                          )}
                        </div>
                      </div>
                    );
                    const isBorder = i > 0;
                    return (
                      <div key={t.id}>
                        {selectMode ? (
                          <div className={isBorder ? "border-t border-foreground/5" : ""}>
                            <button className="w-full text-left" onClick={() => toggle(t.id)}>
                              {row}
                            </button>
                          </div>
                        ) : (
                          <SwipeableItem onDelete={() => toast.success("Đã xoá giao dịch")}>
                            <div className={isBorder ? "border-t border-foreground/5" : ""}>
                              <Link
                                to="/transactions/$id"
                                params={{ id: t.id }}
                                className="block active:bg-foreground/5"
                              >
                                {row}
                              </Link>
                            </div>
                          </SwipeableItem>
                        )}
                      </div>
                    );
                  })}
                </div>
              </section>
            );
          })}
          {grouped.length === 0 && (
            <div className="mt-24 flex flex-col items-center text-center">
              <div className="mb-5 flex h-24 w-24 items-center justify-center rounded-full bg-foreground/5 text-foreground/40 shadow-inner">
                <Search className="h-10 w-10" />
              </div>
              <p className="font-display text-[18px] font-bold text-foreground">Chưa có giao dịch</p>
              <p className="mt-2 max-w-[220px] text-[13px] leading-relaxed text-foreground/70">
                Nhấn vào biểu tượng Camera bên dưới để quét hoá đơn đầu tiên của bạn nhé!
              </p>
            </div>
          )}
        </div>

        {/* Selection toolbar */}
        {selectMode && (
          <div className="absolute inset-x-0 bottom-0 border-t border-white bg-white/95 px-5 py-3 backdrop-blur">
            <div className="mb-2 flex items-center justify-between text-[12px] text-foreground/70">
              <span>{selected.size} đã chọn</span>
              <Link
                to="/transactions/bulk"
                search={{ ids: Array.from(selected).join(",") }}
                className="font-semibold text-primary"
              >
                Thao tác →
              </Link>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setSelected(new Set(filtered.map((t) => t.id)))}
                className="flex-1 rounded-xl bg-foreground/5 py-2 text-[13px] font-semibold"
              >
                Chọn tất cả
              </button>
              <button
                onClick={() => {
                  setSelectMode(false);
                  setSelected(new Set());
                }}
                className="flex-1 rounded-xl bg-foreground py-2 text-[13px] font-semibold text-background"
              >
                Xong
              </button>
            </div>
          </div>
        )}
      </div>
    </PhoneFrame>
  );
}
