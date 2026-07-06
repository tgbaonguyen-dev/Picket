import { createFileRoute, Link, useParams } from "@tanstack/react-router";
import { PhoneFrame } from "@/components/phone-frame";
import { AlertTriangle, TrendingUp, Bell, Ban, CheckCircle2 } from "lucide-react";
import { PopIn, FadeInUp } from "@/components/ui/animations";

export const Route = createFileRoute("/bills/subscriptions/$id/alert")({ component: SubAlert });

const fmt = (n: number) => n.toLocaleString("vi-VN") + "₫";

function SubAlert() {
  const { id } = useParams({ from: "/bills/subscriptions/$id/alert" });
  return (
    <PhoneFrame title="Cảnh báo gói thuê bao" subtitle={id}>
      <div className="space-y-5 px-5 pb-8 pt-2">
        {/* Main Alert Card */}
        <PopIn className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-red-500 to-rose-600 p-6 text-white shadow-xl shadow-red-500/20">
          <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-white/20 blur-2xl" />
          <div className="absolute -bottom-10 -left-10 h-40 w-40 rounded-full bg-black/10 blur-3xl" />
          
          <div className="relative z-10">
            <div className="inline-flex items-center gap-1.5 rounded-xl bg-white/20 px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider backdrop-blur-md">
              <AlertTriangle className="h-3.5 w-3.5" /> Phát hiện tăng giá
            </div>
            <div className="mt-4 flex items-center gap-4">
              <span className="text-4xl">☁️</span>
              <div>
                <p className="text-2xl font-bold tracking-tight">iCloud+ 200GB</p>
                <p className="text-xs font-medium opacity-90">Kỳ gia hạn tiếp theo: 15/08/2026</p>
              </div>
            </div>
          </div>
        </PopIn>

        {/* Price Comparison */}
        <FadeInUp 
          delay={0.05}
          className="grid grid-cols-2 gap-2"
        >
          <div className="rounded-3xl bg-white/70 p-5 shadow-sm backdrop-blur-md">
            <p className="text-[11px] font-bold uppercase tracking-wider text-foreground/40">Giá hiện tại</p>
            <p className="mt-1 text-2xl font-bold tabular-nums text-foreground/50 line-through decoration-red-500/50 decoration-2">{fmt(49000)}</p>
          </div>
          <div className="relative overflow-hidden rounded-3xl bg-red-50 p-5 shadow-sm">
            <div className="absolute -right-4 -top-4 text-red-100"><TrendingUp className="h-20 w-20" /></div>
            <div className="relative z-10">
              <p className="text-[11px] font-bold uppercase tracking-wider text-red-600/80">Giá mới</p>
              <p className="mt-1 text-2xl font-bold tabular-nums text-red-600">{fmt(59000)}</p>
            </div>
          </div>
        </FadeInUp>

        {/* Impact Analysis */}
        <FadeInUp 
          delay={0.1}
          className="space-y-2"
        >
          <div className="rounded-3xl bg-white/70 p-5 shadow-sm backdrop-blur-md">
            <p className="text-[11px] font-bold uppercase tracking-wider text-foreground/40">Tác động chi tiêu hàng năm</p>
            <p className="mt-2 text-sm font-medium text-foreground/70">
              Bạn sẽ chi thêm <strong className="text-red-500">{fmt(120000)}</strong> trong 12 tháng tới cho dịch vụ này.
            </p>
          </div>
          
          <div className="rounded-3xl bg-white/70 p-5 shadow-sm backdrop-blur-md">
            <div className="flex items-center justify-between">
              <p className="text-[11px] font-bold uppercase tracking-wider text-foreground/40">Đánh giá mức độ hữu ích</p>
              <span className="rounded-xl bg-green-100 px-2.5 py-1 text-[10px] font-bold text-green-700">TỐT</span>
            </div>
            <div className="mt-4 flex gap-1">
              {[1, 2, 3, 4, 5].map(i => (
                <div key={i} className={`h-2 flex-1 rounded-full ${i <= 4 ? "bg-gradient-to-r from-pink-400 to-pink-500" : "bg-foreground/10"}`} />
              ))}
            </div>
            <p className="mt-3 text-xs font-medium text-foreground/60">
              Dựa trên khảo sát lần trước, bạn đánh giá 4/5 – gói này vẫn đang rất hữu ích với bạn.
            </p>
          </div>
        </FadeInUp>
        
        {/* Actions */}
        <FadeInUp 
          delay={0.15}
          className="pt-2 text-center"
        >
          <a href="#" className="inline-block text-[11px] font-bold uppercase tracking-wider text-[#B5828C] underline decoration-[#B5828C]/30 underline-offset-4 transition-colors hover:text-[#8F5F68]">
            Xem hướng dẫn huỷ trên Apple ID ↗
          </a>
          
          <div className="mt-5 space-y-2">
            <button className="flex w-full items-center justify-center gap-2 rounded-2xl bg-foreground py-4 text-[13px] font-bold text-background shadow-lg transition-transform active:scale-[0.98]">
              <CheckCircle2 className="h-4 w-4" /> Đồng ý giá mới
            </button>
            <button className="flex w-full items-center justify-center gap-2 rounded-2xl bg-white/80 py-4 text-[13px] font-bold text-foreground shadow-sm backdrop-blur-md transition-transform active:scale-[0.98]">
              <Bell className="h-4 w-4" /> Nhắc tôi 3 ngày trước
            </button>
            <button className="flex w-full items-center justify-center gap-2 rounded-2xl bg-red-50 py-4 text-[13px] font-bold text-red-600 transition-colors active:bg-red-100">
              <Ban className="h-4 w-4" /> Đã huỷ gói này
            </button>
          </div>
        </FadeInUp>
      </div>
    </PhoneFrame>
  );
}
