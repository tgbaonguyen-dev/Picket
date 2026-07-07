import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo } from "react";
import {
  Utensils,
  Car,
  ShoppingBag,
  Receipt,
  Film,
  MoreHorizontal,
  TrendingDown,
  TrendingUp,
  PieChart,
} from "lucide-react";
import { PhoneFrame } from "@/components/phone-frame";
import { TRANSACTIONS, formatVND } from "@/data";

export const Route = createFileRoute("/expenses/")({
  head: () => ({
    meta: [
      { title: "Chi tiêu · Picket" },
      { name: "description", content: "Phân tích chi tiêu theo danh mục trong tháng." },
    ],
  }),
  component: ExpensesPage,
});

type Category = "food" | "transport" | "shopping" | "bills" | "entertainment" | "other";

const LOCAL_CATEGORIES = [
  { key: "food", label: "Ăn uống", icon: Utensils, bg: "#ffe4e6", fg: "#b03a4a" },
  { key: "transport", label: "Di chuyển", icon: Car, bg: "#FFE9D9", fg: "#B5828C" },
  { key: "shopping", label: "Mua sắm", icon: ShoppingBag, bg: "#fef3c7", fg: "#a16207" },
  { key: "bills", label: "Hóa đơn", icon: Receipt, bg: "#ede9fe", fg: "#6d28d9" },
  { key: "entertainment", label: "Giải trí", icon: Film, bg: "#dcfce7", fg: "#15803d" },
  { key: "other", label: "Khác", icon: MoreHorizontal, bg: "#f1f5f9", fg: "#475569" },
];

const CATEGORY_MAP: Record<string, Category> = {
  "Ăn uống": "food",
  "Di chuyển": "transport",
  "Mua sắm": "shopping",
  "Hóa đơn": "bills",
  "Giải trí": "entertainment",
};

function ExpensesPage() {
  // Derive expenses from shared TRANSACTIONS mock data
  const expenses = useMemo(() => {
    return TRANSACTIONS.filter((t) => t.type === "expense");
  }, []);

  const total = expenses.reduce((s, e) => s + e.amount, 0);

  const byCat = useMemo(() => {
    const map = new Map<string, number>();
    for (const e of expenses) {
      const catKey = CATEGORY_MAP[e.category] ?? "other";
      map.set(catKey, (map.get(catKey) ?? 0) + e.amount);
    }
    return LOCAL_CATEGORIES.map((c) => ({ ...c, amount: map.get(c.key) ?? 0 })).sort(
      (a, b) => b.amount - a.amount,
    );
  }, [expenses]);

  const daysSoFar = 15; // April 15
  const avgPerDay = daysSoFar > 0 ? total / daysSoFar : 0;

  return (
    <PhoneFrame title="Phân tích chi tiêu" subtitle="Tháng 4 · 2026" right={
      <Link
        to="/transactions"
        className="flex h-10 w-10 items-center justify-center rounded-2xl border border-white/70 bg-white/70 text-foreground/80 shadow-sm"
        aria-label="Xem giao dịch"
      >
        <PieChart className="h-5 w-5" strokeWidth={2} />
      </Link>
    }>
      <div className="px-5 pb-8">
        {/* Total card */}
        <div className="relative overflow-hidden rounded-[28px] bg-gradient-to-br from-[#B5828C] to-[#1e4a63] p-5 text-white shadow-[0_20px_50px_-20px_rgba(46,107,138,0.6)]">
          <div className="pointer-events-none absolute -right-8 -top-10 h-32 w-32 rounded-full bg-white/10 blur-2xl" />
          <div className="pointer-events-none absolute -bottom-10 -left-6 h-28 w-28 rounded-full bg-[#f9a8a8]/30 blur-2xl" />
          <p className="relative font-sans text-[11px] font-semibold uppercase tracking-[0.18em] text-white/70">
            Tổng chi tháng này
          </p>
          <p className="relative mt-2 font-display text-[32px] font-bold leading-none tabular-nums">
            {formatVND(total)}
          </p>
          <div className="relative mt-4 flex items-center gap-4">
            <Stat
              icon={<TrendingDown className="h-3.5 w-3.5" strokeWidth={2.5} />}
              label="TB/ngày"
              value={formatVND(Math.round(avgPerDay))}
            />
            <div className="h-8 w-px bg-white/15" />
            <Stat
              icon={<TrendingUp className="h-3.5 w-3.5" strokeWidth={2.5} />}
              label="Giao dịch"
              value={String(expenses.length)}
            />
          </div>
        </div>

        {/* Donut Chart & Categories */}
        <div className="mt-6">
          <div className="mb-4 flex items-baseline justify-between">
            <h2 className="font-display text-[16px] font-bold text-foreground">Phân bổ chi tiêu</h2>
            <span className="font-sans text-[10px] font-semibold uppercase tracking-[0.16em] text-foreground/40">
              {LOCAL_CATEGORIES.length} loại
            </span>
          </div>
          
          <div className="flex flex-col gap-5 rounded-3xl border border-white/70 bg-white/70 p-5 shadow-sm backdrop-blur-md">
            {/* Donut Chart SVG */}
            {total > 0 ? (
              <div className="relative mx-auto h-40 w-40">
                <svg width="100%" height="100%" viewBox="0 0 42 42" className="-rotate-90 transform drop-shadow-md">
                  <circle r="15.91549430918954" cx="21" cy="21" fill="transparent" stroke="#00000010" strokeWidth="6" />
                  {(() => {
                    let cumulative = 0;
                    return byCat.map((c) => {
                      if (c.amount === 0) return null;
                      const pct = (c.amount / total) * 100;
                      // Circumference is 100, we draw pct and gap is 100 - pct
                      const offset = 100 - cumulative;
                      cumulative += pct;
                      return (
                        <circle
                          key={c.key}
                          r="15.91549430918954"
                          cx="21"
                          cy="21"
                          fill="transparent"
                          stroke={c.fg}
                          strokeWidth="6"
                          strokeDasharray={`${pct} ${100 - pct}`}
                          strokeDashoffset={offset}
                          className="transition-all duration-1000 ease-out"
                        />
                      );
                    });
                  })()}
                </svg>
                {/* Center text */}
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="font-sans text-[10px] font-bold uppercase tracking-[0.14em] text-foreground/50">Tháng này</span>
                  <span className="font-display text-[14px] font-bold text-foreground tabular-nums">{formatVND(total)}</span>
                </div>
              </div>
            ) : (
              <div className="flex h-32 items-center justify-center rounded-2xl border-2 border-dashed border-foreground/10">
                <p className="font-sans text-[13px] font-medium text-foreground/40">Chưa có dữ liệu chi tiêu</p>
              </div>
            )}

            {/* List */}
            <div className="space-y-3">
              {byCat.map((c) => {
                const pct = total > 0 ? Math.round((c.amount / total) * 100) : 0;
                return (
                  <Link key={c.key} to="/expenses/$id" params={{ id: c.key }} className="flex items-center gap-3 active:scale-[0.98] transition">
                    <div
                      className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[14px] shadow-sm"
                      style={{ backgroundColor: c.bg, color: c.fg }}
                    >
                      <c.icon className="h-[18px] w-[18px]" strokeWidth={2.4} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between">
                        <p className="font-sans text-[13px] font-bold text-foreground">{c.label}</p>
                        <p className="font-display text-[13px] font-bold tabular-nums text-foreground">
                          {c.amount > 0 ? formatVND(c.amount) : "—"}
                        </p>
                      </div>
                      <div className="mt-1.5 flex items-center gap-2">
                        <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-black/[0.05]">
                          <div
                            className="h-full rounded-full transition-all duration-1000 ease-out"
                            style={{ width: `${pct}%`, backgroundColor: c.fg }}
                          />
                        </div>
                        <span className="w-7 text-right font-sans text-[10px] font-bold tabular-nums text-foreground/50">
                          {pct}%
                        </span>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>

        {/* CTA to transactions */}
        <Link
          to="/transactions"
          className="mt-6 flex items-center justify-between rounded-2xl border border-[#B5828C]/20 bg-gradient-to-r from-[#FFE9D9] to-[#ffe4e6] px-4 py-3.5 shadow-sm transition active:scale-[0.98]"
        >
          <div className="min-w-0">
            <p className="font-sans text-[10px] font-bold uppercase tracking-[0.14em] text-[#B5828C]">
              Xem chi tiết
            </p>
            <p className="font-display text-[15px] font-semibold text-foreground">
              Tất cả giao dịch chi →
            </p>
          </div>
        </Link>
      </div>
    </PhoneFrame>
  );
}

function Stat({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-2">
      <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-white/15 text-white/90">
        {icon}
      </div>
      <div>
        <p className="font-sans text-[9px] font-bold uppercase tracking-[0.16em] text-white/60">
          {label}
        </p>
        <p className="font-sans text-[12px] font-bold tabular-nums text-white">{value}</p>
      </div>
    </div>
  );
}
