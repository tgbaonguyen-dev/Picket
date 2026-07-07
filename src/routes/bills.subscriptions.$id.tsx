import { createFileRoute, Link, useParams, useNavigate } from "@tanstack/react-router";
import { PhoneFrame } from "@/components/phone-frame";
import { Edit3, CheckCircle2, Pause, Zap, CalendarDays, Wallet, Bell, Clock, History, AlertTriangle, ArrowRight } from "lucide-react";
import { PopIn, FadeInUp } from "@/components/ui/animations";
import { findSubscription, formatVND, CURRENT_YEAR, CURRENT_MONTH_NUM } from "@/data";
import { Skeleton } from "@/components/ui/skeleton";

export const Route = createFileRoute("/bills/subscriptions/$id")({
  component: SubscriptionDetail,
});

function SubscriptionDetail() {
  const { id } = Route.useParams();
  const navigate = useNavigate();
  const sub = findSubscription(id);

  if (!sub) {
    return (
      <PhoneFrame title="Không tìm thấy" back>
        <div className="flex flex-col items-center justify-center p-10 text-center">
          <AlertTriangle className="h-10 w-10 text-foreground/20 mb-4" />
          <p className="font-bold text-foreground/50">Thuê bao không tồn tại</p>
          <button onClick={() => navigate({ to: "/bills/subscriptions" })} className="mt-4 text-sm font-bold text-primary">Quay lại</button>
        </div>
      </PhoneFrame>
    );
  }

  const isTrial = sub.flag === "trial";
  const isDuplicate = sub.flag === "duplicate";

  return (
    <PhoneFrame 
      title={sub.name} 
      subtitle="Chi tiết thuê bao" 
      back
      right={
        <Link 
          to="/bills/subscriptions" 
          className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white/70 shadow-sm backdrop-blur-md transition-transform active:scale-95"
        >
          <Edit3 className="h-4 w-4 text-foreground/70" />
        </Link>
      }
    >
      <div className="space-y-4 px-5 pb-8 pt-2">
        {/* Premium Vivid Hero Card */}
        <PopIn 
          className="relative overflow-hidden rounded-[32px] bg-gradient-to-br from-[#8C5485] via-[#A86A9E] to-[#8C5485] p-7 text-white shadow-[0_24px_50px_-12px_rgba(140,84,133,0.45)] border border-white/20"
        >
          {/* Background Mesh */}
          <div className="absolute -right-20 -top-20 h-[300px] w-[300px] rounded-full bg-pink-400/30 blur-[80px] mix-blend-overlay" />
          <div className="absolute -bottom-24 -left-20 h-[300px] w-[300px] rounded-full bg-fuchsia-400/30 blur-[80px] mix-blend-overlay" />
          
          {/* Specular Highlight */}
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/40 to-transparent" />
          
          {/* Noise Texture */}
          <div 
            className="absolute inset-0 opacity-[0.12] mix-blend-overlay pointer-events-none"
            style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}
          />

          <div className="relative z-10">
            <div className="flex items-center justify-between mb-4">
              <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/20 text-2xl backdrop-blur-md shadow-inner border border-white/20">
                {sub.icon}
              </span>
              {isTrial && (
                <span className="rounded-xl bg-amber-400 text-amber-950 px-3 py-1 text-[11px] font-bold uppercase tracking-wider shadow-sm">
                  Dùng thử
                </span>
              )}
              {isDuplicate && (
                <span className="rounded-xl bg-rose-500 text-white px-3 py-1 text-[11px] font-bold uppercase tracking-wider shadow-sm">
                  Trùng lặp
                </span>
              )}
            </div>
            
            <p className="mt-2 text-4xl font-display font-bold tracking-tight drop-shadow-sm">{formatVND(sub.monthly)}</p>
            <p className="mt-1 text-[13px] font-medium opacity-90 drop-shadow-sm">Thanh toán mỗi tháng</p>
            
            <div className="mt-6 flex flex-wrap gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-xl bg-white/20 px-3 py-2 text-[11px] font-bold uppercase tracking-wider backdrop-blur-md border border-white/10 shadow-sm">
                <CalendarDays className="h-3.5 w-3.5" /> 12/${String(CURRENT_MONTH_NUM).padStart(2, '0')}/${CURRENT_YEAR}
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-xl bg-white/20 px-3 py-2 text-[11px] font-bold uppercase tracking-wider backdrop-blur-md border border-white/10 shadow-sm">
                <Wallet className="h-3.5 w-3.5" /> Thẻ TCB
              </span>
            </div>
          </div>
        </PopIn>

        {/* Note / Alert Section */}
        {sub.note && (
          <FadeInUp delay={0.1} className={`flex items-start gap-3 rounded-[24px] border border-white/60 p-4 shadow-sm backdrop-blur-md ${isTrial || isDuplicate ? "bg-rose-50/50" : "bg-white/50"}`}>
            <div className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${isTrial || isDuplicate ? "bg-rose-100 text-rose-500" : "bg-fuchsia-100 text-fuchsia-500"}`}>
              {isTrial || isDuplicate ? <AlertTriangle className="h-4 w-4" /> : <Bell className="h-4 w-4" />}
            </div>
            <div>
              <p className="font-sans text-[13px] font-bold text-foreground">Ghi chú</p>
              <p className="mt-0.5 text-[13px] font-medium text-foreground/60 leading-relaxed">{sub.note}</p>
            </div>
          </FadeInUp>
        )}

        {/* Action Buttons */}
        <FadeInUp 
          delay={0.15}
          className="grid grid-cols-2 gap-2"
        >
          <button 
            className="flex items-center justify-center gap-2 rounded-2xl py-3.5 text-[13px] font-bold shadow-sm transition-all active:scale-95 bg-gradient-to-r from-[#A86A9E] to-[#C27A9B] text-white shadow-[#A86A9E]/20"
          >
            <CheckCircle2 className="h-4 w-4" />
            Đã thanh toán
          </button>
          
          <button 
            className="flex items-center justify-center gap-2 rounded-2xl bg-white/80 py-3.5 text-[13px] font-bold text-foreground/70 shadow-sm backdrop-blur-md border border-white transition-all hover:bg-white active:scale-95"
          >
            <Pause className="h-4 w-4" />
            Huỷ gói này
          </button>
        </FadeInUp>

        {/* History Area */}
        <FadeInUp delay={0.2} className="mt-4">
          <div className="flex items-center justify-between px-1 mb-3">
            <h3 className="font-display text-[15px] font-bold text-foreground">Lịch sử thanh toán</h3>
            <button className="flex items-center text-[12px] font-bold text-primary transition-opacity hover:opacity-70">
              Tất cả <ArrowRight className="ml-1 h-3 w-3" />
            </button>
          </div>
          
          <div className="space-y-2">
            {[1, 2, 3].map((_, i) => (
              <div key={i} className="flex items-center justify-between rounded-2xl bg-white/70 p-4 shadow-sm backdrop-blur-md">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-foreground/5 text-foreground/50">
                    <History className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="font-sans text-[14px] font-bold text-foreground">{sub.name}</p>
                    <p className="text-[12px] font-medium text-foreground/50">Tháng {String(CURRENT_MONTH_NUM - 1 - i).padStart(2, '0')}/{CURRENT_YEAR}</p>
                  </div>
                </div>
                <p className="font-sans text-[14px] font-bold text-foreground">{formatVND(sub.monthly)}</p>
              </div>
            ))}
          </div>
        </FadeInUp>
      </div>
    </PhoneFrame>
  );
}
