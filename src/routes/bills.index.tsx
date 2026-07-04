import { createFileRoute, Link } from "@tanstack/react-router";
import { PhoneFrame } from "@/components/phone-frame";
import { Plus, ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/bills/")({ component: BillsCalendar });

const fmt = (n: number) => n.toLocaleString("vi-VN") + "₫";

const bills = [
  { id: "netflix", day: 5, name: "Netflix", amount: 260000, status: "paid", icon: "🎬" },
  { id: "electric", day: 10, name: "Điện EVN", amount: 850000, status: "due", icon: "💡" },
  { id: "internet", day: 12, name: "FPT Internet", amount: 240000, status: "upcoming", icon: "🌐" },
  { id: "spotify", day: 15, name: "Spotify", amount: 59000, status: "upcoming", icon: "🎵" },
  { id: "rent", day: 25, name: "Tiền nhà", amount: 6500000, status: "upcoming", icon: "🏠" },
];

function BillsCalendar() {
  const [tab, setTab] = useState<"cal" | "list">("cal");
  const year = 2026;
  const month = 6; // July (0-indexed)
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  // Monday-first offset: JS getDay() returns 0=Sun..6=Sat → convert to 0=Mon..6=Sun
  const firstDow = (new Date(year, month, 1).getDay() + 6) % 7;
  const total = bills.reduce((s, b) => s + b.amount, 0);

  return (
    <PhoneFrame title="Hoá đơn" subtitle="Tháng 7, 2026" right={
      <Link to="/bills/new" aria-label="Thêm hoá đơn" className="flex h-10 w-10 items-center justify-center rounded-2xl bg-foreground text-background"><Plus className="h-5 w-5" /></Link>
    }>
      <div className="space-y-4 px-5 pb-8">
        {/* Top segmented: 2 phần chính */}
        <div className="flex gap-1 rounded-2xl bg-white/70 p-1 shadow-sm">
          <Link to="/bills" className="flex-1 rounded-xl bg-white py-2 text-center text-sm font-semibold shadow-sm">Hoá đơn</Link>
          <Link to="/bills/subscriptions" className="flex-1 rounded-xl py-2 text-center text-sm font-medium text-foreground/60">Subscription</Link>
        </div>

        <div className="rounded-3xl bg-gradient-to-br from-[#B5828C] to-[#FFB4A2] p-5 text-white">
          <p className="text-xs opacity-90">Tổng cần trả tháng này</p>
          <p className="mt-1 text-3xl font-bold tabular-nums">{fmt(total)}</p>
          <p className="mt-1 text-xs opacity-90">Số dư dự kiến sau khi trả: {fmt(4200000)}</p>
        </div>

        <div className="flex gap-2 rounded-2xl bg-white/60 p-1">
          {[["cal", "Lịch"], ["list", "Danh sách"]].map(([v, l]) => (
            <button key={v} onClick={() => setTab(v as any)} className={`flex-1 rounded-xl py-2 text-sm font-medium ${tab === v ? "bg-white shadow" : ""}`}>{l}</button>
          ))}
        </div>

        {tab === "cal" ? (
          <div className="rounded-3xl bg-white/80 p-4">
            <div className="mb-3 flex items-center justify-between">
              <button><ChevronLeft className="h-4 w-4" /></button>
              <span className="text-sm font-semibold">Tháng 7 · 2026</span>
              <button><ChevronRight className="h-4 w-4" /></button>
            </div>
            <div className="grid grid-cols-7 gap-1 text-center text-[10px] font-semibold uppercase tracking-wider text-foreground/50">
              {["T2", "T3", "T4", "T5", "T6", "T7", "CN"].map(d => <div key={d} className="py-1">{d}</div>)}
            </div>
            <div className="mt-1 grid grid-cols-7 gap-1">
              {Array.from({ length: firstDow }).map((_, i) => (
                <div key={`blank-${i}`} className="aspect-square" />
              ))}
              {Array.from({ length: daysInMonth }).map((_, i) => {
                const day = i + 1;
                const bill = bills.find(b => b.day === day);
                return (
                  <div key={day} className={`relative flex aspect-square items-center justify-center rounded-full text-[11px] ${bill ? bill.status === "paid" ? "bg-[#FFE4D2]" : bill.status === "due" ? "bg-red-100" : "bg-amber-50" : "bg-foreground/5"}`}>
                    <span className="font-medium leading-none">{day}</span>
                    {bill && <span className="absolute -bottom-1 right-0 text-[10px]">{bill.icon}</span>}
                  </div>
                );
              })}
            </div>
          </div>
        ) : null}

        <div>
          <h2 className="mb-2 text-sm font-bold text-foreground/70">Sắp tới</h2>
          <div className="space-y-2">
            {bills.map(b => (
              <Link key={b.id} to="/bills/$id" params={{ id: b.id }} className="flex items-center justify-between rounded-2xl bg-white/80 p-4">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{b.icon}</span>
                  <div>
                    <p className="font-semibold">{b.name}</p>
                    <p className="text-xs text-foreground/60">Ngày {b.day}/7 · <span className={b.status === "due" ? "text-red-600 font-medium" : b.status === "paid" ? "text-[#8F5F68]" : ""}>{b.status === "paid" ? "Đã trả" : b.status === "due" ? "Đến hạn" : "Sắp tới"}</span></p>
                  </div>
                </div>
                <p className="text-sm font-semibold tabular-nums">{fmt(b.amount)}</p>
              </Link>
            ))}
          </div>
        </div>

      </div>
    </PhoneFrame>
  );
}