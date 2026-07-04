import { createFileRoute, Link } from "@tanstack/react-router";
import { PhoneFrame } from "@/components/phone-frame";
import { ArrowRight } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/budgets/transfer")({ component: TransferBudget });

const fmt = (n: number) => n.toLocaleString("vi-VN") + "₫";

function TransferBudget() {
  const [amount, setAmount] = useState(300000);
  return (
    <PhoneFrame title="Chuyển ngân sách" subtitle="Giữa các danh mục">
      <div className="space-y-4 px-5 pb-8">
        <div className="rounded-3xl bg-white/80 p-5">
          <p className="text-xs font-semibold text-foreground/60">Từ</p>
          <div className="mt-2 flex items-center justify-between">
            <div className="flex items-center gap-2"><span className="text-2xl">🎬</span><div><p className="font-semibold">Giải trí</p><p className="text-xs text-foreground/60">Còn {fmt(600000)}</p></div></div>
            <button className="rounded-full bg-foreground/5 px-3 py-1 text-xs">Đổi</button>
          </div>

          <div className="my-3 flex justify-center"><div className="rounded-full bg-[#FFE4D2] p-2"><ArrowRight className="h-4 w-4 rotate-90 text-[#8F5F68]" /></div></div>

          <p className="text-xs font-semibold text-foreground/60">Đến</p>
          <div className="mt-2 flex items-center justify-between">
            <div className="flex items-center gap-2"><span className="text-2xl">🛍️</span><div><p className="font-semibold">Mua sắm</p><p className="text-xs text-red-600">Vượt {fmt(600000)}</p></div></div>
            <button className="rounded-full bg-foreground/5 px-3 py-1 text-xs">Đổi</button>
          </div>
        </div>

        <div className="rounded-3xl bg-white/80 p-5 text-center">
          <p className="text-xs font-semibold text-foreground/60">Số tiền chuyển</p>
          <input value={amount} onChange={e => setAmount(Number(e.target.value) || 0)} className="mt-1 w-full bg-transparent text-center text-3xl font-bold tabular-nums outline-none" />
          <div className="mt-3 flex justify-center gap-2">
            {[100000, 300000, 500000].map(v => (
              <button key={v} onClick={() => setAmount(v)} className="rounded-full bg-foreground/5 px-3 py-1 text-xs">{fmt(v)}</button>
            ))}
          </div>
        </div>

        <div className="rounded-2xl bg-[#FFF1E4] p-3 text-xs text-[#8F5F68]">
          Sau chuyển: Giải trí còn {fmt(600000 - amount)} · Mua sắm giảm thâm hụt còn {fmt(600000 - amount)}
        </div>

        <textarea placeholder="Lý do (tuỳ chọn)" className="w-full rounded-2xl bg-white/80 px-4 py-3 text-sm" rows={2} />

        <Link to="/budgets" className="block rounded-2xl bg-[#B5828C] py-3.5 text-center text-sm font-semibold text-white shadow-lg">Xác nhận chuyển</Link>
      </div>
    </PhoneFrame>
  );
}
