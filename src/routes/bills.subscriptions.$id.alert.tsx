import { createFileRoute, Link, useParams } from "@tanstack/react-router";
import { PhoneFrame } from "@/components/phone-frame";
import { AlertTriangle } from "lucide-react";

export const Route = createFileRoute("/bills/subscriptions/$id/alert")({ component: SubAlert });

const fmt = (n: number) => n.toLocaleString("vi-VN") + "₫";

function SubAlert() {
  const { id } = useParams({ from: "/bills/subscriptions/$id/alert" });
  return (
    <PhoneFrame title="Cảnh báo gói thuê bao" subtitle={id}>
      <div className="space-y-4 px-5 pb-8">
        <div className="rounded-3xl bg-gradient-to-br from-red-500 to-orange-500 p-5 text-white">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase"><AlertTriangle className="h-4 w-4" />Tăng giá</div>
          <p className="mt-3 text-2xl font-bold">iCloud+ 200GB</p>
          <p className="mt-1 text-sm opacity-90">Gia hạn ngày 15/08/2026</p>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-2xl bg-white/80 p-4">
            <p className="text-xs text-foreground/60">Giá cũ</p>
            <p className="mt-1 text-lg font-bold tabular-nums line-through">{fmt(49000)}</p>
          </div>
          <div className="rounded-2xl bg-red-50 p-4">
            <p className="text-xs text-red-600">Giá mới</p>
            <p className="mt-1 text-lg font-bold tabular-nums text-red-700">{fmt(59000)}</p>
          </div>
        </div>

        <div className="rounded-2xl bg-white/80 p-4">
          <p className="text-sm font-semibold">Tác động hàng năm</p>
          <p className="mt-1 text-xs text-foreground/60">Bạn sẽ chi thêm <strong className="text-foreground">{fmt(120000)}</strong> trong 12 tháng tới.</p>
        </div>

        <div className="rounded-2xl bg-white/80 p-4">
          <p className="text-sm font-semibold">Mức độ sử dụng của bạn</p>
          <div className="mt-2 flex gap-1">
            {[1, 2, 3, 4, 5].map(i => <div key={i} className={`h-2 flex-1 rounded ${i <= 4 ? "bg-[#FFB4A2]" : "bg-foreground/10"}`} />)}
          </div>
          <p className="mt-2 text-xs text-foreground/60">Bạn đánh giá 4/5 – vẫn hữu ích.</p>
        </div>

        <a href="#" className="block text-center text-xs font-semibold text-[#B5828C] underline">Hướng dẫn huỷ trên Apple ID →</a>

        <div className="space-y-2">
          <button className="w-full rounded-2xl bg-[#B5828C] py-3.5 text-sm font-semibold text-white">Giữ nguyên</button>
          <button className="w-full rounded-2xl bg-white/80 py-3.5 text-sm font-semibold">Nhắc tôi 3 ngày trước</button>
          <button className="w-full rounded-2xl border border-red-200 py-3.5 text-sm font-medium text-red-600">Đánh dấu đã huỷ</button>
        </div>
      </div>
    </PhoneFrame>
  );
}
