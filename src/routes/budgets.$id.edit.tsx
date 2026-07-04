import { createFileRoute, Link, useParams } from "@tanstack/react-router";
import { PhoneFrame } from "@/components/phone-frame";

export const Route = createFileRoute("/budgets/$id/edit")({ component: EditBudget });

function EditBudget() {
  const { id } = useParams({ from: "/budgets/$id/edit" });
  return (
    <PhoneFrame title="Chỉnh ngân sách" subtitle="Cập nhật hạn mức">
      <div className="space-y-4 px-5 pb-8">
        <div className="rounded-2xl bg-amber-50 p-3 text-xs text-amber-800">Đang chỉnh sửa ngân sách <strong>{id}</strong> · thay đổi áp dụng cho kỳ hiện tại.</div>

        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-foreground/60">Hạn mức</label>
          <input defaultValue="4500000" className="w-full rounded-2xl bg-white/80 px-4 py-3 text-lg font-bold tabular-nums" />
        </div>
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-foreground/60">Ghi chú</label>
          <textarea rows={3} defaultValue="Bao gồm ăn ngoài và giao đồ ăn." className="w-full rounded-2xl bg-white/80 px-4 py-3 text-sm" />
        </div>

        <label className="flex items-center justify-between rounded-2xl bg-white/80 p-4">
          <span className="text-sm">Áp dụng cho các kỳ sau</span>
          <input type="checkbox" defaultChecked className="h-5 w-5" />
        </label>

        <Link to="/budgets/$id" params={{ id }} className="block rounded-2xl bg-[#B5828C] py-3.5 text-center text-sm font-semibold text-white">Cập nhật</Link>
        <button className="w-full rounded-2xl border border-red-200 py-3 text-sm font-medium text-red-600">Archive ngân sách</button>
      </div>
    </PhoneFrame>
  );
}
