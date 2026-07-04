import { createFileRoute, Link, useParams } from "@tanstack/react-router";
import { PhoneFrame } from "@/components/phone-frame";
import { Edit3, ArrowLeftRight, Bell, Users, TrendingUp } from "lucide-react";

export const Route = createFileRoute("/budgets/$id")({ component: BudgetDetail });

const fmt = (n: number) => n.toLocaleString("vi-VN") + "₫";

const data: Record<string, { name: string; icon: string; spent: number; limit: number; status: string }> = {
  food: { name: "Ăn uống", icon: "🍜", spent: 3200000, limit: 4500000, status: "healthy" },
  transport: { name: "Di chuyển", icon: "🚕", spent: 1800000, limit: 2000000, status: "warning" },
  shopping: { name: "Mua sắm", icon: "🛍️", spent: 2600000, limit: 2000000, status: "exceeded" },
  bills: { name: "Hóa đơn", icon: "💡", spent: 2100000, limit: 3000000, status: "healthy" },
  fun: { name: "Giải trí", icon: "🎬", spent: 900000, limit: 1500000, status: "healthy" },
};

const txs = [
  { m: "Highlands Coffee", a: 85000, d: "Hôm nay" },
  { m: "GrabFood - Cơm tấm", a: 120000, d: "Hôm qua" },
  { m: "Circle K", a: 45000, d: "2 ngày trước" },
  { m: "Phúc Long", a: 68000, d: "3 ngày trước" },
];

function BudgetDetail() {
  const { id } = useParams({ from: "/budgets/$id" });
  const b = data[id] ?? data.food;
  const pct = Math.min(100, (b.spent / b.limit) * 100);
  const remaining = b.limit - b.spent;
  const color = b.status === "exceeded" ? "from-red-500 to-rose-600" : b.status === "warning" ? "from-amber-500 to-orange-500" : "from-[#FFB4A2] to-[#B5828C]";

  return (
    <PhoneFrame title={b.name} subtitle="Chi tiết ngân sách" right={
      <Link to="/budgets/$id/edit" params={{ id }} className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white/70"><Edit3 className="h-4 w-4" /></Link>
    }>
      <div className="space-y-4 px-5 pb-24">
        <div className={`rounded-3xl bg-gradient-to-br ${color} p-6 text-white shadow-lg`}>
          <div className="flex items-center gap-2 text-4xl">{b.icon}</div>
          <p className="mt-3 text-xs opacity-80">Đã chi</p>
          <p className="text-3xl font-bold tabular-nums">{fmt(b.spent)}</p>
          <div className="mt-3 h-2 overflow-hidden rounded-full bg-white/25">
            <div className="h-full bg-white" style={{ width: `${pct}%` }} />
          </div>
          <div className="mt-2 flex justify-between text-xs opacity-90">
            <span>Còn {fmt(remaining)}</span>
            <span>Hạn mức {fmt(b.limit)}</span>
          </div>
        </div>

        <div className="rounded-2xl bg-white/80 p-4">
          <div className="flex items-center gap-2 text-sm font-semibold"><TrendingUp className="h-4 w-4 text-[#B5828C]" />Dự báo cuối kỳ</div>
          <p className="mt-1 text-xs text-foreground/60">Với tốc độ hiện tại, bạn sẽ chi khoảng <strong className="text-foreground">{fmt(Math.round(b.spent * 1.4))}</strong> đến cuối tháng.</p>
        </div>

        <div className="grid grid-cols-3 gap-2">
          <Link to="/budgets/$id/edit" params={{ id }} className="flex flex-col items-center gap-1 rounded-2xl bg-white/70 p-3 text-xs font-medium"><Edit3 className="h-4 w-4" />Sửa</Link>
          <Link to="/budgets/transfer" className="flex flex-col items-center gap-1 rounded-2xl bg-white/70 p-3 text-xs font-medium"><ArrowLeftRight className="h-4 w-4" />Chuyển</Link>
          <Link to="/budgets/$id/alert" params={{ id }} className="flex flex-col items-center gap-1 rounded-2xl bg-white/70 p-3 text-xs font-medium"><Bell className="h-4 w-4" />Cảnh báo</Link>
        </div>

        <div>
          <h2 className="mb-2 text-sm font-bold text-foreground/70">Giao dịch trong kỳ</h2>
          <div className="space-y-2">
            {txs.map((t, i) => (
              <div key={i} className="flex items-center justify-between rounded-2xl bg-white/80 p-3">
                <div>
                  <p className="text-sm font-medium">{t.m}</p>
                  <p className="text-xs text-foreground/50">{t.d}</p>
                </div>
                <p className="text-sm font-semibold tabular-nums">-{fmt(t.a)}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl bg-white/80 p-4">
          <div className="flex items-center gap-2 text-sm font-semibold"><Users className="h-4 w-4" />Thành viên</div>
          <p className="mt-1 text-xs text-foreground/60">Bạn & 2 thành viên hộ gia đình</p>
        </div>
      </div>
    </PhoneFrame>
  );
}
