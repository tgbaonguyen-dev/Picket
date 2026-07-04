import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { PhoneFrame } from "@/components/phone-frame";
import { useState } from "react";
import { Check, Bell, Repeat, Tag, CalendarDays, CreditCard } from "lucide-react";

export const Route = createFileRoute("/bills/subscriptions/new")({
  component: NewSubscription,
});

const SUGGESTIONS = [
  { name: "Netflix", icon: "🎬", price: 260000 },
  { name: "Spotify", icon: "🎵", price: 149000 },
  { name: "YouTube Premium", icon: "▶️", price: 79000 },
  { name: "iCloud+", icon: "☁️", price: 59000 },
  { name: "ChatGPT Plus", icon: "🤖", price: 520000 },
  { name: "Apple Music", icon: "🎶", price: 65000 },
  { name: "Notion", icon: "📝", price: 240000 },
  { name: "Figma", icon: "🎨", price: 360000 },
];

const CYCLES = [
  { id: "monthly", label: "Hàng tháng" },
  { id: "yearly", label: "Hàng năm" },
  { id: "weekly", label: "Hàng tuần" },
] as const;

const CATEGORIES = ["Giải trí", "Công việc", "Học tập", "Sức khoẻ", "Khác"] as const;

const fmt = (n: number) => n.toLocaleString("vi-VN") + "₫";

function NewSubscription() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [icon, setIcon] = useState("💳");
  const [amount, setAmount] = useState<number>(0);
  const [cycle, setCycle] = useState<(typeof CYCLES)[number]["id"]>("monthly");
  const [nextDate, setNextDate] = useState("2026-08-01");
  const [category, setCategory] = useState<(typeof CATEGORIES)[number]>("Giải trí");
  const [method, setMethod] = useState("Thẻ Techcombank");
  const [remind, setRemind] = useState(true);
  const [trial, setTrial] = useState(false);

  const yearly = cycle === "monthly" ? amount * 12 : cycle === "yearly" ? amount : amount * 52;

  return (
    <PhoneFrame
      title="Thêm subscription"
      subtitle="Quản lý chi tiêu định kỳ"
      right={
        <button
          type="button"
          onClick={() => navigate({ to: "/bills/subscriptions" })}
          className="flex h-10 items-center justify-center rounded-2xl bg-foreground px-3 text-xs font-semibold text-background"
        >
          Lưu
        </button>
      }
    >
      <div className="space-y-5 px-5 pb-8">
        {/* Preview card */}
        <div className="rounded-3xl bg-gradient-to-br from-[#B5828C] to-[#FFB4A2] p-5 text-white">
          <div className="flex items-center gap-3">
            <span className="grid h-12 w-12 place-items-center rounded-2xl bg-white/20 text-2xl">{icon}</span>
            <div className="min-w-0 flex-1">
              <p className="truncate text-lg font-semibold">{name || "Tên gói dịch vụ"}</p>
              <p className="text-xs opacity-90">{CYCLES.find(c => c.id === cycle)?.label} · {category}</p>
            </div>
          </div>
          <div className="mt-4 flex items-end justify-between">
            <div>
              <p className="text-xs opacity-90">Mỗi kỳ</p>
              <p className="text-2xl font-bold tabular-nums">{fmt(amount)}</p>
            </div>
            <div className="text-right">
              <p className="text-xs opacity-90">Quy đổi năm</p>
              <p className="text-sm font-semibold tabular-nums">{fmt(yearly)}</p>
            </div>
          </div>
        </div>

        {/* Suggestions */}
        <section>
          <h2 className="mb-2 px-1 text-xs font-bold uppercase tracking-wider text-foreground/50">Gợi ý phổ biến</h2>
          <div className="flex gap-2 overflow-x-auto pb-1">
            {SUGGESTIONS.map(s => (
              <button
                key={s.name}
                type="button"
                onClick={() => { setName(s.name); setIcon(s.icon); setAmount(s.price); }}
                className={`flex shrink-0 items-center gap-2 rounded-2xl border px-3 py-2 text-xs font-medium transition ${name === s.name ? "border-[#B5828C] bg-[#FFE4D2] text-[#8F5F68]" : "border-white/70 bg-white/80"}`}
              >
                <span className="text-base">{s.icon}</span>{s.name}
              </button>
            ))}
          </div>
        </section>

        {/* Name + icon */}
        <section className="space-y-3 rounded-3xl bg-white/80 p-4">
          <label className="block">
            <span className="text-[10px] font-bold uppercase tracking-wider text-foreground/50">Tên dịch vụ</span>
            <input
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="VD: Netflix Premium"
              className="mt-1 w-full rounded-xl border border-transparent bg-background/60 px-3 py-2.5 text-sm outline-none focus:border-[#B5828C]"
            />
          </label>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-foreground/50">Biểu tượng</span>
            <div className="mt-1 flex flex-wrap gap-1.5">
              {["💳","🎬","🎵","▶️","☁️","🤖","🎨","📝","🎮","📰","💪","🍔"].map(e => (
                <button
                  key={e}
                  type="button"
                  onClick={() => setIcon(e)}
                  className={`grid h-9 w-9 place-items-center rounded-xl text-lg transition ${icon === e ? "bg-[#FFE4D2] ring-2 ring-[#B5828C]" : "bg-background/60"}`}
                >
                  {e}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Amount + cycle */}
        <section className="space-y-3 rounded-3xl bg-white/80 p-4">
          <label className="block">
            <span className="text-[10px] font-bold uppercase tracking-wider text-foreground/50">Số tiền mỗi kỳ</span>
            <div className="mt-1 flex items-baseline gap-2">
              <input
                inputMode="numeric"
                value={amount ? amount.toLocaleString("vi-VN") : ""}
                onChange={e => setAmount(Number(e.target.value.replace(/[^\d]/g, "")) || 0)}
                placeholder="0"
                className="w-full rounded-xl border border-transparent bg-background/60 px-3 py-2.5 text-lg font-semibold tabular-nums outline-none focus:border-[#B5828C]"
              />
              <span className="text-sm font-semibold text-foreground/60">₫</span>
            </div>
          </label>
          <div>
            <span className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-foreground/50"><Repeat className="h-3 w-3" />Chu kỳ thanh toán</span>
            <div className="mt-1 flex gap-1.5 rounded-2xl bg-background/60 p-1">
              {CYCLES.map(c => (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => setCycle(c.id)}
                  className={`flex-1 rounded-xl py-2 text-xs font-semibold transition ${cycle === c.id ? "bg-white text-foreground shadow-sm" : "text-foreground/60"}`}
                >
                  {c.label}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Details */}
        <section className="space-y-3 rounded-3xl bg-white/80 p-4">
          <label className="flex items-center justify-between">
            <span className="flex items-center gap-2 text-sm font-medium"><CalendarDays className="h-4 w-4 text-[#B5828C]" />Kỳ thanh toán tiếp</span>
            <input
              type="date"
              value={nextDate}
              onChange={e => setNextDate(e.target.value)}
              className="rounded-xl bg-background/60 px-3 py-1.5 text-sm outline-none focus:ring-2 focus:ring-[#B5828C]"
            />
          </label>

          <div>
            <span className="flex items-center gap-2 text-sm font-medium"><Tag className="h-4 w-4 text-[#B5828C]" />Danh mục</span>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {CATEGORIES.map(c => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setCategory(c)}
                  className={`rounded-full px-3 py-1 text-xs font-medium transition ${category === c ? "bg-[#B5828C] text-white" : "bg-background/60 text-foreground/70"}`}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>

          <label className="flex items-center justify-between">
            <span className="flex items-center gap-2 text-sm font-medium"><CreditCard className="h-4 w-4 text-[#B5828C]" />Phương thức</span>
            <input
              value={method}
              onChange={e => setMethod(e.target.value)}
              className="w-40 rounded-xl bg-background/60 px-3 py-1.5 text-right text-sm outline-none focus:ring-2 focus:ring-[#B5828C]"
            />
          </label>
        </section>

        {/* Toggles */}
        <section className="space-y-2">
          <Toggle
            icon={<Bell className="h-4 w-4" />}
            label="Nhắc trước 3 ngày"
            desc="Thông báo trước ngày trừ tiền"
            value={remind}
            onChange={setRemind}
          />
          <Toggle
            icon={<Sparkle />}
            label="Đang dùng thử miễn phí"
            desc="Cảnh báo khi hết trial"
            value={trial}
            onChange={setTrial}
          />
        </section>

        <button
          type="button"
          onClick={() => navigate({ to: "/bills/subscriptions" })}
          className="flex w-full items-center justify-center gap-2 rounded-2xl bg-foreground py-3.5 text-sm font-semibold text-background"
        >
          <Check className="h-4 w-4" />Lưu subscription
        </button>
      </div>
    </PhoneFrame>
  );
}

function Toggle({ icon, label, desc, value, onChange }: { icon: React.ReactNode; label: string; desc: string; value: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      type="button"
      onClick={() => onChange(!value)}
      className="flex w-full items-center justify-between rounded-2xl bg-white/80 p-4 text-left"
    >
      <div className="flex items-center gap-3">
        <span className="grid h-9 w-9 place-items-center rounded-xl bg-[#FFE4D2] text-[#B5828C]">{icon}</span>
        <div>
          <p className="text-sm font-semibold">{label}</p>
          <p className="text-xs text-foreground/60">{desc}</p>
        </div>
      </div>
      <span className={`relative h-6 w-11 rounded-full transition ${value ? "bg-[#B5828C]" : "bg-foreground/15"}`}>
        <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition ${value ? "left-[22px]" : "left-0.5"}`} />
      </span>
    </button>
  );
}

function Sparkle() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor"><path d="M12 2l1.9 5.6L20 9.5l-5 3.7L16.8 20 12 16.7 7.2 20 9 13.2 4 9.5l6.1-1.9L12 2z" /></svg>
  );
}
