import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Delete, Camera, Repeat, Calendar as CalendarIcon } from "lucide-react";
import { PhoneFrame } from "@/components/phone-frame";
import { MetaRow } from "@/components/meta-row";
import { ACCOUNTS, getCategories, formatVND } from "@/data";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

export const Route = createFileRoute("/transactions/new")({
  component: NewTx,
});

function NewTx() {
  const nav = useNavigate();
  const [type, setType] = useState<"expense" | "income" | "transfer">("expense");
  const [amount, setAmount] = useState("0");
  const [note, setNote] = useState("");
  const [account, setAccount] = useState(ACCOUNTS[0].name);
  const [cat, setCat] = useState(getCategories()[0]);
  const [merchant, setMerchant] = useState("");
  const [recurring, setRecurring] = useState(false);

  const press = (k: string) => {
    if (k === "back") return setAmount((a) => (a.length <= 1 ? "0" : a.slice(0, -1)));
    if (k === ".") return setAmount((a) => (a.includes(".") ? a : a + "."));
    setAmount((a) => (a === "0" ? k : a + k));
  };

  const save = (again = false) => {
    toast.success(again ? "Đã lưu · Tiếp tục" : "Đã lưu giao dịch");
    if (!again) nav({ to: "/transactions" });
    else {
      setAmount("0"); setNote(""); setMerchant("");
    }
  };

  return (
    <PhoneFrame title="Thêm giao dịch" back>
      <div className="space-y-4 px-5 pb-6">
        {/* Type toggle */}
        <div className="flex rounded-2xl bg-foreground/5 p-1">
          {(["expense", "income", "transfer"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setType(t)}
              className={`flex-1 rounded-xl py-2 text-[13px] font-semibold transition ${
                type === t ? "bg-white text-foreground shadow" : "text-foreground/55"
              }`}
            >
              {t === "expense" ? "Chi" : t === "income" ? "Thu" : "Chuyển"}
            </button>
          ))}
        </div>

        {/* Amount display */}
        <div className="rounded-3xl bg-gradient-to-br from-foreground to-foreground/85 p-6 text-background shadow-lg">
          <p className="text-[11px] uppercase tracking-widest opacity-70">Số tiền</p>
          <p className="mt-2 font-display text-[40px] font-bold leading-none tabular-nums">
            {type === "expense" && "−"}
            {type === "income" && "+"}
            {formatVND(Number(amount) || 0)}
          </p>
        </div>

        {/* Meta rows */}
        <div className="divide-y divide-foreground/5 rounded-2xl border border-white/70 bg-white/80 shadow-sm">
          <MetaRow label="Danh mục" onClick={() => {}}>
            <Link
              to="/transactions/category"
              className="text-[14px] font-semibold"
            >
              {cat.emoji} {cat.label} →
            </Link>
          </MetaRow>
          <div className="px-4 py-3">
            <p className="text-[11px] uppercase tracking-widest text-foreground/50">Merchant</p>
            <input
              value={merchant}
              onChange={(e) => setMerchant(e.target.value)}
              placeholder="VD: Highlands Coffee"
              className="mt-1 w-full bg-transparent font-display text-[14px] font-semibold outline-none"
            />
          </div>
          <MetaRow label="Tài khoản">
            <Select value={account} onValueChange={setAccount}>
              <SelectTrigger className="flex h-auto w-auto items-center justify-end border-none bg-transparent p-0 text-right text-[14px] font-semibold outline-none ring-0 focus:ring-0 [&>span:last-child]:ml-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="rounded-xl border border-white/40 bg-white/95 backdrop-blur-md shadow-lg">
                {ACCOUNTS.map((a) => (
                  <SelectItem key={a.id} value={a.name} className="rounded-lg">{a.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </MetaRow>
          <MetaRow label="Ngày">
            <span className="flex items-center gap-1.5 text-[14px] font-semibold">
              <CalendarIcon className="h-3.5 w-3.5" /> Hôm nay · 15/04
            </span>
          </MetaRow>
          <div className="px-4 py-3">
            <p className="text-[11px] uppercase tracking-widest text-foreground/50">Ghi chú</p>
            <input
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Thêm ghi chú..."
              className="mt-1 w-full bg-transparent text-[14px] outline-none"
            />
          </div>
          <button
            onClick={() => setRecurring((r) => !r)}
            className="flex w-full items-center justify-between px-4 py-3 text-left"
          >
            <span className="flex items-center gap-2 text-[13px] font-semibold">
              <Repeat className="h-4 w-4" /> Định kỳ
            </span>
            <span
              className={`h-6 w-11 rounded-full p-0.5 transition ${
                recurring ? "bg-foreground" : "bg-foreground/15"
              }`}
            >
              <span
                className={`block h-5 w-5 rounded-full bg-white transition ${
                  recurring ? "translate-x-5" : ""
                }`}
              />
            </span>
          </button>
        </div>

        {/* Keypad */}
        <div className="grid grid-cols-3 gap-2">
          {["1", "2", "3", "4", "5", "6", "7", "8", "9", ".", "0", "back"].map((k) => (
            <button
              key={k}
              onClick={() => press(k)}
              className="rounded-2xl bg-white/80 py-4 text-center font-display text-[20px] font-bold shadow-sm active:scale-95"
            >
              {k === "back" ? <Delete className="mx-auto h-5 w-5" /> : k}
            </button>
          ))}
        </div>

        {/* CTA */}
        <div className="flex gap-2">
          <Link
            to="/capture-receipt"
            className="flex items-center justify-center rounded-2xl border border-foreground/10 bg-white px-4 py-3.5"
          >
            <Camera className="h-5 w-5" />
          </Link>
          <button
            onClick={() => save(true)}
            className="flex-1 rounded-2xl border border-foreground/10 bg-white py-3.5 text-[13px] font-semibold"
          >
            Lưu & thêm
          </button>
          <button
            onClick={() => save(false)}
            className="flex-1 rounded-2xl bg-foreground py-3.5 text-[13px] font-semibold text-background shadow"
          >
            Lưu
          </button>
        </div>
      </div>
    </PhoneFrame>
  );
}
