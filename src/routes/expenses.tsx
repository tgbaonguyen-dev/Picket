import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import {
  Plus,
  Utensils,
  Car,
  ShoppingBag,
  Receipt,
  Film,
  MoreHorizontal,
  TrendingDown,
  TrendingUp,
  X,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { BottomNav } from "@/components/phone-frame";
import { BackButton } from "@/components/back-button";


export const Route = createFileRoute("/expenses")({
  head: () => ({
    meta: [
      { title: "Chi tiêu · Picket" },
      { name: "description", content: "Theo dõi chi tiêu và danh mục trong tháng." },
    ],
  }),
  component: ExpensesPage,
});

type Category = "food" | "transport" | "shopping" | "bills" | "entertainment" | "other";

type Expense = {
  id: string;
  amount: number;
  category: Category;
  note: string | null;
  spent_at: string;
};

const CATEGORIES: {
  key: Category;
  label: string;
  icon: React.ComponentType<{ className?: string; strokeWidth?: number }>;
  bg: string;
  fg: string;
}[] = [
  { key: "food", label: "Ăn uống", icon: Utensils, bg: "#ffe4e6", fg: "#b03a4a" },
  { key: "transport", label: "Di chuyển", icon: Car, bg: "#FFE9D9", fg: "#B5828C" },
  { key: "shopping", label: "Mua sắm", icon: ShoppingBag, bg: "#fef3c7", fg: "#a16207" },
  { key: "bills", label: "Hóa đơn", icon: Receipt, bg: "#ede9fe", fg: "#6d28d9" },
  { key: "entertainment", label: "Giải trí", icon: Film, bg: "#dcfce7", fg: "#15803d" },
  { key: "other", label: "Khác", icon: MoreHorizontal, bg: "#f1f5f9", fg: "#475569" },
];

const CAT_MAP = Object.fromEntries(CATEGORIES.map((c) => [c.key, c])) as Record<
  Category,
  (typeof CATEGORIES)[number]
>;

const formatVND = (n: number) =>
  new Intl.NumberFormat("vi-VN", { maximumFractionDigits: 0 }).format(n) + "₫";

function monthRange(d = new Date()) {
  const start = new Date(d.getFullYear(), d.getMonth(), 1);
  const end = new Date(d.getFullYear(), d.getMonth() + 1, 1);
  return { start: start.toISOString().slice(0, 10), end: end.toISOString().slice(0, 10) };
}

function buildMockExpenses(): Expense[] {
  const today = new Date();
  const y = today.getFullYear();
  const m = today.getMonth();
  const iso = (day: number) =>
    `${y}-${String(m + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
  const d = today.getDate();
  const clamp = (n: number) => Math.max(1, Math.min(d, n));
  const seed: Array<[number, number, Category, string]> = [
    [clamp(d), 62000, "food", "Cơm tấm Ba Ghiền"],
    [clamp(d), 28000, "food", "Cà phê Highlands"],
    [clamp(d), 45000, "transport", "Grab về nhà"],
    [clamp(d - 1), 180000, "shopping", "Uniqlo — áo thun"],
    [clamp(d - 1), 95000, "food", "Bún bò Huế"],
    [clamp(d - 2), 220000, "bills", "Internet FPT"],
    [clamp(d - 2), 55000, "entertainment", "Netflix"],
    [clamp(d - 3), 340000, "shopping", "Shopee — đồ dùng"],
    [clamp(d - 3), 35000, "transport", "Xăng xe"],
    [clamp(d - 4), 120000, "food", "Pizza 4P's"],
    [clamp(d - 5), 78000, "food", "Trà sữa Gong Cha"],
    [clamp(d - 6), 450000, "bills", "Điện tháng này"],
    [clamp(d - 7), 65000, "entertainment", "Vé xem phim CGV"],
    [clamp(d - 8), 30000, "transport", "Gửi xe"],
    [clamp(d - 9), 210000, "shopping", "Nhà sách Fahasa"],
    [clamp(d - 10), 88000, "food", "Bánh mì + trà chanh"],
    [clamp(d - 12), 145000, "other", "Quà sinh nhật bạn"],
    [clamp(d - 14), 520000, "bills", "Nước + rác"],
  ];
  return seed.map(([day, amount, category, note], i) => ({
    id: `mock-${i}`,
    amount,
    category,
    note,
    spent_at: iso(day),
  }));
}

const MOCK_EXPENSES = buildMockExpenses();


function ExpensesPage() {
  const navigate = useNavigate();
  const [userId, setUserId] = useState<string | null>(null);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [expenses, setExpenses] = useState<Expense[]>(MOCK_EXPENSES);
  const [loading, setLoading] = useState(false);
  const [addOpen, setAddOpen] = useState(false);

  useEffect(() => {
    let mounted = true;
    supabase.auth.getSession().then(({ data }) => {
      if (!mounted) return;
      setUserId(data.session?.user.id ?? null);
      setCheckingAuth(false);
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => {
      setUserId(session?.user.id ?? null);
    });
    return () => {
      mounted = false;
      sub.subscription.unsubscribe();
    };
  }, [navigate]);

  const { start, end } = useMemo(() => monthRange(), []);

  async function refresh(uid: string) {
    setLoading(true);
    const { data, error } = await supabase
      .from("expenses")
      .select("id, amount, category, note, spent_at")
      .eq("user_id", uid)
      .gte("spent_at", start)
      .lt("spent_at", end)
      .order("spent_at", { ascending: false })
      .order("created_at", { ascending: false });
    if (error) toast.error(error.message);
    else {
      const rows = (data ?? []) as Expense[];
      // Fall back to mock data when the account has no expenses yet so the
      // page always shows something meaningful.
      setExpenses(rows.length > 0 ? rows : MOCK_EXPENSES);
    }
    setLoading(false);
  }

  useEffect(() => {
    if (userId) refresh(userId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId, start, end]);


  const total = expenses.reduce((s, e) => s + Number(e.amount), 0);
  const byCat = useMemo(() => {
    const map = new Map<Category, number>();
    for (const e of expenses) map.set(e.category, (map.get(e.category) ?? 0) + Number(e.amount));
    return CATEGORIES.map((c) => ({ ...c, amount: map.get(c.key) ?? 0 })).sort(
      (a, b) => b.amount - a.amount,
    );
  }, [expenses]);

  const now = new Date();
  const monthLabel = `Tháng ${now.getMonth() + 1}/${now.getFullYear()}`;
  const daysSoFar = now.getDate();
  const avgPerDay = daysSoFar > 0 ? total / daysSoFar : 0;

  const grouped = useMemo(() => {
    const map = new Map<string, Expense[]>();
    for (const e of expenses) {
      const list = map.get(e.spent_at) ?? [];
      list.push(e);
      map.set(e.spent_at, list);
    }
    return Array.from(map.entries()).sort((a, b) => (a[0] < b[0] ? 1 : -1));
  }, [expenses]);

  if (checkingAuth) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#F5E8DA] p-4">
        <div className="h-10 w-10 animate-pulse rounded-full bg-[#FFE9D9]" />
      </main>
    );
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#F5E8DA] sm:p-4">
      <div className="relative mx-auto flex h-[100dvh] w-full sm:max-w-[390px] sm:h-[844px] sm:max-h-[calc(100vh-32px)] flex-col overflow-hidden sm:rounded-[44px] bg-[#f4f8fb] sm:shadow-2xl sm:ring-[6px] sm:ring-white">
        {/* Ambient background */}
        <div className="pointer-events-none absolute inset-x-0 top-0 h-[45%] bg-gradient-to-b from-[#FFE9D9] via-[#f0f6fa] to-transparent" />
        <div className="pointer-events-none absolute -right-14 -top-14 h-48 w-48 rounded-full bg-[#fecaca] opacity-60 blur-3xl" />
        <div className="pointer-events-none absolute -left-14 top-24 h-48 w-48 rounded-full bg-[#FFB4A2] opacity-40 blur-3xl" />

        <div className="relative z-10 flex-1 overflow-y-auto px-5 pb-24 pt-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <BackButton fallback="/" />
            <div className="text-center">
              <p className="font-sans text-[10px] font-bold uppercase tracking-[0.2em] text-foreground/50">
                Chi tiêu
              </p>
              <p className="font-sans text-[12px] font-semibold text-foreground/80">{monthLabel}</p>
            </div>
            <span className="h-10 w-10" />
          </div>

          {/* Total card */}
          <div className="relative mt-5 overflow-hidden rounded-[28px] bg-gradient-to-br from-[#B5828C] to-[#1e4a63] p-5 text-white shadow-[0_20px_50px_-20px_rgba(46,107,138,0.6)]">
            <div className="pointer-events-none absolute -right-8 -top-10 h-32 w-32 rounded-full bg-white/10 blur-2xl" />
            <div className="pointer-events-none absolute -bottom-10 -left-6 h-28 w-28 rounded-full bg-[#f9a8a8]/30 blur-2xl" />
            <p className="relative font-sans text-[11px] font-semibold uppercase tracking-[0.18em] text-white/70">
              Tổng chi tháng này
            </p>
            <p className="relative mt-2 font-display text-[32px] font-bold leading-none tabular-nums">
              {formatVND(total)}
            </p>
            <div className="relative mt-4 flex items-center gap-4">
              <Stat
                icon={<TrendingDown className="h-3.5 w-3.5" strokeWidth={2.5} />}
                label="TB/ngày"
                value={formatVND(Math.round(avgPerDay))}
              />
              <div className="h-8 w-px bg-white/15" />
              <Stat
                icon={<TrendingUp className="h-3.5 w-3.5" strokeWidth={2.5} />}
                label="Giao dịch"
                value={String(expenses.length)}
              />
            </div>
          </div>

          {/* Categories */}
          <div className="mt-6">
            <div className="mb-3 flex items-baseline justify-between">
              <h2 className="font-display text-[16px] font-bold text-foreground">Danh mục</h2>
              <span className="font-sans text-[10px] font-semibold uppercase tracking-[0.16em] text-foreground/40">
                {CATEGORIES.length} loại
              </span>
            </div>
            <div className="grid grid-cols-3 gap-2.5">
              {byCat.map((c) => {
                const pct = total > 0 ? Math.round((c.amount / total) * 100) : 0;
                return (
                  <button
                    key={c.key}
                    type="button"
                    className="flex flex-col items-start gap-2 rounded-2xl border border-white/70 bg-white/85 p-2.5 text-left shadow-[0_4px_14px_-8px_rgba(15,42,66,0.15)] backdrop-blur-xl transition active:scale-[0.97]"
                  >
                    <div
                      className="flex h-8 w-8 items-center justify-center rounded-xl"
                      style={{ backgroundColor: c.bg, color: c.fg }}
                    >
                      <c.icon className="h-4 w-4" strokeWidth={2.4} />
                    </div>
                    <p className="font-sans text-[11px] font-semibold text-foreground/80">
                      {c.label}
                    </p>
                    <p className="font-sans text-[11px] font-bold tabular-nums text-foreground">
                      {c.amount > 0 ? formatVND(c.amount) : "—"}
                    </p>
                    <div className="mt-0.5 h-1 w-full overflow-hidden rounded-full bg-black/[0.05]">
                      <div
                        className="h-full rounded-full transition-all"
                        style={{ width: `${pct}%`, backgroundColor: c.fg }}
                      />
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Recent list */}
          <div className="mt-6">
            <div className="mb-3 flex items-baseline justify-between">
              <h2 className="font-display text-[16px] font-bold text-foreground">Gần đây</h2>
              <span className="font-sans text-[10px] font-semibold uppercase tracking-[0.16em] text-foreground/40">
                {expenses.length} giao dịch
              </span>
            </div>

            {loading ? (
              <div className="space-y-2">
                {[0, 1, 2].map((i) => (
                  <div key={i} className="h-14 animate-pulse rounded-2xl bg-white/60" />
                ))}
              </div>
            ) : expenses.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-black/10 bg-white/60 px-4 py-8 text-center">
                <p className="font-sans text-[13px] font-semibold text-foreground/60">
                  Chưa có khoản chi nào
                </p>
                <p className="mt-1 font-sans text-[11px] text-foreground/45">
                  Nhấn nút + để thêm khoản chi đầu tiên
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {grouped.map(([date, items]) => (
                  <div key={date}>
                    <p className="mb-1.5 px-1 font-sans text-[10px] font-bold uppercase tracking-[0.16em] text-foreground/40">
                      {formatDate(date)}
                    </p>
                    <div className="overflow-hidden rounded-2xl border border-white/70 bg-white/85 shadow-sm backdrop-blur-xl">
                      {items.map((e, i) => {
                        const c = CAT_MAP[e.category];
                        return (
                          <div
                            key={e.id}
                            className={`flex items-center gap-3 px-3 py-2.5 ${
                              i > 0 ? "border-t border-black/[0.04]" : ""
                            }`}
                          >
                            <div
                              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl"
                              style={{ backgroundColor: c.bg, color: c.fg }}
                            >
                              <c.icon className="h-[18px] w-[18px]" strokeWidth={2.3} />
                            </div>
                            <div className="min-w-0 flex-1">
                              <p className="truncate font-sans text-[13px] font-semibold text-foreground">
                                {e.note || c.label}
                              </p>
                              <p className="font-sans text-[11px] font-medium text-foreground/50">
                                {c.label}
                              </p>
                            </div>
                            <p className="font-sans text-[13.5px] font-bold tabular-nums text-foreground">
                              -{formatVND(Number(e.amount))}
                            </p>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* FAB — offset right so it doesn't collide with the shared camera FAB */}
          <button
            type="button"
            onClick={() => setAddOpen(true)}
            className="absolute bottom-[104px] right-6 z-20 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-[#f9a8a8] to-[#f87171] text-white shadow-[0_14px_30px_-8px_rgba(248,113,113,0.6)] transition active:scale-95"
            aria-label="Thêm khoản chi"
          >
            <Plus className="h-7 w-7" strokeWidth={2.75} />
          </button>

        </div>

        {/* Bottom nav — shared component so every screen matches */}
        <BottomNav />
      </div>

      {addOpen && userId && (
        <AddExpenseSheet
          userId={userId}
          onClose={() => setAddOpen(false)}
          onSaved={() => {
            setAddOpen(false);
            if (userId) refresh(userId);
          }}
        />
      )}
    </main>
  );
}

function Stat({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-2">
      <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-white/15 text-white/90">
        {icon}
      </div>
      <div>
        <p className="font-sans text-[9px] font-bold uppercase tracking-[0.16em] text-white/60">
          {label}
        </p>
        <p className="font-sans text-[12px] font-bold tabular-nums text-white">{value}</p>
      </div>
    </div>
  );
}

function formatDate(iso: string) {
  const d = new Date(iso + "T00:00:00");
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);
  if (d.getTime() === today.getTime()) return "Hôm nay";
  if (d.getTime() === yesterday.getTime()) return "Hôm qua";
  return d.toLocaleDateString("vi-VN", { weekday: "short", day: "2-digit", month: "2-digit" });
}


function AddExpenseSheet({
  userId,
  onClose,
  onSaved,
}: {
  userId: string;
  onClose: () => void;
  onSaved: () => void;
}) {
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState<Category>("food");
  const [note, setNote] = useState("");
  const [saving, setSaving] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    const n = Number(amount.replace(/[^\d]/g, ""));
    if (!n || n <= 0) {
      toast.error("Nhập số tiền hợp lệ");
      return;
    }
    setSaving(true);
    const { error } = await supabase.from("expenses").insert({
      user_id: userId,
      amount: n,
      category,
      note: note.trim() || null,
    });
    setSaving(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success("Đã lưu khoản chi");
    onSaved();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 backdrop-blur-sm sm:items-center">
      <form
        onSubmit={submit}
        className="w-full max-w-[390px] rounded-t-[32px] bg-white p-5 pb-8 shadow-2xl sm:rounded-[32px]"
      >
        <div className="mb-4 flex items-center justify-between">
          <h3 className="font-display text-[18px] font-bold text-foreground">Thêm khoản chi</h3>
          <button
            type="button"
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-full bg-black/[0.05] text-foreground/60"
            aria-label="Đóng"
          >
            <X className="h-4 w-4" strokeWidth={2.4} />
          </button>
        </div>

        <label className="block">
          <span className="font-sans text-[10px] font-bold uppercase tracking-[0.16em] text-foreground/45">
            Số tiền
          </span>
          <div className="mt-1 flex items-baseline gap-1 rounded-2xl bg-[#f4f8fb] px-4 py-3">
            <input
              autoFocus
              inputMode="numeric"
              placeholder="0"
              value={amount}
              onChange={(e) => {
                const raw = e.target.value.replace(/[^\d]/g, "");
                setAmount(raw ? Number(raw).toLocaleString("vi-VN") : "");
              }}
              className="flex-1 bg-transparent font-display text-[26px] font-bold tabular-nums text-foreground placeholder:text-foreground/25 focus:outline-none"
            />
            <span className="font-sans text-[14px] font-bold text-foreground/50">₫</span>
          </div>
        </label>

        <p className="mt-4 font-sans text-[10px] font-bold uppercase tracking-[0.16em] text-foreground/45">
          Danh mục
        </p>
        <div className="mt-2 grid grid-cols-3 gap-2">
          {CATEGORIES.map((c) => {
            const active = c.key === category;
            return (
              <button
                key={c.key}
                type="button"
                onClick={() => setCategory(c.key)}
                className={`flex flex-col items-center gap-1.5 rounded-2xl border p-2.5 transition ${
                  active
                    ? "border-transparent shadow-md"
                    : "border-black/[0.06] bg-white"
                }`}
                style={active ? { backgroundColor: c.bg } : undefined}
              >
                <div
                  className="flex h-9 w-9 items-center justify-center rounded-xl"
                  style={{ backgroundColor: active ? "#ffffff" : c.bg, color: c.fg }}
                >
                  <c.icon className="h-[18px] w-[18px]" strokeWidth={2.3} />
                </div>
                <span
                  className="font-sans text-[11px] font-semibold"
                  style={{ color: active ? c.fg : "hsl(var(--foreground) / 0.75)" }}
                >
                  {c.label}
                </span>
              </button>
            );
          })}
        </div>

        <label className="mt-4 block">
          <span className="font-sans text-[10px] font-bold uppercase tracking-[0.16em] text-foreground/45">
            Ghi chú
          </span>
          <input
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="VD: Cà phê sáng"
            className="mt-1 w-full rounded-2xl border border-black/[0.06] bg-white px-4 py-3 font-sans text-[13px] font-medium text-foreground placeholder:text-foreground/35 focus:outline-none focus:ring-4 focus:ring-[#B5828C]/10"
          />
        </label>

        <button
          type="submit"
          disabled={saving}
          className="mt-5 flex h-[52px] w-full items-center justify-center rounded-2xl bg-[#B5828C] font-sans text-[14px] font-bold text-white shadow-[0_18px_40px_-16px_rgba(46,107,138,0.7)] transition active:scale-[0.98] disabled:opacity-60"
        >
          {saving ? "Đang lưu..." : "Lưu khoản chi"}
        </button>
      </form>
    </div>
  );
}
