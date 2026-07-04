import { createFileRoute, Link, useParams } from "@tanstack/react-router";
import { PhoneFrame } from "@/components/phone-frame";
import { Edit3, CheckCircle2, Pause } from "lucide-react";

export const Route = createFileRoute("/bills/$id")({ component: BillDetail });

const fmt = (n: number) => n.toLocaleString("vi-VN") + "₫";

function BillDetail() {
  const { id } = useParams({ from: "/bills/$id" });
  return (
    <PhoneFrame title="Điện EVN" subtitle="Chi tiết định kỳ" right={
      <Link to="/bills/$id/edit" params={{ id }} className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white/70"><Edit3 className="h-4 w-4" /></Link>
    }>
      <div className="space-y-4 px-5 pb-8">
        <div className="rounded-3xl bg-gradient-to-br from-amber-500 to-orange-600 p-6 text-white">
          <p className="text-xs opacity-80">Kỳ tiếp theo · 10/07/2026</p>
          <p className="mt-1 text-3xl font-bold tabular-nums">{fmt(850000)}</p>
          <p className="mt-2 text-xs opacity-90">Khoảng 700.000 – 950.000₫ · Hàng tháng</p>
          <div className="mt-3 flex gap-2">
            <span className="rounded-full bg-white/25 px-3 py-1 text-xs">Autopay tắt</span>
            <span className="rounded-full bg-white/25 px-3 py-1 text-xs">Nhắc 3 ngày trước</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <button className="flex items-center justify-center gap-2 rounded-2xl bg-[#B5828C] py-3 text-sm font-semibold text-white"><CheckCircle2 className="h-4 w-4" />Đánh dấu đã trả</button>
          <button className="flex items-center justify-center gap-2 rounded-2xl bg-white/80 py-3 text-sm font-semibold"><Pause className="h-4 w-4" />Tạm dừng</button>
        </div>

        <div className="rounded-2xl bg-white/80 p-4">
          <p className="text-sm font-semibold">Thông tin</p>
          <div className="mt-2 space-y-2 text-sm">
            <div className="flex justify-between"><span className="text-foreground/60">Nhà cung cấp</span><span className="font-medium">EVN HCMC</span></div>
            <div className="flex justify-between"><span className="text-foreground/60">Danh mục</span><span className="font-medium">Hóa đơn</span></div>
            <div className="flex justify-between"><span className="text-foreground/60">Tài khoản</span><span className="font-medium">Vietcombank *8899</span></div>
            <div className="flex justify-between"><span className="text-foreground/60">Chu kỳ</span><span className="font-medium">Ngày 10 hàng tháng</span></div>
          </div>
        </div>

        <div>
          <h2 className="mb-2 text-sm font-bold text-foreground/70">Lịch sử thanh toán</h2>
          <div className="space-y-2">
            {[["06/2026", 780000], ["05/2026", 920000], ["04/2026", 690000], ["03/2026", 810000]].map(([m, a]) => (
              <div key={m as string} className="flex justify-between rounded-2xl bg-white/80 p-3">
                <span className="text-sm">{m}</span>
                <span className="text-sm font-semibold tabular-nums">{fmt(a as number)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </PhoneFrame>
  );
}
