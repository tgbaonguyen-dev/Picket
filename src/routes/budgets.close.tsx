import { createFileRoute, Link } from "@tanstack/react-router";
import { PhoneFrame } from "@/components/phone-frame";
import { CheckCircle2, Circle } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/budgets/close")({ component: CloseBudget });

const fmt = (n: number) => n.toLocaleString("vi-VN") + "₫";

const tasks = [
  { id: "uncat", label: "Phân loại 3 giao dịch chưa gán danh mục" },
  { id: "recon", label: "Đối soát tài khoản Vietcombank" },
  { id: "review", label: "Xem lại 2 giao dịch OCR độ tin cậy thấp" },
];

function CloseBudget() {
  const [done, setDone] = useState<Set<string>>(new Set(["review"]));
  const [step, setStep] = useState(1);
  const ready = done.size === tasks.length;

  return (
    <PhoneFrame title="Đóng kỳ Tháng 7" subtitle={`Bước ${step}/3`}>
      <div className="space-y-4 px-5 pb-8">
        <div className="flex gap-1">
          {[1, 2, 3].map(i => <div key={i} className={`h-1 flex-1 rounded-full ${i <= step ? "bg-[#FFB4A2]" : "bg-foreground/10"}`} />)}
        </div>

        {step === 1 && (
          <>
            <h2 className="text-lg font-bold">Checklist trước khi chốt</h2>
            <div className="space-y-2">
              {tasks.map(t => {
                const isDone = done.has(t.id);
                return (
                  <button key={t.id} onClick={() => { const n = new Set(done); isDone ? n.delete(t.id) : n.add(t.id); setDone(n); }} className="flex w-full items-center gap-3 rounded-2xl bg-white/80 p-4 text-left">
                    {isDone ? <CheckCircle2 className="h-5 w-5 text-[#B5828C]" /> : <Circle className="h-5 w-5 text-foreground/40" />}
                    <span className={`flex-1 text-sm ${isDone ? "line-through text-foreground/50" : ""}`}>{t.label}</span>
                  </button>
                );
              })}
            </div>
            {!ready && <p className="text-center text-xs text-amber-700">Hoàn tất checklist để chốt kỳ</p>}
            <button disabled={!ready} onClick={() => setStep(2)} className="w-full rounded-2xl bg-[#B5828C] py-3.5 text-sm font-semibold text-white disabled:opacity-50">Tiếp tục</button>
          </>
        )}

        {step === 2 && (
          <>
            <h2 className="text-lg font-bold">Kế hoạch vs Thực tế</h2>
            <div className="space-y-2">
              {[["Ăn uống", 4500000, 3200000], ["Di chuyển", 2000000, 1800000], ["Mua sắm", 2000000, 2600000], ["Hóa đơn", 3000000, 2100000]].map(([n, p, a]) => {
                const diff = (a as number) - (p as number);
                return (
                  <div key={n as string} className="rounded-2xl bg-white/80 p-3">
                    <div className="flex justify-between"><span className="font-medium">{n}</span><span className={`text-sm font-semibold ${diff > 0 ? "text-red-600" : "text-[#8F5F68]"}`}>{diff > 0 ? "+" : ""}{fmt(diff)}</span></div>
                    <p className="text-xs text-foreground/60">Kế hoạch {fmt(p as number)} · Thực tế {fmt(a as number)}</p>
                  </div>
                );
              })}
            </div>
            <button onClick={() => setStep(3)} className="w-full rounded-2xl bg-[#B5828C] py-3.5 text-sm font-semibold text-white">Tiếp tục</button>
          </>
        )}

        {step === 3 && (
          <>
            <h2 className="text-lg font-bold">Kỳ tiếp theo</h2>
            <div className="rounded-2xl bg-white/80 p-4">
              <p className="text-sm font-semibold">Rollover phần dư</p>
              <p className="mt-1 text-xs text-foreground/60">Chuyển {fmt(1900000)} chưa dùng sang tháng 8.</p>
            </div>
            <textarea placeholder="Ghi chú kỳ này..." className="w-full rounded-2xl bg-white/80 px-4 py-3 text-sm" rows={3} />
            <Link to="/monthly-wrap" className="block rounded-2xl bg-[#B5828C] py-3.5 text-center text-sm font-semibold text-white shadow-lg">Chốt kỳ và mở Wrap</Link>
          </>
        )}
      </div>
    </PhoneFrame>
  );
}
