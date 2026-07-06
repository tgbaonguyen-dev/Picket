import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import {
  Pencil, Split, Undo2, Paperclip, Share2, Trash2, Users, Clock, Receipt, TrendingUp
} from "lucide-react";
import { PhoneFrame } from "@/components/phone-frame";
import { MetaRow } from "@/components/meta-row";
import { findTx, formatVND } from "@/lib/mock-transactions";
import { useState } from "react";

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
  const [shareMode, setShareMode] = useState(false);
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
          <p className={`mt-3 font-display text-[36px] font-bold leading-none tabular-nums transition duration-500 ${shareMode ? 'blur-md select-none opacity-80' : ''}`}>
            {sign}
            {formatVND(t.amount, t.currency)}
          </p>
          <p className={`mt-2 text-[15px] font-semibold transition duration-500 ${shareMode ? 'blur-sm select-none opacity-80' : ''}`}>{t.merchant}</p>
          <p className="text-[12px] opacity-75">
            {new Date(t.date).toLocaleString("vi-VN", {
              weekday: "long", day: "numeric", month: "long", hour: "2-digit", minute: "2-digit",
            })}
          </p>
        </div>

        {/* Budget impact */}
        {isNeg && (
          <div className="rounded-2xl border border-white/70 bg-white/80 p-4 shadow-sm flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-orange-100 text-orange-600">
              <TrendingUp className="h-5 w-5" />
            </div>
            <div className="flex-1">
              <p className="text-[12px] font-semibold text-foreground/70">Ngân sách {t.category}</p>
              <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-foreground/10 flex">
                <div className="h-full bg-foreground/20" style={{ width: '36.5%' }} />
                <div className="h-full bg-orange-500 relative" style={{ width: '5.5%' }}>
                   <div className="absolute inset-0 bg-white/30 animate-pulse" />
                </div>
              </div>
              <p className="mt-1.5 text-[10px] font-medium text-foreground/50">Giao dịch này chiếm <span className="font-bold text-orange-600">5.5%</span></p>
            </div>
          </div>
        )}

        {/* Details */}
        <div className="divide-y divide-foreground/5 rounded-2xl border border-white/70 bg-white/80 shadow-sm">
          <MetaRow label="Tài khoản" value={t.account} />
          <MetaRow label="Danh mục" value={`${t.categoryEmoji} ${t.category}`} />
          <MetaRow label="Loại" value={typeLabel(t.type)} />
          {t.note && <MetaRow label="Ghi chú" value={t.note} />}
          {t.shared && <MetaRow label="Chia sẻ" value="Chung với 2 người" icon={<Users className="h-3.5 w-3.5" />} />}
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
          <button 
            onClick={() => setShareMode(!shareMode)}
            className={`flex-1 rounded-xl border py-3 text-[13px] font-semibold transition ${shareMode ? 'bg-[#dc2626] border-[#dc2626] text-white shadow-lg shadow-rose-600/20' : 'border-foreground/10 bg-white'}`}
          >
            {shareMode ? <Undo2 className="mr-1.5 inline h-4 w-4" /> : <Share2 className="mr-1.5 inline h-4 w-4" />}
            {shareMode ? "Huỷ chia sẻ" : "Chia sẻ an toàn"}
          </button>
          <button className="flex-1 rounded-xl border border-destructive/30 bg-white py-3 text-[13px] font-semibold text-destructive">
            <Trash2 className="mr-1.5 inline h-4 w-4" /> Xoá
          </button>
        </div>
      </div>
    </PhoneFrame>
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
