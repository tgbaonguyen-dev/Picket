import { createFileRoute, Link, useParams } from "@tanstack/react-router";
import { PhoneFrame } from "@/components/phone-frame";

export const Route = createFileRoute("/bills/$id/edit")({ component: EditBill });

function EditBill() {
  const { id } = useParams({ from: "/bills/$id/edit" });
  return (
    <PhoneFrame title="Chỉnh khoản định kỳ" subtitle={`ID: ${id}`}>
      <div className="space-y-4 px-5 pb-8">
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-foreground/60">Tên</label>
          <input defaultValue="Điện EVN" className="w-full rounded-2xl bg-white/80 px-4 py-3 text-sm" />
        </div>
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-foreground/60">Số tiền ước tính</label>
          <input defaultValue="850000" className="w-full rounded-2xl bg-white/80 px-4 py-3 text-lg font-bold tabular-nums" />
        </div>
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-foreground/60">Ngày trong tháng</label>
          <input type="number" defaultValue={10} className="w-full rounded-2xl bg-white/80 px-4 py-3 text-sm" />
        </div>
        <label className="flex items-center justify-between rounded-2xl bg-white/80 p-4">
          <span className="text-sm">Autopay</span>
          <input type="checkbox" className="h-5 w-5" />
        </label>
        <Link to="/bills/$id" params={{ id }} className="block rounded-2xl bg-[#B5828C] py-3.5 text-center text-sm font-semibold text-white">Cập nhật</Link>
        <button className="w-full rounded-2xl border border-red-200 py-3 text-sm font-medium text-red-600">Kết thúc chu kỳ</button>
      </div>
    </PhoneFrame>
  );
}
