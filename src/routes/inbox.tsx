import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { PhoneFrame } from "@/components/phone-frame";
import { AlertTriangle, Copy, Tag, WifiOff, Check, Trash2, ChevronRight } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/inbox")({
  component: InboxPage,
});

type TaskKind = "ocr" | "duplicate" | "uncategorized" | "sync";

type Task = {
  id: string;
  kind: TaskKind;
  title: string;
  reason: string;
  meta: string;
  cta: string;
};

const TASKS: Task[] = [
  { id: "t1", kind: "ocr", title: "Hoá đơn Circle K", reason: "OCR độ tin cậy 62% · Kiểm tra tổng tiền", meta: "128.000₫ · 14/04", cta: "Xem hoá đơn" },
  { id: "t2", kind: "ocr", title: "Hoá đơn Starbucks", reason: "Không đọc được thuế VAT", meta: "89.000₫ · 13/04", cta: "Chỉnh sửa" },
  { id: "t3", kind: "duplicate", title: "Grab · 45.000₫", reason: "Trùng với giao dịch lúc 08:14 hôm nay", meta: "2 giao dịch", cta: "So sánh" },
  { id: "t4", kind: "duplicate", title: "Shopee · 320.000₫", reason: "Có thể trùng đơn hàng #A912", meta: "3 giao dịch", cta: "Gộp" },
  { id: "t5", kind: "uncategorized", title: "Chuyển khoản 1.200.000₫", reason: "Chưa chọn danh mục", meta: "12/04", cta: "Phân loại" },
  { id: "t6", kind: "uncategorized", title: "MoMo · 55.000₫", reason: "Ghi chú trống · Gợi ý: Ăn uống", meta: "10/04", cta: "Chọn" },
  { id: "t7", kind: "sync", title: "Techcombank", reason: "Sync lỗi lúc 09:22 · Cần đăng nhập lại", meta: "Ngân hàng", cta: "Kết nối" },
];

const KIND_META: Record<TaskKind, { label: string; icon: typeof AlertTriangle; color: string; bg: string }> = {
  ocr: { label: "OCR", icon: AlertTriangle, color: "text-[#b45309]", bg: "bg-[#fef3c7]" },
  duplicate: { label: "Trùng", icon: Copy, color: "text-[#7c3aed]", bg: "bg-[#ede9fe]" },
  uncategorized: { label: "Chưa phân loại", icon: Tag, color: "text-[#B5828C]", bg: "bg-[#FFE9D9]" },
  sync: { label: "Sync", icon: WifiOff, color: "text-[#b91c1c]", bg: "bg-[#fee2e2]" },
};

const TABS: { key: "all" | TaskKind; label: string }[] = [
  { key: "all", label: "Tất cả" },
  { key: "ocr", label: "OCR" },
  { key: "duplicate", label: "Trùng" },
  { key: "uncategorized", label: "Chưa phân loại" },
  { key: "sync", label: "Sync" },
];

function InboxPage() {
  const [tab, setTab] = useState<(typeof TABS)[number]["key"]>("all");
  const [selected, setSelected] = useState<Set<string>>(new Set());

  const filtered = TASKS.filter((t) => tab === "all" || t.kind === tab);
  const counts = TASKS.reduce<Record<string, number>>((acc, t) => {
    acc[t.kind] = (acc[t.kind] ?? 0) + 1;
    acc.all = (acc.all ?? 0) + 1;
    return acc;
  }, {});

  function toggle(id: string) {
    const next = new Set(selected);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setSelected(next);
  }

  function bulk(action: "approve" | "dismiss") {
    if (!selected.size) return;
    toast.success(`Đã ${action === "approve" ? "xác nhận" : "bỏ qua"} ${selected.size} mục`);
    setSelected(new Set());
  }

  return (
    <PhoneFrame title="Hộp cần kiểm tra" subtitle={`${TASKS.length} việc chờ`}>
      {/* Tabs */}
      <div className="flex gap-2 overflow-x-auto px-5 pb-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {TABS.map((t) => (
          <button
            key={t.key}
            type="button"
            onClick={() => setTab(t.key)}
            className={`flex shrink-0 items-center gap-1.5 rounded-full px-3.5 py-1.5 font-sans text-[12px] font-semibold transition ${
              tab === t.key
                ? "bg-[#B5828C] text-white shadow-sm"
                : "border border-white/80 bg-white/70 text-foreground/70"
            }`}
          >
            {t.label}
            <span
              className={`rounded-full px-1.5 py-0.5 text-[10px] font-bold tabular-nums ${
                tab === t.key ? "bg-white/25 text-white" : "bg-foreground/5 text-foreground/60"
              }`}
            >
              {counts[t.key] ?? 0}
            </span>
          </button>
        ))}
      </div>

      {/* Cards */}
      <div className="space-y-2.5 px-5 pb-32">
        {filtered.map((t) => {
          const meta = KIND_META[t.kind];
          const Icon = meta.icon;
          const isSelected = selected.has(t.id);
          return (
            <div
              key={t.id}
              className={`rounded-[20px] border bg-white p-4 shadow-[0_4px_14px_-8px_rgba(46,107,138,0.25)] transition ${
                isSelected ? "border-[#B5828C] ring-2 ring-[#B5828C]/20" : "border-white"
              }`}
            >
              <div className="flex items-start gap-3">
                <button
                  type="button"
                  onClick={() => toggle(t.id)}
                  aria-label="Chọn"
                  className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md border-2 transition ${
                    isSelected
                      ? "border-[#B5828C] bg-[#B5828C] text-white"
                      : "border-foreground/25 bg-white"
                  }`}
                >
                  {isSelected && <Check className="h-3 w-3" strokeWidth={3} />}
                </button>
                <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${meta.bg} ${meta.color}`}>
                  <Icon className="h-4 w-4" strokeWidth={2.4} />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className={`rounded-full px-2 py-0.5 font-sans text-[10px] font-bold uppercase tracking-wider ${meta.bg} ${meta.color}`}>
                      {meta.label}
                    </span>
                    <span className="truncate font-sans text-[11px] font-medium text-foreground/50">{t.meta}</span>
                  </div>
                  <h3 className="mt-1.5 truncate font-display text-[15px] font-bold text-foreground">{t.title}</h3>
                  <p className="mt-1 font-sans text-[12px] leading-snug text-foreground/65">{t.reason}</p>
                  <div className="mt-3 flex items-center justify-between">
                    <button
                      type="button"
                      className="flex items-center gap-1 rounded-full bg-[#FFE9D9] px-3 py-1.5 font-sans text-[12px] font-semibold text-[#B5828C] transition active:scale-95"
                    >
                      {t.cta} <ChevronRight className="h-3 w-3" strokeWidth={2.5} />
                    </button>
                    <button
                      type="button"
                      onClick={() => toast("Đã bỏ qua")}
                      className="font-sans text-[12px] font-medium text-foreground/50 transition hover:text-foreground/70"
                    >
                      Bỏ qua
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
        {!filtered.length && (
          <p className="mt-10 text-center font-sans text-[13px] text-foreground/50">Tất cả đều gọn gàng ✨</p>
        )}
      </div>

      {/* Bulk actions */}
      {selected.size > 0 && (
        <div className="absolute inset-x-5 bottom-5 flex items-center justify-between gap-2 rounded-[22px] border border-[#B5828C]/15 bg-white p-3 shadow-[0_12px_30px_-10px_rgba(46,107,138,0.4)]">
          <span className="pl-2 font-sans text-[13px] font-semibold text-foreground">
            {selected.size} đã chọn
          </span>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => bulk("dismiss")}
              className="flex items-center gap-1.5 rounded-xl bg-[#fee2e2] px-3 py-2 font-sans text-[12px] font-semibold text-[#b91c1c] transition active:scale-95"
            >
              <Trash2 className="h-3.5 w-3.5" /> Bỏ qua
            </button>
            <button
              type="button"
              onClick={() => bulk("approve")}
              className="flex items-center gap-1.5 rounded-xl bg-[#B5828C] px-3 py-2 font-sans text-[12px] font-semibold text-white transition active:scale-95"
            >
              <Check className="h-3.5 w-3.5" /> Xác nhận
            </button>
          </div>
        </div>
      )}
    </PhoneFrame>
  );
}
