import { createFileRoute, Link } from "@tanstack/react-router";
import { PhoneFrame } from "@/components/phone-frame";
import { Plus, ChevronRight, TrendingUp, AlertTriangle, CheckCircle2, Calendar, ArrowRightLeft } from "lucide-react";
import { useState, useEffect } from "react";
import { formatVND } from "@/lib/mock-transactions";

export const Route = createFileRoute("/budgets/")({ component: BudgetDashboard });

const budgets = [
  { id: "food", name: "Ăn uống", spent: 3200000, limit: 4500000, status: "ok" as const, icon: "🍜" },
  { id: "transport", name: "Di chuyển", spent: 1800000, limit: 2000000, status: "warn" as const, icon: "🚕" },
  { id: "shopping", name: "Mua sắm", spent: 2600000, limit: 2000000, status: "over" as const, icon: "🛍️" },
  { id: "bills", name: "Hóa đơn", spent: 2100000, limit: 3000000, status: "ok" as const, icon: "💡" },
  { id: "fun", name: "Giải trí", spent: 900000, limit: 1500000, status: "ok" as const, icon: "🎬" },
];

const fmt = (n: number) => formatVND(n);

function BudgetDashboard() {
  const [period, setPeriod] = useState("Tháng 7");
  const [budgetsList, setBudgetsList] = useState(budgets);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setIsLoading(false), 800);
    return () => clearTimeout(t);
  }, []);
  
  if (!isLoading && budgetsList.length === 0) {
    return (
      <PhoneFrame title="Ngân sách" subtitle="Kế hoạch chi tiêu" right={
        <button onClick={() => setBudgetsList(budgets)} className="text-[10px] font-bold uppercase text-foreground/50 active:scale-95 transition">Demo Khôi phục</button>
      }>
        <div className="flex h-full flex-col items-center justify-center px-6 pb-20 text-center animate-in fade-in duration-500">
          <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-[32px] bg-[#FFB4A2]/20 rotate-3 shadow-inner">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-[#FFB4A2] to-[#B5828C] text-white shadow-xl shadow-[#B5828C]/30 -rotate-6">
              <TrendingUp className="h-8 w-8" strokeWidth={2.5} />
            </div>
          </div>
          <h2 className="font-display text-[24px] font-bold text-foreground">Chưa có ngân sách</h2>
          <p className="mt-3 font-sans text-[14px] text-foreground/60 max-w-[250px] leading-relaxed mx-auto">
            Thiết lập ngân sách giúp bạn kiểm soát chi tiêu và hoàn thành các mục tiêu tài chính nhanh hơn.
          </p>
          <Link to="/budgets/new" className="mt-8 rounded-2xl bg-foreground px-8 py-4 font-sans text-[15px] font-bold text-background shadow-xl shadow-foreground/20 active:scale-[0.98] transition">
            Tạo ngân sách đầu tiên
          </Link>
        </div>
      </PhoneFrame>
    );
  }

  const totalLimit = budgetsList.reduce((s, b) => s + b.limit, 0);
  const totalSpent = budgetsList.reduce((s, b) => s + b.spent, 0);
  const remaining = totalLimit - totalSpent;
  const pct = Math.min(100, (totalSpent / totalLimit) * 100);

  return (
    <PhoneFrame title="Ngân sách" subtitle="Kế hoạch chi tiêu">
      <div className="space-y-4 px-5 pb-8">
        <div className="flex gap-2 overflow-x-auto">
          {["Tháng 6", "Tháng 7", "Tháng 8"].map(p => (
            <button key={p} onClick={() => setPeriod(p)} className={`flex items-center gap-1.5 whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium ${period === p ? "bg-foreground text-background" : "bg-white/70 text-foreground/70"}`}>
              <Calendar className="h-3.5 w-3.5" />{p}
            </button>
          ))}
        </div>

        <div className="rounded-3xl bg-gradient-to-br from-[#FFB4A2] to-[#B5828C] p-5 text-white shadow-lg">
          <p className="text-xs font-medium opacity-80">Tổng ngân sách {period}</p>
          <p className="mt-1 text-3xl font-bold tabular-nums">{fmt(remaining)}</p>
          <p className="mt-0.5 text-xs opacity-90">còn lại từ {fmt(totalLimit)}</p>
          <div className="mt-4 h-2 overflow-hidden rounded-full bg-white/25">
            <div className="h-full bg-white" style={{ width: `${pct}%` }} />
          </div>
          <div className="mt-2 flex justify-between text-xs opacity-90">
            <span>Đã chi {fmt(totalSpent)}</span>
            <span>{pct.toFixed(0)}%</span>
          </div>
        </div>

        {/* SVG Bar Chart */}
        <div className="rounded-3xl border border-white/70 bg-white/70 p-5 shadow-sm backdrop-blur-md">
          <div className="mb-4 flex items-center justify-between">
            <p className="text-[13px] font-bold text-foreground">Chi tiêu theo tuần</p>
            <span className="text-[10px] font-semibold uppercase tracking-wider text-foreground/40">Tháng này</span>
          </div>
          <div className="flex h-32 items-end justify-between gap-3 px-2">
            {[3200000, 4500000, 2500000, 1500000].map((v, i) => {
              const height = (v / 5000000) * 100;
              return (
                <div key={i} className="group relative flex flex-1 flex-col items-center justify-end h-full">
                  <div className="w-full max-w-[32px] h-full flex flex-col justify-end">
                    <div className="w-full bg-[#B5828C] rounded-t-[10px] transition-all duration-700 ease-out" style={{ height: `${height}%` }} />
                  </div>
                  <span className="mt-2 text-[10px] font-bold text-foreground/50 uppercase">T{i+1}</span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-2xl bg-white/70 p-3">
            <div className="flex items-center gap-1.5 text-xs text-foreground/60"><TrendingUp className="h-3.5 w-3.5" />Dự báo cuối kỳ</div>
            <p className="mt-1 text-lg font-bold tabular-nums text-foreground">{fmt(11400000)}</p>
          </div>
          <div className="rounded-2xl bg-white/70 p-3">
            <div className="flex items-center gap-1.5 text-xs text-foreground/60"><AlertTriangle className="h-3.5 w-3.5" />Chưa gán ngân sách</div>
            <p className="mt-1 text-lg font-bold tabular-nums text-foreground">{fmt(650000)}</p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="flex gap-2">
          <Link to="/budgets/method" className="flex flex-1 flex-col items-center justify-center gap-1.5 rounded-2xl bg-[#B5828C] p-3 text-white shadow-md transition active:scale-95">
            <Plus className="h-5 w-5" strokeWidth={2.5} />
            <span className="text-[11px] font-bold">Thêm mới</span>
          </Link>
          <Link to="/budgets/transfer" className="flex flex-1 flex-col items-center justify-center gap-1.5 rounded-2xl border border-white/60 bg-white/70 p-3 text-foreground/80 shadow-sm transition active:scale-95">
            <ArrowRightLeft className="h-5 w-5" strokeWidth={2.2} />
            <span className="text-[11px] font-bold">Điều chuyển</span>
          </Link>
          <Link to="/budgets/close" className="flex flex-1 flex-col items-center justify-center gap-1.5 rounded-2xl border border-white/60 bg-white/70 p-3 text-foreground/80 shadow-sm transition active:scale-95">
            <CheckCircle2 className="h-5 w-5" strokeWidth={2.2} />
            <span className="text-[11px] font-bold">Đóng kỳ</span>
          </Link>
        </div>

        <div>
          <div className="mb-3 flex items-center justify-between px-1">
            <div className="flex items-center gap-2">
              <h2 className="font-display text-[16px] font-bold text-foreground">Theo danh mục</h2>
              <button onClick={() => setBudgetsList([])} className="text-[9px] uppercase text-red-500 font-bold bg-red-50 rounded px-1.5 py-0.5 active:bg-red-100">Empty</button>
            </div>
          </div>
          <div className="space-y-2.5">
            {isLoading ? (
              <div className="space-y-3 animate-in fade-in duration-500">
                {[1, 2, 3].map((_, i) => (
                  <div key={i} className="rounded-[20px] bg-white/80 border border-white p-4">
                    <div className="flex items-center gap-3">
                      <div className="h-11 w-11 shrink-0 rounded-2xl bg-foreground/5 animate-pulse" />
                      <div className="flex-1 space-y-2.5">
                        <div className="h-4 w-24 rounded-full bg-foreground/10 animate-pulse" />
                        <div className="h-3 w-32 rounded-full bg-foreground/5 animate-pulse" />
                      </div>
                    </div>
                    <div className="mt-3.5 h-2 w-full rounded-full bg-foreground/5 animate-pulse" />
                  </div>
                ))}
              </div>
            ) : (
              budgetsList.map(b => {
                const p = Math.min(100, (b.spent / b.limit) * 100);
              const color = b.status === "over" ? "bg-expense" : b.status === "warn" ? "bg-amber-500" : "bg-[#FFB4A2]";
              return (
                <Link key={b.id} to="/budgets/$id" params={{ id: b.id }} className={`block rounded-[20px] p-4 active:scale-[0.99] border transition-colors ${b.status === "over" ? "bg-red-50/80 border-red-100" : "bg-white/80 border-white"}`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white text-xl shadow-sm border border-foreground/5">{b.icon}</span>
                      <div>
                        <p className="font-bold text-foreground">{b.name}</p>
                        <p className="text-xs tabular-nums text-foreground/50">{fmt(b.spent)} / {fmt(b.limit)}</p>
                      </div>
                    </div>
                    <ChevronRight className="h-4 w-4 text-foreground/30" />
                  </div>
                  <div className="mt-3.5 h-2 overflow-hidden rounded-full bg-foreground/10 relative">
                    <div className={`h-full ${color}`} style={{ width: `${p}%` }} />
                    {b.status === "over" && <div className="absolute right-0 top-0 bottom-0 w-2 bg-expense animate-pulse" />}
                  </div>
                  {b.status === "over" && (
                    <div className="mt-2.5 flex items-center gap-1.5 rounded-xl bg-expense/10 px-3 py-2 text-[12px] font-bold text-expense">
                      <AlertTriangle className="h-4 w-4" />
                      Vượt {fmt(b.spent - b.limit)} so với ngân sách
                    </div>
                  )}
                  {b.status === "ok" && b.id === "food" && (
                    <p className="mt-2 flex items-center gap-1.5 text-[11px] font-semibold text-[#16a34a]">
                      <CheckCircle2 className="h-3.5 w-3.5" />
                      Đúng tiến độ
                    </p>
                  )}
                </Link>
              );
            })
          )}
          </div>
        </div>
      </div>
    </PhoneFrame>
  );
}
