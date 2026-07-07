import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState, useDeferredValue } from "react";
import { Search, SlidersHorizontal, Plus, ChevronDown, Check, CheckSquare2, PieChart } from "lucide-react";
import { motion } from "framer-motion";
import { PhoneFrame } from "@/components/phone-frame";
import { SwipeableItem } from "@/components/swipeable-item";
import { TransactionRow } from "@/components/transaction-row";
import { FadeInUp } from "@/components/ui/animations";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import {
  TRANSACTIONS, ACCOUNTS, groupByDay, dayLabel, daySum, formatVND, type TxType,
} from "@/lib/mock-transactions";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export const Route = createFileRoute("/transactions/")({
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
  const deferredSearch = useDeferredValue(search);
  const [selectMode, setSelectMode] = useState(false);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [deleteTxId, setDeleteTxId] = useState<string | null>(null);

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setIsLoading(false), 1000);
    return () => clearTimeout(t);
  }, []);

  const filtered = useMemo(() => {
    return TRANSACTIONS.filter((t) => {
      if (filter !== "all" && t.type !== filter) return false;
      if (account !== "all" && t.account !== account) return false;
      if (deferredSearch && !`${t.merchant} ${t.category}`.toLowerCase().includes(deferredSearch.toLowerCase()))
        return false;
      return true;
    });
  }, [filter, account, deferredSearch]);

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
        <div className="flex items-center gap-2">
          <Link
            to="/expenses"
            className="flex h-10 w-10 items-center justify-center rounded-2xl border border-white/70 bg-white/70 text-foreground/80 shadow-sm"
            aria-label="Phân tích chi tiêu"
          >
            <PieChart className="h-5 w-5" />
          </Link>
          <button
            onClick={() => {
              setSelectMode((v) => !v);
              setSelected(new Set());
            }}
            className="flex h-10 w-10 items-center justify-center rounded-2xl border border-white/70 bg-white/70 text-foreground/80 shadow-sm"
          >
            <CheckSquare2 className="h-5 w-5" />
          </button>
        </div>
      }
    >
      <div className="relative flex h-full flex-col">
        <div className="space-y-3 px-5 pb-3">
          {/* account switcher */}
          <Select value={account} onValueChange={setAccount}>
            <SelectTrigger className="flex h-auto w-full items-center justify-between rounded-2xl border border-white/80 bg-white/80 px-4 py-3 text-left shadow-sm backdrop-blur-md focus:ring-0 [&>span:last-child]:hidden outline-none">
              <div className="text-left flex-1 min-w-0">
                <p className="text-[10px] font-bold uppercase tracking-widest text-foreground/50">
                  Tài khoản
                </p>
                <p className="font-display text-[15px] font-semibold truncate mt-0.5">
                  <SelectValue placeholder="Tất cả tài khoản" />
                </p>
              </div>
              <ChevronDown className="h-4 w-4 shrink-0 text-foreground/50" />
            </SelectTrigger>
            <SelectContent className="rounded-xl border border-white/40 bg-white/95 backdrop-blur-md shadow-lg">
              <SelectItem value="all" className="rounded-lg">Tất cả tài khoản</SelectItem>
              {ACCOUNTS.map(a => (
                <SelectItem key={a.id} value={a.name} className="rounded-lg">{a.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>

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
          {isLoading ? (
            <div className="space-y-5 animate-in fade-in duration-500">
              {[1, 2].map((_, idx) => (
                <div key={idx} className="space-y-2">
                  <div className="h-4 w-24 rounded-full bg-foreground/10 animate-pulse" />
                  <div className="rounded-2xl border border-white/70 bg-white/80 p-1 shadow-sm">
                    {[1, 2, 3].map((_, i) => (
                      <div key={i} className={`flex items-center gap-3 p-3 ${i > 0 ? "border-t border-foreground/5" : ""}`}>
                        <div className="h-11 w-11 shrink-0 rounded-2xl bg-foreground/5 animate-pulse" />
                        <div className="flex-1 space-y-2.5">
                          <div className="h-3.5 w-32 rounded-full bg-foreground/10 animate-pulse" />
                          <div className="h-2.5 w-20 rounded-full bg-foreground/5 animate-pulse" />
                        </div>
                        <div className="h-4 w-16 rounded-full bg-foreground/10 animate-pulse" />
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <>
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
                    <div className="flex flex-col gap-2.5">
                      {items.map((t, i) => {
                        const isSelected = selected.has(t.id);
                        const row = (
                          <TransactionRow
                            transaction={t}
                            selectMode={selectMode}
                            isSelected={isSelected}
                            maskBalance={false}
                          />
                        );
                        return (
                          <FadeInUp 
                            key={t.id}
                            delay={i * 0.05}
                          >
                            {selectMode ? (
                              <div>
                                <button className="w-full text-left" onClick={() => toggle(t.id)}>
                                  {row}
                                </button>
                              </div>
                            ) : (
                              <SwipeableItem onDelete={() => setDeleteTxId(t.id)} className="rounded-2xl">
                                <div>
                                  <Link
                                    to="/transactions/$id"
                                    params={{ id: t.id }}
                                    className="block"
                                  >
                                    {row}
                                  </Link>
                                </div>
                              </SwipeableItem>
                            )}
                          </FadeInUp>
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
            </>
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

        {/* Alert Dialog */}
        <AlertDialog open={!!deleteTxId} onOpenChange={(open) => !open && setDeleteTxId(null)}>
          <AlertDialogContent className="w-[90%] max-w-[340px] rounded-3xl">
            <AlertDialogHeader>
              <AlertDialogTitle>Xoá giao dịch?</AlertDialogTitle>
              <AlertDialogDescription>
                Bạn có chắc chắn muốn xoá giao dịch này? Hành động này không thể hoàn tác.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter className="mt-2 flex-row justify-end space-x-2 space-y-0">
              <AlertDialogCancel className="rounded-xl border-foreground/10 bg-transparent text-foreground hover:bg-foreground/5 h-11 border mt-0">Huỷ</AlertDialogCancel>
              <AlertDialogAction
                className="rounded-xl bg-red-600 text-white hover:bg-red-700 h-11"
                onClick={() => {
                  toast.success("Đã xoá giao dịch");
                  setDeleteTxId(null);
                }}
              >
                Xoá
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </PhoneFrame>
  );
}
