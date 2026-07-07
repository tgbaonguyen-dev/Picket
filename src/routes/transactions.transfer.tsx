import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowDown, ArrowLeftRight, AlertTriangle } from "lucide-react";
import { PhoneFrame } from "@/components/phone-frame";
import { ACCOUNTS, formatVND } from "@/data";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

export const Route = createFileRoute("/transactions/transfer")({
  component: TransferPage,
});

function TransferPage() {
  const nav = useNavigate();
  const [from, setFrom] = useState(ACCOUNTS[0]);
  const [to, setTo] = useState(ACCOUNTS[1]);
  const [amount, setAmount] = useState("500000");
  const [fee, setFee] = useState("0");
  const [note, setNote] = useState("");

  const fx = from.currency !== to.currency;
  const rate = fx ? 25400 : 1;
  const converted = Math.round((Number(amount) || 0) * (fx ? 1 / rate : 1));
  const insufficient = Number(amount) > from.balance;

  const swap = () => {
    setFrom(to);
    setTo(from);
  };

  return (
    <PhoneFrame title="Chuyển tiền" back>
      <div className="space-y-4 px-5 pb-6">
        {/* From */}
        <AccountCard
          label="Từ tài khoản"
          account={from}
          onChange={setFrom}
        />

        <div className="flex justify-center">
          <button
            onClick={swap}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-white/80 bg-white shadow-sm"
          >
            <ArrowLeftRight className="h-4 w-4" />
          </button>
        </div>

        <AccountCard label="Đến tài khoản" account={to} onChange={setTo} />

        <div className="flex justify-center">
          <ArrowDown className="h-5 w-5 text-foreground/30" />
        </div>

        {/* Amount */}
        <div className="rounded-3xl bg-gradient-to-br from-foreground to-foreground/85 p-5 text-background">
          <p className="text-[11px] uppercase tracking-widest opacity-70">Số tiền chuyển</p>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="mt-1 w-full bg-transparent font-display text-[30px] font-bold tabular-nums outline-none"
          />
          {fx && (
            <div className="mt-2 flex justify-between text-[12px] opacity-80">
              <span>Tỷ giá: 1 USD = 25,400₫</span>
              <span>≈ ${converted}</span>
            </div>
          )}
        </div>

        {insufficient && (
          <div className="flex items-start gap-2 rounded-2xl border border-destructive/30 bg-destructive/5 p-3 text-[12px] text-destructive">
            <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
            Số dư không đủ. Số dư hiện tại: {formatVND(from.balance, from.currency)}
          </div>
        )}

        <div className="space-y-3 rounded-2xl border border-white/70 bg-white/85 p-4 shadow-sm">
          <div>
            <p className="mb-1 text-[11px] font-bold uppercase tracking-widest text-foreground/50">
              Phí giao dịch
            </p>
            <input
              type="number"
              value={fee}
              onChange={(e) => setFee(e.target.value)}
              className="w-full bg-transparent text-[15px] font-semibold outline-none"
            />
          </div>
          <div>
            <p className="mb-1 text-[11px] font-bold uppercase tracking-widest text-foreground/50">
              Ghi chú
            </p>
            <input
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="VD: Nạp tiền ví..."
              className="w-full bg-transparent text-[14px] outline-none"
            />
          </div>
        </div>

        <button
          disabled={insufficient}
          onClick={() => {
            toast.success("Đã tạo chuyển khoản");
            nav({ to: "/transactions" });
          }}
          className="w-full rounded-2xl bg-foreground py-3.5 text-[14px] font-semibold text-background disabled:opacity-40"
        >
          Xác nhận chuyển
        </button>
      </div>
    </PhoneFrame>
  );
}

function AccountCard({
  label, account, onChange,
}: {
  label: string;
  account: (typeof ACCOUNTS)[number];
  onChange: (a: (typeof ACCOUNTS)[number]) => void;
}) {
  return (
    <div className="rounded-2xl border border-white/70 bg-white/85 p-4 shadow-sm">
      <p className="text-[11px] font-bold uppercase tracking-widest text-foreground/50">
        {label}
      </p>
      <Select
        value={account.id}
        onValueChange={(val) => {
          const a = ACCOUNTS.find((x) => x.id === val);
          if (a) onChange(a);
        }}
      >
        <SelectTrigger className="w-full flex h-auto items-center justify-between border-none bg-transparent p-0 font-display text-[16px] font-semibold outline-none ring-0 focus:ring-0 [&>span:last-child]:hidden">
          <SelectValue />
        </SelectTrigger>
        <SelectContent className="rounded-xl border border-white/40 bg-white/95 backdrop-blur-md shadow-lg">
          {ACCOUNTS.map((a) => (
            <SelectItem key={a.id} value={a.id} className="rounded-lg">{a.name}</SelectItem>
          ))}
        </SelectContent>
      </Select>
      <p className="mt-1 text-[12px] text-foreground/55 tabular-nums">
        Số dư: {formatVND(account.balance, account.currency)}
      </p>
    </div>
  );
}
