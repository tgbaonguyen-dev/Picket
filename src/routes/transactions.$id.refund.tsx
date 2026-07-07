import { createFileRoute, useNavigate, notFound } from "@tanstack/react-router";
import { useState } from "react";
import { Check, Camera, Clock, X, ChevronDown } from "lucide-react";
import { PhoneFrame } from "@/components/phone-frame";
import { findTx, ACCOUNTS, formatVND } from "@/data";
import { PickerSheet } from "@/components/picker-sheet";
import { toast } from "sonner";

export const Route = createFileRoute("/transactions/$id/refund")({
  loader: ({ params }) => {
    const tx = findTx(params.id);
    if (!tx) throw notFound();
    return tx;
  },
  errorComponent: ({ error }) => (
    <PhoneFrame title="Lỗi"><div className="p-6 text-sm text-destructive">{error.message}</div></PhoneFrame>
  ),
  notFoundComponent: () => (
    <PhoneFrame title="Không tìm thấy"><div className="p-6 text-sm">Không tìm thấy.</div></PhoneFrame>
  ),
  component: RefundPage,
});

function RefundPage() {
  const t = Route.useLoaderData();
  const nav = useNavigate();
  const [mode, setMode] = useState<"refund" | "split">("refund");
  const [amount, setAmount] = useState(String(t.amount));
  const [dest, setDest] = useState(t.account);
  const [picker, setPicker] = useState(false);

  const partial = Number(amount) < t.amount;

  return (
    <PhoneFrame
      title={mode === "refund" ? "Hoàn tiền" : "Chia tiền"}
      right={
        <button className="text-[14px] font-semibold text-primary" onClick={() => {
          toast.success("Đã ghi nhận yêu cầu");
          nav({ to: "/transactions/$id", params: { id: t.id } });
        }}>
          Lưu
        </button>
      }
    >
      <div className="space-y-4 px-5 pb-6 pt-4">
        {/* Toggle */}
        <div className="flex rounded-2xl bg-foreground/5 p-1">
          {(["refund", "split"] as const).map((m) => (
            <button
              key={m}
              onClick={() => setMode(m)}
              className={`flex-1 rounded-xl py-2 text-[13px] font-semibold transition-all ${
                mode === m ? "bg-white shadow-sm text-foreground" : "text-foreground/50 hover:bg-white/50"
              }`}
            >
              {m === "refund" ? "Merchant hoàn" : "Đòi bạn bè"}
            </button>
          ))}
        </div>

        {/* Original */}
        <div className="rounded-2xl border border-white/70 bg-white/85 p-4 shadow-sm">
          <p className="text-[11px] font-bold uppercase tracking-widest text-foreground/50">
            Giao dịch gốc
          </p>
          <div className="mt-2 flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-foreground/5 text-xl">
              {t.categoryEmoji}
            </div>
            <div className="flex-1">
              <p className="font-display text-[14px] font-semibold">{t.merchant}</p>
              <p className="text-[11px] text-foreground/55">
                {new Date(t.date).toLocaleDateString("vi-VN")} · {t.account}
              </p>
            </div>
            <p className="font-display text-[15px] font-bold tabular-nums">
              −{formatVND(t.amount, t.currency)}
            </p>
          </div>
        </div>

        {/* Amount */}
        <div className="rounded-3xl bg-gradient-to-br from-[#B5828C] to-[#FFB4A2] p-5 text-white shadow-lg">
          <p className="text-[11px] uppercase tracking-widest opacity-80">
            Số tiền {mode === "refund" ? "hoàn" : "yêu cầu"}
          </p>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="mt-1 w-full bg-transparent font-display text-[30px] font-bold tabular-nums outline-none"
          />
          <p className="mt-1 text-[12px] opacity-80">
            {partial ? "Hoàn một phần" : "Hoàn toàn bộ"}
          </p>
        </div>

        <div className="space-y-3 rounded-2xl border border-white/70 bg-white/85 p-4 shadow-sm">
          <div>
            <p className="mb-1 text-[11px] font-bold uppercase tracking-widest text-foreground/50">
              {mode === "refund" ? "Nhận vào tài khoản" : "Từ người"}
            </p>
            {mode === "refund" ? (
              <button
                type="button"
                onClick={() => setPicker(true)}
                className="w-full flex h-auto items-center justify-between border-none bg-transparent p-0 text-[15px] font-semibold outline-none ring-0 focus:ring-0"
              >
                {dest}
                <ChevronDown className="h-4 w-4 text-foreground/50" />
              </button>
            ) : (
              <p className="text-[15px] font-semibold">Nam Nguyễn</p>
            )}
          </div>
          <button className="flex w-full items-center gap-2 rounded-xl border border-dashed border-foreground/20 px-3 py-2.5 text-[12px] text-foreground/60">
            <Camera className="h-4 w-4" /> Thêm bằng chứng (biên lai / email)
          </button>
        </div>

        {/* Status timeline */}
        <div className="rounded-2xl border border-white/70 bg-white/85 p-4 shadow-sm">
          <p className="mb-3 text-[11px] font-bold uppercase tracking-widest text-foreground/50">
            Trạng thái
          </p>
          <div className="space-y-3">
            <TimelineRow icon={<Check className="h-3 w-3" />} label="Ghi nhận yêu cầu" time="15/04" done />
            <TimelineRow icon={<Clock className="h-3 w-3" />} label={mode === "refund" ? "Chờ xác nhận từ merchant" : "Chờ người trả"} time="—" />
            <TimelineRow icon={<Check className="h-3 w-3" />} label="Đã nhận tiền" time="—" />
          </div>
        </div>

        <div className="flex gap-2">
          <button className="flex-1 rounded-2xl border border-foreground/10 bg-white py-3.5 text-[13px] font-semibold text-destructive">
            <X className="mr-1 inline h-4 w-4" /> Huỷ
          </button>
          <button
            onClick={() => {
              toast.success(mode === "refund" ? "Đã ghi nhận hoàn tiền" : "Đã gửi yêu cầu");
              nav({ to: "/transactions/$id", params: { id: t.id } });
            }}
            className="flex-1 rounded-2xl bg-foreground py-3.5 text-[13px] font-semibold text-background"
          >
            Xác nhận
          </button>
        </div>
      </div>

      <PickerSheet
        open={picker}
        title="Chọn tài khoản"
        options={ACCOUNTS.map((a) => a.name)}
        value={dest}
        onSelect={(val) => setDest(val)}
        onClose={() => setPicker(false)}
      />
    </PhoneFrame>
  );
}

function TimelineRow({
  icon, label, time, done,
}: { icon: React.ReactNode; label: string; time: string; done?: boolean }) {
  return (
    <div className="flex items-center gap-3">
      <div className={`flex h-6 w-6 items-center justify-center rounded-full ${done ? "bg-[#FFB4A2] text-white" : "bg-foreground/10 text-foreground/40"}`}>
        {icon}
      </div>
      <span className={`flex-1 text-[13px] ${done ? "font-semibold" : "text-foreground/55"}`}>{label}</span>
      <span className="text-[11px] text-foreground/50 tabular-nums">{time}</span>
    </div>
  );
}
