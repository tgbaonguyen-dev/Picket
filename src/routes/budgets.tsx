import { createFileRoute, Link } from "@tanstack/react-router";
import { PhoneFrame } from "@/components/phone-frame";
import { Plus, ChevronRight, TrendingUp, AlertTriangle, CheckCircle2, Calendar } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/budgets")({ component: BudgetDashboard });

const budgets = [
  { id: "food", name: "Ăn uống", spent: 3200000, limit: 4500000, status: "ok" as const, icon: "🍜" },
  { id: "transport", name: "Di chuyển", spent: 1800000, limit: 2000000, status: "warn" as const, icon: "🚕" },
  { id: "shopping", name: "Mua sắm", spent: 2600000, limit: 2000000, status: "over" as const, icon: "🛍️" },
  { id: "bills", name: "Hóa đơn", spent: 2100000, limit: 3000000, status: "ok" as const, icon: "💡" },
  { id: "fun", name: "Giải trí", spent: 900000, limit: 1500000, status: "ok" as const, icon: "🎬" },
];

const fmt = (n: number) => n.toLocaleString("vi-VN") + "₫";

function BudgetDashboard() {
  const [period, setPeriod] = useState("Tháng 7");
  const totalLimit = budgets.reduce((s, b) => s + b.limit, 0);
  const totalSpent = budgets.reduce((s, b) => s + b.spent, 0);
  const remaining = totalLimit - totalSpent;
  const pct = Math.min(100, (totalSpent / totalLimit) * 100);

  return (
    <PhoneFrame title="Ngân sách" subtitle="Kế hoạch chi tiêu" right={
      <Link to="/budgets/method" className="flex h-10 w-10 items-center justify-center rounded-2xl bg-foreground text-background shadow-md active:scale-95">
        <Plus className="h-5 w-5" />
      </Link>
    }>
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

        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-2xl bg-white/70 p-3">
            <div className="flex items-center gap-1.5 text-xs text-foreground/60"><TrendingUp className="h-3.5 w-3.5" />Dự báo cuối kỳ</div>
            <p className="mt-1 text-lg font-bold">{fmt(11400000)}</p>
          </div>
          <div className="rounded-2xl bg-white/70 p-3">
            <div className="flex items-center gap-1.5 text-xs text-foreground/60"><AlertTriangle className="h-3.5 w-3.5" />Chưa gán ngân sách</div>
            <p className="mt-1 text-lg font-bold">{fmt(650000)}</p>
          </div>
        </div>

        <div>
          <div className="mb-2 flex items-center justify-between">
            <h2 className="text-sm font-bold text-foreground/70">Theo danh mục</h2>
            <Link to="/budgets/close" className="text-xs font-semibold text-[#8F5F68]">Đóng kỳ →</Link>
          </div>
          <div className="space-y-2.5">
            {budgets.map(b => {
              const p = Math.min(100, (b.spent / b.limit) * 100);
              const color = b.status === "over" ? "bg-red-500" : b.status === "warn" ? "bg-amber-500" : "bg-[#FFB4A2]";
              return (
                <Link key={b.id} to="/budgets/$id" params={{ id: b.id }} className="block rounded-2xl bg-white/80 p-4 active:scale-[0.99]">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <span className="text-2xl">{b.icon}</span>
                      <div>
                        <p className="font-semibold">{b.name}</p>
                        <p className="text-xs tabular-nums text-foreground/60">{fmt(b.spent)} / {fmt(b.limit)}</p>
                      </div>
                    </div>
                    <ChevronRight className="h-4 w-4 text-foreground/40" />
                  </div>
                  <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-foreground/10">
                    <div className={`h-full ${color}`} style={{ width: `${p}%` }} />
                  </div>
                  {b.status === "over" && <p className="mt-1.5 flex items-center gap-1 text-xs font-medium text-red-600"><AlertTriangle className="h-3 w-3" />Vượt {fmt(b.spent - b.limit)}</p>}
                  {b.status === "ok" && b.id === "food" && <p className="mt-1.5 flex items-center gap-1 text-xs text-[#8F5F68]"><CheckCircle2 className="h-3 w-3" />Đúng tiến độ</p>}
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </PhoneFrame>
  );
}
