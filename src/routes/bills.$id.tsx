import { createFileRoute, Link, useParams } from "@tanstack/react-router";
import { PhoneFrame } from "@/components/phone-frame";
import { Edit3, CheckCircle2, Pause, Zap, CalendarDays, Wallet, Bell, Clock } from "lucide-react";
import { PopIn, FadeInUp, FadeInLeft } from "@/components/ui/animations";
import { useState } from "react";

export const Route = createFileRoute("/bills/$id")({ component: BillDetail });

const fmt = (n: number) => n.toLocaleString("vi-VN") + "₫";

function BillDetail() {
  const { id } = useParams({ from: "/bills/$id" });
  const [isPaid, setIsPaid] = useState(false);

  return (
    <PhoneFrame title="Điện EVN" subtitle="Chi tiết định kỳ" right={
      <Link 
        to="/bills/$id/edit" 
        params={{ id }} 
        className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white/70 shadow-sm backdrop-blur-md transition-transform active:scale-[0.97]"
      >
        <Edit3 className="h-4 w-4 text-foreground/70" />
      </Link>
    }>
      <div className="space-y-4 px-5 pb-8 pt-2">
        {/* Main Status Card */}
        <PopIn 
          className={`relative overflow-hidden rounded-3xl p-6 text-white shadow-xl transition-colors duration-300 ${isPaid ? "bg-gradient-to-br from-green-500 to-emerald-600 shadow-green-500/20" : "bg-gradient-to-br from-amber-500 to-orange-600 shadow-orange-500/20"}`}
        >
          <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-white/20 blur-2xl" />
          <div className="absolute -bottom-10 -left-10 h-40 w-40 rounded-full bg-black/10 blur-3xl" />
          
          <div className="relative z-10">
            <p className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider opacity-90">
              <CalendarDays className="h-3.5 w-3.5" />
              {isPaid ? "Đã thanh toán kỳ này" : "Kỳ tiếp theo · 10/07/2026"}
            </p>
            <p className="mt-1 text-4xl font-bold tracking-tight">{fmt(850000)}</p>
            <p className="mt-2 text-xs font-medium opacity-90">Dự kiến: 700.000 – 950.000₫ · Hàng tháng</p>
            
            <div className="mt-4 flex flex-wrap gap-2">
              <span className="inline-flex items-center gap-1 rounded-xl bg-white/20 px-3 py-1.5 text-[11px] font-semibold backdrop-blur-md">
                <Zap className="h-3 w-3" /> Autopay Tắt
              </span>
              <span className="inline-flex items-center gap-1 rounded-xl bg-white/20 px-3 py-1.5 text-[11px] font-semibold backdrop-blur-md">
                <Bell className="h-3 w-3" /> Nhắc trước 3 ngày
              </span>
            </div>
          </div>
        </PopIn>

        {/* Action Buttons */}
        <FadeInUp 
          delay={0.05}
          className="grid grid-cols-2 gap-2"
        >
          <button 
            onClick={() => setIsPaid(!isPaid)}
            className={`flex items-center justify-center gap-2 rounded-2xl py-3.5 text-[13px] font-bold shadow-sm transition-all active:scale-[0.97] ${isPaid ? "bg-white/80 text-foreground/50" : "bg-gradient-to-r from-[#8F5F68] to-[#B5828C] text-white shadow-[#8F5F68]/20"}`}
          >
            <CheckCircle2 className="h-4 w-4" />
            {isPaid ? "Hoàn tác" : "Đánh dấu đã trả"}
          </button>
          <button className="flex items-center justify-center gap-2 rounded-2xl bg-white/70 py-3.5 text-[13px] font-bold text-foreground/70 shadow-sm backdrop-blur-md transition-all active:scale-[0.97]">
            <Pause className="h-4 w-4" /> Tạm dừng
          </button>
        </FadeInUp>

        {/* Info Grid */}
        <FadeInUp 
          delay={0.1}
          className="rounded-3xl bg-white/70 p-5 shadow-sm backdrop-blur-md"
        >
          <p className="mb-4 text-[11px] font-bold uppercase tracking-wider text-foreground/40">Thông tin chi tiết</p>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm text-foreground/60"><Wallet className="h-4 w-4" /> Tài khoản</div>
              <span className="text-sm font-bold">Vietcombank *8899</span>
            </div>
            <div className="h-px w-full bg-foreground/5" />
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm text-foreground/60"><Clock className="h-4 w-4" /> Chu kỳ</div>
              <span className="text-sm font-bold">Ngày 10 hàng tháng</span>
            </div>
          </div>
        </FadeInUp>

        {/* History */}
        <FadeInUp 
          delay={0.15}
        >
          <h2 className="mb-3 px-1 text-[11px] font-bold uppercase tracking-wider text-foreground/40">Lịch sử thanh toán</h2>
          <div className="space-y-2">
            {[
              { m: "Tháng 06/2026", a: 780000, date: "10/06" }, 
              { m: "Tháng 05/2026", a: 920000, date: "10/05" }, 
              { m: "Tháng 04/2026", a: 690000, date: "10/04" }, 
              { m: "Tháng 03/2026", a: 810000, date: "10/03" }
            ].map((item, i) => (
              <FadeInLeft 
                key={item.m} 
                delay={0.2 + i * 0.05}
                className="flex items-center justify-between rounded-2xl bg-white/70 p-4 shadow-sm backdrop-blur-md"
              >
                <div>
                  <p className="text-sm font-bold">{item.m}</p>
                  <p className="text-[11px] font-medium text-foreground/50">Đã thanh toán vào {item.date}</p>
                </div>
                <span className="text-[15px] font-bold tabular-nums">{fmt(item.a)}</span>
              </FadeInLeft>
            ))}
          </div>
        </FadeInUp>
      </div>
    </PhoneFrame>
  );
}
