import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import {
  Pencil, Split, Undo2, Paperclip, Share2, Trash2, Users, Clock, Receipt,
} from "lucide-react";
import { PhoneFrame } from "@/components/phone-frame";
import { findTx, formatVND } from "@/lib/mock-transactions";

export const Route = createFileRoute("/transactions/$id")({
  loader: ({ params }) => {
    const tx = findTx(params.id);
    if (!tx) throw notFound();
    return tx;
  },
  errorComponent: ({ error }) => (
    <PhoneFrame title="Lỗi">
      <div className="p-6 text-sm text-destructive">{error.message}</div>
    </PhoneFrame>
  ),
  notFoundComponent: () => (
    <PhoneFrame title="Không tìm thấy">
      <div className="p-6 text-sm text-foreground/60">Giao dịch không tồn tại.</div>
    </PhoneFrame>
  ),
  component: TxDetail,
});

function TxDetail() {
  const t = Route.useLoaderData();
  const isNeg = t.type === "expense";
  const isPlus = t.type === "income" || t.type === "refund";
  const sign = isNeg ? "−" : isPlus ? "+" : "";

  return (
    <PhoneFrame title="Chi tiết giao dịch" subtitle={t.id.toUpperCase()}>
      <div className="space-y-4 px-5 pb-8">
        {/* Amount hero */}
        <div className="rounded-3xl bg-gradient-to-br from-foreground to-foreground/85 p-6 text-background shadow-lg">
          <div className="flex items-center gap-2 text-[11px] uppercase tracking-widest opacity-70">
            <span className="text-lg">{t.categoryEmoji}</span>
            <span>{t.category}</span>
            {t.status === "pending" && (
              <span className="ml-auto rounded-full bg-amber-400 px-2 py-0.5 text-[10px] font-bold text-amber-900">
                Chờ xử lý
              </span>
            )}
            {t.status === "refunded" && (
              <span className="ml-auto rounded-full bg-[#FFB4A2] px-2 py-0.5 text-[10px] font-bold text-[#4A2C2A]">
                Đã hoàn
              </span>
            )}
          </div>
          <p className="mt-3 font-display text-[36px] font-bold leading-none tabular-nums">
            {sign}
            {formatVND(t.amount, t.currency)}
          </p>
          <p className="mt-2 text-[15px] font-semibold">{t.merchant}</p>
          <p className="text-[12px] opacity-75">
            {new Date(t.date).toLocaleString("vi-VN", {
              weekday: "long", day: "numeric", month: "long", hour: "2-digit", minute: "2-digit",
            })}
          </p>
        </div>

        {/* Details */}
        <div className="divide-y divide-foreground/5 rounded-2xl border border-white/70 bg-white/80 shadow-sm">
          <Row label="Tài khoản" value={t.account} />
          <Row label="Danh mục" value={`${t.categoryEmoji} ${t.category}`} />
          <Row label="Loại" value={typeLabel(t.type)} />
          {t.note && <Row label="Ghi chú" value={t.note} />}
          {t.shared && <Row label="Chia sẻ" value="Chung với 2 người" icon={<Users className="h-3.5 w-3.5" />} />}
        </div>

        {/* Receipts */}
        {t.receipts && t.receipts.length > 0 && (
          <div>
            <p className="mb-2 px-1 text-[11px] font-bold uppercase tracking-widest text-foreground/50">
              Hoá đơn ({t.receipts.length})
            </p>
            <div className="flex gap-2 overflow-x-auto">
              {t.receipts.map((r: string) => (
                <img
                  key={r}
                  src={r}
                  alt="Hoá đơn"
                  className="h-32 w-24 shrink-0 rounded-xl border border-white/70 object-cover shadow-sm"
                />
              ))}
              <Link
                to="/capture-receipt"
                className="flex h-32 w-24 shrink-0 flex-col items-center justify-center rounded-xl border-2 border-dashed border-foreground/20 text-foreground/50"
              >
                <Receipt className="h-6 w-6" />
                <span className="mt-1 text-[10px]">Thêm</span>
              </Link>
            </div>
          </div>
        )}

        {/* Audit */}
        <div className="rounded-2xl border border-white/70 bg-white/80 p-4 shadow-sm">
          <p className="mb-3 flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-widest text-foreground/50">
            <Clock className="h-3 w-3" /> Lịch sử
          </p>
          <div className="space-y-2 text-[12px] text-foreground/70">
            <div className="flex justify-between">
              <span>Tạo giao dịch</span>
              <span className="tabular-nums">15/04, 09:12</span>
            </div>
            <div className="flex justify-between">
              <span>Đồng bộ từ Vietcombank</span>
              <span className="tabular-nums">15/04, 09:14</span>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="grid grid-cols-4 gap-2">
          <ActionBtn to="/transactions/$id/edit" params={{ id: t.id }} icon={<Pencil className="h-4 w-4" />} label="Sửa" />
          <ActionBtn to="/transactions/$id/split" params={{ id: t.id }} icon={<Split className="h-4 w-4" />} label="Split" />
          <ActionBtn to="/transactions/$id/refund" params={{ id: t.id }} icon={<Undo2 className="h-4 w-4" />} label="Hoàn" />
          <ActionBtn to="/capture-receipt" icon={<Paperclip className="h-4 w-4" />} label="Đính kèm" />
        </div>

        <div className="flex gap-2 pt-2">
          <button className="flex-1 rounded-xl border border-foreground/10 bg-white py-3 text-[13px] font-semibold">
            <Share2 className="mr-1.5 inline h-4 w-4" /> Chia sẻ
          </button>
          <button className="flex-1 rounded-xl border border-destructive/30 bg-white py-3 text-[13px] font-semibold text-destructive">
            <Trash2 className="mr-1.5 inline h-4 w-4" /> Xoá
          </button>
        </div>
      </div>
    </PhoneFrame>
  );
}

function Row({ label, value, icon }: { label: string; value: string; icon?: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between px-4 py-3">
      <span className="text-[12px] text-foreground/55">{label}</span>
      <span className="flex items-center gap-1.5 text-right font-display text-[14px] font-semibold">
        {icon}
        {value}
      </span>
    </div>
  );
}

function ActionBtn({
  to, params, icon, label,
}: {
  to: string; params?: Record<string, string>; icon: React.ReactNode; label: string;
}) {
  return (
    <Link
      to={to as never}
      params={params as never}
      className="flex flex-col items-center gap-1 rounded-xl border border-white/70 bg-white/80 py-3 text-[11px] font-semibold shadow-sm active:scale-95"
    >
      {icon}
      {label}
    </Link>
  );
}

function typeLabel(t: string) {
  return { expense: "Chi", income: "Thu", transfer: "Chuyển khoản", refund: "Hoàn tiền" }[t] ?? t;
}
