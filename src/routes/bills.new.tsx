import { createFileRoute, Link } from "@tanstack/react-router";
import { PhoneFrame } from "@/components/phone-frame";
import { useState } from "react";

export const Route = createFileRoute("/bills/new")({ component: NewBill });

function NewBill() {
  const [type, setType] = useState("bill");
  const [cadence, setCadence] = useState("monthly");

  return (
    <PhoneFrame title="Khoản định kỳ mới" subtitle="Bill · Income · Transfer">
      <div className="space-y-4 px-5 pb-8">
        <div className="grid grid-cols-3 gap-2">
          {[["bill", "Hoá đơn"], ["income", "Thu nhập"], ["transfer", "Chuyển"]].map(([v, l]) => (
            <button key={v} onClick={() => setType(v)} className={`rounded-2xl py-3 text-sm font-medium ${type === v ? "bg-foreground text-background" : "bg-white/70"}`}>{l}</button>
          ))}
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-foreground/60">Tên</label>
          <input placeholder="Ví dụ: Điện EVN" className="w-full rounded-2xl bg-white/80 px-4 py-3 text-sm" />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs font-semibold text-foreground/60">Số tiền</label>
            <input placeholder="0" inputMode="numeric" className="mt-1.5 w-full rounded-2xl bg-white/80 px-4 py-3 text-lg font-bold tabular-nums" />
          </div>
          <div>
            <label className="text-xs font-semibold text-foreground/60">Ngày đầu</label>
            <input type="date" className="mt-1.5 w-full rounded-2xl bg-white/80 px-4 py-3 text-sm" />
          </div>
        </div>

        <label className="flex items-center justify-between rounded-2xl bg-white/80 p-3 text-sm">
          <span>Số tiền thay đổi mỗi kỳ</span>
          <input type="checkbox" className="h-5 w-5" />
        </label>

        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-foreground/60">Chu kỳ</label>
          <div className="grid grid-cols-4 gap-2">
            {[["weekly", "Tuần"], ["monthly", "Tháng"], ["quarterly", "Quý"], ["yearly", "Năm"]].map(([v, l]) => (
              <button key={v} onClick={() => setCadence(v)} className={`rounded-xl py-2 text-xs font-medium ${cadence === v ? "bg-foreground text-background" : "bg-white/70"}`}>{l}</button>
            ))}
          </div>
        </div>

        <div className="rounded-2xl bg-white/80 p-4">
          <p className="text-sm font-semibold">Tài khoản</p>
          <p className="mt-1 text-xs text-foreground/60">Vietcombank *8899</p>
        </div>
        <div className="rounded-2xl bg-white/80 p-4">
          <p className="text-sm font-semibold">Danh mục</p>
          <p className="mt-1 text-xs text-foreground/60">Hóa đơn</p>
        </div>

        <label className="flex items-center justify-between rounded-2xl bg-white/80 p-4">
          <div><p className="text-sm font-semibold">Autopay</p><p className="text-xs text-foreground/60">Tự động ghi nhận khi đến hạn</p></div>
          <input type="checkbox" className="h-5 w-5" />
        </label>

        <div className="rounded-2xl bg-[#FFF1E4] p-3 text-xs text-[#8F5F68]">
          Xem trước: 10/07, 10/08, 10/09, 10/10 · 12 kỳ trong 12 tháng
        </div>

        <Link to="/bills" className="block rounded-2xl bg-[#B5828C] py-3.5 text-center text-sm font-semibold text-white shadow-lg">Lưu khoản định kỳ</Link>
      </div>
    </PhoneFrame>
  );
}
