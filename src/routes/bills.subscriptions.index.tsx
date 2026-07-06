import { createFileRoute, Link } from "@tanstack/react-router";
import { PhoneFrame } from "@/components/phone-frame";
import { AlertTriangle, Sparkles, Plus } from "lucide-react";
import { PopIn, FadeInUp, FadeInLeft } from "@/components/ui/animations";
import { motion } from "framer-motion";

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
    <PhoneFrame 
      title="Subscription" 
      subtitle="Gói thuê bao" 
      right={
        <Link 
          to="/bills/subscriptions/new" 
          aria-label="Thêm subscription" 
          className="flex h-10 w-10 items-center justify-center rounded-2xl bg-foreground text-background shadow-lg shadow-black/10 transition-transform active:scale-95"
        >
          <Plus className="h-5 w-5" />
        </Link>
      }
    >
      <div className="space-y-6 px-5 pb-8">
        
        {/* Type Toggle */}
        <div className="flex gap-1 rounded-2xl bg-white/50 p-1.5 shadow-sm backdrop-blur-md">
          <Link to="/bills" className="flex-1 rounded-xl py-2.5 text-center text-[13px] font-medium text-foreground/50 transition-colors active:bg-white/40">
            Hoá đơn cố định
          </Link>
          <Link to="/bills/subscriptions" className="flex-1 rounded-xl bg-white py-2.5 text-center text-[13px] font-semibold text-foreground shadow-sm">
            Subscriptions
          </Link>
        </div>

        {/* Hero Summary Card */}
        <PopIn className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-fuchsia-500 to-pink-600 p-6 text-white shadow-xl shadow-pink-500/20">
          <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-white/20 blur-2xl" />
          <div className="absolute -bottom-10 -left-10 h-40 w-40 rounded-full bg-black/10 blur-3xl" />
          
          <div className="relative z-10">
            <p className="text-sm font-medium opacity-90">Tổng mỗi tháng</p>
            <p className="mt-1 text-4xl font-bold tracking-tight">{fmt(monthly)}</p>
            
            <div className="mt-4 inline-flex items-center gap-2 rounded-xl bg-white/20 px-3 py-1.5 text-[11px] font-medium backdrop-blur-md">
              Quy đổi năm: {fmt(monthly * 12)}
            </div>
          </div>
        </PopIn>

        {/* Alert Banner */}
        <FadeInUp 
          delay={0.05}
          className="flex items-start gap-3 rounded-3xl bg-amber-50 p-4 shadow-sm"
        >
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-amber-100 text-amber-600">
            <Sparkles className="h-4 w-4" />
          </div>
          <div>
            <p className="text-sm font-bold text-amber-800">2 mục cần xem xét</p>
            <p className="mt-0.5 text-[11px] font-medium text-amber-700/80">
              Trial sắp hết & tăng giá phát hiện tuần này.
            </p>
          </div>
        </FadeInUp>

        {/* Subscription List */}
        <div className="pt-2">
          <div className="mb-3 flex items-center justify-between px-1">
            <h2 className="text-[13px] font-bold uppercase tracking-wider text-foreground/50">Đang hoạt động</h2>
          </div>
          <div className="space-y-3">
            {subs.map((s, i) => (
              <FadeInLeft
                key={s.id}
                delay={0.1 + i * 0.05}
              >
                <Link 
                  to="/bills/subscriptions/$id/alert" 
                  params={{ id: s.id }} 
                  className="block rounded-3xl bg-white/70 p-4 shadow-sm backdrop-blur-md transition-transform active:scale-[0.98]"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white shadow-sm">
                        <span className="text-2xl">{s.icon}</span>
                      </div>
                      <div>
                        <p className="font-bold text-foreground">{s.name}</p>
                        <p className="mt-0.5 text-[11px] font-medium text-foreground/50">{fmt(s.monthly)} / tháng</p>
                      </div>
                    </div>
                    
                    <div className="flex flex-col items-end gap-2">
                      {s.flag === "trial" && (
                        <span className="rounded-xl bg-amber-100 px-2.5 py-1 text-[10px] font-bold text-amber-800">TRIAL</span>
                      )}
                      {s.flag === "increase" && (
                        <span className="rounded-xl bg-red-100 px-2.5 py-1 text-[10px] font-bold text-red-700">TĂNG GIÁ</span>
                      )}
                      {s.flag === "duplicate" && (
                        <span className="rounded-xl bg-[#FFE4D2] px-2.5 py-1 text-[10px] font-bold text-[#8F5F68]">TRÙNG</span>
                      )}
                    </div>
                  </div>
                  
                  {s.note && (
                    <div className="mt-3 flex items-center gap-1.5 rounded-xl bg-foreground/5 p-2 text-[11px] font-medium text-foreground/60">
                      <AlertTriangle className="h-3.5 w-3.5 text-amber-500" />
                      {s.note}
                    </div>
                  )}
                </Link>
              </FadeInLeft>
            ))}
          </div>
        </div>

      </div>
    </PhoneFrame>
  );
}