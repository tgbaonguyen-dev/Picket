import { createFileRoute, useNavigate, notFound } from "@tanstack/react-router";
import { useState } from "react";
import { History, AlertTriangle } from "lucide-react";
import { PhoneFrame } from "@/components/phone-frame";
import { findTx, ACCOUNTS, formatVND } from "@/data";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

export const Route = createFileRoute("/transactions/$id/edit")({
  loader: ({ params }) => {
    const tx = findTx(params.id);
    if (!tx) throw notFound();
    return tx;
  },
  errorComponent: ({ error }) => (
    <PhoneFrame title="Lỗi"><div className="p-6 text-sm text-destructive">{error.message}</div></PhoneFrame>
  ),
  notFoundComponent: () => (
    <PhoneFrame title="Không tìm thấy"><div className="p-6 text-sm">Giao dịch không tồn tại.</div></PhoneFrame>
  ),
  component: EditTx,
});

function EditTx() {
  const t = Route.useLoaderData();
  const nav = useNavigate();
  const [amount, setAmount] = useState(String(t.amount));
  const [merchant, setMerchant] = useState(t.merchant);
  const [account, setAccount] = useState(t.account);
  const [note, setNote] = useState(t.note ?? "");

  const changed = amount !== String(t.amount) || merchant !== t.merchant || account !== t.account || note !== (t.note ?? "");
  const bankLocked = t.status === "posted" && t.account.includes("Vietcombank");

  return (
    <PhoneFrame title="Chỉnh sửa" subtitle={t.id.toUpperCase()}>
      <div className="space-y-4 px-5 pb-6">
        {bankLocked && (
          <div className="flex items-start gap-2 rounded-2xl border border-amber-200 bg-amber-50 p-3 text-[12px] text-amber-800">
            <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
            <div>
              <p className="font-semibold">Trường số tiền bị khoá</p>
              <p className="opacity-80">Giao dịch đã đối soát với ngân hàng. Sửa số tiền cần tạo điều chỉnh.</p>
            </div>
          </div>
        )}

        <div className="space-y-3 rounded-2xl border border-white/70 bg-white/80 p-4 shadow-sm">
          <Field label="Số tiền">
            <input
              type="number"
              disabled={bankLocked}
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full bg-transparent font-display text-[22px] font-bold tabular-nums outline-none disabled:opacity-50"
            />
          </Field>
          <Field label="Merchant">
            <input
              value={merchant}
              onChange={(e) => setMerchant(e.target.value)}
              className="w-full bg-transparent text-[15px] font-semibold outline-none"
            />
          </Field>
          <Field label="Tài khoản">
            <Select value={account} onValueChange={setAccount}>
              <SelectTrigger className="w-full flex h-auto items-center justify-between border-none bg-transparent p-0 text-[15px] font-semibold outline-none ring-0 focus:ring-0 [&>span:last-child]:hidden">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="rounded-xl border border-white/40 bg-white/95 backdrop-blur-md shadow-lg">
                {ACCOUNTS.map((a) => (<SelectItem key={a.id} value={a.name} className="rounded-lg">{a.name}</SelectItem>))}
              </SelectContent>
            </Select>
          </Field>
          <Field label="Ghi chú">
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              rows={2}
              className="w-full resize-none bg-transparent text-[14px] outline-none"
            />
          </Field>
        </div>

        {/* Change summary */}
        {changed && (
          <div className="rounded-2xl border border-primary/20 bg-primary/5 p-4">
            <p className="mb-2 text-[11px] font-bold uppercase tracking-widest text-primary">
              Tác động
            </p>
            <div className="space-y-1 text-[12px]">
              {amount !== String(t.amount) && (
                <p>Số tiền: <span className="line-through opacity-50">{formatVND(t.amount)}</span> → <b>{formatVND(Number(amount) || 0)}</b></p>
              )}
              <p className="text-foreground/60">
                • Ngân sách "Ăn uống" tháng 4 sẽ cập nhật
              </p>
              <p className="text-foreground/60">• 1 báo cáo liên quan sẽ đồng bộ lại</p>
            </div>
          </div>
        )}

        <button className="flex w-full items-center justify-center gap-2 rounded-2xl border border-foreground/10 bg-white py-3 text-[13px] font-semibold">
          <History className="h-4 w-4" /> Xem lịch sử thay đổi
        </button>

        <div className="flex gap-2 pt-1">
          <button
            onClick={() => nav({ to: "/transactions/$id", params: { id: t.id } })}
            className="flex-1 rounded-2xl border border-foreground/10 bg-white py-3.5 text-[13px] font-semibold"
          >
            Huỷ
          </button>
          <button
            disabled={!changed}
            onClick={() => {
              toast.success("Đã lưu thay đổi");
              nav({ to: "/transactions/$id", params: { id: t.id } });
            }}
            className="flex-1 rounded-2xl bg-foreground py-3.5 text-[13px] font-semibold text-background disabled:opacity-40"
          >
            Lưu
          </button>
        </div>
      </div>
    </PhoneFrame>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="mb-1 text-[11px] font-bold uppercase tracking-widest text-foreground/50">{label}</p>
      {children}
    </div>
  );
}
