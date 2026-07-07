import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { zodValidator, fallback } from "@tanstack/zod-adapter";
import { z } from "zod";
import { useState } from "react";
import { Tag, FolderTree, CheckCircle, Trash2, Download, Undo2 } from "lucide-react";
import { PhoneFrame } from "@/components/phone-frame";
import { TRANSACTIONS, formatVND } from "@/data";
import { toast } from "sonner";

const searchSchema = z.object({
  ids: fallback(z.string(), "").default(""),
});

export const Route = createFileRoute("/transactions/bulk")({
  validateSearch: zodValidator(searchSchema),
  component: BulkPage,
});

function BulkPage() {
  const { ids } = Route.useSearch();
  const nav = useNavigate();
  const selectedIds = ids.split(",").filter(Boolean);
  const items = TRANSACTIONS.filter((t) => selectedIds.includes(t.id));
  const [preview, setPreview] = useState<string | null>(null);

  const totalExpense = items
    .filter((t) => t.type === "expense")
    .reduce((s, t) => s + t.amount, 0);

  const runAction = (label: string) => {
    setPreview(label);
    setTimeout(() => {
      toast.success(`${label} · ${items.length} giao dịch`, {
        action: { label: "Hoàn tác", onClick: () => toast.info("Đã hoàn tác") },
      });
      setPreview(null);
      nav({ to: "/transactions" });
    }, 800);
  };

  if (items.length === 0) {
    return (
      <PhoneFrame title="Thao tác hàng loạt">
        <div className="p-10 text-center text-foreground/55">
          <p className="text-[14px]">Chưa chọn giao dịch nào.</p>
          <button
            onClick={() => nav({ to: "/transactions" })}
            className="mt-4 rounded-xl bg-foreground px-4 py-2 text-[13px] font-semibold text-background"
          >
            Quay về danh sách
          </button>
        </div>
      </PhoneFrame>
    );
  }

  return (
    <PhoneFrame title="Thao tác hàng loạt" subtitle={`${items.length} đã chọn`}>
      <div className="space-y-4 px-5 pb-6">
        {/* Summary */}
        <div className="rounded-3xl bg-gradient-to-br from-foreground to-foreground/85 p-5 text-background shadow-lg">
          <div className="flex justify-between text-[11px] uppercase tracking-widest opacity-70">
            <span>Đã chọn</span>
            <span>Tổng chi</span>
          </div>
          <div className="mt-1 flex items-baseline justify-between">
            <span className="font-display text-[30px] font-bold">{items.length}</span>
            <span className="font-display text-[22px] font-bold tabular-nums">
              −{formatVND(totalExpense)}
            </span>
          </div>
        </div>

        {/* Actions */}
        <div className="grid grid-cols-2 gap-2">
          <BulkAction
            icon={<FolderTree className="h-4 w-4" />}
            label="Đổi danh mục"
            onClick={() => runAction("Đã đổi danh mục")}
          />
          <BulkAction
            icon={<Tag className="h-4 w-4" />}
            label="Thêm nhãn"
            onClick={() => runAction("Đã thêm nhãn")}
          />
          <BulkAction
            icon={<CheckCircle className="h-4 w-4" />}
            label="Đánh dấu đã xem"
            onClick={() => runAction("Đã xác nhận")}
          />
          <BulkAction
            icon={<Download className="h-4 w-4" />}
            label="Xuất CSV"
            onClick={() => runAction("Đã xuất file")}
          />
          <BulkAction
            icon={<Undo2 className="h-4 w-4" />}
            label="Đảo trạng thái"
            onClick={() => runAction("Đã cập nhật")}
          />
          <BulkAction
            danger
            icon={<Trash2 className="h-4 w-4" />}
            label="Xoá"
            onClick={() => runAction("Đã xoá")}
          />
        </div>

        {preview && (
          <div className="rounded-2xl border border-primary/20 bg-primary/5 p-4">
            <p className="text-[12px] font-semibold text-primary">Đang xử lý...</p>
            <p className="mt-1 text-[11px] text-foreground/60">
              Preview: {items.length} giao dịch sẽ được cập nhật, ảnh hưởng đến 3 ngân sách.
            </p>
          </div>
        )}

        {/* Selected list */}
        <div>
          <p className="mb-2 text-[11px] font-bold uppercase tracking-widest text-foreground/50">
            Danh sách
          </p>
          <div className="overflow-hidden rounded-2xl border border-white/70 bg-white/85 shadow-sm">
            {items.map((t, i) => (
              <div
                key={t.id}
                className={`flex items-center gap-3 px-4 py-3 ${
                  i > 0 ? "border-t border-foreground/5" : ""
                }`}
              >
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-foreground/5 text-base">
                  {t.categoryEmoji}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[13px] font-semibold">{t.merchant}</p>
                  <p className="text-[11px] text-foreground/55">{t.category}</p>
                </div>
                <p className="font-display text-[13px] font-bold tabular-nums">
                  {t.type === "expense" ? "−" : "+"}
                  {formatVND(t.amount, t.currency)}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </PhoneFrame>
  );
}

function BulkAction({
  icon, label, onClick, danger,
}: { icon: React.ReactNode; label: string; onClick: () => void; danger?: boolean }) {
  return (
    <button
      onClick={onClick}
      className={`flex flex-col items-start gap-2 rounded-2xl border p-4 text-left shadow-sm active:scale-95 ${
        danger
          ? "border-destructive/20 bg-white text-destructive"
          : "border-white/70 bg-white/85"
      }`}
    >
      {icon}
      <span className="text-[13px] font-semibold">{label}</span>
    </button>
  );
}
