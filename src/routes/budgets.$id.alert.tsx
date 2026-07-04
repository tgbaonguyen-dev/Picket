import { createFileRoute, Link, useParams } from "@tanstack/react-router";
import { PhoneFrame } from "@/components/phone-frame";
import { AlertTriangle, TrendingUp, ArrowLeftRight, BellOff } from "lucide-react";

export const Route = createFileRoute("/budgets/$id/alert")({ component: BudgetAlert });

const fmt = (n: number) => n.toLocaleString("vi-VN") + "₫";

function BudgetAlert() {
  const { id } = useParams({ from: "/budgets/$id/alert" });
  return (
    <PhoneFrame title="Cảnh báo ngân sách" subtitle="Chi tiết vượt hạn">
      <div className="space-y-4 px-5 pb-8">
        <div className="rounded-3xl bg-gradient-to-br from-red-500 to-rose-600 p-5 text-white">
          <div className="flex items-center gap-2"><AlertTriangle className="h-5 w-5" /><p className="text-xs font-semibold uppercase tracking-wide">Vượt ngân sách</p></div>
          <p className="mt-3 text-2xl font-bold">Mua sắm đã vượt 30%</p>
          <p className="mt-1 text-sm opacity-90">Dự báo cuối tháng: <strong>{fmt(3400000)}</strong> / {fmt(2000000)}</p>
        </div>

        <div className="rounded-2xl bg-white/80 p-4">
          <div className="flex items-center gap-2 text-sm font-semibold"><TrendingUp className="h-4 w-4" />Xu hướng 7 ngày</div>
          <div className="mt-3 flex h-24 items-end gap-2">
            {[30, 45, 60, 40, 80, 95, 70].map((h, i) => (
              <div key={i} className="flex-1 rounded-t bg-gradient-to-t from-red-400 to-red-500" style={{ height: `${h}%` }} />
            ))}
          </div>
        </div>

        <div>
          <h2 className="mb-2 text-sm font-bold text-foreground/70">Giao dịch lớn nhất</h2>
          <div className="space-y-2">
            {[{ m: "Shopee", a: 850000 }, { m: "Uniqlo", a: 650000 }, { m: "Tiki", a: 420000 }].map((t, i) => (
              <div key={i} className="flex justify-between rounded-2xl bg-white/80 p-3">
                <span className="text-sm font-medium">{t.m}</span>
                <span className="text-sm font-semibold text-red-600">-{fmt(t.a)}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <h2 className="text-sm font-bold text-foreground/70">Hành động</h2>
          <Link to="/budgets/transfer" className="flex items-center gap-3 rounded-2xl bg-white/80 p-4"><ArrowLeftRight className="h-5 w-5 text-[#B5828C]" /><div><p className="text-sm font-semibold">Chuyển ngân sách</p><p className="text-xs text-foreground/60">Bù từ danh mục còn dư</p></div></Link>
          <Link to="/budgets/$id/edit" params={{ id }} className="flex items-center gap-3 rounded-2xl bg-white/80 p-4"><TrendingUp className="h-5 w-5 text-[#B5828C]" /><div><p className="text-sm font-semibold">Tăng hạn mức</p><p className="text-xs text-foreground/60">Cập nhật cho kỳ sau</p></div></Link>
          <button className="flex w-full items-center gap-3 rounded-2xl bg-white/80 p-4"><BellOff className="h-5 w-5 text-foreground/60" /><div className="text-left"><p className="text-sm font-semibold">Tắt ngưỡng cảnh báo</p><p className="text-xs text-foreground/60">Cho kỳ này</p></div></button>
        </div>
      </div>
    </PhoneFrame>
  );
}
