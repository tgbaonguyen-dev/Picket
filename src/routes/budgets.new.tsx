import { createFileRoute, Link } from "@tanstack/react-router";
import { PhoneFrame } from "@/components/phone-frame";
import { useState } from "react";

export const Route = createFileRoute("/budgets/new")({ component: NewBudget });

function NewBudget() {
  const [name, setName] = useState("Ăn uống");
  const [amount, setAmount] = useState("4500000");
  const [period, setPeriod] = useState("month");
  const [rollover, setRollover] = useState(true);

  return (
    <PhoneFrame title="Tạo ngân sách" subtitle="Chi tiết mới">
      <div className="space-y-4 px-5 pb-8">
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-foreground/60">Tên ngân sách</label>
          <input value={name} onChange={e => setName(e.target.value)} className="w-full rounded-2xl bg-white/80 px-4 py-3 text-sm" />
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-foreground/60">Hạn mức (VND)</label>
          <input value={amount} onChange={e => setAmount(e.target.value)} inputMode="numeric" className="w-full rounded-2xl bg-white/80 px-4 py-3 text-lg font-bold tabular-nums" />
          <p className="text-xs text-foreground/50">Gợi ý dựa trên trung bình 3 tháng: 4.200.000₫</p>
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-foreground/60">Kỳ ngân sách</label>
          <div className="grid grid-cols-3 gap-2">
            {[["week", "Tuần"], ["month", "Tháng"], ["custom", "Tuỳ chỉnh"]].map(([v, l]) => (
              <button key={v} onClick={() => setPeriod(v)} className={`rounded-2xl py-2.5 text-sm font-medium ${period === v ? "bg-foreground text-background" : "bg-white/70"}`}>{l}</button>
            ))}
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-foreground/60">Phạm vi</label>
          <div className="rounded-2xl bg-white/80 p-3 text-sm">Danh mục: <strong>Ăn uống</strong> · 3 tag</div>
        </div>

        <label className="flex items-center justify-between rounded-2xl bg-white/80 p-4">
          <div>
            <p className="text-sm font-semibold">Rollover phần dư</p>
            <p className="text-xs text-foreground/60">Chuyển tiền chưa dùng sang kỳ sau</p>
          </div>
          <input type="checkbox" checked={rollover} onChange={e => setRollover(e.target.checked)} className="h-5 w-5" />
        </label>

        <div className="rounded-2xl bg-white/80 p-4">
          <p className="text-sm font-semibold">Cảnh báo</p>
          <p className="mt-1 text-xs text-foreground/60">Thông báo khi đạt 80% và khi vượt hạn mức.</p>
        </div>

        <div className="rounded-2xl bg-white/80 p-4">
          <p className="text-sm font-semibold">Chia sẻ hộ gia đình</p>
          <p className="mt-1 text-xs text-foreground/60">Chủ sở hữu: Bạn · 2 thành viên chỉ xem</p>
        </div>

        <Link to="/budgets" className="block rounded-2xl bg-[#B5828C] py-3.5 text-center text-sm font-semibold text-white shadow-lg">Lưu ngân sách</Link>
      </div>
    </PhoneFrame>
  );
}
