import { createFileRoute, Link } from "@tanstack/react-router";
import { PhoneFrame } from "@/components/phone-frame";
import { AlertTriangle, Sparkles, Plus } from "lucide-react";

export const Route = createFileRoute("/bills/subscriptions/")({ component: SubDashboard });

const fmt = (n: number) => n.toLocaleString("vi-VN") + "₫";

const subs = [
  { id: "netflix", name: "Netflix Premium", icon: "🎬", monthly: 260000, flag: "trial", note: "Trial hết 12/07" },
  { id: "spotify", name: "Spotify Family", icon: "🎵", monthly: 149000, flag: null, note: "Đang dùng thường xuyên" },
  { id: "icloud", name: "iCloud+ 200GB", icon: "☁️", monthly: 59000, flag: "increase", note: "Tăng giá +10.000₫ từ 08/2026" },
  { id: "chatgpt", name: "ChatGPT Plus", icon: "🤖", monthly: 520000, flag: null, note: "" },
  { id: "youtube", name: "YouTube Premium", icon: "▶️", monthly: 79000, flag: "duplicate", note: "Trùng với Family plan" },
];

function SubDashboard() {
  const monthly = subs.reduce((s, x) => s + x.monthly, 0);
  return (
    <PhoneFrame title="Subscription" subtitle="Gói thuê bao" right={
      <Link to="/bills/subscriptions/new" aria-label="Thêm subscription" className="flex h-10 w-10 items-center justify-center rounded-2xl bg-foreground text-background"><Plus className="h-5 w-5" /></Link>
    }>
      <div className="space-y-4 px-5 pb-8">
        {/* Top segmented: 2 phần chính */}
        <div className="flex gap-1 rounded-2xl bg-white/70 p-1 shadow-sm">
          <Link to="/bills" className="flex-1 rounded-xl py-2 text-center text-sm font-medium text-foreground/60">Hoá đơn</Link>
          <Link to="/bills/subscriptions" className="flex-1 rounded-xl bg-white py-2 text-center text-sm font-semibold shadow-sm">Subscription</Link>
        </div>

        <div className="rounded-3xl bg-gradient-to-br from-fuchsia-500 to-pink-600 p-5 text-white">
          <p className="text-xs opacity-80">Tổng mỗi tháng</p>
          <p className="mt-1 text-3xl font-bold tabular-nums">{fmt(monthly)}</p>
          <p className="mt-1 text-xs opacity-80">Quy đổi năm: {fmt(monthly * 12)}</p>
        </div>

        <div className="rounded-2xl bg-amber-50 p-3 text-xs text-amber-800">
          <div className="flex items-center gap-1.5 font-semibold"><Sparkles className="h-3.5 w-3.5" />2 mục cần xem xét</div>
          <p className="mt-1">Trial sắp hết & tăng giá phát hiện tuần này.</p>
        </div>

        <div className="space-y-2">
          {subs.map(s => (
            <Link key={s.id} to="/bills/subscriptions/$id/alert" params={{ id: s.id }} className="block rounded-2xl bg-white/80 p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{s.icon}</span>
                  <div>
                    <p className="font-semibold">{s.name}</p>
                    <p className="text-xs text-foreground/60">{fmt(s.monthly)}/tháng</p>
                  </div>
                </div>
                {s.flag === "trial" && <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-semibold text-amber-800">Trial</span>}
                {s.flag === "increase" && <span className="rounded-full bg-red-100 px-2 py-0.5 text-[10px] font-semibold text-red-700">Tăng giá</span>}
                {s.flag === "duplicate" && <span className="rounded-full bg-[#FFE4D2] px-2 py-0.5 text-[10px] font-semibold text-[#8F5F68]">Trùng</span>}
              </div>
              {s.note && <p className="mt-2 flex items-center gap-1 text-xs text-foreground/60"><AlertTriangle className="h-3 w-3" />{s.note}</p>}
            </Link>
          ))}
        </div>
      </div>
    </PhoneFrame>
  );
}