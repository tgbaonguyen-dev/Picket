import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { PhoneFrame } from "@/components/phone-frame";
import { useState } from "react";
import { Check, Bell, Repeat, Tag, CalendarDays, CreditCard, Sparkles, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { PopIn, FadeInUp } from "@/components/ui/animations";

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
          className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white/70 shadow-sm backdrop-blur-md transition-transform active:scale-95"
        >
          <Check className="h-4 w-4 text-foreground/70" />
        </button>
      }
    >
      <div className="space-y-5 px-5 pb-8 pt-2">
        {/* Preview card */}
        <PopIn className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-fuchsia-500 to-pink-600 p-6 text-white shadow-xl shadow-pink-500/20">
          <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-white/20 blur-2xl" />
          <div className="absolute -bottom-10 -left-10 h-40 w-40 rounded-full bg-black/10 blur-3xl" />
          
          <div className="relative z-10">
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-white/20 text-3xl shadow-sm backdrop-blur-md">
                {icon}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-xl font-bold tracking-tight">{name || "Tên gói dịch vụ"}</p>
                <div className="mt-1 flex items-center gap-2">
                  <span className="rounded-lg bg-white/20 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider backdrop-blur-md">
                    {CYCLES.find(c => c.id === cycle)?.label}
                  </span>
                  <span className="text-[11px] font-medium opacity-90">{category}</span>
                </div>
              </div>
            </div>
            
            <div className="mt-6 flex items-end justify-between">
              <div>
                <p className="text-[11px] font-bold uppercase tracking-wider opacity-90">Số tiền mỗi kỳ</p>
                <p className="mt-1 text-3xl font-bold tabular-nums">{fmt(amount)}</p>
              </div>
              <div className="text-right">
                <p className="text-[10px] font-bold uppercase tracking-wider opacity-90">Quy đổi năm</p>
                <p className="mt-1 text-sm font-bold tabular-nums">{fmt(yearly)}</p>
              </div>
            </div>
          </div>
        </PopIn>

        {/* Suggestions */}
        <FadeInUp delay={0.05}>
          <h2 className="mb-3 px-1 text-[11px] font-bold uppercase tracking-wider text-foreground/40">Gợi ý phổ biến</h2>
          <div className="flex gap-2 overflow-x-auto pb-1 hide-scrollbar">
            {SUGGESTIONS.map(s => (
              <button
                key={s.name}
                type="button"
                onClick={() => { setName(s.name); setIcon(s.icon); setAmount(s.price); }}
                className={`flex shrink-0 items-center gap-2 rounded-2xl border px-3.5 py-2.5 text-[13px] font-bold transition-all active:scale-95 ${name === s.name ? "border-pink-200 bg-pink-100 text-pink-700 shadow-sm" : "border-white/40 bg-white/50 text-foreground/70 backdrop-blur-sm"}`}
              >
                <span className="text-lg">{s.icon}</span>{s.name}
              </button>
            ))}
          </div>
        </FadeInUp>

        {/* Amount & Cycle */}
        <FadeInUp 
          delay={0.1}
          className="space-y-4 rounded-3xl bg-white/70 p-5 shadow-sm backdrop-blur-md"
        >
          <div>
            <label className="text-[11px] font-bold uppercase tracking-wider text-foreground/40">Tên dịch vụ</label>
            <input
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="VD: Netflix Premium"
              className="mt-1.5 w-full bg-transparent text-lg font-bold text-foreground placeholder:text-foreground/30 focus:outline-none"
            />
          </div>
          
          <div className="h-px w-full bg-foreground/5" />
          
          <div>
            <label className="text-[11px] font-bold uppercase tracking-wider text-foreground/40">Biểu tượng</label>
            <div className="mt-2.5 flex flex-wrap gap-2">
              {["💳","🎬","🎵","▶️","☁️","🤖","🎨","📝","🎮","📰","💪","🍔"].map(e => (
                <button
                  key={e}
                  type="button"
                  onClick={() => setIcon(e)}
                  className={`grid h-10 w-10 place-items-center rounded-2xl text-xl transition-all active:scale-90 ${icon === e ? "bg-pink-100 ring-2 ring-pink-500 ring-offset-1" : "bg-foreground/5 text-foreground/70"}`}
                >
                  {e}
                </button>
              ))}
            </div>
          </div>
          
          <div className="h-px w-full bg-foreground/5" />
          
          <div>
            <label className="text-[11px] font-bold uppercase tracking-wider text-foreground/40">Số tiền mỗi kỳ</label>
            <div className="mt-1.5 flex items-baseline">
              <span className="text-xl font-bold text-foreground/50">₫</span>
              <input
                inputMode="numeric"
                value={amount ? amount.toLocaleString("vi-VN") : ""}
                onChange={e => setAmount(Number(e.target.value.replace(/[^\d]/g, "")) || 0)}
                placeholder="0"
                className="w-full bg-transparent text-3xl font-bold tabular-nums text-foreground placeholder:text-foreground/20 focus:outline-none"
              />
            </div>
          </div>
          
          <div className="h-px w-full bg-foreground/5" />
          
          <div>
            <label className="mb-2 block text-[11px] font-bold uppercase tracking-wider text-foreground/40">Chu kỳ thanh toán</label>
            <div className="grid grid-cols-3 gap-1.5 rounded-2xl bg-foreground/5 p-1.5">
              {CYCLES.map(c => (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => setCycle(c.id)}
                  className={`relative rounded-xl py-2.5 text-[12px] font-bold transition-colors ${cycle === c.id ? "text-foreground shadow-sm" : "text-foreground/60 active:bg-white/40"}`}
                >
                  {cycle === c.id && (
                    <motion.div 
                      layoutId="cycleTab"
                      className="absolute inset-0 rounded-xl bg-white shadow-sm"
                      transition={{ type: "spring", bounce: 0.2, duration: 0.5 }}
                    />
                  )}
                  <span className="relative z-10">{c.label}</span>
                </button>
              ))}
            </div>
          </div>
        </FadeInUp>

        {/* Details Grid */}
        <FadeInUp 
          delay={0.15}
          className="grid grid-cols-2 gap-2"
        >
          <div className="space-y-1.5 rounded-3xl bg-white/70 p-4 shadow-sm backdrop-blur-md">
            <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-foreground/40">
              <CalendarDays className="h-3.5 w-3.5" /> Kỳ tiếp theo
            </div>
            <input
              type="date"
              value={nextDate}
              onChange={e => setNextDate(e.target.value)}
              className="w-full bg-transparent text-sm font-bold text-foreground focus:outline-none"
            />
          </div>
          
          <div className="space-y-1.5 rounded-3xl bg-white/70 p-4 shadow-sm backdrop-blur-md">
            <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-foreground/40">
              <CreditCard className="h-3.5 w-3.5" /> Nguồn tiền
            </div>
            <input
              value={method}
              onChange={e => setMethod(e.target.value)}
              className="w-full bg-transparent text-sm font-bold text-foreground focus:outline-none"
            />
          </div>
        </FadeInUp>

        {/* Categories */}
        <FadeInUp 
          delay={0.2}
          className="rounded-3xl bg-white/70 p-5 shadow-sm backdrop-blur-md"
        >
          <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider text-foreground/40">
            <Tag className="h-4 w-4 text-[#B5828C]" />Danh mục
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            {CATEGORIES.map(c => (
              <button
                key={c}
                type="button"
                onClick={() => setCategory(c)}
                className={`rounded-xl px-3.5 py-1.5 text-[12px] font-bold transition-all active:scale-95 ${category === c ? "bg-[#B5828C] text-white shadow-sm" : "bg-white/50 text-foreground/60 shadow-sm"}`}
              >
                {c}
              </button>
            ))}
          </div>
        </FadeInUp>

        {/* Toggles */}
        <FadeInUp 
          delay={0.25}
          className="space-y-2"
        >
          <Toggle
            icon={<Bell className="h-4 w-4" />}
            iconColor="text-blue-500"
            iconBg="bg-blue-100"
            label="Nhắc trước 3 ngày"
            desc="Thông báo trước ngày trừ tiền"
            value={remind}
            onChange={setRemind}
          />
          <Toggle
            icon={<Sparkles className="h-4 w-4" />}
            iconColor="text-amber-500"
            iconBg="bg-amber-100"
            label="Đang dùng thử miễn phí"
            desc="Cảnh báo khi sắp hết trial"
            value={trial}
            onChange={setTrial}
          />
        </FadeInUp>

        <FadeInUp 
          delay={0.3}
          className="pt-2"
        >
          <button
            type="button"
            onClick={() => navigate({ to: "/bills/subscriptions" })}
            className="flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-fuchsia-500 to-pink-600 py-4 text-sm font-bold text-white shadow-lg shadow-pink-500/25 transition-transform active:scale-[0.98]"
          >
            Lưu subscription
            <ArrowRight className="h-4 w-4" />
          </button>
        </FadeInUp>
      </div>
    </PhoneFrame>
  );
}

function Toggle({ icon, iconColor, iconBg, label, desc, value, onChange }: { icon: React.ReactNode; iconColor: string; iconBg: string; label: string; desc: string; value: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      type="button"
      onClick={() => onChange(!value)}
      className="flex w-full items-center justify-between rounded-3xl bg-white/70 p-4 text-left shadow-sm backdrop-blur-md active:scale-[0.98] transition-transform"
    >
      <div className="flex items-center gap-3">
        <span className={`grid h-10 w-10 place-items-center rounded-2xl ${iconBg} ${iconColor}`}>
          {icon}
        </span>
        <div>
          <p className="text-[13px] font-bold">{label}</p>
          <p className="text-[11px] font-medium text-foreground/50">{desc}</p>
        </div>
      </div>
      <div className={`relative flex h-6 w-11 items-center rounded-full transition-colors ${value ? "bg-foreground" : "bg-foreground/10"}`}>
        <motion.div 
          className="absolute h-5 w-5 rounded-full bg-white shadow-sm"
          layout
          animate={{ left: value ? "22px" : "2px" }}
          transition={{ type: "spring", stiffness: 500, damping: 30 }}
        />
      </div>
    </button>
  );
}
